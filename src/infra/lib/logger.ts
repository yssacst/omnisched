import { type LoggerOptions } from 'pino'

export const loggerConfig: LoggerOptions = {
  ...(process.env.NODE_ENV === 'dev' ? {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
      },
    },
  } : {}),
}