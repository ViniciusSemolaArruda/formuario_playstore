// lib/prisma.ts
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pkg from "pg"

const { Pool } = pkg

// Pool do pg usando sua DATABASE_URL do Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Adapter do Prisma para PostgreSQL
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}
