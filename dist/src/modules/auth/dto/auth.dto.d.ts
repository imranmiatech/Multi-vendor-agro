export declare class RegisterDto {
    fullName: string;
    email: string;
    password: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RequestOtpDto {
    email: string;
}
export declare class ResetPasswordDto {
    email: string;
    otp: string;
    newPassword: string;
}
