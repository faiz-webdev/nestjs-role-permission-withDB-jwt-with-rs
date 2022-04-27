import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateRoleDto,
  CreatePermissionDto,
  CreateRolePermissionDto,
  CreateUserPermissionDto,
  CreatePageTitleDto,
} from '../dto/role.dto';
import { RoleEntity } from '../role.entity';
import { RolesRepository } from './role.repository';
import { PermissionRepository } from './permission.repository';
import { IResponseHandlerParams } from '../../interface/reponse-handler.interface';
import { RolePermissionRepository } from './role-permission.repository';
import { ResponseHandlerService } from '../../service/response-handler.service';
import { PermissionEntity } from '../permission.entity';
import { getManager, getRepository } from 'typeorm';
import { RolePermissionEntity } from '../role-permission.entity';
import { User } from '../user.entity';
import { v4 as uuid } from 'uuid';
import { UserPermissionEntity } from '../user-permission.entity';
import { CheckDuplicate } from './duplicate';
import { PageTitleEntity } from '../page-title.entity';
import { userInfo } from 'os';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolesRepository)
    private rolesRepository: RolesRepository,

    @InjectRepository(PermissionRepository)
    private permissionRepository: PermissionRepository,

    @InjectRepository(RolePermissionRepository)
    private rolePermissionRepository: RolePermissionRepository,
  ) {}

  async createNewRole(
    createRoleDto: CreateRoleDto,
  ): Promise<IResponseHandlerParams> {
    return this.rolesRepository.createRole(createRoleDto);
  }

  async getRoles(): Promise<RoleEntity[]> {
    return this.rolesRepository.getRoles();
  }

  async getRoleById(id: string): Promise<RoleEntity> {
    return this.rolesRepository.getRoleById(id);
  }

  /*---------------------Permission------------------*/
  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<IResponseHandlerParams> {
    return this.permissionRepository.createPermission(createPermissionDto);
  }

  async getPermission(): Promise<IResponseHandlerParams> {
    return this.permissionRepository.getPermission();
  }

  /*---------------------Permission------------------*/
  async createRolePermission(
    createRolePermissionDto: CreateRolePermissionDto,
  ): Promise<IResponseHandlerParams> {
    return this.rolePermissionRepository.createRolePermission(
      createRolePermissionDto,
    );
  }

  async getRolePermission(): Promise<IResponseHandlerParams> {
    return this.rolePermissionRepository.getRolePermission();
  }

  public async getPermissionByRoleName(
    roleName: string,
  ): Promise<IResponseHandlerParams> {
    return this.rolePermissionRepository.getPermissionByRoleName(roleName);
    // try {
    //   const entityRepository = await getRepository(RolePermissionEntity);
    //   const response = entityRepository.find({
    //     relations: ['permission'],
    //     where: { roleName },
    //   });

    //   return ResponseHandlerService({
    //     success: true,
    //     httpCode: HttpStatus.OK,
    //     message: 'Role permission has been granted',
    //     data: response,
    //   });
    // } catch (error) {
    //   return ResponseHandlerService({
    //     success: false,
    //     httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
    //     message:
    //       'Unable to process your request to google api. Please try again later',
    //     errorDetails: error,
    //   });
    // }
  }

  async getPermissionByRole(roleId: string): Promise<IResponseHandlerParams> {
    try {
      return this.rolePermissionRepository.getPermissionByRole(roleId);
      // const myData = DataSource();
      const entityManager = getManager();
      // const entityRepository = getRepository(RoleEntity);
      // const response = await entityRepository
      //   .createQueryBuilder('role')
      //   .leftJoin('permission', 'rp', 'rp.roleId = role.id')
      //   .leftJoinAndSelect('permission', 'per', 'per.id = rp.permissionId')
      //   .getSql();

      // const response = await entityRepository
      // .createQueryBuilder('role')
      // .leftJoin('rolePermission', 'rp', 'rp.roleId = role.id')
      // .leftJoinAndSelect('permission', 'per', 'per.id = rp.permissionId')
      // .getMany();

      // const response = entityManager
      //   .getRepository(RoleEntity)
      //   .createQueryBuilder('role')
      //   .leftJoinAndSelect('rolePermission.role', 'id')
      //   .getMany();

      // const response = await this.rolePermissionRepository.find({
      //   relations: ['role', 'permission'],
      //   where: { roleId },
      // });

      /*const response = await this.rolesRepository.find({
        relations: ['rolePermission', 'permission'],
        where: { id: roleId },
        
      })*/

      // const query = getRepository(RoleEntity);
      // const query1 = getRepository(RolePermissionEntity);
      // const response = await query.find({ relations: ['rolePermission'] });

      // const response = await this.rolesRepository.find({
      //   relations: ['rolePermissions'],
      //   where: { id: roleId },
      // });

      // const response = getRepository(PermissionEntity)
      //   .createQueryBuilder('permission')
      //   .innerJoin('permission.rolePermissions', 'rolePermission')
      //   .innerJoin('rolePermission.role', 'role', 'role.id = :roleId', {
      //     roleId,
      //   })
      //   .getMany();

      /*const response = this.rolesRepository
        .createQueryBuilder()
        .select('role.name', 'role.id')
        .where('role.id = :id', { id: roleId })
        // .andWhere('rp.roleId = :id', { roleId })
        // .innerJoin('rolePermission', 'rp')
        .getMany();*/
      const repo = getRepository(RolePermissionEntity);
      const response = await repo.find({
        relations: ['permissions'],
        where: { roleName: roleId },
      });
      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        message: 'Record found',
        data: response,
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
    // return this.rolePermissionRepository.getPermissionByRole(roleId);
  }

  /*---------------------User Permission------------------*/
  async createUserPermission(
    createUserPermissionDto: CreateUserPermissionDto,
  ): Promise<IResponseHandlerParams> {
    const entityRoleRepository = getRepository(UserPermissionEntity);
    try {
      const { userId, permissionId } = createUserPermissionDto;
      const find = await this.checkDuplicateUserPermission(
        userId,
        permissionId,
      );
      if (find.status) {
        return ResponseHandlerService({
          success: find.status ? false : true,
          httpCode: find.status
            ? HttpStatus.OK
            : HttpStatus.INTERNAL_SERVER_ERROR,
          message: find.message,
          data: find.data,
        });
      }
      const role = entityRoleRepository.create({
        id: uuid(),
        userId,
        permissionId,
      });

      const res = await entityRoleRepository.save(role);

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        message: 'Role permission has been granted',
        data: res,
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

  async getUserPermission(userId: string): Promise<IResponseHandlerParams> {
    try {
      const userPermissionEntity = getRepository(User);
      // const response = await userPermissionEntity.find({
      //   relations: ['userPermissions', 'userPermissions.permission'],
      //   where: { id: userId },
      // });

      const response = await userPermissionEntity
        .createQueryBuilder('user')
        .where({ id: userId })
        .select([
          'user.id',
          'user.name',
          'user.roleName',
          'userPermissions.id',
          'userPermissions.permissionId',
          'userPermissions.userId',
          'permission.id',
          'permission.url',
        ])
        .innerJoinAndSelect('user.userPermissions', 'userPermissions')
        .innerJoinAndSelect('userPermissions.permission', 'permission')
        .getMany();

      // const response = await userPermissionEntity.find({
      //   where: {
      //     id: userId,
      //   },
      //   join: {
      //     alias: 'user',
      //     leftJoinAndSelect: {
      //       userPermissions: 'user.userPermissions',
      //       permission: 'userPermissions.permission',
      //     },
      //   },
      // });

      // let response =
      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        message: response.length > 0 ? 'Record found' : 'Record not found',
        data: await this.sanitizeUserPermission(response),
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
    // return this.rolePermissionRepository.getPermissionByRole(roleId);
  }

  /*---------------------Page Title------------------*/
  async createPageTitle(
    createPageTitleDto: CreatePageTitleDto,
  ): Promise<IResponseHandlerParams> {
    const pageTitleRepo = getRepository(PageTitleEntity);
    try {
      const { title } = createPageTitleDto;
      const find = await this.checkDuplicatePageTitle(title);

      if (find.status) {
        return ResponseHandlerService({
          success: find.status ? false : true,
          httpCode: find.status
            ? HttpStatus.OK
            : HttpStatus.INTERNAL_SERVER_ERROR,
          message: find.message,
          data: find.data,
        });
      }
      const create = pageTitleRepo.create({
        id: uuid(),
        title,
      });

      const res = await pageTitleRepo.save(create);

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        message: 'Record added successfully',
        data: res,
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

  async getPageTitle(): Promise<IResponseHandlerParams> {
    try {
      const pageTitleRepo = getRepository(PageTitleEntity);
      const response = await pageTitleRepo
        .createQueryBuilder('pageTite')
        .select(['pageTite.id', 'pageTite.title'])
        .innerJoinAndSelect('pageTite.permissions', 'permissions')
        .getMany();
      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        message: response.length > 0 ? 'Record found' : 'Record not found',
        data: response,
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

  async checkDuplicateUserPermission(
    userId: string,
    permissionId: string,
  ): Promise<CheckDuplicate> {
    const entityRoleRepository = getRepository(UserPermissionEntity);
    const response = await entityRoleRepository.findOne({
      userId,
      permissionId,
    });

    let res = {
      message: response ? 'Record already exists' : 'Record does not exists',
      status: response ? true : false,
      data: response,
    };
    return res;
  }

  async checkDuplicatePageTitle(title: string): Promise<CheckDuplicate> {
    const entityRoleRepository = getRepository(PageTitleEntity);
    const response = await entityRoleRepository
      .createQueryBuilder()
      .where('LOWER(title) = LOWER(:title)', { title })
      .getOne();
    let res = {
      message: response ? 'Record already exists' : 'Record does not exists',
      status: response ? true : false,
      data: response,
    };
    return res;
  }

  async sanitizeUserPermission(permission) {
    let userInfo = {};
    let permissionInfo = [];
    if (permission.length > 0) {
      userInfo['id'] = permission[0].id;
      userInfo['name'] = permission[0].name;
      userInfo['roleName'] = permission[0].roleName;
      if (permission[0].userPermissions.length > 0) {
        let permissionData = permission[0].userPermissions;
        for (let i = 0; i < permissionData.length; i++) {
          // delete permissionData[i].permission.isActive;
          let permissionObject = {};
          permissionObject['id'] = permissionData[i].permission.id;
          permissionObject['name'] = permissionData[i].permission.name;
          permissionObject['url'] = permissionData[i].permission.url;
          // permissionInfo.push(permissionData[i].permission);
          permissionInfo.push(permissionObject);
        }
        userInfo['permissions'] = permissionInfo;
      }
    }
    return userInfo;
  }
}
