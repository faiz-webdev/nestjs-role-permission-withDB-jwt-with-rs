import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  CreateRoleDto,
  CreatePermissionDto,
  CreateRolePermissionDto,
  CreateUserPermissionDto,
  CreatePageTitleDto,
} from '../dto/role.dto';
import { RoleEntity } from '../role.entity';
import { RolePermissionService } from './role-permission.service';
import { IResponseHandlerParams } from '../../interface/reponse-handler.interface';

@Controller('role-permission')
export class RolePermissionController {
  constructor(private rolePermissionService: RolePermissionService) {}

  @Post('create-role')
  createRole(
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<IResponseHandlerParams> {
    return this.rolePermissionService.createNewRole(createRoleDto);
  }

  @Get('get-roles')
  getRoles(): Promise<RoleEntity[]> {
    return this.rolePermissionService.getRoles();
  }

  @Get('get-role-by-id/:id')
  getRoleById(@Param('id') id: string): Promise<RoleEntity> {
    return this.rolePermissionService.getRoleById(id);
  }

  /*---------------------Permission------------------*/
  @Post('create-permission')
  createPermission(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<IResponseHandlerParams> {
    return this.rolePermissionService.createPermission(createPermissionDto);
  }

  @Get('get-permissions')
  getPermission(): Promise<IResponseHandlerParams> {
    return this.rolePermissionService.getPermission();
  }

  /*---------------------Role Permission------------------*/
  @Post('create-role-permission')
  createRolePermission(
    @Body() createRolePermissionDto: CreateRolePermissionDto,
  ): Promise<IResponseHandlerParams> {
    return this.rolePermissionService.createRolePermission(
      createRolePermissionDto,
    );
  }

  @Get('get-role-permissions')
  getRolePermission(): Promise<IResponseHandlerParams> {
    return this.rolePermissionService.getRolePermission();
  }

  @Get('get-permission-by-role/:roleId')
  getPermissionByRole(
    @Param('roleId') roleId: string,
  ): Promise<IResponseHandlerParams> {
    return this.rolePermissionService.getPermissionByRole(roleId);
  }

  /*---------------------User Permission------------------*/
  @Post('create-user-permission')
  createUserPermission(
    @Body() createUserPermissionDto: CreateUserPermissionDto,
  ): Promise<IResponseHandlerParams> {
    return this.rolePermissionService.createUserPermission(
      createUserPermissionDto,
    );
  }

  @Get('get-user-permission/:userId')
  getUserPermission(
    @Param('userId') userId: string,
  ): Promise<IResponseHandlerParams> {
    return this.rolePermissionService.getUserPermission(userId);
  }

  /*---------------------Page Title------------------*/
  @Post('create-pagetitle')
  createPageTitle(
    @Body() createPageTitleDto: CreatePageTitleDto,
  ): Promise<IResponseHandlerParams> {
    return this.rolePermissionService.createPageTitle(createPageTitleDto);
  }

  @Get('get-pagetitle')
  getPageTitle(): Promise<IResponseHandlerParams> {
    return this.rolePermissionService.getPageTitle();
  }

  // @Get('get-role-permissions')
  // getRolePermission(): Promise<IResponseHandlerParams> {
  //   return this.rolePermissionService.getRolePermission();
  // }

  // @Get('get-permission-by-role/:roleId')
  // getPermissionByRole(
  //   @Param('roleId') roleId: string,
  // ): Promise<IResponseHandlerParams> {
  //   return this.rolePermissionService.getPermissionByRole(roleId);
  // }
}
