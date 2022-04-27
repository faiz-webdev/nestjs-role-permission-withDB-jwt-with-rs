import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { UserPermissionEntity } from './user-permission.entity';
import { RolePermissionEntity } from './role-permission.entity';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';
import { RolePermissionController } from './role-permission/role-permission.controller';
import { RolePermissionService } from './role-permission/role-permission.service';
import { RolesRepository } from './role-permission/role.repository';
import { PermissionRepository } from './role-permission/permission.repository';
import { RolePermissionRepository } from './role-permission/role-permission.repository';
import { PageTitleEntity } from './page-title.entity';
import { UserPermissionService } from './user-permission.service';
import { UsersPermissionRepository } from './user-permission.repository';
import { UserModule } from '../user/user.module';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [
        ConfigModule,
        TypeOrmModule.forFeature([
          User,
          UserPermissionEntity,
          RolePermissionEntity,
          RoleEntity,
          PermissionEntity,
          PageTitleEntity,
        ]),
      ],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // secret: configService.get('JWT_SECRET'),
        privateKey: await fs.readFileSync(
          path.join(__dirname, './../../private.key'),
          'utf8',
        ),
        publicKey: await fs.readFileSync(
          path.join(__dirname, './../../public.key'),
          'utf8',
        ),
        signOptions: {
          expiresIn: 3600,
          algorithm: 'RS256',
        },
      }),
    }),
    TypeOrmModule.forFeature([
      UsersRepository,
      RolesRepository,
      PermissionRepository,
      RolePermissionRepository,
      UsersPermissionRepository,
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    RolePermissionService,
    UserPermissionService,
  ],
  controllers: [AuthController, RolePermissionController],
  exports: [
    JwtStrategy,
    PassportModule,
    AuthService,
    UserPermissionService,
    RolePermissionService,
  ],
})
export class AuthModule {}
