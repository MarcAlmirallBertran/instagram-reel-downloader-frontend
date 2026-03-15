import { Link } from '@tanstack/react-router'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { 
  Clock, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Calendar
} from 'lucide-react'

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'secondary',
    icon: Clock,
  },
  running: {
    label: 'Running',
    variant: 'warning',
    icon: Loader2,
  },
  completed: {
    label: 'Completed',
    variant: 'success',
    icon: CheckCircle2,
  },
  failed: {
    label: 'Failed',
    variant: 'destructive',
    icon: XCircle,
  },
}

export function TaskCard({ task }) {
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
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={config.variant} className="flex items-center gap-1">
                  <StatusIcon className={`h-3 w-3 ${task.status === 'running' ? 'animate-spin' : ''}`} />
                  {config.label}
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">
                  #{task.id.slice(0, 8)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-foreground mb-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{truncateUrl(task.instagram_url)}</span>
              </div>

              {task.error_message && (
                <p className="text-sm text-destructive mt-2 line-clamp-2">
                  {task.error_message}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground flex-shrink-0">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(task.created_at)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
