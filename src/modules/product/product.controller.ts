import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto, ProductFilterDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UploadedImageFile } from '../common/cloudinary/cloudinary.types';

const productMultipartBody = {
    schema: {
        type: 'object',
        properties: {
            productName: { type: 'string', example: 'Wooden Chair' },
            title: { type: 'string', example: 'Premium handcrafted chair' },
            brand: { type: 'string', example: 'Acme Furniture' },
            categoryId: { type: 'string', example: 'furniture' },
            sku: { type: 'string', example: 'SKU-1001' },
            description: { type: 'string', example: 'Handcrafted premium chair' },
            price: { type: 'number', example: 5000 },
            discountPrice: { type: 'number', example: 4500 },
            discountStartDate: { type: 'string', format: 'date-time' },
            discountEndDate: { type: 'string', format: 'date-time' },
            stockQuantity: { type: 'number', example: 20 },
            images: {
                type: 'array',
                items: { type: 'string', format: 'binary' },
            },
        },
    },
};

@ApiTags('Product')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @ApiOperation({ summary: 'Create a new product' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody(productMultipartBody)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('images', 5, { limits: { fileSize: 5 * 1024 * 1024 } }))
    @Post('create')
    async create(
        @Body() createProductDto: CreateProductDto,
        @UploadedFiles() files: UploadedImageFile[],
        @CurrentUser() user: any
    ) {
        return await this.productService.create(user.userId, createProductDto, files ?? []);
    }

    @ApiOperation({ summary: 'Get all products' })
    @ApiQuery({ name: 'sku', required: false, type: String })
    @ApiQuery({ name: 'categoryId', required: false, type: String })
    @ApiQuery({ name: 'productType', required: false, type: String })
    @Get('all')
    findAll(@Query() query: ProductFilterDto) {
        return this.productService.findAll();
    }

    @ApiOperation({ summary: 'Get a product by id' })
    @ApiParam({ name: 'id', type: String })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a product' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', type: String })
    @ApiConsumes('multipart/form-data')
    @ApiBody(productMultipartBody)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FilesInterceptor('images', 5, { limits: { fileSize: 5 * 1024 * 1024 } }))
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: CreateProductDto,
        @UploadedFiles() files: UploadedImageFile[],
        @CurrentUser() user: any
    ) {
        return await this.productService.update(id, updateProductDto, user.userId, files ?? []);
    }

    @ApiOperation({ summary: 'Delete a product' })
    @ApiParam({ name: 'id', type: String })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.productService.remove(id);
    }
}
