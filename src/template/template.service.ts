import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateTemplateDto } from './template.dto';
import { IResponseHandlerParams } from '../interface/reponse-handler.interface';
import { ResponseHandlerService } from '../service/response-handler.service';

@Injectable()
export class TemplateService {
  public async createTemplate(
    templateDto: CreateTemplateDto,
  ): Promise<IResponseHandlerParams> {
    try {
      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.CREATED,
        message: 'Hello from template service',
        data: templateDto,
      });
    } catch (error) {
      return ResponseHandlerService({
        success: false,
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          'Unable to process your request to google api. Please try again later',
        errorDetails: error,
      });
    }
  }

  public async viewTemplate(): Promise<IResponseHandlerParams> {
    try {
      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.CREATED,
        message: 'Hello from get all template service',
        data: {},
      });
    } catch (error) {
      return ResponseHandlerService({
        success: false,
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          'Unable to process your request to google api. Please try again later',
        errorDetails: error,
      });
    }
  }

  public async editTemplate(): Promise<IResponseHandlerParams> {
    try {
      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.CREATED,
        message: 'Hello from get edit method template service',
        data: {},
      });
    } catch (error) {
      return ResponseHandlerService({
        success: false,
        httpCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message:
          'Unable to process your request to google api. Please try again later',
        errorDetails: error,
      });
    }
  }
}
