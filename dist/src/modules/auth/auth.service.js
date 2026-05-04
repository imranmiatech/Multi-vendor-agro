"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../common/mail/mail.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    mailService;
    constructor(prisma, jwtService, mailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async register(dto) {
        const { fullName, email, password } = dto;
        const userExists = await this.prisma.user.findUnique({
            where: { email },
        });
        if (userExists) {
            throw new common_1.BadRequestException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
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
    async login(dto) {
        const { email, password } = dto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ id: user.id, email: user.email }, { expiresIn: '15m' }),
            this.jwtService.signAsync({ id: user.id, email: user.email }, { expiresIn: '7d' }),
        ]);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: { hashedRefreshToken: hashedRefreshToken },
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
    async requestOtp(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
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
        console.log(`OTP for ${email}: ${otp}`);
        await this.mailService.sendOtp(email, otp);
        return { message: 'OTP sent to email' };
    }
    async resetPassword(email, otp, newPassword) {
        try {
            const record = await this.prisma.passwordReset.findFirst({
                where: { email, otp },
                orderBy: { createdAt: 'desc' },
            });
            if (!record) {
                throw new common_1.BadRequestException('Invalid or expired OTP');
            }
            if (record.expiresAt < new Date()) {
                throw new common_1.BadRequestException('OTP has expired');
            }
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new common_1.BadRequestException('User no longer exists');
            }
            if (!newPassword) {
                throw new common_1.BadRequestException('New password is required');
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await this.prisma.user.update({
                where: { email },
                data: { password: hashedPassword },
            });
            await this.prisma.passwordReset.deleteMany({
                where: { email },
            });
            return { message: 'Password reset successful' };
        }
        catch (error) {
            console.error('Reset Password Error:', error);
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.BadRequestException('Failed to reset password. Please try again.');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map