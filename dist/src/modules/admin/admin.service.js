"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma.service");
const MODERATABLE_ROLES = new Set([client_1.Role.VENDOR, client_1.Role.ADMIN]);
const ADMIN_ROLES = new Set([client_1.Role.ADMIN, client_1.Role.SUPERADMIN]);
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    cleanString(value) {
        const trimmed = value?.trim();
        return trimmed ? trimmed : null;
    }
    async assertModerator(currentUserId) {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: currentUserId },
            select: {
                id: true,
                role: true,
                status: true,
            },
        });
        if (!currentUser) {
            throw new common_1.NotFoundException('Current user not found');
        }
        if (!ADMIN_ROLES.has(currentUser.role) || currentUser.status !== client_1.UserStatus.APPROVED) {
            throw new common_1.ForbiddenException('Only approved admin users can manage approvals');
        }
    }
    async getModeratableUser(userId) {
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
            throw new common_1.NotFoundException('User not found');
        }
        if (!MODERATABLE_ROLES.has(user.role)) {
            throw new common_1.BadRequestException('Only vendor or admin accounts can be approved or rejected');
        }
        return user;
    }
    async getModeratableProduct(productId) {
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
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async getPendingApprovals(currentUserId, role) {
        await this.assertModerator(currentUserId);
        if (role && !MODERATABLE_ROLES.has(role)) {
            throw new common_1.BadRequestException('Only vendor or admin approvals can be listed');
        }
        const users = await this.prisma.user.findMany({
            where: {
                status: client_1.UserStatus.PENDING,
                role: role ?? {
                    in: [client_1.Role.VENDOR, client_1.Role.ADMIN],
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
    async approveUser(currentUserId, userId) {
        await this.assertModerator(currentUserId);
        const user = await this.getModeratableUser(userId);
        if (user.status !== client_1.UserStatus.PENDING) {
            throw new common_1.BadRequestException(`This account is already ${user.status.toLowerCase()}`);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                status: client_1.UserStatus.APPROVED,
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
    async rejectUser(currentUserId, userId) {
        await this.assertModerator(currentUserId);
        const user = await this.getModeratableUser(userId);
        if (user.status !== client_1.UserStatus.PENDING) {
            throw new common_1.BadRequestException(`This account is already ${user.status.toLowerCase()}`);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: {
                status: client_1.UserStatus.REJECTED,
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
    async getPendingProducts(currentUserId) {
        await this.assertModerator(currentUserId);
        const products = await this.prisma.product.findMany({
            where: {
                status: client_1.ProductStatus.PENDING,
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
    async approveProduct(currentUserId, productId) {
        await this.assertModerator(currentUserId);
        const product = await this.getModeratableProduct(productId);
        if (product.status !== client_1.ProductStatus.PENDING) {
            throw new common_1.BadRequestException(`This product is already ${product.status.toLowerCase()}`);
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id: productId },
            data: {
                status: client_1.ProductStatus.APPROVED,
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
    async rejectProduct(currentUserId, productId, rejectReason) {
        await this.assertModerator(currentUserId);
        const product = await this.getModeratableProduct(productId);
        if (product.status !== client_1.ProductStatus.PENDING) {
            throw new common_1.BadRequestException(`This product is already ${product.status.toLowerCase()}`);
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id: productId },
            data: {
                status: client_1.ProductStatus.REJECTED,
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map