import { createServerFn } from '@tanstack/react-start'
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type z from 'zod'
import { db } from '.'

export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  email: text('email').notNull().unique(),
})

export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
})

// export type InsertUser = typeof usersTable.$inferInsert
// export type SelectUser = typeof usersTable.$inferSelect
export const insertUserSchema = createInsertSchema(usersTable)
export const selectUserSchema = createSelectSchema(usersTable)
export type InsertUser = z.infer<typeof insertUserSchema>

// export type InsertPost = typeof postsTable.$inferInsert
// export type SelectPost = typeof postsTable.$inferSelect

// TODO: refactor the following part

export const createUser = createServerFn({ method: 'POST' })
  .inputValidator(insertUserSchema)
  .handler(async (insertUser) => {
    const result = await db
      .insert(usersTable)
      .values(insertUser.data)
      .returning()
    console.log(result)
  })
