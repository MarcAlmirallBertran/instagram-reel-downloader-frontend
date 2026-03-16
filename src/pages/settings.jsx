import { useState } from 'react'
import { useUser, useUpdateUser } from '../hooks/use-auth'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Spinner } from '../components/ui/spinner'
import { Key, Instagram, Eye, EyeOff, Check, AlertCircle } from 'lucide-react'

function OpenAISettingsCard() {
  const { data: user, isLoading } = useUser()
  const updateUser = useUpdateUser()
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateUser.mutateAsync({ openai_api_key: apiKey })
      setApiKey('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      // Error handled by mutation
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Key className="h-5 w-5" />
          OpenAI API Key
        </CardTitle>
        <CardDescription>
          Configure your OpenAI API key for transcription services
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {user?.has_openai_api_key && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" />
              API key configured
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="openai-key" className="text-sm font-medium text-foreground">
              {user?.has_openai_api_key ? 'New API Key' : 'API Key'}
            </label>
            <div className="relative">
              <Input
                id="openai-key"
                type={showKey ? 'text' : 'password'}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={updateUser.isPending}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showKey ? 'Hide API key' : 'Show API key'}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored securely and never shared
            </p>
          </div>
          {updateUser.error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {updateUser.error.message}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={updateUser.isPending || !apiKey}>
            {updateUser.isPending ? (
              'Saving...'
            ) : saved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

function InstagramSettingsCard() {
  const { data: user, isLoading } = useUser()
  const updateUser = useUpdateUser()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateUser.mutateAsync({
        instagram_username: username,
        instagram_password: password,
      })
      setUsername('')
      setPassword('')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      // Error handled by mutation
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Spinner />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Instagram className="h-5 w-5" />
          Instagram Credentials
        </CardTitle>
        <CardDescription>
          Configure your Instagram credentials for downloading Reels
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {user?.has_instagram_credentials && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Check className="h-4 w-4" />
              Instagram credentials configured
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="ig-username" className="text-sm font-medium text-foreground">
              Username
            </label>
            <Input
              id="ig-username"
              type="text"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={updateUser.isPending}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="ig-password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Input
                id="ig-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={updateUser.isPending}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Credentials are encrypted and stored securely
            </p>
          </div>
          {updateUser.error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {updateUser.error.message}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={updateUser.isPending || (!username && !password)}>
            {updateUser.isPending ? (
              'Saving...'
            ) : saved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your API keys and credentials
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <OpenAISettingsCard />
        <InstagramSettingsCard />
      </div>
    </div>
  )
}
