import * as React from 'react'
import { cn } from '../../utils/cn'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, ...props }, ref) => {
		return (
			<input
				ref={ref}
				type="checkbox"
				className={cn(
					'relative inline-flex h-4 w-4 items-center justify-center rounded border border-[hsl(var(--input))] bg-transparent text-[hsl(var(--primary-foreground))] appearance-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] disabled:opacity-50 disabled:cursor-not-allowed checked:bg-[hsl(var(--primary))] checked:border-[hsl(var(--primary))] after:content-[""] after:hidden checked:after:block after:absolute after:h-2 after:w-1 after:border-r-2 after:border-b-2 after:border-[hsl(var(--primary-foreground))] after:rotate-45',
					className,
				)}
				{...props}
			/>
		)
	},
)
Checkbox.displayName = 'Checkbox'
