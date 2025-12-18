import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Use DATABASE_URL from environment or fallback to hardcoded (for local dev only)
const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_KQT9Gk7cHUId@ep-odd-tree-a43m83k9-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require'

// Create pg Pool with SSL configuration for Neon
const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
})

const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

