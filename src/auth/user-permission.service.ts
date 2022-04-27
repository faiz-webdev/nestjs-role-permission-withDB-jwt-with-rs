import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { IResponseHandlerParams } from '../interface/reponse-handler.interface';
import { UsersPermissionRepository } from './user-permission.repository';

@Injectable()
export class UserPermissionService {
  constructor(
    @InjectRepository(UsersPermissionRepository)
    private usersPermissionRepository: UsersPermissionRepository,
  ) {}

  public async checkUserPermission(
    userId: string,
    url: string,
  ): Promise<IResponseHandlerParams> {
    return await this.usersPermissionRepository.checkUserPermission(
      userId,
      url,
    );
  }
}
