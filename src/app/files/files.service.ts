import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilesService {
  private files: Prisma.FileDelegate<DefaultArgs>;

  constructor(prisma: PrismaService) {
    this.files = prisma.file;
  }

  create(data: Prisma.FileCreateInput) {
    return this.files.create({ data });
  }

  findOne(where: Prisma.FileWhereInput) {
    return this.files.findFirst({ where });
  }

  updateById(id: string, data: Prisma.FileUpdateInput) {
    return this.files.update({ where: { id }, data });
  }

  deleteById(where: Prisma.FileWhereUniqueInput) {
    return this.files.delete({ where });
  }

  findWithPagination(page: number, pageSize: number) {
    return this.files.findMany({ take: pageSize, skip: (page - 1) * pageSize });
  }
}
