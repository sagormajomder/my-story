import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET cannot be empty'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:3000'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const formatted = result.error.flatten().fieldErrors;
  console.error('❌ Invalid environment variables:\n', formatted);
  process.exit(1);
}

const env = Object.freeze(result.data);

export default env;
