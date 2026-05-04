import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    fullName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}


export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class RequestOtpDto {
    @IsEmail()
    email: string;
}


export class ResetPasswordDto {
    @IsEmail()
    email: string;

    @IsString()
    otp: string;

    @IsString()
    @MinLength(6)
    newPassword: string;
}