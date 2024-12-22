import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const SignInSchema = z.object({
  id: z.string(),
  password: z.string(),
});

export class SignInDto extends createZodDto(SignInSchema) {}
