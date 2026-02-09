import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import { env } from '../env/index.js'
import { loggerConfig } from '../infra/lib/logger.js'

/** routes & plugins  */
import { healthCheck } from '../infra/http/routes/health-check.js'
import { createTenant } from '../infra/http/routes/create-tenant.js'
import { registerMetrics } from '../infra/http/plugins/metrics.js'
import { errorHandler } from '../infra/http/error-handler.js'

const app = fastify({
  logger: loggerConfig,
}).withTypeProvider<ZodTypeProvider>()

/** zod compilers */
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

/** global error handler */
errorHandler(app)

app.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'OmniSched API',
      description: 'High-performance scheduling API',
      version: '1.0.0'
    },
    host: 'localhost:3333',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

await app.register(registerMetrics)

app.register(healthCheck)
app.register(createTenant)

async function start() {
  try {
    await app.listen({
      host: '0.0.0.0',
      port: env.PORT,
    })

    if (env.NODE_ENV === 'dev') {
      app.log.info(`OmniSched API is runnig at http://localhost:${env.PORT}`)
      app.log.info(`Swagger: http://localhost:${env.PORT}/docs`)
      app.log.info(`Health: http://localhost:${env.PORT}/health`)
      app.log.info(`Metrics: http://localhost:${env.PORT}/metrics`)
      app.log.info(`Grafana: http://localhost:${process.env.GRAFANA_PORT}`)
      app.log.info(`Prometheus: http://localhost:${process.env.PROMETHEUS_PORT}/targets`)
    }
  } catch (err) {
    app.log.fatal(err)
    process.exit(1)
  }
}

const signals = ['SIGINT', 'SIGTERM']

for (const signal of signals) {
  process.on(signal, async () => {
    app.log.info(`Received ${signal}. Closing server...`)
    await app.close()
    app.log.info('Server closed')
    process.exit(0)
  })
}

start()