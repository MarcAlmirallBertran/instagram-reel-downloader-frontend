import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi, removeToken } from '../lib/api'

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ username, password }) => authApi.login(username, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: ({ username, password }) => authApi.register(username, password),
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      removeToken()
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => authApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

export function isAuthenticated() {
  return !!localStorage.getItem('access_token')
}
