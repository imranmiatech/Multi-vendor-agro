import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class PendingApprovalQueryDto {
    @ApiPropertyOptional({ enum: [Role.VENDOR, Role.ADMIN], example: Role.VENDOR })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}

export class RejectProductDto {
    @ApiPropertyOptional({ example: 'Product information is incomplete' })
    @IsOptional()
    @IsString()
    rejectReason?: string;
}
