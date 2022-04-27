import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';
import { JoinColumn, ManyToOne } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rolePermission')
export class RolePermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roleName: string;

  // @Column()
  // roleId: string;

  @Column()
  permissionId: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true })
  updatedBy: string;

  // @ManyToOne(() => RoleEntity, (role) => role.rolePermissions)
  // @JoinColumn({ name: 'roleId' })
  // public role!: RoleEntity;
  @ManyToOne(() => PermissionEntity, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permissionId' })
  public permission!: PermissionEntity;
}
