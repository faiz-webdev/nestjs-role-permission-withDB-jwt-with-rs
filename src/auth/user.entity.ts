import { Task } from '../tasks/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserRoles } from './user-roles';
import { PermissionEntity } from './permission.entity';
import { UserPermissionEntity } from './user-permission.entity';
import { TemplateEntity } from '../template/template.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  name: string;

  // @Column({ type: 'enum', enum: UserRoles, default: UserRoles.Agent })
  // @Column()
  // rolePermisionId: string;

  @Column()
  password: string;

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
  roleId: string;

  @Column('text', { nullable: true })
  roleName: string;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  // @ManyToMany(() => PermissionEntity, (permission) => permission.users)
  // user: User;

  @OneToMany(
    () => UserPermissionEntity,
    (userPermission) => userPermission.user,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  public userPermissions!: UserPermissionEntity[];

  @OneToMany(
    () => TemplateEntity,
    (template: TemplateEntity) => template.user,
    {
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ referencedColumnName: 'userId' })
  public templates: TemplateEntity[];
}
