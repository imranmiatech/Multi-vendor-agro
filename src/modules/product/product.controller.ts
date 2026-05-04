import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ProductFilterDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    async create(
        @Body() createProductDto: CreateProductDto,
        @CurrentUser() user: any
    ) {
        return await this.productService.create(user.userId, createProductDto);
    }
    @Get('all')
    findAll(@Query() query: ProductFilterDto) {
        return this.productService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: CreateProductDto,
        @CurrentUser() user: any
    ) {
        return await this.productService.update(id, updateProductDto, user.userId);
    }
    // @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.productService.remove(id);
    }
}
