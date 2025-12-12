import { createFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '@/components/RegisterForm'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-6'>Registrieren</h1>
        <RegisterForm />
      </div>
    </div>
  )
}
