import { useState } from 'react'
import { useTasks, useCreateTask } from '../hooks/use-tasks'
import { TaskCard } from '../components/task-card'
import { CreateTaskModal } from '../components/create-task-modal'
import { Button } from '../components/ui/button'
import { Spinner } from '../components/ui/spinner'
import { Plus, RefreshCw, Inbox } from 'lucide-react'

export function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: tasks, isLoading, error, refetch, isRefetching } = useTasks()
  const createTask = useCreateTask()

  const handleCreateTask = async (url) => {
    try {
      await createTask.mutateAsync(url)
      setIsModalOpen(false)
    } catch (err) {
      throw err
    }
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
        <p className="text-destructive">Error loading tasks: {error.message}</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your Instagram Reel downloads
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={isRefetching}
            aria-label="Refresh tasks"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border rounded-lg bg-card/50">
          <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No tasks yet</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Create your first task to download and transcribe an Instagram Reel
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>
      )}

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={createTask.isPending}
        error={createTask.error?.message}
      />
    </div>
  )
}
