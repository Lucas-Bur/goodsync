import { createFileRoute } from '@tanstack/react-router'
import { UserProfile } from '@/components/UserProfile'
import { authMiddleware } from '@/middleware/auth'

export const Route = createFileRoute('/profile')({
  component: UserProfile,
  server: {
    middleware: [authMiddleware],
  },
})
