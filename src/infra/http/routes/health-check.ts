import { type FastifyInstance } from 'fastify'
import { prisma } from '../../database/prisma/prisma-client.js'

export async function healthCheck(app: FastifyInstance) {
  app.get('/health', async (request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`

      return reply.status(200).send({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'connected'
      })
    } catch (error) {
      return reply.status(503).send({
        status: 'error',
        database: 'disconnected',
        timestamp: new Date().toISOString()
      })
    }
  })
}