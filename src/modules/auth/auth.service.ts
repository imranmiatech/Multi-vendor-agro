import { Injectable, BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Role, UserStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto, PasswordResetDto, RegisterDto, RequestOtpDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../common/mail/mail.service';

const APPROVAL_EXEMPT_ROLES = new Set<Role>([Role.USER, Role.SUPERADMIN]);

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private readonly mailService: MailService,
    ) { }

    private normalizeEmail(email: string) {
        return email.trim().toLowerCase();
    }

    async register(dto: RegisterDto) {
        const {
            name,
            email: rawEmail,
            phone,
            age,
            password,
            role = Role.USER,
            businessName,
            businessAddress,
        } = dto;
        const email = this.normalizeEmail(rawEmail);
        const trimmedPhone = phone.trim();
        const trimmedName = name.trim();
        const trimmedBusinessName = businessName?.trim();
        const trimmedBusinessAddress = businessAddress?.trim();
        const status = APPROVAL_EXEMPT_ROLES.has(role)
            ? UserStatus.APPROVED
            : UserStatus.PENDING;

        const [emailExists, phoneExists] = await Promise.all([
            this.prisma.user.findUnique({
                where: { email },
            }),
            this.prisma.user.findUnique({
                where: { phone: trimmedPhone },
            }),
        ]);

        if (emailExists) {
            throw new BadRequestException('Email already exists');
        }

        if (phoneExists) {
            throw new BadRequestException('Phone already exists');
        }

        if (role === Role.VENDOR && (!trimmedBusinessName || !trimmedBusinessAddress)) {
            throw new BadRequestException('Business name and business address are required for vendor registration');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                name: trimmedName,
                email,
                phone: trimmedPhone,
                age,
                password: hashedPassword,
                role,
                status,
                businessName: role === Role.VENDOR ? trimmedBusinessName : null,
                businessAddress: role === Role.VENDOR ? trimmedBusinessAddress : null,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                age: true,
                role: true,
                status: true,
                businessName: true,
                businessAddress: true,
                createdAt: true,
            },
        });

        return {
            success: true,
            message: status === UserStatus.APPROVED
                ? 'Registration successful.'
                : 'Registration submitted successfully. Your account is pending approval.',
            data: user,
        };
    }

    async login(dto: LoginDto) {
        const email = this.normalizeEmail(dto.email);
        const { password } = dto;

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!APPROVAL_EXEMPT_ROLES.has(user.role) && user.status !== UserStatus.APPROVED) {
            if (user.status === UserStatus.REJECTED) {
                throw new ForbiddenException('Your account approval has been rejected');
            }

            throw new ForbiddenException('Your account is pending approval');
        }

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { id: user.id, email: user.email, role: user.role },
                { expiresIn: '15m' }
            ),
            this.jwtService.signAsync(
                { id: user.id, email: user.email, role: user.role },
                { expiresIn: '7d' }
            ),
        ]);

        return {
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    age: user.age,
                    role: user.role,
                    status: user.status,
                    businessName: user.businessName,
                    businessAddress: user.businessAddress,
                },
                tokens: {
                    accessToken,
                    refreshToken,
                },
            },
        };
    }


    async requestOtp(dto: RequestOtpDto) {
        const email = this.normalizeEmail(dto.email);
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        await this.prisma.user.update({
            where: { email },
            data: {
                otp,
                otpExpiry: expiresAt,
            },
        });

        console.log(`OTP for ${email}: ${otp}`);

        await this.mailService.sendOtp(email, otp);

        return {
            success: true,
            message: 'OTP sent to email',
        };
    }

    async resetPassword(dto: PasswordResetDto) {
        const email = this.normalizeEmail(dto.email);
        const otp = dto.otp.trim();
        const newPassword = dto.newPassword;

        try {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new BadRequestException('User no longer exists');
            }

            if (!user.otp || user.otp !== otp || !user.otpExpiry) {
                throw new BadRequestException('Invalid or expired OTP');
            }

            if (user.otpExpiry < new Date()) {
                throw new BadRequestException('OTP has expired');
            }

            if (!newPassword) {
                throw new BadRequestException('New password is required');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await this.prisma.user.update({
                where: { email },
                data: {
                    password: hashedPassword,
                    otp: null,
                    otpExpiry: null,
                    resetToken: null,
                    resetTokenExpiry: null,
                },
            });

            return {
                success: true,
                message: 'Password reset successful',
            };
        } catch (error) {
            console.error('Reset Password Error:', error);
            if (error instanceof BadRequestException) throw error;
            throw new BadRequestException('Failed to reset password. Please try again.');
        }
    }

}
