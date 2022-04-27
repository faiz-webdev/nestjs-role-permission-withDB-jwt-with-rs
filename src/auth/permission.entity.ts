import { RolePermissionEntity } from './role-permission.entity';
import { JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserPermissionEntity } from './user-permission.entity';
import { PageTitleEntity } from './page-title.entity';

@Entity('permission')
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  url: string;

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

  @Column({ nullable: true })
  pageTitleId: string;

  @Column({ default: true })
  isActive: boolean;

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

  @OneToMany(
    () => UserPermissionEntity,
    (userPermission) => userPermission.permission,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  public userPermissions!: UserPermissionEntity[];

  @ManyToOne((_type) => PageTitleEntity, (pageTitle) => pageTitle.permissions, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  pageTitle: PageTitleEntity;
}
