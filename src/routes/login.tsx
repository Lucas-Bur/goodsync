import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/LoginForm'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-6'>Anmelden</h1>
        <LoginForm />
      </div>
    </div>
  )
}
