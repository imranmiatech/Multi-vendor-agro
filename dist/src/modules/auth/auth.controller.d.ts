import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RequestOtpDto, ResetPasswordDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    login(dto: LoginDto, res: Response): Promise<{
        success: boolean;
        message: string;
        data: {
            data: {
                user: {
                    id: string;
                    fullName: string;
                    email: string;
                };
                tokens: {
                    accessToken: string;
                    refreshToken: string;
                };
            };
        };
    }>;
    requestOtp(dto: RequestOtpDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
