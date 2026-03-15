import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '../lib/api'

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: tasksApi.list,
    refetchInterval: (query) => {
      const tasks = query.state.data
      if (!tasks) return false
      
      // Poll every 5 seconds if there are pending or running tasks
      const hasActiveTasks = tasks.some(
        task => task.status === 'pending' || task.status === 'running'
      )
      return hasActiveTasks ? 5000 : false
    },
  })
}

export function useTask(taskId) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => tasksApi.get(taskId),
    enabled: !!taskId,
    refetchInterval: (query) => {
      const task = query.state.data
      if (!task) return false
      
      // Poll every 3 seconds if task is active
      const isActive = task.status === 'pending' || task.status === 'running'
      return isActive ? 3000 : false
    },
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (uri) => tasksApi.create(uri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useCancelTask() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (taskId) => tasksApi.cancel(taskId),
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
    },
  })
}

export function useTranscript(taskId, enabled = true) {
  return useQuery({
    queryKey: ['transcript', taskId],
    queryFn: () => tasksApi.getTranscript(taskId),
    enabled: !!taskId && enabled,
  })
}
