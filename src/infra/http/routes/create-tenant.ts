import { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../database/prisma/prisma-client.js'

export async function createTenant(app: FastifyInstance) {
  app.post('/tenants', async (request, reply) => {
    const createTenantSchema = z.object({
      name: z.string().min(3),
      slug: z.string().lowercase().trim(),
    })

    const { name, slug } = createTenantSchema.parse(request.body)

    try {
      const tenant = await prisma.tenant.create({
        data: {
          name,
          slug,
        },
      })

      return reply.status(201).send({ tenantId: tenant.id })
    } catch (error) {
      return reply.status(400).send({ message: 'Tenant slug already exists.' })
    }
  })
}