import { Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private cleanString;
    private assertModerator;
    private getModeratableUser;
    private getModeratableProduct;
    getPendingApprovals(currentUserId: string, role?: Role): Promise<{
        message: string;
        count: number;
        users: {
            name: string;
            email: string;
            phone: string;
            age: number;
            role: import(".prisma/client").$Enums.Role;
            businessName: string | null;
            businessAddress: string | null;
            id: string;
            status: import(".prisma/client").$Enums.UserStatus;
            createdAt: Date;
        }[];
    }>;
    approveUser(currentUserId: string, userId: string): Promise<{
        message: string;
        user: {
            name: string;
            email: string;
            phone: string;
            age: number;
            role: import(".prisma/client").$Enums.Role;
            businessName: string | null;
            businessAddress: string | null;
            id: string;
            status: import(".prisma/client").$Enums.UserStatus;
            updatedAt: Date;
        };
    }>;
    rejectUser(currentUserId: string, userId: string): Promise<{
        message: string;
        user: {
            name: string;
            email: string;
            phone: string;
            age: number;
            role: import(".prisma/client").$Enums.Role;
            businessName: string | null;
            businessAddress: string | null;
            id: string;
            status: import(".prisma/client").$Enums.UserStatus;
            updatedAt: Date;
        };
    }>;
    getPendingProducts(currentUserId: string): Promise<{
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
    approveProduct(currentUserId: string, productId: string): Promise<{
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
    rejectProduct(currentUserId: string, productId: string, rejectReason?: string): Promise<{
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
}
