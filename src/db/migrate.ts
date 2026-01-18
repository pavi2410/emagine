import { drizzle } from 'drizzle-orm/bun-sql'
import { migrate } from 'drizzle-orm/bun-sql/migrator'
import { env } from '../env'

const db = drizzle(env.DATABASE_URL)

await migrate(db, { migrationsFolder: './drizzle' })

console.log('✅ Migrations applied successfully')
process.exit(0)
