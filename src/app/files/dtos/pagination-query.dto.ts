import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { BadRequestException } from '@nestjs/common';

const validateStringOrUndefinedAsNumber = (defaultValue = 1) =>
  z.union([z.string(), z.undefined()]).transform((val) => {
    const num = Number(val);
    if (isNaN(num) || val === undefined) {
      return defaultValue;
    }
    if (num < 1) {
      throw new BadRequestException('params must be more than 1');
    }
    return num;
  });

const PaginationQuerySchema = z.object({
  page: validateStringOrUndefinedAsNumber(1),
  limit: validateStringOrUndefinedAsNumber(10),
});

export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) {}
