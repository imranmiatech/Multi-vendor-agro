import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto, ProductFilterDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Product')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @ApiOperation({ summary: 'Create a new product' })
    @ApiBearerAuth()
    @ApiBody({ type: CreateProductDto })
    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(
        @Body() createProductDto: CreateProductDto,
        @CurrentUser() user: any
    ) {
        return await this.productService.create(user.userId, createProductDto);
    }

    @ApiOperation({ summary: 'Get all products' })
    @ApiQuery({ name: 'sku', required: false, type: Number })
    @ApiQuery({ name: 'category', required: false, type: String })
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
    @ApiBody({ type: CreateProductDto })
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: CreateProductDto,
        @CurrentUser() user: any
    ) {
        return await this.productService.update(id, updateProductDto, user.userId);
    }

    @ApiOperation({ summary: 'Delete a product' })
    @ApiParam({ name: 'id', type: String })
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.productService.remove(id);
    }
}
