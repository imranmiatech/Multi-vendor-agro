import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/product.dto';
export declare class ProductService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateProductDto): Promise<{
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
    findAll(): Promise<{
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
    update(id: string, dto: CreateProductDto, userId: string): Promise<{
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
