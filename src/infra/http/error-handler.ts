import { type FastifyInstance, type FastifyError } from 'fastify'

export function setupErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error.validation) {
      return reply.status(400).send({
        message: 'Validation error',
        issues: error.validation,
      })
    }

    if (error.code === 'P2002') {
      return reply.status(409).send({ message: 'Resource already exists' })
    }

    request.log.error(error)
    return reply.status(500).send({ message: 'Internal server error' })
  })
}