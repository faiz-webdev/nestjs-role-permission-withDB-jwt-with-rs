import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { IResponseHandlerParams } from '../interface/reponse-handler.interface';
import { AssignUserRoleDto } from './user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { RolePermissionService } from '../auth/role-permission/role-permission.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rolePermissionService: RolePermissionService,
  ) {}

  @Post('/assign-userrole')
  //   @UseGuards(AuthGuard())
  public assignUserRole(
    @Body() assignUserRoleDto: AssignUserRoleDto,
    // @GetUser() user: User,
  ): Promise<IResponseHandlerParams> {
    return this.userService.assignUserRole(assignUserRoleDto);
  }
}
