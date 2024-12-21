import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [PrismaModule, AuthModule, TokensModule, UsersModule, FilesModule],
})
export class AppModule {}
