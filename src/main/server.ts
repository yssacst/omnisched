import fastify, { type FastifyError } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider
} from 'fastify-type-provider-zod'

import { env } from '../env/index.js'
import { loggerConfig } from '../infra/lib/logger.js'

/** routes & plugins  */
import { healthCheck } from '../infra/http/routes/health-check.js'
import { createTenant } from '../infra/http/routes/create-tenant.js'
import { registerMetrics } from '../infra/http/plugins/metrics.js'
import { setupErrorHandler } from '../infra/http/error-handler.js'

const app = fastify({
  logger: loggerConfig,
}).withTypeProvider<ZodTypeProvider>()

/** zod compilers */
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

/** global error handler */
setupErrorHandler(app)

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
      app.log.info(`Health: http://localhost:${env.PORT}/health`)
      app.log.info(`Metrics: http://localhost:${env.PORT}/metrics`)
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