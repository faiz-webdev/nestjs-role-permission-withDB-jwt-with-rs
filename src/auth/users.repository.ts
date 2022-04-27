import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, IsNull, Not, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { IResponseHandlerParams } from '../interface/reponse-handler.interface';
import { ResponseHandlerService } from '../service/response-handler.service';
import { HttpStatus } from '@nestjs/common';
import { AssignUserRoleDto } from '../user/user.dto';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password, name } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, name, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  public async assignUserRole(
    assignUserRoleDto: AssignUserRoleDto,
  ): Promise<IResponseHandlerParams> {
    try {
      const response = await this.createQueryBuilder()
        .update()
        .set({ roleName: assignUserRoleDto.roleName })
        .where('id = :id', { id: assignUserRoleDto.userId })
        .execute();

      return ResponseHandlerService({
        success: response.affected == 1 ? true : false,
        httpCode:
          response.affected == 1
            ? HttpStatus.OK
            : HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          response.affected == 1
            ? 'Role & permission assigned successfully'
            : 'Role & permission not assigned! Please try again later',
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
