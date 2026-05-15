import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/product.dto';
export declare class ProductService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateProductDto): Promise<{
        message: string;
        product: {
            user: {
                email: string;
                id: string;
            };
        } & {
            description: string | null;
            name: string;
            id: string;
            status: boolean;
            image: string[];
            createdAt: Date;
            updatedAt: Date;
            length: number | null;
            sku: number | null;
            material: string | null;
            location: string | null;
            condition: string | null;
            price: number | null;
            specialPrice: number | null;
            specialPriceFrom: Date | null;
            specialPriceTo: Date | null;
            stockQuantity: number | null;
            allowedCurrency: string[];
            height: number | null;
            width: number | null;
            weight: number | null;
            story: string | null;
            userId: string;
        };
    }>;
    findAll(): Promise<{
        message: string;
        count: number;
        products: ({
            user: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            description: string | null;
            name: string;
            id: string;
            status: boolean;
            image: string[];
            createdAt: Date;
            updatedAt: Date;
            length: number | null;
            sku: number | null;
            material: string | null;
            location: string | null;
            condition: string | null;
            price: number | null;
            specialPrice: number | null;
            specialPriceFrom: Date | null;
            specialPriceTo: Date | null;
            stockQuantity: number | null;
            allowedCurrency: string[];
            height: number | null;
            width: number | null;
            weight: number | null;
            story: string | null;
            userId: string;
        })[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        product: {
            user: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            description: string | null;
            name: string;
            id: string;
            status: boolean;
            image: string[];
            createdAt: Date;
            updatedAt: Date;
            length: number | null;
            sku: number | null;
            material: string | null;
            location: string | null;
            condition: string | null;
            price: number | null;
            specialPrice: number | null;
            specialPriceFrom: Date | null;
            specialPriceTo: Date | null;
            stockQuantity: number | null;
            allowedCurrency: string[];
            height: number | null;
            width: number | null;
            weight: number | null;
            story: string | null;
            userId: string;
        };
    }>;
    update(id: string, dto: CreateProductDto, userId: string): Promise<{
        message: string;
        product: {
            user: {
                name: string;
                email: string;
                id: string;
            };
        } & {
            description: string | null;
            name: string;
            id: string;
            status: boolean;
            image: string[];
            createdAt: Date;
            updatedAt: Date;
            length: number | null;
            sku: number | null;
            material: string | null;
            location: string | null;
            condition: string | null;
            price: number | null;
            specialPrice: number | null;
            specialPriceFrom: Date | null;
            specialPriceTo: Date | null;
            stockQuantity: number | null;
            allowedCurrency: string[];
            height: number | null;
            width: number | null;
            weight: number | null;
            story: string | null;
            userId: string;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
