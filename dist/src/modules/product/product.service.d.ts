import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/product.dto';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { UploadedImageFile } from '../common/cloudinary/cloudinary.types';
export declare class ProductService {
    private prisma;
    private readonly cloudinaryService;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService);
    private cleanString;
    private validateProductOwner;
    private buildCreateProductData;
    private buildUpdateProductData;
    create(userId: string, dto: CreateProductDto, files: UploadedImageFile[]): Promise<{
        message: string;
        product: {
            user: {
                email: string;
                id: string;
            } | null;
        } & {
            description: string;
            title: string | null;
            id: string;
            status: import(".prisma/client").$Enums.ProductStatus;
            createdAt: Date;
            updatedAt: Date;
            productName: string;
            brand: string | null;
            categoryId: string;
            sku: string;
            images: string[];
            price: number;
            discountPrice: number | null;
            discountStartDate: Date | null;
            discountEndDate: Date | null;
            stockQuantity: number;
            rejectReason: string | null;
            vendorId: string;
            approvedAt: Date | null;
            rejectedAt: Date | null;
            userId: string | null;
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
            } | null;
        } & {
            description: string;
            title: string | null;
            id: string;
            status: import(".prisma/client").$Enums.ProductStatus;
            createdAt: Date;
            updatedAt: Date;
            productName: string;
            brand: string | null;
            categoryId: string;
            sku: string;
            images: string[];
            price: number;
            discountPrice: number | null;
            discountStartDate: Date | null;
            discountEndDate: Date | null;
            stockQuantity: number;
            rejectReason: string | null;
            vendorId: string;
            approvedAt: Date | null;
            rejectedAt: Date | null;
            userId: string | null;
        })[];
    }>;
    findOne(id: string): Promise<{
        message: string;
        product: {
            user: {
                name: string;
                email: string;
                id: string;
            } | null;
        } & {
            description: string;
            title: string | null;
            id: string;
            status: import(".prisma/client").$Enums.ProductStatus;
            createdAt: Date;
            updatedAt: Date;
            productName: string;
            brand: string | null;
            categoryId: string;
            sku: string;
            images: string[];
            price: number;
            discountPrice: number | null;
            discountStartDate: Date | null;
            discountEndDate: Date | null;
            stockQuantity: number;
            rejectReason: string | null;
            vendorId: string;
            approvedAt: Date | null;
            rejectedAt: Date | null;
            userId: string | null;
        };
    }>;
    update(id: string, dto: CreateProductDto, userId: string, files: UploadedImageFile[]): Promise<{
        message: string;
        product: {
            user: {
                name: string;
                email: string;
                id: string;
            } | null;
        } & {
            description: string;
            title: string | null;
            id: string;
            status: import(".prisma/client").$Enums.ProductStatus;
            createdAt: Date;
            updatedAt: Date;
            productName: string;
            brand: string | null;
            categoryId: string;
            sku: string;
            images: string[];
            price: number;
            discountPrice: number | null;
            discountStartDate: Date | null;
            discountEndDate: Date | null;
            stockQuantity: number;
            rejectReason: string | null;
            vendorId: string;
            approvedAt: Date | null;
            rejectedAt: Date | null;
            userId: string | null;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
