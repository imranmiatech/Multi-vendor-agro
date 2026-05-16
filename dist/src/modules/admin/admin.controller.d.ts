import { AdminService } from './admin.service';
import { PendingApprovalQueryDto, RejectProductDto } from './dto/approval.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getPendingApprovals(user: {
        userId: string;
    }, query: PendingApprovalQueryDto): Promise<{
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
    approveUser(user: {
        userId: string;
    }, userId: string): Promise<{
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
    rejectUser(user: {
        userId: string;
    }, userId: string): Promise<{
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
    getPendingProducts(user: {
        userId: string;
    }): Promise<{
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
    approveProduct(user: {
        userId: string;
    }, productId: string): Promise<{
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
    rejectProduct(user: {
        userId: string;
    }, productId: string, dto: RejectProductDto): Promise<{
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
