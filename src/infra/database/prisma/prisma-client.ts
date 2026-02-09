import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: ['query', 'error', 'info', 'warn'], // to show SQL in terminal
})