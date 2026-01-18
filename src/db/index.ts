import { drizzle } from 'drizzle-orm/bun-sql'
import { SQL } from 'bun'
import * as schema from './schema'
import { env } from '../env'

// Create Bun SQL client and Drizzle instance with schema
const client = new SQL(env.DATABASE_URL)
export const db = drizzle({ client, schema })

// Re-export schema for convenience
export * from './schema'
