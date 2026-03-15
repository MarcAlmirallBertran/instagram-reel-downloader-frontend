import { Outlet } from '@tanstack/react-router'
import { Navbar } from '../navbar'

export function AuthLayout() {
  return (
    <div className="min-h-svh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
