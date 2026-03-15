import { createRouter, createRootRoute, createRoute, redirect, Outlet } from '@tanstack/react-router'
import { isAuthenticated } from './hooks/use-auth'
import { RootLayout } from './components/layouts/root-layout'
import { AuthLayout } from './components/layouts/auth-layout'
import { LoginPage } from './pages/login'
import { RegisterPage } from './pages/register'
import { DashboardPage } from './pages/dashboard'
import { TaskDetailPage } from './pages/task-detail'
import { SettingsPage } from './pages/settings'

// Root route
const rootRoute = createRootRoute({
  component: RootLayout,
})

// Auth layout for protected routes
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: AuthLayout,
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
})

// Public routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/' })
    }
  },
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/' })
    }
  },
})

// Protected routes
const dashboardRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/',
  component: DashboardPage,
})

const taskDetailRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/tasks/$taskId',
  component: TaskDetailPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/settings',
  component: SettingsPage,
})

// Route tree
const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  authLayoutRoute.addChildren([
    dashboardRoute,
    taskDetailRoute,
    settingsRoute,
  ]),
])

// Create router
export const router = createRouter({ routeTree })
