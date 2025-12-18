import * as React from 'react'
import { cn } from '../../utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	variant?: 'default' | 'secondary' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
	const base =
		'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors'
	const variantClass =
		variant === 'secondary'
			? 'border-transparent bg-secondary text-secondary-foreground'
			: variant === 'outline'
			? 'text-foreground'
			: 'border-transparent bg-primary text-primary-foreground'

	return <span className={cn(base, variantClass, className)} {...props} />
}
