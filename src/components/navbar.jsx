import { Link, useNavigate } from '@tanstack/react-router'
import { Settings, LogOut, Film } from 'lucide-react'
import { Button } from './ui/button'
import { useLogout, useUser } from '../hooks/use-auth'

export function Navbar() {
  const navigate = useNavigate()
  const { data: user } = useUser()
  const logout = useLogout()

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate({ to: '/login' })
      },
    })
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <Film className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Reel Downloader</span>
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <span className="text-sm text-muted-foreground mr-2">
              {user.username}
            </span>
          )}
          
          <Link to="/settings">
            <Button variant="ghost" size="icon" title="Settings">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
