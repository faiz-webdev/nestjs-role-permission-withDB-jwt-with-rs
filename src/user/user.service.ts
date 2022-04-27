import { Injectable, HttpStatus } from '@nestjs/common';
import { AssignUserRoleDto } from './user.dto';
import { IResponseHandlerParams } from '../interface/reponse-handler.interface';
import { ResponseHandlerService } from '../service/response-handler.service';
import { RolePermissionService } from '../auth/role-permission/role-permission.service';
import { getRepository, Repository, Not, IsNull } from 'typeorm';
import { UserPermissionEntity } from '../auth/user-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';
import { UsersRepository } from '../auth/users.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly rolePermissionService: RolePermissionService,
    // @InjectRepository(User) private readonly repo: Repository<User>, // private readonly usersRepository: UsersRepository,
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  public async assignUserRole(
    assignUserRoleDto: AssignUserRoleDto,
  ): Promise<IResponseHandlerParams> {
    try {
      /**check user has already assigned role and permission */
      const userRepository = getRepository(User);
      const find = await userRepository
        .createQueryBuilder()
        .where('id = :id', {
          id: assignUserRoleDto.userId,
        })
        .andWhere({
          roleName: Not(IsNull()),
        })
        .select('name')
        .execute();
      if (find.length > 0) {
        return ResponseHandlerService({
          success: true,
          httpCode: HttpStatus.OK,
          message: 'Role and permission already exists',
        });
      }
      /**
       * assign role and permission to user
       */
      const assignRole = await this.usersRepository.assignUserRole(
        assignUserRoleDto,
      );
      if (!assignRole.success) {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: assignRole.message,
        });
      }
      const response = await this.rolePermissionService.getPermissionByRoleName(
        assignUserRoleDto.roleName,
      );
      const userPermissionRepository = getRepository(UserPermissionEntity);

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.CREATED,
        message: 'Role and permission assigned successfully',
        data: await userPermissionRepository
          .createQueryBuilder()
          .insert()
          .into(UserPermissionEntity)
          .values(
            await this.sanitizeRolePermission(
              response.data,
              assignUserRoleDto.userId,
              assignUserRoleDto.roleName,
            ),
          )
          .execute(),
      });
    } catch (error) {
      return ResponseHandlerService({
        success: false,
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          'Unable to process your request to google api. Please try again later',
        errorDetails: error,
      });
    }
  }

  private async sanitizeRolePermission(permission, userId, roleName) {
    let userPermissionInfo = [];
    if (permission.length > 0) {
      for (let i = 0; i < permission.length; i++) {
        let permissionObject = {};
        permissionObject['userId'] = userId;
        permissionObject['roleName'] = roleName;
        permissionObject['url'] = permission[i].permission.url;
        permissionObject['permissionId'] = permission[i].permission.id;
        userPermissionInfo.push(permissionObject);
      }
    }
    return userPermissionInfo;
  }
}
