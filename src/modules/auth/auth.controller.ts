import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, PasswordResetDto, RegisterDto, RequestOtpDto } from './dto/auth.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    @Post('register')
    async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @ApiOperation({ summary: 'Login and receive JWT tokens' })
    @ApiBody({ type: LoginDto })
    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.login(dto);

        const { accessToken, refreshToken } = result.data.tokens;

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

        return result;
    }

    @ApiOperation({ summary: 'Request OTP for password reset' })
    @ApiBody({ type: RequestOtpDto })
    @Post('request-otp')
    async requestOtp(@Body() dto: RequestOtpDto) {
        return this.authService.requestOtp(dto);
    }

    @ApiOperation({ summary: 'Reset password with OTP' })
    @ApiBody({ type: PasswordResetDto })
    @Post('reset-password')
    async resetPassword(@Body() dto: PasswordResetDto) {
        return this.authService.resetPassword(dto);
    }
}
