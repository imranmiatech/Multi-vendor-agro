export declare class CreateProductDto {
    name: string;
    sku?: number;
    material?: string;
    location?: string;
    condition?: string;
    status?: boolean;
    image?: string[];
    price?: number;
    specialPrice?: number;
    specialPriceFrom?: Date;
    specialPriceTo?: Date;
    stockQuantity?: number;
    allowedCurrency?: string[];
    length?: number;
    height?: number;
    width?: number;
    weight?: number;
    description?: string;
    story?: string;
}
export declare class ProductFilterDto {
    sku?: number;
    category?: string;
    productType?: string;
}
