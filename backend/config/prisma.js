require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { PrismaPg } = require('@prisma/adapter-pg');

// Lazily loads the ESM-only generated Prisma client from CommonJS code.
let prismaPromise;

function getPrisma() {
  if (!prismaPromise) {
    prismaPromise = import('../generated/prisma/client.ts').then(({ PrismaClient }) => {
      const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
      return new PrismaClient({ adapter });
    });
  }
  return prismaPromise;
}

module.exports = { getPrisma };
