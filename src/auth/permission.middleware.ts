import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserPermissionService } from './user-permission.service';

@Injectable()
export class PermissionMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userPermissionService: UserPermissionService,
    private moduleRef: ModuleRef,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { authorization } = req.headers;
      const headerUrl = req.headers['url'] as string;
      const url = req.url;

      if (!authorization) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
      if (
        !headerUrl ||
        !url.toLocaleLowerCase().includes(headerUrl.toLocaleLowerCase())
      ) {
        const errPayload = new ForbiddenException(
          "You don't have permission to access this resource.",
        );
        next(errPayload);
      }

      const decodedTokenResponse = await this.authService.validateToken(
        authorization,
      );

      if (!decodedTokenResponse.success) {
        // res.status(401).send({ message: 'Unauthorized' });
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const permissionResponse =
        await this.userPermissionService.checkUserPermission(
          decodedTokenResponse.data['id'],
          headerUrl,
        );

      if (!permissionResponse.success) {
        const errPayload = new ForbiddenException(
          "You don't have permission to access this resource.",
        );
        next(errPayload);
      }
      next();
    } catch (err) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
