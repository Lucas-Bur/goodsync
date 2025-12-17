import { getTableName } from 'drizzle-orm'

import { authSync } from '@/features/auth/db/schema/auth'
import { postsSync } from '@/features/sync/db/schema/posts'

export * from '@/features/auth/db/schema/auth'
export * from '@/features/sync/db/schema/posts'

const ALL_SYNCABLE = [...authSync, ...postsSync] as const
const ALL_SYNCABLE_NAMES = ALL_SYNCABLE.map((pgTable) => getTableName(pgTable))

export type SyncableTable = (typeof ALL_SYNCABLE_NAMES)[number] // "users_table" | "user" | "posts_table"

export const TABLE_REGISTRY = Object.fromEntries(
  ALL_SYNCABLE.map((table) => [getTableName(table), table]),
) as Record<SyncableTable, (typeof ALL_SYNCABLE)[number]>
