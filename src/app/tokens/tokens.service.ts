import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TokensService {
  private tokens: Prisma.TokenDelegate<DefaultArgs>;

  constructor(prisma: PrismaService) {
    this.tokens = prisma.token;
  }

  create(data: Prisma.TokenCreateInput) {
    return this.tokens.create({ data });
  }

  findOne(where: Prisma.TokenWhereInput) {
    return this.tokens.findFirst({ where });
  }

  updateById(id: string, data: Prisma.TokenUpdateInput) {
    return this.tokens.updateMany({ where: { id }, data });
  }

  delete(where: Prisma.TokenWhereUniqueInput) {
    return this.tokens.delete({ where });
  }
}
