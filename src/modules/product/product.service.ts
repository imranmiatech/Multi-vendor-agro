import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/product.dto';


@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateProductDto) {
        // 🔍 1. Basic validation
        if (!dto.name) {
            throw new BadRequestException('Product name is required');
        }

        // 🔍 2. Price validation
        // if (dto.specialPrice && !dto.price) {
        //     throw new BadRequestException('Base price is required for special price');
        // }

        // if (dto.specialPrice && dto.specialPrice >= dto.specialPrice) {
        //     throw new BadRequestException('Special price must be less than regular price');
        // }

        // // 🔍 3. Special price date validation
        // if (dto.specialPriceFrom && dto.specialPriceTo) {
        //     if (new Date(dto.specialPriceFrom) > new Date(dto.specialPriceTo)) {
        //         throw new BadRequestException('Invalid special price date range');
        //     }
        // }

        // 🔍 4. Default values
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

        // 🚀 5. Create product
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
    async update(id: string, dto: CreateProductDto, userId: string) {
        // 1. check product exists and belongs to user
        const existing = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!existing) {
            throw new NotFoundException('Product not found');
        }

        if (existing.userId !== userId) {
            throw new BadRequestException('You do not have permission to update this product');
        }

        // 2. update product
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: {
                ...dto,
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
            message: 'Product updated successfully',
            product: updatedProduct,
        };
    }
    async remove(id: string) {
        // 1. check if product exists
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // 2. delete product
        await this.prisma.product.delete({
            where: { id },
        });

        return {
            message: 'Product deleted successfully',
            id,
        };
    }
}
