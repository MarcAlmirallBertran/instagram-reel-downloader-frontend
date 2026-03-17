import { Link } from '@tanstack/react-router'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ExternalLink, Calendar, StopCircle } from 'lucide-react'
import { statusConfig } from '../lib/status-config'
import { useCancelTask } from '../hooks/use-tasks'

export function TaskCard({ task }) {
  const cancelTask = useCancelTask()
  const isActive = task.status === 'pending' || task.status === 'in_progress' || task.status === 'processing'
  const canCancel = !task.cancelled && isActive

  const handleCancel = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to cancel this task?')) return
    try {
      await cancelTask.mutateAsync(task.id)
    } catch {
      // Error is handled by the mutation
    }
  }
  const config = statusConfig[task.status] || statusConfig.pending
  const StatusIcon = config.icon

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const truncateUrl = (url, maxLength = 50) => {
    if (!url) return '-'
    if (url.length <= maxLength) return url
    return url.slice(0, maxLength) + '...'
  }

  return (
    <Link to="/tasks/$taskId" params={{ taskId: task.id }}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer group pt-6">
        <CardContent>
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={config.variant} className="flex items-center gap-1">
                  <StatusIcon className={`h-3 w-3 ${task.status === 'in_progress' || task.status === 'processing'  ? 'animate-spin' : ''}`} />
                  {config.label}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  #{task.id.slice(0, 8)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-foreground">
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{truncateUrl(`https://www.instagram.com/reels/${task.short_code}/`)}</span>
              </div>

              {task.errors?.length > 0 && (
                <p className="text-sm text-destructive mt-2 line-clamp-2">
                  {task.errors[task.errors.length - 1].message}
                </p>
              )}
              {task.cancelled && (task.status === 'pending' || task.status === 'in_progress' || task.status === 'processing') && (
                <p className="text-sm text-muted-foreground mt-2">Cancellation requested</p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {formatDate(task.created_at)}
              </div>
              {canCancel && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={handleCancel}
                  disabled={cancelTask.isPending}
                >
                  <StopCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
