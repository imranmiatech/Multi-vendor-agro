import { ProductService } from './product.service';
import { CreateProductDto, ProductFilterDto } from './dto/product.dto';
import { UploadedImageFile } from '../common/cloudinary/cloudinary.types';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(createProductDto: CreateProductDto, files: UploadedImageFile[], user: any): Promise<{
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
    findAll(query: ProductFilterDto): Promise<{
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
    update(id: string, updateProductDto: CreateProductDto, files: UploadedImageFile[], user: any): Promise<{
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
