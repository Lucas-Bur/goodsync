import { electricCollectionOptions } from '@tanstack/electric-db-collection'
import { createCollection } from '@tanstack/react-db'
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import {
  insertUserSchema,
  selectUserSchema,
  usersTable,
} from '@/db/schema/posts'

// TODO. refactor
const addUser = createServerFn({
  method: 'POST',
})
  .inputValidator(insertUserSchema)
  .handler(async (insertUser) => {
    insertUser.data.id = undefined
    const result = await db
      .insert(usersTable)
      .values(insertUser.data)
      .returning()
    return result
  })

export const usersCollection = createCollection(
  electricCollectionOptions({
    id: 'users',
    shapeOptions: {
      url: new URL(
        '/api/sync',
        typeof window !== 'undefined'
          ? window.location.origin
          : 'http://localhost:3000',
      ).toString(),
      params: {
        table: 'users_table', // Matcht den Namen in ALLOWED_TABLES
      },
    },
    schema: selectUserSchema,
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      const { modified: newUser } = transaction.mutations[0]

      await addUser({
        data: newUser,
      })
    },
  }),
)
