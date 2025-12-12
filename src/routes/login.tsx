import { createFileRoute } from '@tanstack/react-router'
import { AuthForm } from '@/components/AuthForm'
import { guestMiddleware } from '@/middleware/auth'

export const Route = createFileRoute('/login')({
  component: AuthForm,
  server: {
    middleware: [guestMiddleware],
  },
})
