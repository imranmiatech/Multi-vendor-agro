import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RequestOtpDto, ResetPasswordDto } from './dto/auth.dto';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }
    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.login(dto);

        const { accessToken, refreshToken } = result.tokens;

        // set cookies
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: false, // true in production (HTTPS)
            sameSite: 'lax',
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: false,
            path: '/auth/refresh',
            sameSite: 'lax',
        });

        return {
            success: true,
            message: 'Login successful',
            data: {
                data: {
                    user: result.user,
                    tokens: result.tokens, // ✅ ADD THIS
                }
            },
        };
    }
    @Post('request-otp')
    async requestOtp(@Body() dto: RequestOtpDto) {
        return this.authService.requestOtp(dto.email);
    }

    @Post('reset-password')
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return this.authService.resetPassword(
            dto.email,
            dto.otp,
            dto.newPassword,
        );
    }
}
