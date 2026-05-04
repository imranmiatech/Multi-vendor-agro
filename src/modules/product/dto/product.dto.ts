import {
    IsString,
    IsOptional,
    IsNumber,
    IsBoolean,
    IsArray,
    IsDateString,
} from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsNumber()
    sku?: number;

    @IsOptional()
    @IsString()
    material?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    condition?: string;

    @IsOptional()
    @IsBoolean()
    status?: boolean;

    @IsOptional()
    @IsArray()
    image?: string[];

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNumber()
    specialPrice?: number;

    @IsOptional()
    @IsDateString()
    specialPriceFrom?: Date;

    @IsOptional()
    @IsDateString()
    specialPriceTo?: Date;

    @IsOptional()
    @IsNumber()
    stockQuantity?: number;

    @IsOptional()
    @IsArray()
    allowedCurrency?: string[];

    @IsOptional()
    @IsNumber()
    length?: number;

    @IsOptional()
    @IsNumber()
    height?: number;

    @IsOptional()
    @IsNumber()
    width?: number;

    @IsOptional()
    @IsNumber()
    weight?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    story?: string;
}

export class ProductFilterDto {
    @IsOptional()
    @IsNumber()
    sku?: number;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    productType?: string;
}