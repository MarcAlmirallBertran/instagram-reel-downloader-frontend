import { clsx } from 'clsx'

export function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      className={clsx(
        'flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export function Label({ className, children, ...props }) {
  return (
    <label
      className={clsx(
        'text-sm font-medium leading-none text-foreground',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}
