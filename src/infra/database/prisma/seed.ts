import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import pino from 'pino'
import { loggerConfig } from '../../lib/logger.js'

const prisma = new PrismaClient()
const logger = pino(loggerConfig)

async function run() {
  logger.info('Starting database seed...')

  await prisma.tenant.deleteMany() // clean db before starting
  logger.warn('Database cleaned (all tenants deleted).')

  const tenantsToCreate = Array.from({ length: 20 }).map(() => {
    const name = faker.company.name()
    return {
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      // generate random dates 30 days ago for grafana 
      createdAt: faker.date.recent({ days: 30 })
    }
  })

  await prisma.tenant.createMany({
    data: tenantsToCreate
  })

  logger.info({ count: 20 }, 'Database seeded with tenants!')
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    logger.fatal({ err: e }, 'Seed process failed!')
    await prisma.$disconnect()
    process.exit(1)
  })