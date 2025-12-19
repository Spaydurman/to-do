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
					'h-4 w-4 rounded border border-[hsl(var(--input))] text-[hsl(var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]',
					className,
				)}
				{...props}
			/>
		)
	},
)
Checkbox.displayName = 'Checkbox'
