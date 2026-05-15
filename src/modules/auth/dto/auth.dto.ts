import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsIn, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'Imran Mia' })
    @IsString()
    name!: string;

    @ApiProperty({ example: 'imran@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '+8801712345678' })
    @IsString()
    phone!: string;

    @ApiProperty({ example: 28 })
    @IsInt()
    @Min(1)
    age!: number;

    @ApiProperty({ example: '123456', minLength: 6 })
    @IsString()
    @MinLength(6)
    password!: string;

    @ApiPropertyOptional({ enum: [Role.USER, Role.VENDOR], example: Role.VENDOR })
    @IsOptional()
    @IsEnum(Role)
    @IsIn([Role.USER, Role.VENDOR])
    role?: Role;

    @ApiPropertyOptional({ example: 'Klwlara Furnitures' })
    @IsOptional()
    @IsString()
    businessName?: string;

    @ApiPropertyOptional({ example: 'Dhaka, Bangladesh' })
    @IsOptional()
    @IsString()
    businessAddress?: string;
}


export class LoginDto {
    @ApiProperty({ example: 'imran@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    password!: string;
}

export class RequestOtpDto {
    @ApiProperty({ example: 'imran@example.com' })
    @IsEmail()
    email!: string;
}


export class PasswordResetDto {
    @ApiProperty({ example: 'imran@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    otp!: string;

    @ApiProperty({ example: 'newpassword123', minLength: 6 })
    @IsString()
    @MinLength(6)
    newPassword!: string;
}
