import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, PasswordResetDto, RegisterDto, RequestOtpDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(dto: LoginDto, res: Response): Promise<{
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
