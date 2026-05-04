import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../common/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private readonly mailService: MailService,
    ) { }

    async register(dto: RegisterDto) {
        const { fullName, email, password } = dto;

        // 1. check if user exists
        const userExists = await this.prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            throw new BadRequestException('Email already exists');
        }

        // 2. hash password (VERY IMPORTANT)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. create user
        const user = await this.prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                createdAt: true,
                password: true,
            },
        });

        return {
            message: 'User registered successfully',
            user,
        };
    }

    //////-------------------------login---------------------//
    async login(dto: LoginDto) {
        const { email, password } = dto;

        // 1. find user
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 2. check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // 3. create JWT tokens
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { id: user.id, email: user.email },
                { expiresIn: '15m' }
            ),
            this.jwtService.signAsync(
                { id: user.id, email: user.email },
                { expiresIn: '7d' }
            ),
        ]);

        // 4. hash and store refresh token
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { hashedRefreshToken: hashedRefreshToken } as any,
        });

        return {
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
            },
            tokens: {
                accessToken,
                refreshToken,
            },
        };
    }


    async requestOtp(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        await this.prisma.passwordReset.create({
            data: {
                email,
                otp,
                expiresAt,
            },
        });

        // 👉 In real app: send email here
        console.log(`OTP for ${email}: ${otp}`);

        await this.mailService.sendOtp(email, otp);

        return { message: 'OTP sent to email' };
    }

    // 2. RESET PASSWORD
    async resetPassword(email: string, otp: string, newPassword: string) {
        try {
            // 1. find the OTP record
            const record = await this.prisma.passwordReset.findFirst({
                where: { email, otp },
                orderBy: { createdAt: 'desc' },
            });

            if (!record) {
                throw new BadRequestException('Invalid or expired OTP');
            }

            // 2. check expiration
            if (record.expiresAt < new Date()) {
                throw new BadRequestException('OTP has expired');
            }

            // 3. check if user still exists
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new BadRequestException('User no longer exists');
            }

            // 4. hash new password
            if (!newPassword) {
                throw new BadRequestException('New password is required');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // 5. update user password
            await this.prisma.user.update({
                where: { email },
                data: { password: hashedPassword },
            });

            // 6. cleanup: delete all OTPs for this email
            await this.prisma.passwordReset.deleteMany({
                where: { email },
            });

            return { message: 'Password reset successful' };
        } catch (error) {
            console.error('Reset Password Error:', error);
            if (error instanceof BadRequestException) throw error;
            throw new BadRequestException('Failed to reset password. Please try again.');
        }
    }
}