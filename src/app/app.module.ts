import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import config from '../config';
import { AuthTokenModule } from "./auth-token/auth-token.module";

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    AuthModule,
    AuthTokenModule,
    TokensModule,
    UsersModule,
    FilesModule,
  ],
})
export class AppModule {}
