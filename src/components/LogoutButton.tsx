import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from './ui/button'

export function LogoutButton() {
  const navigate = useNavigate()
  const [session, setSession] = useState<ReturnType<
    typeof authClient.getSession
  > | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } = await authClient.getSession()
        console.log(data)
        setSession(data)
      } catch (error) {
        console.error('Failed to load session:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [])

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      setSession(null)
      navigate({ to: '/login' })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return null
  }

  if (session?.user) {
    return (
      <Button onClick={handleLogout} className='btn btn-logout'>
        Logout
      </Button>
    )
  }

  return (
    <Link to='/login' className='btn btn-login'>
      Login
    </Link>
  )
}
