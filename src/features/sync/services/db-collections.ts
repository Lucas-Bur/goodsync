import {
  electricCollectionOptions,
  type Txid,
} from '@tanstack/electric-db-collection'
import { createCollection } from '@tanstack/react-db'
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import {
  insertUserSchema,
  selectUserSchema,
  usersTable,
} from '../db/schema/posts'

// TODO. refactor

// Generate a transaction ID
async function generateTxId(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
): Promise<Txid> {
  // The ::xid cast strips off the epoch, giving you the raw 32-bit value
  // that matches what PostgreSQL sends in logical replication streams
  // (and then exposed through Electric which we'll match against
  // in the client).
  const result = await tx.execute(
    `SELECT pg_current_xact_id()::xid::text as txid`,
  )
  const txid = result.rows[0]?.txid

  if (txid === undefined) {
    throw new Error(`Failed to get transaction ID`)
  }

  return parseInt(txid as string, 10)
}

const addUser = createServerFn({
  method: 'POST',
})
  .inputValidator(insertUserSchema)
  .handler(async (insertUser) => {
    insertUser.data.id = undefined

    const result = await db.transaction(async (tx) => {
      const txid = await generateTxId(tx)
      const newItem = await tx
        .insert(usersTable)
        .values(insertUser.data)
        .returning()

      return { item: newItem, txid }
    })

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

      const result = await addUser({
        data: newUser,
      })

      return { txid: result.txid }
    },
  }),
)
