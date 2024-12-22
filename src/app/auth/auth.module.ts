import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SecurityService } from './security.service';
import { UsersModule } from '../users/users.module';
import { TokensModule } from '../tokens/tokens.module';
import { AuthTokenModule } from '../auth-token/auth-token.module';

@Module({
  imports: [
    UsersModule,
    TokensModule,
    forwardRef(() => AuthTokenModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, SecurityService],
  exports: [SecurityService],
})
export class AuthModule {}
