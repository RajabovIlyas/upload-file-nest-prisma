import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const SignUpSchema = z.object({
  id: z.string(),
  password: z.string(),
});

export class SignUpDto extends createZodDto(SignUpSchema) {}
