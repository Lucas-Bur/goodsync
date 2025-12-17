import { useLiveQuery } from '@tanstack/react-db'
import { Loader2, User } from 'lucide-react'
import { usersCollection } from '@/features/sync/services/db-collections'

export function LiveUsers() {
  const { data: liveUsers, isLoading } = useLiveQuery((q) =>
    q.from({ usersCollection }),
  )

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
        <Loader2 className='h-8 w-8 animate-spin mb-2' />
        <p>Synchronisiere Daten...</p>
      </div>
    )
  }

  if (liveUsers.length === 0) {
    return (
      <div className='text-center py-12 border-2 border-dashed border-border/50 rounded-xl bg-card/30'>
        <User className='h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-50' />
        <p className='text-muted-foreground'>Keine User gefunden.</p>
        <p className='text-xs text-muted-foreground/60'>
          Erstelle einen neuen User unten.
        </p>
      </div>
    )
  }

  return (
    <ul className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6'>
      {liveUsers.map((user) => (
        <li
          key={user.id}
          className='group relative overflow-hidden rounded-xl border border-border/50 bg-card/40 p-4 transition-all hover:bg-card/60 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5'
        >
          {/* Decorative Gradient Blob */}
          <div className='absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/10 blur-xl transition-all group-hover:bg-primary/20' />

          <div className='relative flex items-center justify-between'>
            <div>
              <span className='block font-medium text-foreground group-hover:text-primary transition-colors'>
                {user.name}
              </span>
              <span className='text-xs font-mono text-muted-foreground/70 truncate block max-w-[150px]'>
                {user.email}
              </span>
            </div>
            <span className='text-[10px] font-mono py-1 px-2 rounded bg-background border border-border text-muted-foreground'>
              #{user.id}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
