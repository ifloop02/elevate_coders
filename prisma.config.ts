import dotenv from 'dotenv'
import { defineConfig } from '@prisma/config'

// Load environment variables from .env.local first (Next.js default), then .env
dotenv.config({ path: '.env.local' })
dotenv.config()

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? 'postgresql://postgres:password@localhost:5432/elevate_coders',
  },
})
