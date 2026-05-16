import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductStatus, Role, UserStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

const MODERATABLE_ROLES = new Set<Role>([Role.VENDOR, Role.ADMIN]);
const ADMIN_ROLES = new Set<Role>([Role.ADMIN, Role.SUPERADMIN]);

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) { }

    private cleanString(value?: string | null) {
        const trimmed = value?.trim();
        return trimmed ? trimmed : null;
    }

    private async assertModerator(currentUserId: string) {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: currentUserId },
            select: {
                id: true,
                role: true,
                status: true,
            },
        });

        if (!currentUser) {
            throw new NotFoundException('Current user not found');
        }

        if (!ADMIN_ROLES.has(currentUser.role) || currentUser.status !== UserStatus.APPROVED) {
            throw new ForbiddenException('Only approved admin users can manage approvals');
        }
    }

    private async getModeratableUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                age: true,
                role: true,
                status: true,
                businessName: true,
                businessAddress: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!MODERATABLE_ROLES.has(user.role)) {
            throw new BadRequestException('Only vendor or admin accounts can be approved or rejected');
        }

        return user;
    }

    private async getModeratableProduct(productId: string) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    async getPendingApprovals(currentUserId: string, role?: Role) {
        await this.assertModerator(currentUserId);

        if (role && !MODERATABLE_ROLES.has(role)) {
            throw new BadRequestException('Only vendor or admin approvals can be listed');
        }

        const users = await this.prisma.user.findMany({
            where: {
                status: UserStatus.PENDING,
                role: role ?? {
                    in: [Role.VENDOR, Role.ADMIN],
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                age: true,
                role: true,
                status: true,
                businessName: true,
                businessAddress: true,
                createdAt: true,
            },
        });

        return {
            message: 'Pending approvals fetched successfully',
            count: users.length,
            users,
        };
    }

    async approveUser(currentUserId: string, userId: string) {
        await this.assertModerator(currentUserId);
        const user = await this.getModeratableUser(userId);

        if (user.status !== UserStatus.PENDING) {
            throw new BadRequestException(`This account is already ${user.status.toLowerCase()}`);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                status: UserStatus.APPROVED,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                age: true,
                role: true,
                status: true,
                businessName: true,
                businessAddress: true,
                updatedAt: true,
            },
        });

        return {
            message: `${updatedUser.role} account approved successfully`,
            user: updatedUser,
        };
    }

    async rejectUser(currentUserId: string, userId: string) {
        await this.assertModerator(currentUserId);
        const user = await this.getModeratableUser(userId);

        if (user.status !== UserStatus.PENDING) {
            throw new BadRequestException(`This account is already ${user.status.toLowerCase()}`);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                status: UserStatus.REJECTED,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                age: true,
                role: true,
                status: true,
                businessName: true,
                businessAddress: true,
                updatedAt: true,
            },
        });

        return {
            message: `${updatedUser.role} account rejected successfully`,
            user: updatedUser,
        };
    }

    async getPendingProducts(currentUserId: string) {
        await this.assertModerator(currentUserId);

        const products = await this.prisma.product.findMany({
            where: {
                status: ProductStatus.PENDING,
            },
            orderBy: {
                createdAt: 'asc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return {
            message: 'Pending products fetched successfully',
            count: products.length,
            products,
        };
    }

    async approveProduct(currentUserId: string, productId: string) {
        await this.assertModerator(currentUserId);
        const product = await this.getModeratableProduct(productId);

        if (product.status !== ProductStatus.PENDING) {
            throw new BadRequestException(`This product is already ${product.status.toLowerCase()}`);
        }

        const updatedProduct = await this.prisma.product.update({
            where: { id: productId },
            data: {
                status: ProductStatus.APPROVED,
                approvedAt: new Date(),
                rejectedAt: null,
                rejectReason: null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return {
            message: 'Product approved successfully',
            product: updatedProduct,
        };
    }

    async rejectProduct(currentUserId: string, productId: string, rejectReason?: string) {
        await this.assertModerator(currentUserId);
        const product = await this.getModeratableProduct(productId);

        if (product.status !== ProductStatus.PENDING) {
            throw new BadRequestException(`This product is already ${product.status.toLowerCase()}`);
        }

        const updatedProduct = await this.prisma.product.update({
            where: { id: productId },
            data: {
                status: ProductStatus.REJECTED,
                rejectedAt: new Date(),
                approvedAt: null,
                rejectReason: this.cleanString(rejectReason),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return {
            message: 'Product rejected successfully',
            product: updatedProduct,
        };
    }
}
