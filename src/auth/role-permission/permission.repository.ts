import { EntityRepository, Repository, getRepository } from 'typeorm';
import { HttpStatus, Logger } from '@nestjs/common';
import { RoleEntity } from '../role.entity';
import { CreatePermissionDto } from '../dto/role.dto';
import { CheckDuplicate } from './duplicate';
import { PermissionEntity } from '../permission.entity';
import { IResponseHandlerParams } from '../../interface/reponse-handler.interface';
import { v4 as uuid } from 'uuid';
import { ResponseHandlerService } from '../../service/response-handler.service';

@EntityRepository(PermissionEntity)
export class PermissionRepository extends Repository<PermissionEntity> {
  private logger = new Logger('TasksRepository', true);

  public async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<IResponseHandlerParams> {
    try {
      const { name, url, pageTitleId } = createPermissionDto;
      const find = await this.checkDuplicatePermission(
        createPermissionDto.name,
        createPermissionDto.url,
      );
      if (find.status === true) {
        return ResponseHandlerService({
          success: true,
          httpCode: HttpStatus.CREATED,
          message: 'Permission already exists',
          data: find.data,
        });
      }

      const role = this.create({
        id: uuid(),
        name,
        url,
        pageTitleId,
      });

      const response = await this.save(role);
      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.CREATED,
        message: 'Permission added successfully',
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
  async getPermission(): Promise<IResponseHandlerParams> {
    try {
      const response = await this.find({ order: { createdAt: 'ASC' } });
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

  async checkDuplicatePermission(
    name: string,
    url: string,
  ): Promise<CheckDuplicate> {
    const response = await this.createQueryBuilder('permission')
      .where('LOWER(name) = LOWER(:name)', { name })
      .orWhere('LOWER(url) = LOWER(:url)', { url })
      .select(['permission.name', 'permission.url'])
      .getOne();
    // console.log('response:', response);
    let res = {
      message: response ? 'Record already exists' : 'Record does not exists',
      status: response ? true : false,
      data: response,
    };
    return res;
  }
}
