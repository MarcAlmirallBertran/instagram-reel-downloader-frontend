import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Film } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Input, Label } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import { Spinner } from '../components/ui/spinner'
import { useRegister, useLogin } from '../hooks/use-auth'

export function RegisterPage() {
  const navigate = useNavigate()
  const register = useRegister()
  const login = useLogin()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!username || !password || !confirmPassword) {
      toast.error('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    register.mutate(
      { username, password },
      {
        onSuccess: () => {
          toast.success('Account created successfully!')
          // Auto login after registration
          login.mutate(
            { username, password },
            {
              onSuccess: () => {
                navigate({ to: '/' })
              },
              onError: () => {
                navigate({ to: '/login' })
              },
            }
          )
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to create account')
        },
      }
    )
  }

  const isPending = register.isPending || login.isPending

  return (
    <div className="min-h-svh flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Film className="h-10 w-10 text-primary" />
          <span className="font-bold text-2xl text-foreground">Reel Downloader</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Get started with Instagram Reel Downloader
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isPending}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPending}
                  autoComplete="new-password"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Spinner size="sm" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
