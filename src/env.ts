import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    APP_URL: z.string().url().optional(),
    BETTER_AUTH_SECRET: z.string().min(1),
    OPENROUTER_API_KEY: z.string().min(1),
    BUCKET_ENDPOINT: z.string().url().optional(),
    BUCKET_NAME: z.string().optional(),
    BUCKET_ACCESS_KEY_ID: z.string().optional(),
    BUCKET_SECRET_ACCESS_KEY: z.string().optional(),
  },
  clientPrefix: 'VITE_',
  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
