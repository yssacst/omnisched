import 'dotenv/config'
import { z } from 'zod'
import pino from 'pino'
import { loggerConfig } from '../infra/lib/logger.js'

const logger = pino(loggerConfig)

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  logger.fatal('Variáveis de ambiente inválidas')
  process.exit(1)
}

export const env = _env.data