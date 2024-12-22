import { forwardRef, Module } from '@nestjs/common';
import { TokensModule } from '../tokens/tokens.module';
import { AuthTokenService } from './auth-token.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    TokensModule,
    forwardRef(() => AuthModule),
    JwtModule.register({}),
  ],
  providers: [AuthTokenService],
  exports: [AuthTokenService],
})
export class AuthTokenModule {}
