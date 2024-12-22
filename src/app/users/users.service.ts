import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
  private users: Prisma.UserDelegate<DefaultArgs>;

  constructor(prisma: PrismaService) {
    this.users = prisma.user;
  }

  create(data: Prisma.UserCreateInput) {
    return this.users.create({ data });
  }

  findOne(where: Prisma.UserWhereInput) {
    return this.users.findFirst({ where });
  }
}
