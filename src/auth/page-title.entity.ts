import { RolePermissionEntity } from './role-permission.entity';
import { JoinColumn, JoinTable, ManyToMany } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserPermissionEntity } from './user-permission.entity';
import { PermissionEntity } from './permission.entity';

@Entity('pageTitle')
export class PageTitleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

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

  @OneToMany(
    () => RolePermissionEntity,
    (rolePermissions) => rolePermissions.permission,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ referencedColumnName: 'permissionId' })
  public rolePermissions!: RolePermissionEntity[];

  // @ManyToMany(() => User)
  // @JoinTable({
  //   // name: 'userPermission',
  //   joinColumn: {
  //     name: 'permission',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'user',
  //     referencedColumnName: 'id',
  //   },
  // })
  // users: PermissionEntity[];

  @OneToMany((_type) => PermissionEntity, (permission) => permission.pageTitle)
  public permissions: PermissionEntity[];
}
