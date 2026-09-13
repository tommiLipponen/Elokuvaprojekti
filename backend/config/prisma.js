const path = require('path');

const environmentFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
require('dotenv').config({
  path: path.join(__dirname, '..', environmentFile),
});
const { PrismaPg } = require('@prisma/adapter-pg');

// Lazily loads the ESM-only generated Prisma client from CommonJS code.
let prismaPromise;

function getDatabaseUrl() {
  if (process.env.NODE_ENV === 'test') {
    if (!process.env.TEST_DATABASE_URL) {
      throw new Error('TEST_DATABASE_URL must be set when running database tests');
    }

    return process.env.TEST_DATABASE_URL;
  }

  return process.env.DATABASE_URL;
}

function getPrisma() {
  if (!prismaPromise) {
    prismaPromise = import('../generated/prisma/client.ts').then(({ PrismaClient }) => {
      const adapter = new PrismaPg({ connectionString: getDatabaseUrl() });
      return new PrismaClient({ adapter });
    });
  }
  return prismaPromise;
}

module.exports = { getPrisma };
