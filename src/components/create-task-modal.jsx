import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { X, Link as LinkIcon } from 'lucide-react'

export function CreateTaskModal({ isOpen, onClose, onSubmit, isLoading, error }) {
  const [url, setUrl] = useState('')
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setUrl('')
      setValidationError('')
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const validateUrl = (value) => {
    if (!value.trim()) {
      return 'URL is required'
    }
    const instagramPattern = /^https?:\/\/(www\.)?instagram\.com\/(reel|p)\/[\w-]+/i
    if (!instagramPattern.test(value)) {
      return 'Please enter a valid Instagram Reel URL'
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationResult = validateUrl(url)
    if (validationResult) {
      setValidationError(validationResult)
      return
    }
    setValidationError('')
    try {
      await onSubmit(url)
    } catch (err) {
      // Error handled by parent
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <Card className="relative w-full max-w-md mx-4 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        
        <CardHeader>
          <CardTitle>New Download Task</CardTitle>
          <CardDescription>
            Enter an Instagram Reel URL to download and transcribe
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="instagram-url" className="text-sm font-medium text-foreground">
                  Instagram Reel URL
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="instagram-url"
                    type="url"
                    placeholder="https://www.instagram.com/reel/..."
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value)
                      if (validationError) setValidationError('')
                    }}
                    className="pl-10"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                {(validationError || error) && (
                  <p className="text-sm text-destructive">
                    {validationError || error}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
