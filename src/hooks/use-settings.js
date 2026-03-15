import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'

export function useOpenAISettings() {
  return useQuery({
    queryKey: ['openai-settings'],
    queryFn: api.getOpenAISettings,
  })
}

export function useUpdateOpenAISettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.updateOpenAISettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['openai-settings'] })
    },
  })
}

export function useInstagramSettings() {
  return useQuery({
    queryKey: ['instagram-settings'],
    queryFn: api.getInstagramSettings,
  })
}

export function useUpdateInstagramSettings() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.updateInstagramSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instagram-settings'] })
    },
  })
}
