import * as React from 'react'
import { cn } from '../../utils/cn'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string
}

type OptionItem = {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

function parseOptions(children: React.ReactNode): OptionItem[] {
  const out: OptionItem[] = []
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    // Support <option> only (simple use cases in this app)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const type: any = child.type
    if (type === 'option') {
      const value = child.props.value ?? String(child.props.children ?? '')
      out.push({ value: String(value), label: child.props.children, disabled: !!child.props.disabled })
    }
    // Could add optgroup support here if needed
  })
  return out
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      children,
      value,
      defaultValue,
      onChange,
      disabled,
      name,
      id,
      placeholder = 'Select…',
      ...rest
    },
    ref
  ) => {
    const options = React.useMemo(() => parseOptions(children), [children])
    const [open, setOpen] = React.useState(false)
    const isControlled = value !== undefined && value !== null
    const firstValue = options[0]?.value ?? ''
    const [uncontrolledValue, setUncontrolledValue] = React.useState<string>(
      defaultValue != null ? String(defaultValue) : firstValue
    )
    const currentValue = isControlled ? String(value as string) : uncontrolledValue

    const selectRef = React.useRef<HTMLSelectElement | null>(null)
    const triggerRef = React.useRef<HTMLButtonElement | null>(null)
    const listRef = React.useRef<HTMLDivElement | null>(null)
    const wrapperRef = React.useRef<HTMLDivElement | null>(null)
    const mergedRef = React.useCallback(
      (node: HTMLSelectElement | null) => {
        selectRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<HTMLSelectElement | null>).current = node
      },
      [ref]
    )

    const [activeIndex, setActiveIndex] = React.useState<number>(() => {
      const idx = options.findIndex((o) => o.value === currentValue)
      return idx >= 0 ? idx : 0
    })

    React.useEffect(() => {
      // Keep active index in sync when value or options change
      const idx = options.findIndex((o) => o.value === currentValue)
      if (idx >= 0) setActiveIndex(idx)
    }, [currentValue, options])

    React.useEffect(() => {
      function onDocMouseDown(e: MouseEvent) {
        if (!open) return
        const el = wrapperRef.current
        if (el && e.target instanceof Node && !el.contains(e.target)) setOpen(false)
      }
      document.addEventListener('mousedown', onDocMouseDown)
      return () => document.removeEventListener('mousedown', onDocMouseDown)
    }, [open])

    React.useEffect(() => {
      if (open) listRef.current?.focus()
    }, [open])

    const label = React.useMemo(() => options.find((o) => o.value === currentValue)?.label, [options, currentValue])

    function commitValue(newValue: string) {
      if (!isControlled) setUncontrolledValue(newValue)
      if (selectRef.current) selectRef.current.value = newValue
      if (onChange && selectRef.current) {
        const event = {
          target: selectRef.current,
          currentTarget: selectRef.current,
        } as unknown as React.ChangeEvent<HTMLSelectElement>
        onChange(event)
      }
      setOpen(false)
      triggerRef.current?.focus()
    }

    function onTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
      if (disabled) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
    }

    function onListKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => {
          let ni = i
          do {
            ni = (ni + 1) % options.length
          } while (options[ni]?.disabled && ni !== i)
          return ni
        })
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => {
          let ni = i
          do {
            ni = (ni - 1 + options.length) % options.length
          } while (options[ni]?.disabled && ni !== i)
          return ni
        })
        return
      }
      if (e.key === 'Home') {
        e.preventDefault()
        setActiveIndex(0)
        return
      }
      if (e.key === 'End') {
        e.preventDefault()
        setActiveIndex(Math.max(0, options.length - 1))
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const opt = options[activeIndex]
        if (opt && !opt.disabled) commitValue(opt.value)
      }
    }

    // Simple typeahead (reset after 500ms)
    const typeahead = React.useRef('')
    const typeTimer = React.useRef<number | null>(null)
    function onTypeahead(key: string) {
      const ch = key.length === 1 ? key : ''
      if (!ch) return
      if (typeTimer.current) window.clearTimeout(typeTimer.current)
      typeahead.current += ch.toLowerCase()
      typeTimer.current = window.setTimeout(() => (typeahead.current = ''), 500)
      const idx = options.findIndex((o) =>
        String(o.label ?? '').toLowerCase().startsWith(typeahead.current)
      )
      if (idx >= 0) setActiveIndex(idx)
    }

    function onListKeyPress(e: React.KeyboardEvent<HTMLDivElement>) {
      if (!e.ctrlKey && !e.metaKey && !e.altKey) onTypeahead(e.key)
    }

    const listId = React.useId()

    return (
      <div ref={wrapperRef} className="relative">
        {/* Visually hidden native select to preserve forms and refs */}
        <select
          ref={mergedRef}
          name={name}
          id={id}
          disabled={disabled}
          defaultValue={isControlled ? undefined : uncontrolledValue}
          value={isControlled ? currentValue : undefined}
          onChange={onChange}
          className="sr-only"
          aria-hidden
          tabIndex={-1}
          {...rest}
        >
          {children}
        </select>

        {/* Trigger */}
        <button
          ref={triggerRef}
          type="button"
          className={cn(
            'input w-full items-center justify-between gap-2 px-3 py-0 text-left inline-flex',
            disabled && 'opacity-50 pointer-events-none',
            className
          )}
          role="combobox"
          aria-controls={listId}
          aria-expanded={open}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
          onKeyDown={onTriggerKeyDown}
        >
          <span className={cn('truncate select-none', !label && 'text-[hsl(var(--muted-foreground))]')}>
            {label ?? placeholder}
          </span>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-4 w-4 opacity-70"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && options.length > 0 && (
          <div
            id={listId}
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={`${listId}-opt-${activeIndex}`}
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-lg focus:outline-none"
            onKeyDown={onListKeyDown}
            onKeyPress={onListKeyPress}
          >
            {options.map((opt, i) => {
              const selected = currentValue === opt.value
              const active = i === activeIndex
              return (
                <div
                  id={`${listId}-opt-${i}`}
                  key={opt.value}
                  role="option"
                  aria-selected={selected}
                  data-active={active || undefined}
                  className={cn(
                    'flex cursor-pointer select-none items-center justify-between px-3 py-2 text-sm',
                    active ? 'bg-[hsl(var(--accent))]' : 'bg-transparent',
                    selected ? 'font-medium' : 'font-normal',
                    opt.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  onMouseEnter={() => !opt.disabled && setActiveIndex(i)}
                  onClick={() => !opt.disabled && commitValue(opt.value)}
                >
                  <span className="truncate">{opt.label}</span>
                  {selected && (
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="h-4 w-4 opacity-80"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'
