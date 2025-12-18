import * as React from 'react'
import { AnimatePresence } from 'framer-motion'
import { Todo } from '@/types'
import { TodoItem } from './TodoItem'
import { reorderImmutable } from '@/utils/reorder'

interface TodoListProps {
  todos: Todo[]
  onChangeOrder: (todos: Todo[]) => void
  onToggle: (id: string) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
}

export function TodoList({ todos, onChangeOrder, onToggle, onEdit, onDelete }: TodoListProps) {
  const dragIndex = React.useRef<number | null>(null)

  function onDragStart(e: React.DragEvent<HTMLDivElement>) {
    const idx = Number(e.currentTarget.getAttribute('data-index'))
    dragIndex.current = idx
    e.dataTransfer.effectAllowed = 'move'
  }
  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const from = dragIndex.current
    const to = Number(e.currentTarget.getAttribute('data-index'))
    if (from === null || Number.isNaN(to) || from === to) return
    const reordered = reorderImmutable(todos, from, to)
    onChangeOrder(reordered)
    dragIndex.current = null
  }
  function onDragEnd() {
    dragIndex.current = null
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            index={index}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            dragHandlers={{
              draggable: true,
              onDragStart,
              onDragOver,
              onDrop,
              onDragEnd,
              'data-index': index,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
