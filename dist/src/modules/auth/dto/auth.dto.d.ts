import { Role } from '@prisma/client';
export declare class RegisterDto {
    name: string;
    email: string;
    phone: string;
    age: number;
    password: string;
    role?: Role;
    businessName?: string;
    businessAddress?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RequestOtpDto {
    email: string;
}
export declare class PasswordResetDto {
    email: string;
    otp: string;
    newPassword: string;
}
