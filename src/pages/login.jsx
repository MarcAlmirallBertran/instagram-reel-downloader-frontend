import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Film } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Input, Label } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import { Spinner } from '../components/ui/spinner'
import { useLogin } from '../hooks/use-auth'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useLogin()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!username || !password) {
      toast.error('Please fill in all fields')
      return
    }

    login.mutate(
      { username, password },
      {
        onSuccess: () => {
          toast.success('Welcome back!')
          navigate({ to: '/' })
        },
        onError: (error) => {
          toast.error(error.message || 'Invalid credentials')
        },
      }
    )
  }

  return (
    <div className="min-h-svh flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Film className="h-10 w-10 text-primary" />
          <span className="font-bold text-2xl text-foreground">Reel Downloader</span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={login.isPending}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={login.isPending}
                  autoComplete="current-password"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={login.isPending}
              >
                {login.isPending ? (
                  <>
                    <Spinner size="sm" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                {"Don't have an account? "}
                <Link 
                  to="/register" 
                  className="text-primary hover:underline font-medium"
                >
                  Create one
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
