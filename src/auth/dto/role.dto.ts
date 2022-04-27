import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;
}

export class CreatePermissionDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsString()
  @IsOptional()
  url: string;

  @IsOptional()
  @IsString()
  pageTitleId: string;
}

export class CreateRolePermissionDto {
  // @IsNotEmpty()
  // @IsUUID()
  // roleId: string;

  @IsNotEmpty()
  @IsString()
  roleName: string;

  @IsNotEmpty()
  @IsUUID()
  permissionId: string;
}

export class CreateUserPermissionDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  permissionId: string;

  // @IsOptional()
  // @IsUUID()
  // roleId: string;

  @IsOptional()
  @IsUUID()
  roleName: string;
}

export class CreatePageTitleDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
