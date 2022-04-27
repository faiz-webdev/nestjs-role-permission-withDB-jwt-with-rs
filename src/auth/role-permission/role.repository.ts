import { EntityRepository, Repository } from 'typeorm';
import {
  InternalServerErrorException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { RoleEntity } from '../role.entity';
import { CreateRoleDto } from '../dto/role.dto';
import { CheckDuplicate } from './duplicate';
import { ResponseHandlerService } from '../../service/response-handler.service';
import { IResponseHandlerParams } from '../../interface/reponse-handler.interface';

@EntityRepository(RoleEntity)
export class RolesRepository extends Repository<RoleEntity> {
  private logger = new Logger('TasksRepository', true);

  // async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
  //   const { status, search } = filterDto;

  //   const query = this.createQueryBuilder('task');
  //   query.where({ user });

  //   if (status) {
  //     query.andWhere('task.status = :status', { status });
  //   }

  //   if (search) {
  //     query.andWhere(
  //       '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
  //       { search: `%${search}%` },
  //     );
  //   }

  //   try {
  //     const tasks = await query.getMany();
  //     return tasks;
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to get tasks for user "${
  //         user.username
  //       }". Filters: ${JSON.stringify(filterDto)}`,
  //       error.stack,
  //     );
  //     throw new InternalServerErrorException();
  //   }
  // }

  async createRole(
    createRoleDto: CreateRoleDto,
  ): Promise<IResponseHandlerParams> {
    const { name } = createRoleDto;
    const response = await this.checkDuplicateRole(createRoleDto.name);
    if (response.status === true) {
      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        message: 'Role already exists',
        data: response.data,
      });
    }

    const role = this.create({
      name,
    });

    await this.save(role);
    return ResponseHandlerService({
      success: true,
      httpCode: HttpStatus.OK,
      message: 'Role added successfully',
      data: role,
    });
  }

  async getRoles(): Promise<RoleEntity[]> {
    const roles = await this.find();
    return roles;
  }

  async getRoleById(id: string): Promise<RoleEntity> {
    const role = await this.findOne({ id });
    return role;
  }

  async checkDuplicateRole(name: string): Promise<CheckDuplicate> {
    // const entityRoleRepository = getRepository(PageTitleEntity);
    // const response = await entityRoleRepository
    //   .createQueryBuilder()
    //   .where('LOWER(title) = LOWER(:title)', { title })
    //   .getOne();

    // const response = await this.findOne({ name });
    const response = await this.createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .getOne();

    let res = {
      message: response ? 'Record already exists' : 'Record does not exists',
      status: response ? true : false,
      data: response,
    };
    return res;
  }
}
