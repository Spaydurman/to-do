import * as React from 'react'
import { motion } from 'framer-motion'
import { Priority, Todo } from '@/types'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from './ui/button'

interface TodoItemProps {
  todo: Todo
  index: number
  onToggle: (id: string) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  dragHandlers: {
    draggable: boolean
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void
    'data-index': number
  }
}

export function TodoItem({ todo, onToggle, onEdit, onDelete, dragHandlers }: TodoItemProps) {
  const priorityColor =
    todo.priority === Priority.High
      ? 'bg-red-500'
      : todo.priority === Priority.Medium
      ? 'bg-yellow-500'
      : 'bg-green-500'

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div
        className="card grid grid-cols-[auto_1fr_auto] items-center gap-3 p-4"
        {...dragHandlers}
      >
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={todo.status === 'done'}
          onChange={() => onToggle(todo.id)}
          aria-label="Toggle complete"
        />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={"inline-block h-2 w-2 rounded-full " + priorityColor} aria-hidden />
            <h3 className="font-medium">{todo.title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded border border-border px-2 py-0.5">{todo.category}</span>
            <span className="rounded border border-border px-2 py-0.5">{todo.priority}</span>
            <span className="rounded border border-border px-2 py-0.5">{todo.status}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(todo)}
            aria-label="Edit"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(todo.id)}
            aria-label="Delete"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
