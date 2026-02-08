import { type FastifyPluginAsync } from 'fastify'
import metrics from 'fastify-metrics'

export const registerMetrics: FastifyPluginAsync = async (app) => {
  const plugin = (metrics as any).default || metrics

  await app.register(plugin, {
    endpoint: '/metrics',
    routeMetrics: {
      enabled: true,
      registeredRoutesOnly: true,
    }
  })
}