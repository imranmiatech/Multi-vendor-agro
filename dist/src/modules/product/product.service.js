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
const prisma_service_1 = require("../../database/prisma.service");
let ProductService = class ProductService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        if (!dto.name) {
            throw new common_1.BadRequestException('Product name is required');
        }
        const data = {
            name: dto.name,
            sku: dto.sku ?? null,
            material: dto.material ?? null,
            location: dto.location ?? null,
            condition: dto.condition ?? null,
            status: dto.status ?? true,
            image: dto.image ?? [],
            allowedCurrency: dto.allowedCurrency ?? ['USD'],
            price: dto.price ?? null,
            specialPrice: dto.specialPrice ?? null,
            specialPriceFrom: dto.specialPriceFrom ?? null,
            specialPriceTo: dto.specialPriceTo ?? null,
            stockQuantity: dto.stockQuantity ?? 0,
            length: dto.length ?? null,
            height: dto.height ?? null,
            width: dto.width ?? null,
            weight: dto.weight ?? null,
            description: dto.description ?? null,
            story: dto.story ?? null,
            userId,
        };
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
                        fullName: true,
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
                        fullName: true,
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
    async update(id, dto, userId) {
        const existing = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (existing.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to update this product');
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: {
                ...dto,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map