import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma, ProductStatus, Role, UserStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/product.dto';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { UploadedImageFile } from '../common/cloudinary/cloudinary.types';

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    private cleanString(value?: string | null) {
        const trimmed = value?.trim();
        return trimmed ? trimmed : null;
    }

    private async validateProductOwner(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                role: true,
                status: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (
            user.role !== Role.VENDOR &&
            user.role !== Role.ADMIN &&
            user.role !== Role.SUPERADMIN
        ) {
            throw new ForbiddenException('Only vendor or admin users can manage products');
        }

        if (user.status !== UserStatus.APPROVED) {
            throw new ForbiddenException('Only approved accounts can manage products');
        }
    }

    private buildCreateProductData(
        dto: CreateProductDto,
        userId: string,
        imageUrls: string[],
    ): Prisma.ProductUncheckedCreateInput {
        const productName = this.cleanString(dto.productName) ?? this.cleanString(dto.name);
        const categoryId = this.cleanString(dto.categoryId);
        const description = this.cleanString(dto.description);
        const sku = dto.sku != null ? String(dto.sku).trim() : null;

        if (!productName) {
            throw new BadRequestException('Product name is required');
        }

        if (!categoryId) {
            throw new BadRequestException('Category is required');
        }

        if (!description) {
            throw new BadRequestException('Description is required');
        }

        if (dto.price == null) {
            throw new BadRequestException('Price is required');
        }

        if (!sku) {
            throw new BadRequestException('SKU is required');
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
            status: ProductStatus.PENDING,
        };
    }

    private buildUpdateProductData(
        dto: CreateProductDto,
        imageUrls?: string[],
    ): Prisma.ProductUncheckedUpdateInput {
        const productName = this.cleanString(dto.productName) ?? this.cleanString(dto.name);
        const categoryId = this.cleanString(dto.categoryId);
        const description = this.cleanString(dto.description);
        const sku = dto.sku != null ? String(dto.sku).trim() : null;

        const data: Prisma.ProductUncheckedUpdateInput = {};

        if (productName !== null) data.productName = productName;
        if (dto.title !== undefined) data.title = this.cleanString(dto.title);
        if (dto.brand !== undefined) data.brand = this.cleanString(dto.brand);
        if (categoryId !== null) data.categoryId = categoryId;
        if (description !== null) data.description = description;
        if (sku !== null) data.sku = sku;
        if (dto.price !== undefined) data.price = dto.price;
        if (dto.discountPrice !== undefined || dto.specialPrice !== undefined) {
            data.discountPrice = dto.discountPrice ?? dto.specialPrice ?? null;
        }
        if (dto.discountStartDate !== undefined || dto.specialPriceFrom !== undefined) {
            data.discountStartDate = dto.discountStartDate ?? dto.specialPriceFrom ?? null;
        }
        if (dto.discountEndDate !== undefined || dto.specialPriceTo !== undefined) {
            data.discountEndDate = dto.discountEndDate ?? dto.specialPriceTo ?? null;
        }
        if (dto.stockQuantity !== undefined) data.stockQuantity = dto.stockQuantity;
        if (imageUrls !== undefined) {
            data.images = imageUrls;
        } else if (dto.images !== undefined || dto.image !== undefined) {
            data.images = dto.images ?? dto.image ?? [];
        }
        data.status = ProductStatus.PENDING;
        data.approvedAt = null;
        data.rejectedAt = null;
        data.rejectReason = null;

        return data;
    }

    async create(userId: string, dto: CreateProductDto, files: UploadedImageFile[]) {
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
                createdAt: 'desc', // newest first
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

    async findOne(id: string) {
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
            throw new NotFoundException('Product not found');
        }

        return {
            message: 'Product fetched successfully',
            product,
        };
    }
    async update(id: string, dto: CreateProductDto, userId: string, files: UploadedImageFile[]) {
        await this.validateProductOwner(userId);
        const existing = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new NotFoundException('Product not found');
        }

        const ownerId = existing.userId ?? existing.vendorId;
        if (ownerId !== userId) {
            throw new BadRequestException('You do not have permission to update this product');
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
    async remove(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        await this.prisma.product.delete({
            where: { id },
        });

        return {
            message: 'Product deleted successfully',
            id,
        };
    }
}
