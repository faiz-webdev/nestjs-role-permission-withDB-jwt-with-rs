import { ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { PermissionEntity } from './permission.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('userPermission')
export class UserPermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  roleName: string;

  @Column()
  permissionId: string;

  @Column()
  userId: string;

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

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  url: string;

  @ManyToOne(() => User, (user) => user.userPermissions)
  public user!: User;

  @ManyToOne(() => PermissionEntity, (permission) => permission.userPermissions)
  public permission!: PermissionEntity;
}
