import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class AssignUserRoleDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  roleName: string;
}
