import {
    IsString,
    IsOptional,
    IsNumber,
    IsArray,
    IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

const toOptionalNumber = ({ value }: { value: unknown }) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }

    return Number(value);
};

const toOptionalDateString = ({ value }: { value: unknown }) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    return String(value);
};

const toOptionalStringArray = ({ value }: { value: unknown }) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }

    if (Array.isArray(value)) {
        return value.map(String);
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) {
            return undefined;
        }

        if (trimmed.startsWith('[')) {
            try {
                const parsed = JSON.parse(trimmed);
                return Array.isArray(parsed) ? parsed.map(String) : undefined;
            } catch {
                return undefined;
            }
        }

        return trimmed.split(',').map((item) => item.trim()).filter(Boolean);
    }

    return undefined;
};

export class CreateProductDto {
    @ApiProperty({ example: 'seed' })
    @IsOptional()
    @IsString()
    productName?: string;

    @ApiPropertyOptional({ example: 'Wooden Chair', deprecated: true })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'Premium handcrafted chair' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 'Acme Furniture' })
    @IsOptional()
    @IsString()
    brand?: string;

    @ApiProperty({ example: 'furniture' })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiPropertyOptional({ example: 'SKU-1001' })
    @IsOptional()
    @IsString()
    sku?: string;

    @ApiProperty({ example: 'Handcrafted premium chair' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: ['https://example.com/image-1.jpg'] })
    @IsOptional()
    @IsArray()
    @Transform(toOptionalStringArray)
    images?: string[];

    @ApiPropertyOptional({ example: ['https://example.com/image-1.jpg'], deprecated: true })
    @IsOptional()
    @IsArray()
    @Transform(toOptionalStringArray)
    image?: string[];

    @ApiProperty({ example: 5000 })
    @IsOptional()
    @IsNumber()
    @Transform(toOptionalNumber)
    price?: number;

    @ApiPropertyOptional({ example: 4500 })
    @IsOptional()
    @IsNumber()
    @Transform(toOptionalNumber)
    discountPrice?: number;

    @ApiPropertyOptional({ example: 4500, deprecated: true })
    @IsOptional()
    @IsNumber()
    @Transform(toOptionalNumber)
    specialPrice?: number;

    @ApiPropertyOptional({ example: '2026-05-15T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    @Transform(toOptionalDateString)
    discountStartDate?: Date;

    @ApiPropertyOptional({ example: '2026-05-15T00:00:00.000Z', deprecated: true })
    @IsOptional()
    @IsDateString()
    @Transform(toOptionalDateString)
    specialPriceFrom?: Date;

    @ApiPropertyOptional({ example: '2026-05-30T00:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    @Transform(toOptionalDateString)
    discountEndDate?: Date;

    @ApiPropertyOptional({ example: '2026-05-30T00:00:00.000Z', deprecated: true })
    @IsOptional()
    @IsDateString()
    @Transform(toOptionalDateString)
    specialPriceTo?: Date;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @IsNumber()
    @Transform(toOptionalNumber)
    stockQuantity?: number;

    @ApiPropertyOptional({ example: 'Made by local artisans.' })
    @IsOptional()
    @IsString()
    rejectReason?: string;
}

export class ProductFilterDto {
    @ApiPropertyOptional({ example: 'SKU-1001' })
    @IsOptional()
    @IsString()
    sku?: string;

    @ApiPropertyOptional({ example: 'furniture' })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiPropertyOptional({ example: 'chair', deprecated: true })
    @IsOptional()
    @IsString()
    productType?: string;
}
