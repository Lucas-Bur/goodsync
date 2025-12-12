import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner' // Optional: Falls du Sonner oder Toaster hast
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { authClient } from '@/lib/auth-client'
import {
  type LoginInput,
  loginSchema,
  type RegisterInput,
  registerSchema,
} from '@/lib/auth-schema'

export function AuthForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  // Login Form
  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  // Register Form
  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  })

  async function onLogin(data: LoginInput) {
    setIsLoading(true)
    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        fetchOptions: {
          onSuccess: () => {
            navigate({ to: '/profile' })
          },
          onError: (ctx) => {
            // Hier Fehlerbehandlung, z.B. Toast
            console.error(ctx.error.message)
            loginForm.setError('root', { message: ctx.error.message })
          },
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onRegister(data: RegisterInput) {
    setIsLoading(true)
    try {
      await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        fetchOptions: {
          onSuccess: () => {
            navigate({ to: '/profile' })
          },
          onError: (ctx) => {
            console.error(ctx.error.message)
            registerForm.setError('root', { message: ctx.error.message })
          },
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-[50vh] items-center justify-center p-4'>
      <Tabs defaultValue='login' className='w-[400px]'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='login'>Anmelden</TabsTrigger>
          <TabsTrigger value='register'>Registrieren</TabsTrigger>
        </TabsList>

        {/* LOGIN TAB */}
        <TabsContent value='login'>
          <Card>
            <CardHeader>
              <CardTitle>Willkommen zurück</CardTitle>
              <CardDescription>
                Melde dich mit deiner E-Mail an.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLogin)}
                  className='space-y-4'
                >
                  <FormField
                    control={loginForm.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail</FormLabel>
                        <FormControl>
                          <Input placeholder='m@example.com' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passwort</FormLabel>
                        <FormControl>
                          <Input type='password' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {loginForm.formState.errors.root && (
                    <div className='text-destructive text-sm'>
                      {loginForm.formState.errors.root.message}
                    </div>
                  )}
                  <Button className='w-full' type='submit' disabled={isLoading}>
                    {isLoading ? 'Lädt...' : 'Anmelden'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REGISTER TAB */}
        <TabsContent value='register'>
          <Card>
            <CardHeader>
              <CardTitle>Konto erstellen</CardTitle>
              <CardDescription>
                Gib deine Daten ein, um loszulegen.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegister)}
                  className='space-y-4'
                >
                  <FormField
                    control={registerForm.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Max Mustermann' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-Mail</FormLabel>
                        <FormControl>
                          <Input placeholder='m@example.com' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passwort</FormLabel>
                        <FormControl>
                          <Input type='password' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {registerForm.formState.errors.root && (
                    <div className='text-destructive text-sm'>
                      {registerForm.formState.errors.root.message}
                    </div>
                  )}
                  <Button className='w-full' type='submit' disabled={isLoading}>
                    {isLoading ? 'Erstellen...' : 'Registrieren'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
