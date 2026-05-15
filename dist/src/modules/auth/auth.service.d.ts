import { PrismaService } from '../../database/prisma.service';
import { LoginDto, PasswordResetDto, RegisterDto, RequestOtpDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../common/mail/mail.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private readonly mailService;
    constructor(prisma: PrismaService, jwtService: JwtService, mailService: MailService);
    private normalizeEmail;
    register(dto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            email: string;
            phone: string;
            age: number;
            role: import(".prisma/client").$Enums.Role;
            businessName: string | null;
            businessAddress: string | null;
            id: string;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                name: string;
                email: string;
                phone: string;
                age: number;
                role: import(".prisma/client").$Enums.Role;
                status: import(".prisma/client").$Enums.UserStatus;
                businessName: string | null;
                businessAddress: string | null;
            };
            tokens: {
                accessToken: string;
                refreshToken: string;
            };
        };
    }>;
    requestOtp(dto: RequestOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(dto: PasswordResetDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
