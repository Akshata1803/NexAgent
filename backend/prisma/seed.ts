/**
 * prisma/seed.ts — NexAgent development database seed
 *
 * Creates the initial admin user using the password from ADMIN_PASSWORD env var.
 * Idempotent: uses upsert so it is safe to run multiple times.
 *
 * Usage:
 *   npx prisma migrate dev     # ensure schema is applied
 *   npm run db:seed            # run this script
 *
 * Requires ADMIN_PASSWORD to be set in .env (never hard-coded here).
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error(
      'ADMIN_PASSWORD environment variable is not set. ' +
      'Add it to backend/.env before running the seed script.'
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const adminAi = await prisma.user.upsert({
    where: { email: 'admin@nexagent.ai' },
    update: {
      passwordHash,
      name: 'NexAgent Admin',
      role: 'ADMIN',
    },
    create: {
      email: 'admin@nexagent.ai',
      name: 'NexAgent Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const adminDev = await prisma.user.upsert({
    where: { email: 'admin@nexagent.dev' },
    update: {
      passwordHash,
      name: 'NexAgent Admin',
      role: 'ADMIN',
    },
    create: {
      email: 'admin@nexagent.dev',
      name: 'NexAgent Admin',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`[SEED] Admin users ready: ${adminAi.email}, ${adminDev.email}`);
}

main()
  .catch((err) => {
    console.error('[SEED] Failed:', err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
