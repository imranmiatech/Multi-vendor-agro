import {
    IsString,
    IsOptional,
    IsNumber,
    IsBoolean,
    IsArray,
    IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({ example: 'Wooden Chair' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 1001 })
    @IsOptional()
    @IsNumber()
    sku?: number;

    @ApiPropertyOptional({ example: 'Oak Wood' })
    @IsOptional()
    @IsString()
    material?: string;

    @ApiPropertyOptional({ example: 'Dhaka Warehouse' })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiPropertyOptional({ example: 'New' })
    @IsOptional()
    @IsString()
    condition?: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @ApiPropertyOptional({ example: ['https://example.com/image-1.jpg'] })
    @IsOptional()
    @IsArray()
    image?: string[];

    @ApiPropertyOptional({ example: 5000 })
    @IsOptional()
    @IsNumber()
    price?: number;

    @ApiPropertyOptional({ example: 4500 })
    @IsOptional()
    @IsNumber()
    specialPrice?: number;

    @ApiPropertyOptional({ example: '2026-05-15T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    specialPriceFrom?: Date;

    @ApiPropertyOptional({ example: '2026-05-30T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    specialPriceTo?: Date;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @IsNumber()
    stockQuantity?: number;

    @ApiPropertyOptional({ example: ['USD', 'BDT'] })
    @IsOptional()
    @IsArray()
    allowedCurrency?: string[];

    @ApiPropertyOptional({ example: 48 })
    @IsOptional()
    @IsNumber()
    length?: number;

    @ApiPropertyOptional({ example: 90 })
    @IsOptional()
    @IsNumber()
    height?: number;

    @ApiPropertyOptional({ example: 52 })
    @IsOptional()
    @IsNumber()
    width?: number;

    @ApiPropertyOptional({ example: 8 })
    @IsOptional()
    @IsNumber()
    weight?: number;

    @ApiPropertyOptional({ example: 'Handcrafted premium chair' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 'Made by local artisans.' })
    @IsOptional()
    @IsString()
    story?: string;
}

export class ProductFilterDto {
    @ApiPropertyOptional({ example: 1001 })
    @IsOptional()
    @IsNumber()
    sku?: number;

    @ApiPropertyOptional({ example: 'furniture' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ example: 'chair' })
    @IsOptional()
    @IsString()
    productType?: string;
}
