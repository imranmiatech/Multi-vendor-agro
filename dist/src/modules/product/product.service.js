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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma.service");
const cloudinary_service_1 = require("../common/cloudinary/cloudinary.service");
let ProductService = class ProductService {
    prisma;
    cloudinaryService;
    constructor(prisma, cloudinaryService) {
        this.prisma = prisma;
        this.cloudinaryService = cloudinaryService;
    }
    cleanString(value) {
        const trimmed = value?.trim();
        return trimmed ? trimmed : null;
    }
    async validateProductOwner(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                role: true,
                status: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.role !== client_1.Role.VENDOR &&
            user.role !== client_1.Role.ADMIN &&
            user.role !== client_1.Role.SUPERADMIN) {
            throw new common_1.ForbiddenException('Only vendor or admin users can manage products');
        }
        if (user.status !== client_1.UserStatus.APPROVED) {
            throw new common_1.ForbiddenException('Only approved accounts can manage products');
        }
    }
    buildCreateProductData(dto, userId, imageUrls) {
        const productName = this.cleanString(dto.productName) ?? this.cleanString(dto.name);
        const categoryId = this.cleanString(dto.categoryId);
        const description = this.cleanString(dto.description);
        const sku = dto.sku != null ? String(dto.sku).trim() : null;
        if (!productName) {
            throw new common_1.BadRequestException('Product name is required');
        }
        if (!categoryId) {
            throw new common_1.BadRequestException('Category is required');
        }
        if (!description) {
            throw new common_1.BadRequestException('Description is required');
        }
        if (dto.price == null) {
            throw new common_1.BadRequestException('Price is required');
        }
        if (!sku) {
            throw new common_1.BadRequestException('SKU is required');
        }
        return {
            productName,
            title: this.cleanString(dto.title),
            brand: this.cleanString(dto.brand),
            categoryId,
            description,
            sku,
            price: dto.price,
            discountPrice: dto.discountPrice ?? dto.specialPrice ?? null,
            discountStartDate: dto.discountStartDate ?? dto.specialPriceFrom ?? null,
            discountEndDate: dto.discountEndDate ?? dto.specialPriceTo ?? null,
            stockQuantity: dto.stockQuantity ?? 0,
            images: imageUrls,
            vendorId: userId,
            userId,
            status: client_1.ProductStatus.PENDING,
        };
    }
    buildUpdateProductData(dto, imageUrls) {
        const productName = this.cleanString(dto.productName) ?? this.cleanString(dto.name);
        const categoryId = this.cleanString(dto.categoryId);
        const description = this.cleanString(dto.description);
        const sku = dto.sku != null ? String(dto.sku).trim() : null;
        const data = {};
        if (productName !== null)
            data.productName = productName;
        if (dto.title !== undefined)
            data.title = this.cleanString(dto.title);
        if (dto.brand !== undefined)
            data.brand = this.cleanString(dto.brand);
        if (categoryId !== null)
            data.categoryId = categoryId;
        if (description !== null)
            data.description = description;
        if (sku !== null)
            data.sku = sku;
        if (dto.price !== undefined)
            data.price = dto.price;
        if (dto.discountPrice !== undefined || dto.specialPrice !== undefined) {
            data.discountPrice = dto.discountPrice ?? dto.specialPrice ?? null;
        }
        if (dto.discountStartDate !== undefined || dto.specialPriceFrom !== undefined) {
            data.discountStartDate = dto.discountStartDate ?? dto.specialPriceFrom ?? null;
        }
        if (dto.discountEndDate !== undefined || dto.specialPriceTo !== undefined) {
            data.discountEndDate = dto.discountEndDate ?? dto.specialPriceTo ?? null;
        }
        if (dto.stockQuantity !== undefined)
            data.stockQuantity = dto.stockQuantity;
        if (imageUrls !== undefined) {
            data.images = imageUrls;
        }
        else if (dto.images !== undefined || dto.image !== undefined) {
            data.images = dto.images ?? dto.image ?? [];
        }
        data.status = client_1.ProductStatus.PENDING;
        data.approvedAt = null;
        data.rejectedAt = null;
        data.rejectReason = null;
        return data;
    }
    async create(userId, dto, files) {
        await this.validateProductOwner(userId);
        const imageUrls = files.length > 0
            ? await this.cloudinaryService.uploadProductImages(files)
            : dto.images ?? dto.image ?? [];
        const data = this.buildCreateProductData(dto, userId, imageUrls);
        const product = await this.prisma.product.create({
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
        return {
            message: 'Product created successfully',
            product,
        };
    }
    async findAll() {
        const products = await this.prisma.product.findMany({
            orderBy: {
                createdAt: 'desc',
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
            message: 'Products fetched successfully',
            count: products.length,
            products,
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
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
        return {
            message: 'Product fetched successfully',
            product,
        };
    }
    async update(id, dto, userId, files) {
        await this.validateProductOwner(userId);
        const existing = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Product not found');
        }
        const ownerId = existing.userId ?? existing.vendorId;
        if (ownerId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to update this product');
        }
        const imageUrls = files.length > 0
            ? await this.cloudinaryService.uploadProductImages(files)
            : undefined;
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: this.buildUpdateProductData(dto, imageUrls),
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
            message: 'Product updated successfully',
            product: updatedProduct,
        };
    }
    async remove(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.prisma.product.delete({
            where: { id },
        });
        return {
            message: 'Product deleted successfully',
            id,
        };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], ProductService);
//# sourceMappingURL=product.service.js.map