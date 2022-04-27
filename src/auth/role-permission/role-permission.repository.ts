import { EntityRepository, Repository } from 'typeorm';
import { HttpStatus, Logger } from '@nestjs/common';
import { RoleEntity } from '../role.entity';
import { CreatePermissionDto, CreateRolePermissionDto } from '../dto/role.dto';
import { CheckDuplicate } from './duplicate';
import { PermissionEntity } from '../permission.entity';
import { IResponseHandlerParams } from '../../interface/reponse-handler.interface';
import { v4 as uuid } from 'uuid';
import { ResponseHandlerService } from '../../service/response-handler.service';
import { RolePermissionEntity } from '../role-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesRepository } from './role.repository';
import { PermissionRepository } from './permission.repository';

@EntityRepository(RolePermissionEntity)
export class RolePermissionRepository extends Repository<RolePermissionEntity> {
  constructor(
    @InjectRepository(RolesRepository)
    private rolesRepository: RolesRepository,
    @InjectRepository(PermissionRepository)
    private permissionRepository: PermissionRepository,

    @InjectRepository(RolePermissionRepository)
    private rolePermissionRepository: RolePermissionRepository,
  ) {
    super();
  }
  private logger = new Logger('TasksRepository', true);

  public async createRolePermission(
    createRolePermissionDto: CreateRolePermissionDto,
  ): Promise<IResponseHandlerParams> {
    try {
      const { roleName, permissionId } = createRolePermissionDto;
      const find = await this.checkDuplicateRolePermission(
        roleName,
        permissionId,
      );
      if (find.status === true) {
        let result = {
          id: find.data.id,
          roleName: find.data.roleName,
          permissionId: find.data.permissionId,
        };
        // return result;
        return ResponseHandlerService({
          success: true,
          httpCode: HttpStatus.CREATED,
          message: 'Permission already assigned to this role',
          data: result,
        });
      }

      const role = this.create({
        id: uuid(),
        roleName,
        permissionId,
      });

      const response = await this.save(role);
      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.CREATED,
        message: 'Role permission added successfully',
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
  async getRolePermission(): Promise<IResponseHandlerParams> {
    try {
      const response = await this.find({ relations: ['permission'] });
      return ResponseHandlerService({
        success: response.length > 0 ? true : false,
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

  async getPermissionByRole(roleId: string): Promise<IResponseHandlerParams> {
    try {
      console.log('roleId: ', roleId);
      // let response = '';
      // const response = await this.find({ roleId });
      // const response = this.createQueryBuilder('rolePermission')
      //   .leftJoinAndSelect(
      //     'rolePermission',
      //     'rolePermission.permissionId = permission.id',
      //   )
      //   .where('rolePermission.roleId=:roleId', { roleId: roleId })
      //   .getMany();
      // const query = this.createQueryBuilder('rolePermission');
      // query.where({ roleId });
      // return ResponseHandlerService({
      //   success: response.length > 0 ? true : false,
      //   httpCode: HttpStatus.OK,
      //   message: response.length > 0 ? 'Record found' : 'Record not found',
      //   data: response,
      // });
      const response = await this.find({
        relations: ['permission'],
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
  }

  public async getPermissionByRoleName(
    roleName: string,
  ): Promise<IResponseHandlerParams> {
    try {
      const response = await this.find({
        relations: ['permission'],
        where: { roleName },
      });

      return ResponseHandlerService({
        success: response.length > 1 ? true : false,
        httpCode: HttpStatus.OK,
        message: response.length > 1 ? 'Record found' : 'Record not found',
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

  // async getPermissionById(id: string): Promise<PermissionEntity> {
  //   const role = await this.findOne({ id });
  //   return role;
  // }

  async checkDuplicateRolePermission(
    roleName: string,
    permissionId: string,
  ): Promise<CheckDuplicate> {
    const response = await this.findOne({ permissionId, roleName });

    let res = {
      message: response ? 'Record already exists' : 'Record does not exists',
      status: response ? true : false,
      data: response,
    };
    return res;
  }
}
