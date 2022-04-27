import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionEntity } from 'src/auth/role-permission.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersRepository } from '../auth/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolePermissionEntity]),
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UsersRepository]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
