import { useState } from 'react'
import { useTasks, useCreateTask } from '../hooks/use-tasks'
import { TaskCard } from '../components/task-card'
import { CreateTaskModal } from '../components/create-task-modal'
import { Button } from '../components/ui/button'
import { Select } from '../components/ui/select'
import { Spinner } from '../components/ui/spinner'
import { Plus, RefreshCw, Inbox, Filter, ArrowUpDown } from 'lucide-react'

const DEFAULT_SORT_BY = 'created_at'
const DEFAULT_SORT_ORDER = 'desc'

export function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState(DEFAULT_SORT_BY)
  const [sortOrder, setSortOrder] = useState(DEFAULT_SORT_ORDER)

  const { data: tasks, isLoading, error, refetch, isRefetching } = useTasks({
    status: statusFilter || undefined,
    sortBy,
    sortOrder,
  })
  const createTask = useCreateTask()

  const hasActiveFilters =
    statusFilter !== '' || sortBy !== DEFAULT_SORT_BY || sortOrder !== DEFAULT_SORT_ORDER

  const clearFilters = () => {
    setStatusFilter('')
    setSortBy(DEFAULT_SORT_BY)
    setSortOrder(DEFAULT_SORT_ORDER)
  }

  const handleCreateTask = async (url) => {
    await createTask.mutateAsync(url)
    setIsModalOpen(false)
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

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-40"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowUpDown className="h-4 w-4" />
        </div>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-40"
          aria-label="Sort by"
        >
          <option value="created_at">Created Date</option>
          <option value="updated_at">Updated Date</option>
        </Select>
        <Select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-40"
          aria-label="Sort order"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </Select>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : hasActiveFilters ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border rounded-lg bg-card/50">
          <Filter className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No matching tasks</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            No tasks match the current filters
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
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
        key={+isModalOpen}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={createTask.isPending}
        error={createTask.error?.message}
      />
    </div>
  )
}
