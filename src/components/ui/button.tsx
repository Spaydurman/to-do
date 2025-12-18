import * as React from 'react'
import { cn } from '../../utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variantClass =
      variant === 'primary'
        ? 'btn btn-primary'
        : variant === 'secondary'
        ? 'btn btn-secondary'
        : variant === 'outline'
        ? 'btn btn-outline'
        : 'btn bg-destructive text-destructive-foreground hover:opacity-90'

    const sizeClass =
      size === 'sm'
        ? 'h-8 px-3'
        : size === 'lg'
        ? 'h-12 px-6 text-base'
        : size === 'icon'
        ? 'h-10 w-10 p-0'
        : 'h-10 px-4'

    return (
      <button ref={ref} className={cn(variantClass, sizeClass, className)} {...props} />
    )
  }
)
Button.displayName = 'Button'
