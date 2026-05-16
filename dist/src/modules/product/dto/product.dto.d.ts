export declare class CreateProductDto {
    productName?: string;
    name?: string;
    title?: string;
    brand?: string;
    categoryId?: string;
    sku?: string;
    description?: string;
    images?: string[];
    image?: string[];
    price?: number;
    discountPrice?: number;
    specialPrice?: number;
    discountStartDate?: Date;
    specialPriceFrom?: Date;
    discountEndDate?: Date;
    specialPriceTo?: Date;
    stockQuantity?: number;
    rejectReason?: string;
}
export declare class ProductFilterDto {
    sku?: string;
    categoryId?: string;
    productType?: string;
}
