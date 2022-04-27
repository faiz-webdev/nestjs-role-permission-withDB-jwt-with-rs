import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateEntity } from './template.entity';
import { TemplateService } from './template.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TemplateEntity]), AuthModule],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
