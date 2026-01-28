import { pgTable, text, timestamp, uuid, jsonb, integer, boolean, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Accounts table (for Better Auth)
export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Sessions table (for Better Auth)
export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Verification tokens (for Better Auth)
export const verifications = pgTable('verifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// User settings (persisted preferences)
export const userSettings = pgTable('user_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  selectedModel: text('selected_model').default('z-ai/glm-4.5-air:free').notNull(),
  enableThinking: boolean('enable_thinking').default(false).notNull(),
  theme: text('theme').default('dark').notNull(),
  // OOBE tracking
  hasCompletedOOBE: boolean('has_completed_oobe').default(false).notNull(),
  // Personalization
  wallpaper: text('wallpaper').default('gradient-purple').notNull(),
  accentColor: text('accent_color').default('purple').notNull(),
  avatar: text('avatar').default('gradient-1').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Apps table (generated applications)
export const apps = pgTable('apps', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  icon: text('icon').notNull(), // emoji
  description: text('description'),

  // Storage reference (path in S3 bucket)
  htmlStoragePath: text('html_storage_path'),

  // Metadata
  prompt: text('prompt'), // Original user prompt
  modelUsed: text('model_used'),
  generationTimeMs: integer('generation_time_ms'),

  // Status
  status: text('status').default('generating').notNull().$type<'generating' | 'ready' | 'error'>(),
  errorMessage: text('error_message'),

  // For "agentic OS" features
  capabilities: jsonb('capabilities').default([]).$type<string[]>(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // Soft delete for trash
})

// App versions (for history/undo)
export const appVersions = pgTable('app_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  appId: uuid('app_id').references(() => apps.id, { onDelete: 'cascade' }).notNull(),
  version: integer('version').notNull(),
  htmlStoragePath: text('html_storage_path').notNull(),
  prompt: text('prompt'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// User files (for agentic OS file system)
export const userFiles = pgTable('user_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  path: text('path').notNull(), // Virtual path like '/documents/notes.txt'
  mimeType: text('mime_type').notNull(),
  storagePath: text('storage_path').notNull(),
  size: integer('size').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('user_path_idx').on(table.userId, table.path),
])

// Relations
export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, { fields: [userSettings.userId], references: [users.id] }),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  apps: many(apps),
  files: many(userFiles),
  settings: one(userSettings),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const appsRelations = relations(apps, ({ one, many }) => ({
  user: one(users, { fields: [apps.userId], references: [users.id] }),
  versions: many(appVersions),
}))

export const appVersionsRelations = relations(appVersions, ({ one }) => ({
  app: one(apps, { fields: [appVersions.appId], references: [apps.id] }),
}))

export const userFilesRelations = relations(userFiles, ({ one }) => ({
  user: one(users, { fields: [userFiles.userId], references: [users.id] }),
}))
