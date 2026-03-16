import { Clock, Loader2, CheckCircle2, XCircle, Ban } from 'lucide-react'

export const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'secondary',
    icon: Clock,
    description: 'Task is waiting to be processed',
  },
  in_progress: {
    label: 'Running',
    variant: 'warning',
    icon: Loader2,
    description: 'Task is being processed',
  },
  processing: {
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
  cancelled: {
    label: 'Cancelled',
    variant: 'secondary',
    icon: Ban,
    description: 'Task was cancelled by the user',
  },
}
