import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { TokensService } from '../tokens/tokens.service';

import { AuthTokenData, AuthTokens } from './auth-token.interface';
import { ConfigService } from '@nestjs/config';
import { AuthResponseDto } from '../auth/dtos/auth-response.dto';
import type { User, Token } from '@prisma/client';
import { EncryptionConfig, TokenConfig } from '../../config/config.interface';
import { SecurityService } from '../auth/security.service';

@Injectable()
export class AuthTokenService {
  private tokenConfig: TokenConfig;
  private encryptionConfig: EncryptionConfig;

  constructor(
    private securityService: SecurityService,
    private tokensService: TokensService,
    private jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.tokenConfig = configService.get('token');
    this.encryptionConfig = configService.get('encryption');
  }

  getTokenByKey(key: string) {
    return this.tokensService.findOne({ key });
  }

  async generateTokensAndSave(user: User): Promise<AuthResponseDto> {
    const key = uuid();
    const tokens: AuthTokens = await this.generateTokens(user, key);
    const { refreshToken } = tokens;

    await this.saveRefreshToken(user, refreshToken, key);

    return tokens;
  }

  async generateTokensAndUpdate(
    user: User,
    token: Token,
  ): Promise<AuthResponseDto> {
    const key = uuid();
    const tokens: AuthTokens = await this.generateTokens(user, key);
    const { refreshToken } = tokens;
    await this.tokensService.updateById(token.id, { refreshToken, key });

    return tokens;
  }

  async validateToken(
    token: string,
    tokenType: 'accessToken' | 'refreshToken',
  ): Promise<AuthTokenData> {
    return this.jwtService.verifyAsync(token, {
      secret: this.tokenConfig[tokenType].secret,
    });
  }

  private async generateTokens(user: User, key: string): Promise<AuthTokens> {
    const payload = { userId: user.id, password: user.password, key };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async saveRefreshToken(
    user: User,
    token: string,
    key: string,
  ): Promise<void> {
    const hashedToken = await this.securityService.hash(token);
    await this.tokensService.create({
      user: { connect: { id: user.id } },
      refreshToken: hashedToken,
      key,
    });
  }

  private async generateAccessToken({
    userId,
    password,
    key,
  }): Promise<string> {
    const {
      accessToken: { secret, expiresIn },
    } = this.tokenConfig;

    return this.jwtService.signAsync(
      { sub: userId, password, key },
      {
        secret,
        expiresIn,
      },
    );
  }

  private async generateRefreshToken({ userId, key }): Promise<string> {
    const {
      refreshToken: { secret, expiresIn },
    } = this.tokenConfig;

    return this.jwtService.signAsync(
      { sub: userId, key },
      {
        secret,
        expiresIn,
      },
    );
  }
}
