import {
  ConflictException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { UserPermissionEntity } from './user-permission.entity';
import { ResponseHandlerService } from '../service/response-handler.service';
import { IResponseHandlerParams } from '../interface/reponse-handler.interface';

@EntityRepository(UserPermissionEntity)
export class UsersPermissionRepository extends Repository<UserPermissionEntity> {
  public async checkUserPermission(
    userId: string,
    url: string,
  ): Promise<IResponseHandlerParams> {
    try {
      const response = await this.findOne({
        select: ['id'],
        where: { userId, url, isActive: true },
      });
      return ResponseHandlerService({
        success: response ? true : false,
        httpCode: HttpStatus.OK,
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
}
