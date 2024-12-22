import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const RefreshSchema = z.object({
  refreshToken: z.string(),
});

export class RefreshDto extends createZodDto(RefreshSchema) {}
