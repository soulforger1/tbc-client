import { cn } from '@/lib/utils'

export const Table = ({ className, children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto">
    <table className={cn('w-full text-sm', className)} {...props}>
      {children}
    </table>
  </div>
)

export const TableHead = ({ children }: { children: React.ReactNode }) => (
  <thead>
    <tr className="border-b border-edge">{children}</tr>
  </thead>
)

export const Th = ({
  children, right, center, className, ...props
}: React.ThHTMLAttributes<HTMLTableCellElement> & { right?: boolean; center?: boolean }) => (
  <th
    className={cn(
      'pb-3 text-xs font-medium text-ink4',
      center ? 'w-24 text-center' : right ? 'pr-4 text-right' : 'pr-4 text-left',
      className
    )}
    {...props}
  >
    {children}
  </th>
)

export const TableBody = ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className="divide-y divide-edge" {...props}>{children}</tbody>
)

export const TableRow = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn('hover:bg-muted/40 transition-colors', className)} {...props}>
    {children}
  </tr>
)

export const Td = ({
  children, right, center, className, ...props
}: React.TdHTMLAttributes<HTMLTableCellElement> & { right?: boolean; center?: boolean }) => (
  <td
    className={cn('py-3', center ? 'text-center' : right ? 'pr-4 text-right' : 'pr-4', className)}
    {...props}
  >
    {children}
  </td>
)
