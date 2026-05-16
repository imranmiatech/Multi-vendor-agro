import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AdminService } from './admin.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PendingApprovalQueryDto, RejectProductDto } from './dto/approval.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.SUPERADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @ApiOperation({ summary: 'Get pending vendor and admin approvals' })
    @ApiQuery({ name: 'role', required: false, enum: [Role.VENDOR, Role.ADMIN] })
    @Get('approvals/pending')
    getPendingApprovals(
        @CurrentUser() user: { userId: string },
        @Query() query: PendingApprovalQueryDto,
    ) {
        return this.adminService.getPendingApprovals(user.userId, query.role);
    }

    @ApiOperation({ summary: 'Approve a pending vendor or admin account' })
    @ApiParam({ name: 'userId', type: String })
    @Patch('approvals/:userId/approve')
    approveUser(
        @CurrentUser() user: { userId: string },
        @Param('userId') userId: string,
    ) {
        return this.adminService.approveUser(user.userId, userId);
    }

    @ApiOperation({ summary: 'Reject a pending vendor or admin account' })
    @ApiParam({ name: 'userId', type: String })
    @Patch('approvals/:userId/reject')
    rejectUser(
        @CurrentUser() user: { userId: string },
        @Param('userId') userId: string,
    ) {
        return this.adminService.rejectUser(user.userId, userId);
    }

    @ApiOperation({ summary: 'Get pending vendor products for review' })
    @Get('products/pending')
    getPendingProducts(@CurrentUser() user: { userId: string }) {
        return this.adminService.getPendingProducts(user.userId);
    }

    @ApiOperation({ summary: 'Approve a pending vendor product' })
    @ApiParam({ name: 'productId', type: String })
    @Patch('products/:productId/approve')
    approveProduct(
        @CurrentUser() user: { userId: string },
        @Param('productId') productId: string,
    ) {
        return this.adminService.approveProduct(user.userId, productId);
    }

    @ApiOperation({ summary: 'Reject a pending vendor product' })
    @ApiParam({ name: 'productId', type: String })
    @ApiBody({ type: RejectProductDto, required: false })
    @Patch('products/:productId/reject')
    rejectProduct(
        @CurrentUser() user: { userId: string },
        @Param('productId') productId: string,
        @Body() dto: RejectProductDto,
    ) {
        return this.adminService.rejectProduct(user.userId, productId, dto.rejectReason);
    }
}
