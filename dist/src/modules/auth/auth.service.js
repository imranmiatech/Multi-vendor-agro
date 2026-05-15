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
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const mail_service_1 = require("../common/mail/mail.service");
const APPROVAL_EXEMPT_ROLES = new Set([client_1.Role.USER, client_1.Role.SUPERADMIN]);
let AuthService = class AuthService {
    prisma;
    jwtService;
    mailService;
    constructor(prisma, jwtService, mailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    normalizeEmail(email) {
        return email.trim().toLowerCase();
    }
    async register(dto) {
        const { name, email: rawEmail, phone, age, password, role = client_1.Role.USER, businessName, businessAddress, } = dto;
        const email = this.normalizeEmail(rawEmail);
        const trimmedPhone = phone.trim();
        const trimmedName = name.trim();
        const trimmedBusinessName = businessName?.trim();
        const trimmedBusinessAddress = businessAddress?.trim();
        const status = APPROVAL_EXEMPT_ROLES.has(role)
            ? client_1.UserStatus.APPROVED
            : client_1.UserStatus.PENDING;
        const [emailExists, phoneExists] = await Promise.all([
            this.prisma.user.findUnique({
                where: { email },
            }),
            this.prisma.user.findUnique({
                where: { phone: trimmedPhone },
            }),
        ]);
        if (emailExists) {
            throw new common_1.BadRequestException('Email already exists');
        }
        if (phoneExists) {
            throw new common_1.BadRequestException('Phone already exists');
        }
        if (role === client_1.Role.VENDOR && (!trimmedBusinessName || !trimmedBusinessAddress)) {
            throw new common_1.BadRequestException('Business name and business address are required for vendor registration');
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
                businessName: role === client_1.Role.VENDOR ? trimmedBusinessName : null,
                businessAddress: role === client_1.Role.VENDOR ? trimmedBusinessAddress : null,
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
            message: status === client_1.UserStatus.APPROVED
                ? 'Registration successful.'
                : 'Registration submitted successfully. Your account is pending approval.',
            data: user,
        };
    }
    async login(dto) {
        const email = this.normalizeEmail(dto.email);
        const { password } = dto;
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
        if (!APPROVAL_EXEMPT_ROLES.has(user.role) && user.status !== client_1.UserStatus.APPROVED) {
            if (user.status === client_1.UserStatus.REJECTED) {
                throw new common_1.ForbiddenException('Your account approval has been rejected');
            }
            throw new common_1.ForbiddenException('Your account is pending approval');
        }
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ id: user.id, email: user.email, role: user.role }, { expiresIn: '15m' }),
            this.jwtService.signAsync({ id: user.id, email: user.email, role: user.role }, { expiresIn: '7d' }),
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
    async requestOtp(dto) {
        const email = this.normalizeEmail(dto.email);
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
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
    async resetPassword(dto) {
        const email = this.normalizeEmail(dto.email);
        const otp = dto.otp.trim();
        const newPassword = dto.newPassword;
        try {
            const user = await this.prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new common_1.BadRequestException('User no longer exists');
            }
            if (!user.otp || user.otp !== otp || !user.otpExpiry) {
                throw new common_1.BadRequestException('Invalid or expired OTP');
            }
            if (user.otpExpiry < new Date()) {
                throw new common_1.BadRequestException('OTP has expired');
            }
            if (!newPassword) {
                throw new common_1.BadRequestException('New password is required');
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