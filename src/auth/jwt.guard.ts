import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  private logger = new Logger('JWT Guard');
  handleRequest(err, user, info) {
    if (info instanceof TokenExpiredError) {
      this.logger.error('Token Expired');
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Token Expired',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (info instanceof JsonWebTokenError) {
      this.logger.error('Invalid Token');
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Invalid Token',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
