import { Outlet } from '@tanstack/react-router'
import { Navbar } from '../navbar'

export function AuthLayout() {
  return (
    <div className="min-h-svh flex flex-col">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
