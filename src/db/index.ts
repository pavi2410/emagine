import { drizzle } from 'drizzle-orm/bun-sql'
import * as schema from './schema'

// Use Bun's native SQL client
const client = Bun.sql

// Create Drizzle instance with schema
export const db = drizzle({ client, schema })

// Re-export schema for convenience
export * from './schema'
