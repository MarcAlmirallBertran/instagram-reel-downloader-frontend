import { useParams, Link, useNavigate } from '@tanstack/react-router'
import { useTask, useCancelTask } from '../hooks/use-tasks'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Spinner } from '../components/ui/spinner'
import { 
  ArrowLeft, 
  Clock, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  ExternalLink,
  Video,
  FileAudio,
  FileText,
  Calendar,
  StopCircle,
  Download
} from 'lucide-react'

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'secondary',
    icon: Clock,
    description: 'Task is waiting to be processed',
  },
  running: {
    label: 'Running',
    variant: 'warning',
    icon: Loader2,
    description: 'Task is being processed',
  },
  completed: {
    label: 'Completed',
    variant: 'success',
    icon: CheckCircle2,
    description: 'Task completed successfully',
  },
  failed: {
    label: 'Failed',
    variant: 'destructive',
    icon: XCircle,
    description: 'Task failed to complete',
  },
}

export function TaskDetailPage() {
  const { taskId } = useParams({ from: '/tasks/$taskId' })
  const navigate = useNavigate()
  const { data: task, isLoading, error, refetch } = useTask(taskId)
  const cancelTask = useCancelTask()

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this task?')) return
    try {
      await cancelTask.mutateAsync(taskId)
      refetch()
    } catch (err) {
      // Error is handled by the mutation
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-destructive">Error loading task: {error.message}</p>
        <div className="flex gap-3">
          <Button onClick={() => navigate({ to: '/' })} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Task not found</p>
        <Button onClick={() => navigate({ to: '/' })} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const config = statusConfig[task.status] || statusConfig.pending
  const StatusIcon = config.icon
  const canCancel = task.status === 'pending' || task.status === 'running'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">Task Details</h1>
          <p className="text-sm text-muted-foreground font-mono">#{task.id}</p>
        </div>
        {canCancel && (
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={cancelTask.isPending}
          >
            <StopCircle className="h-4 w-4 mr-2" />
            {cancelTask.isPending ? 'Canceling...' : 'Cancel Task'}
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant={config.variant} className="flex items-center gap-1 text-sm py-1 px-3">
                <StatusIcon className={`h-4 w-4 ${task.status === 'running' ? 'animate-spin' : ''}`} />
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{config.description}</p>
            
            {task.error_message && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-medium">Error Details</p>
                <p className="text-sm text-destructive/80 mt-1">{task.error_message}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <ExternalLink className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Instagram URL</p>
                <a 
                  href={task.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline break-all"
                >
                  {task.instagram_url}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Created</p>
                <p className="text-sm text-muted-foreground">{formatDate(task.created_at)}</p>
              </div>
            </div>
            {task.updated_at && (
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Last Updated</p>
                  <p className="text-sm text-muted-foreground">{formatDate(task.updated_at)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Card */}
        {task.video_path && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-4 w-4" />
                Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              <video 
                controls 
                className="w-full rounded-md bg-black"
                src={task.video_path}
              >
                Your browser does not support the video tag.
              </video>
              <Button variant="outline" className="mt-3 w-full" asChild>
                <a href={task.video_path} download>
                  <Download className="h-4 w-4 mr-2" />
                  Download Video
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Audio Card */}
        {task.audio_path && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileAudio className="h-4 w-4" />
                Audio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <audio 
                controls 
                className="w-full"
                src={task.audio_path}
              >
                Your browser does not support the audio element.
              </audio>
              <Button variant="outline" className="mt-3 w-full" asChild>
                <a href={task.audio_path} download>
                  <Download className="h-4 w-4 mr-2" />
                  Download Audio
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Transcription Card */}
        {task.transcription && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Transcription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-md bg-muted/50 border border-border">
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {task.transcription}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
