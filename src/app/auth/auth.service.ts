import { UsersService } from '../users/users.service';
import { TokensService } from '../tokens/tokens.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { compareSync } from 'bcrypt';
import { RefreshDto } from './dtos/refresh.dto';
import {
  TOKEN_NOT_FOUND,
  USER_ALREADY_EXISTS,
  USER_NOT_FOUND,
  WRONG_TOKEN,
} from '../../common/constants';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { SecurityService } from './security.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private authTokenService: AuthTokenService,
    private securityService: SecurityService,
    private tokensService: TokensService,
  ) {}

  async singIn({ id, password }: SignInDto) {
    const user = await this.usersService.findOne({ id });
    if (!(user && compareSync(password, user.password))) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return this.authTokenService.generateTokensAndSave(user);
  }

  async signUp(signUpDto: SignUpDto) {
    const { id, password } = signUpDto;
    const foundUser = await this.usersService.findOne({ id });

    if (foundUser) {
      throw new HttpException(USER_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await this.securityService.hash(password);

    await this.usersService.create({
      id,
      password: hashedPassword,
    });

    return { id };
  }

  async refresh(refreshDto: RefreshDto) {
    const { refreshToken } = refreshDto;
    const { sub: userId, key } = await this.authTokenService.validateToken(
      refreshToken,
      'refreshToken',
    );

    if (!userId) {
      throw new UnauthorizedException(WRONG_TOKEN);
    }

    const user = await this.usersService.findOne({ id: userId });

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    const token = await this.tokensService.findOne({ user, key });

    if (!token) {
      throw new NotFoundException(TOKEN_NOT_FOUND);
    }

    const isTokenCorrect = await this.securityService.compare(
      refreshToken,
      token.refreshToken,
    );

    if (!isTokenCorrect) {
      throw new UnauthorizedException(WRONG_TOKEN);
    }

    return this.authTokenService.generateTokensAndUpdate(user, token);
  }

  async logout(key: string) {
    return this.tokensService.delete({ key });
  }
}
