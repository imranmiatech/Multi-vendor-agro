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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const admin_service_1 = require("./admin.service");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const approval_dto_1 = require("./dto/approval.dto");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getPendingApprovals(user, query) {
        return this.adminService.getPendingApprovals(user.userId, query.role);
    }
    approveUser(user, userId) {
        return this.adminService.approveUser(user.userId, userId);
    }
    rejectUser(user, userId) {
        return this.adminService.rejectUser(user.userId, userId);
    }
    getPendingProducts(user) {
        return this.adminService.getPendingProducts(user.userId);
    }
    approveProduct(user, productId) {
        return this.adminService.approveProduct(user.userId, productId);
    }
    rejectProduct(user, productId, dto) {
        return this.adminService.rejectProduct(user.userId, productId, dto.rejectReason);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get pending vendor and admin approvals' }),
    (0, swagger_1.ApiQuery)({ name: 'role', required: false, enum: [client_1.Role.VENDOR, client_1.Role.ADMIN] }),
    (0, common_1.Get)('approvals/pending'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, approval_dto_1.PendingApprovalQueryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPendingApprovals", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Approve a pending vendor or admin account' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: String }),
    (0, common_1.Patch)('approvals/:userId/approve'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "approveUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Reject a pending vendor or admin account' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: String }),
    (0, common_1.Patch)('approvals/:userId/reject'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rejectUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get pending vendor products for review' }),
    (0, common_1.Get)('products/pending'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPendingProducts", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Approve a pending vendor product' }),
    (0, swagger_1.ApiParam)({ name: 'productId', type: String }),
    (0, common_1.Patch)('products/:productId/approve'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "approveProduct", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Reject a pending vendor product' }),
    (0, swagger_1.ApiParam)({ name: 'productId', type: String }),
    (0, swagger_1.ApiBody)({ type: approval_dto_1.RejectProductDto, required: false }),
    (0, common_1.Patch)('products/:productId/reject'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, approval_dto_1.RejectProductDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rejectProduct", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPERADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map