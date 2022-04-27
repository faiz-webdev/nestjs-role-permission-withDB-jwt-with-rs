import { RolePermissionEntity } from './role-permission.entity';
import { JoinColumn } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

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

  @Column({ default: true })
  isActive: boolean;

  // @OneToMany(
  //   () => RolePermissionEntity,
  //   (rolePermissions) => rolePermissions.role,
  //   {
  //     cascade: true,
  //     onDelete: 'CASCADE',
  //     onUpdate: 'CASCADE',
  //   },
  // )
  // @JoinColumn({ referencedColumnName: 'roleId' })
  // public rolePermissions!: RolePermissionEntity[];
}
