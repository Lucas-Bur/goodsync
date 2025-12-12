import { createFileRoute } from '@tanstack/react-router'
import { LogoutButton } from '@/components/LogoutButton'
import { authMiddleware } from '@/middleware/auth'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
  server: {
    middleware: [authMiddleware],
  },
})

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* <LogoutButton /> */}
    </div>
  )
}
