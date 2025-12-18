import * as React from 'react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'

    const variantClass =
      variant === 'default'
        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
        : variant === 'secondary'
        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        : variant === 'outline'
        ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
        : variant === 'destructive'
        ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
        : 'bg-transparent hover:bg-accent hover:text-accent-foreground'

    const sizeClass =
      size === 'sm'
        ? 'h-8 px-3'
        : size === 'lg'
        ? 'h-11 px-8 text-base'
        : size === 'icon'
        ? 'h-9 w-9 p-0'
        : 'h-9 px-4'

    return (
      <button ref={ref} className={cn(base, variantClass, sizeClass, className)} {...props} />
    )
  }
)
Button.displayName = 'Button'
