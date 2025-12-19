import * as React from 'react'
import { motion } from 'framer-motion'
import { Priority, Todo, SubTask } from '@/types'
import { Pencil, Trash2, X, Plus } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Checkbox } from './ui/checkbox'
import { cn } from '@/utils/cn'

interface TodoItemProps {
  todo: Todo
  index: number
  onToggle: (id: string) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  onToggleSubtask: (todoId: string, subtaskId: string) => void
  onAddSubtask: (todoId: string, title: string) => void
  onRemoveSubtask: (todoId: string, subtaskId: string) => void
  dragHandlers: {
    draggable: boolean
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void
    'data-index': number
  }
}

  export function TodoItem({
    todo,
    onToggle,
    onEdit,
    onDelete,
    onToggleSubtask,
    onAddSubtask,
    onRemoveSubtask,
    dragHandlers,
  }: TodoItemProps) {
  const [newSubTitle, setNewSubTitle] = React.useState('')
  const [isDragging, setIsDragging] = React.useState(false)

  const priorityColor =
    todo.priority === Priority.Critical
      ? 'bg-red-600'
      : todo.priority === Priority.High
      ? 'bg-orange-500'
      : todo.priority === Priority.Medium
      ? 'bg-yellow-500'
      : 'bg-emerald-500'

  function handleAddSubtask(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = newSubTitle.trim()
    if (!trimmed) return
    onAddSubtask(todo.id, trimmed)
    setNewSubTitle('')
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <Card
        draggable={dragHandlers.draggable}
        data-index={dragHandlers['data-index']}
        onDragStart={(e) => {
          setIsDragging(true)
          dragHandlers.onDragStart(e)
        }}
        onDragOver={dragHandlers.onDragOver}
        onDrop={dragHandlers.onDrop}
        onDragEnd={(e) => {
          setIsDragging(false)
          dragHandlers.onDragEnd(e)
        }}
        className={cn(
          'cursor-grab active:cursor-grabbing transition-colors',
          isDragging && 'ring-1 ring-[hsl(var(--primary))]'
        )}
      >
        <CardContent className="space-y-3 pt-4">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  className={
                    'capitalize flex items-center gap-2 bg-opacity-90 text-xs font-semibold text-white ' +
                    priorityColor
                  }
                >
                  {todo.priority}
                </Badge>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">{todo.stage}</span>
              </div>
              <h3 className="text-sm font-semibold leading-tight">{todo.title}</h3>
              {todo.description && (
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{todo.description}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Checkbox
                checked={todo.stage === 'Done'}
                onChange={() => onToggle(todo.id)}
                aria-label="Toggle done"
              />
              <div className="flex items-center gap-1">
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
          </div>

          {todo.subtasks.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-[hsl(var(--muted-foreground))]">Sub-tasks</p>
              <div className="space-y-1">
                {todo.subtasks.map((sub: SubTask) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <label className="flex items-center gap-2">
                      <Checkbox
                        checked={sub.completed}
                        onChange={() => onToggleSubtask(todo.id, sub.id)}
                      />
                      <span
                        className={
                          sub.completed
                            ? 'text-[hsl(var(--muted-foreground))] line-through'
                            : 'text-[hsl(var(--foreground))]'
                        }
                      >
                        {sub.title}
                      </span>
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveSubtask(todo.id, sub.id)}
                      aria-label="Remove subtask"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleAddSubtask} className="mt-2 flex items-center gap-2">
            <input
              className="flex-1 rounded-md border border-[hsl(var(--input))] bg-transparent px-2 py-1 text-xs shadow-sm text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
              placeholder="Add sub-task"
              value={newSubTitle}
              onChange={(e) => setNewSubTitle(e.target.value)}
            />
            <Button type="submit" size="icon" variant="outline" aria-label="Add subtask">
              <Plus className="h-3 w-3" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
