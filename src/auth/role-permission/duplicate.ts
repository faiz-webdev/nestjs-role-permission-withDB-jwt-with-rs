import { IsBoolean, IsString } from 'class-validator';

export class CheckDuplicate {
  @IsString()
  message: string;

  @IsBoolean()
  status: boolean;

  @IsString()
  data: any;
}
