import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'destructive' | 'warning' | 'outline' | 'secondary'
  className?: string
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
      {
        'bg-subtle text-ink2': variant === 'default',
        'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400': variant === 'success',
        'bg-red-500/15 text-red-600 dark:text-red-400': variant === 'destructive',
        'bg-amber-500/15 text-amber-600 dark:text-amber-400': variant === 'warning',
        'border border-edge text-ink2': variant === 'outline',
        'bg-muted text-ink3': variant === 'secondary',
      },
      className
    )}
  >
    {children}
  </span>
)
