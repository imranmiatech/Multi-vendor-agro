import { ProductService } from './product.service';
import { CreateProductDto, ProductFilterDto } from './dto/product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto, user: any): Promise<{
        message: string;
        product: {
            user: {
                id: string;
                email: string;
            };
        } & {
            length: number | null;
            id: string;
            name: string;
            sku: number | null;
            material: string | null;
            location: string | null;
            condition: string | null;
            status: boolean;
            image: string[];
            price: number | null;
            specialPrice: number | null;
            specialPriceFrom: Date | null;
            specialPriceTo: Date | null;
            stockQuantity: number | null;
            allowedCurrency: string[];
            height: number | null;
            width: number | null;
            weight: number | null;
            description: string | null;
            story: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
    }>;
    findAll(query: ProductFilterDto): Promise<{
        message: string;
        count: number;
        products: ({
            user: {
                id: string;
                fullName: string;
                email: string;
            };
        } & {
            length: number | null;
            id: string;
            name: string;
            sku: number | null;
            material: string | null;
            location: string | null;
            condition: string | null;
            status: boolean;
            image: string[];
            price: number | null;
            specialPrice: number | null;
            specialPriceFrom: Date | null;
            specialPriceTo: Date | null;
            stockQuantity: number | null;
            allowedCurrency: string[];
            height: number | null;
            width: number | null;
            weight: number | null;
            description: string | null;
            story: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        })[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        product: {
            user: {
                id: string;
                fullName: string;
                email: string;
            };
        } & {
            length: number | null;
            id: string;
            name: string;
            sku: number | null;
            material: string | null;
            location: string | null;
            condition: string | null;
            status: boolean;
            image: string[];
            price: number | null;
            specialPrice: number | null;
            specialPriceFrom: Date | null;
            specialPriceTo: Date | null;
            stockQuantity: number | null;
            allowedCurrency: string[];
            height: number | null;
            width: number | null;
            weight: number | null;
            description: string | null;
            story: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
    }>;
    update(id: string, updateProductDto: CreateProductDto, user: any): Promise<{
        message: string;
        product: {
            user: {
                id: string;
                fullName: string;
                email: string;
            };
        } & {
            length: number | null;
            id: string;
            name: string;
            sku: number | null;
            material: string | null;
            location: string | null;
            condition: string | null;
            status: boolean;
            image: string[];
            price: number | null;
            specialPrice: number | null;
            specialPriceFrom: Date | null;
            specialPriceTo: Date | null;
            stockQuantity: number | null;
            allowedCurrency: string[];
            height: number | null;
            width: number | null;
            weight: number | null;
            description: string | null;
            story: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
