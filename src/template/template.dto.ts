import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTemplateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
