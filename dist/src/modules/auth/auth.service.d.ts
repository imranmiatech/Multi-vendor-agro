import { PrismaService } from '../../database/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../common/mail/mail.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private readonly mailService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailService: MailService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            fullName: string;
            email: string;
            password: string;
            id: string;
            createdAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            fullName: string;
            email: string;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    requestOtp(email: string): Promise<{
        message: string;
    }>;
    resetPassword(email: string, otp: string, newPassword: string): Promise<{
        message: string;
    }>;
}
