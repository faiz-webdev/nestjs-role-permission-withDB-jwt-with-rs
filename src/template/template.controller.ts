import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { TemplateService } from './template.service';
import { IResponseHandlerParams } from '../interface/reponse-handler.interface';
import { CreateTemplateDto } from './template.dto';
// import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { AuthGuard } from '../auth/auth.guard';

@Controller('templates')
@UseGuards(new AuthGuard())
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post('/create-template')
  public createTemplate(
    @Body() createTemplateDto: CreateTemplateDto,
    @GetUser() user: User,
  ): Promise<IResponseHandlerParams> {
    console.log(user);
    return this.templateService.createTemplate(createTemplateDto);
  }

  @Get('/view-template')
  public viewTemplate(): // @GetUser() user: User,
  Promise<IResponseHandlerParams> {
    return this.templateService.viewTemplate();
  }

  @Get('/edit-template')
  public editTemplate(): // @GetUser() user: User,
  Promise<IResponseHandlerParams> {
    return this.templateService.editTemplate();
  }
}
