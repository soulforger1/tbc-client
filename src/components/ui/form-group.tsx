import { cn } from '@/lib/utils'

interface FormGroupProps {
  label: string
  children: React.ReactNode
  className?: string
}

export const FormGroup = ({ label, children, className }: FormGroupProps) => (
  <div className={cn(className)}>
    <label className="mb-1.5 block text-xs font-semibold text-ink2">{label}</label>
    {children}
  </div>
)
