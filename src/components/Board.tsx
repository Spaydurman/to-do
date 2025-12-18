import * as React from 'react'
import { AnimatePresence } from 'framer-motion'
import { Todo, Status } from '@/types'
import { TodoItem } from './TodoItem'

interface BoardProps {
  todos: Todo[]
  onChange: (todos: Todo[]) => void
  onToggle: (id: string) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
}

type DragData = {
  id: string
  fromStatus: Status
  fromIndex: number
}

function useColumns(todos: Todo[]) {
  const byStatus = React.useMemo(() => {
    return {
      new: todos.filter((t) => t.status === 'new'),
      ongoing: todos.filter((t) => t.status === 'ongoing'),
      done: todos.filter((t) => t.status === 'done'),
    } as Record<Status, Todo[]>
  }, [todos])
  return byStatus
}

export function Board({ todos, onChange, onToggle, onEdit, onDelete }: BoardProps) {
  const columns = useColumns(todos)
  const dragRef = React.useRef<DragData | null>(null)

  function onDragStart(status: Status, index: number, id: string) {
    dragRef.current = { id, fromStatus: status, fromIndex: index }
  }

  function handleDrop(targetStatus: Status, targetIndex: number) {
    const drag = dragRef.current
    if (!drag) return

    // Create fresh arrays
    const lists: Record<Status, Todo[]> = {
      new: columns.new.slice(),
      ongoing: columns.ongoing.slice(),
      done: columns.done.slice(),
    }

    // Remove from source
    const sourceList = lists[drag.fromStatus]
    const item = sourceList.splice(drag.fromIndex, 1)[0]
    if (!item) return

    // Insert into target and set status
    item.status = targetStatus
    const destList = lists[targetStatus]
    const idx = Math.max(0, Math.min(targetIndex, destList.length))
    destList.splice(idx, 0, item)

    // Recombine lists -> order by columns top-to-bottom left-to-right
    const next = [...lists.new, ...lists.ongoing, ...lists.done]
    onChange(next)
    dragRef.current = null
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {(['new', 'ongoing', 'done'] as Status[]).map((status) => (
        <Column
          key={status}
          title={status === 'new' ? 'New' : status === 'ongoing' ? 'On-going' : 'Done'}
          status={status}
          items={columns[status]}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onDragStart={onDragStart}
          onDropAt={handleDrop}
        />
      ))}
    </div>
  )
}

interface ColumnProps {
  title: string
  status: Status
  items: Todo[]
  onToggle: (id: string) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  onDragStart: (status: Status, index: number, id: string) => void
  onDropAt: (status: Status, index: number) => void
}

function Column({ title, status, items, onToggle, onEdit, onDelete, onDragStart, onDropAt }: ColumnProps) {
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
  }

  return (
    <div className="card min-h-[300px]">
      <div className="border-b border-border p-3">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="p-3 space-y-3" onDragOver={handleDragOver}>
        <AnimatePresence initial={false}>
          {items.map((todo, index) => (
            <div
              key={todo.id}
              onDragOver={handleDragOver}
              onDrop={(e) => {
                e.preventDefault()
                onDropAt(status, index)
              }}
            >
              <TodoItem
                todo={todo}
                index={index}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                dragHandlers={{
                  draggable: true,
                  onDragStart: () => onDragStart(status, index, todo.id),
                  onDragOver: handleDragOver,
                  onDrop: (e) => {
                    e.preventDefault()
                    onDropAt(status, index)
                  },
                  onDragEnd: () => {},
                  'data-index': index,
                }}
              />
            </div>
          ))}
        </AnimatePresence>
        {/* Drop at end */}
        <div
          className="h-8"
          onDrop={(e) => {
            e.preventDefault()
            onDropAt(status, items.length)
          }}
          onDragOver={handleDragOver}
        />
      </div>
    </div>
  )
}
