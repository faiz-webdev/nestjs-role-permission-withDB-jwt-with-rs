import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';
import * as base32 from 'hi-base32';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.headers.authorization) {
      return false;
    }

    request.user = await this.validateToken(request.headers.authorization);
    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const token = base32.decode(auth.split(' ')[1]);

    try {
      const privateKEY = await fs.readFileSync(
        path.join(__dirname, './../../private.key'),
        'utf8',
      );
      const decoded = await jwt.verify(token, privateKEY, {
        algorithms: ['RS256'],
      });
      return decoded;
    } catch (err) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
