import * as React from 'react'
import { AnimatePresence } from 'framer-motion'
import { STAGES, Stage, Todo } from '@/types'
import { TodoItem } from './TodoItem'
import { Card, CardContent, CardHeader } from './ui/card'

interface BoardProps {
  todos: Todo[]
  onChange: (todos: Todo[]) => void
  onToggle: (id: string) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  onToggleSubtask: (todoId: string, subtaskId: string) => void
  onAddSubtask: (todoId: string, title: string) => void
  onRemoveSubtask: (todoId: string, subtaskId: string) => void
  onCreate: (stage: Stage) => void
}

type DragData = {
  id: string
  fromStage: Stage
  fromIndex: number
}

function useColumns(todos: Todo[]) {
  const byStage = React.useMemo(() => {
    const map: Record<Stage, Todo[]> = {
      [Stage.Backlog]: [],
      [Stage.Todo]: [],
      [Stage.InProgress]: [],
      [Stage.Done]: [],
    }
    for (const t of todos) {
      map[t.stage]?.push(t)
    }
    return map
  }, [todos])
  return byStage
}

export function Board({
  todos,
  onChange,
  onToggle,
  onEdit,
  onDelete,
  onToggleSubtask,
  onAddSubtask,
  onRemoveSubtask,
  onCreate,
}: BoardProps) {
  const columns = useColumns(todos)
  const dragRef = React.useRef<DragData | null>(null)
  const [activeStage, setActiveStage] = React.useState<Stage | null>(null)

  function onDragStart(stage: Stage, index: number, id: string) {
    dragRef.current = { id, fromStage: stage, fromIndex: index }
  }

  function handleDrop(targetStage: Stage, targetIndex: number) {
    const drag = dragRef.current
    if (!drag) return

    const lists: Record<Stage, Todo[]> = {
      [Stage.Backlog]: columns[Stage.Backlog].slice(),
      [Stage.Todo]: columns[Stage.Todo].slice(),
      [Stage.InProgress]: columns[Stage.InProgress].slice(),
      [Stage.Done]: columns[Stage.Done].slice(),
    }

    const sourceList = lists[drag.fromStage]
    const item = sourceList.splice(drag.fromIndex, 1)[0]
    if (!item) return

    item.stage = targetStage
    const destList = lists[targetStage]
    const idx = Math.max(0, Math.min(targetIndex, destList.length))
    destList.splice(idx, 0, item)

    const next: Todo[] = [
      ...lists[Stage.Backlog],
      ...lists[Stage.Todo],
      ...lists[Stage.InProgress],
      ...lists[Stage.Done],
    ]
    onChange(next)
    dragRef.current = null
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {STAGES.map((stage) => (
        <Column
          key={stage}
          stage={stage}
          items={columns[stage]}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
          onDragStart={onDragStart}
          onDropAt={handleDrop}
          onToggleSubtask={onToggleSubtask}
          onAddSubtask={onAddSubtask}
          onRemoveSubtask={onRemoveSubtask}
          isActive={activeStage === stage}
          onHover={(s) => setActiveStage(s)}
          onCreate={onCreate}
        />
      ))}
    </div>
  )
}

interface ColumnProps {
  stage: Stage
  items: Todo[]
  onToggle: (id: string) => void
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
  onDragStart: (stage: Stage, index: number, id: string) => void
  onDropAt: (stage: Stage, index: number) => void
  onToggleSubtask: (todoId: string, subtaskId: string) => void
  onAddSubtask: (todoId: string, title: string) => void
  onRemoveSubtask: (todoId: string, subtaskId: string) => void
  isActive: boolean
  onHover: (stage: Stage | null) => void
  onCreate: (stage: Stage) => void
}

function Column({
  stage,
  items,
  onToggle,
  onEdit,
  onDelete,
  onDragStart,
  onDropAt,
  onToggleSubtask,
  onAddSubtask,
  onRemoveSubtask,
  isActive,
  onHover,
  onCreate,
}: ColumnProps) {
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    onHover(stage)
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    onHover(null)
  }

  // const stageBg = 
  //   stage === Stage.Backlog
  //     ? 'bg-white dark:bg-zinc-900/60'
  //     : stage === Stage.Todo
  //     ? 'bg-white dark:bg-zinc-900/50'
  //     : stage === Stage.InProgress
  //     ? 'bg-white dark:bg-zinc-900/50'
  //     : 'bg-white dark:bg-zinc-900/50'

  return (
    <Card
      className={
        'flex min-h-80 flex-col' +
        (isActive ? ' ring-1 ring-[hsl(var(--primary))]' : '')
      }
    >
      <CardHeader className="flex items-center justify-between">
        <h3 className="text-sm font-semibold leading-none tracking-tight">{stage}</h3>
        <button
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[hsl(var(--border))] text-xs font-medium text-[hsl(var(--foreground))] shadow-sm hover:bg-[hsl(var(--accent))]"
          type="button"
          onClick={() => onCreate(stage)}
        >
          +
        </button>
      </CardHeader>
      <CardContent
        className="flex-1 space-y-3 overflow-auto pt-4"
         onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDropAt(stage, items.length)
            onHover(null)
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
      >
        <AnimatePresence initial={false}>
          {items.map((todo, index) => (
            <div
              key={todo.id}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDropAt(stage, index)
                onHover(null)
              }}
            >
              <TodoItem
                todo={todo}
                index={index}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleSubtask={onToggleSubtask}
                onAddSubtask={onAddSubtask}
                onRemoveSubtask={onRemoveSubtask}
                dragHandlers={{
                  draggable: true,
                  onDragStart: () => onDragStart(stage, index, todo.id),
                  onDragOver: handleDragOver,
                  onDrop: (e) => {
                    e.preventDefault()
                    onDropAt(stage, index)
                  },
                  onDragEnd: () => {},
                  'data-index': index,
                }}
              />
            </div>
          ))}
        </AnimatePresence>
        <div
          className="mt-2 flex h-9 cursor-pointer items-center justify-center rounded-md border border-dashed border-[hsl(var(--border))] text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] hover:border-[hsl(var(--primary))]"
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDropAt(stage, items.length)
            onHover(null)
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => onCreate(stage)}
        >
          + Add new
        </div>
      </CardContent>
    </Card>
  )
}
