import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthTokenService } from '../auth-token.service';
import { UsersService } from '../../users/users.service';
import { USER_UNAUTHORIZED } from '../../../common/constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger: Logger;

  constructor(
    private authTokenService: AuthTokenService,
    private usersService: UsersService,
  ) {
    this.logger = new Logger(JwtAuthGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const { authorization, Authorization } = request.headers;
      const tokenHeaderValue = authorization || Authorization;
      const [bearer, token] = tokenHeaderValue.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: USER_UNAUTHORIZED });
      }

      const { sub: userId, key } = await this.authTokenService.validateToken(
        token,
        'accessToken',
      );
      const tokenAccess = await this.authTokenService.getTokenByKey(key);

      if (!tokenAccess) {
        throw new UnauthorizedException({ message: USER_UNAUTHORIZED });
      }

      const user = await this.usersService.findOne({ id: userId });

      if (!user) {
        throw new UnauthorizedException({ message: USER_UNAUTHORIZED });
      }

      request.user = user;
      request.key = key;

      return true;
    } catch (err) {
      this.logger.error(USER_UNAUTHORIZED, err);
      throw new UnauthorizedException({ message: USER_UNAUTHORIZED });
    }
  }
}
