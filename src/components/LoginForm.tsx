import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const client = authClient
    try {
      const res = await client.signIn.email({
        email,
        password,
      })
      console.log(res)
      navigate({ to: '/dashboard' })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleLogin} className='space-y-4'>
      <div>
        <label htmlFor='email'>Email</label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor='password'>Passwort</label>
        <input
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type='submit'>Anmelden</button>
    </form>
  )
}
