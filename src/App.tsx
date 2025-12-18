import * as React from 'react'
import { motion } from 'framer-motion'
import { STORAGE_KEYS, Todo, TodoDraft, Priority, Stage, SubTask } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UserNameForm } from '@/components/UserNameForm'
import { TodoForm } from '@/components/TodoForm'
import { Board } from '@/components/Board'

function createTodoId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export default function App() {
  const [name, setName] = useLocalStorage<string>(STORAGE_KEYS.name, '')
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEYS.todos, [])
  const [editing, setEditing] = React.useState<Todo | null>(null)
  const [showForm, setShowForm] = React.useState(false)

  // Migrate existing todos from older shapes (status-based, no stage/subtasks)
  React.useEffect(() => {
    if (!todos.some((t) => (t as any).stage === undefined || (t as any).subtasks === undefined)) {
      return
    }

    const migrated = todos.map((t) => {
      const anyTodo = t as any
      const existingStage: Stage | undefined = anyTodo.stage
      const legacyStatus: string | undefined = anyTodo.status
      let stage: Stage
      if (existingStage) {
        stage = existingStage
      } else if (legacyStatus === 'ongoing') {
        stage = Stage.InProgress
      } else if (legacyStatus === 'done' || t.completed) {
        stage = Stage.Done
      } else if (legacyStatus === 'new') {
        stage = Stage.Backlog
      } else {
        stage = Stage.Backlog
      }

      const subtasks: SubTask[] = Array.isArray(anyTodo.subtasks)
        ? anyTodo.subtasks
        : []

      return {
        ...t,
        stage,
        subtasks,
      }
    })
    setTodos(migrated)
  // we intentionally run this once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function addTodo(draft: TodoDraft) {
    const now = Date.now()
    const todo: Todo = {
      id: createTodoId(),
      createdAt: now,
      updatedAt: now,
      stage: draft.stage ?? Stage.Backlog,
      subtasks: draft.subtasks ?? [],
      ...draft,
    }
    setTodos([todo, ...todos])
    setShowForm(false)
  }

  function updateTodo(id: string, draft: TodoDraft) {
    setTodos(
      todos.map((t) =>
        t.id === id
          ? {
              ...t,
              ...draft,
              stage: draft.stage ?? t.stage,
              subtasks: draft.subtasks ?? t.subtasks,
              updatedAt: Date.now(),
            }
          : t,
        ),
    )
    setEditing(null)
  }

  function deleteTodo(id: string) {
    setTodos(todos.filter((t) => t.id !== id))
  }

  function toggleTodo(id: string) {
    setTodos(
      todos.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: t.stage !== Stage.Done,
              stage: t.stage === Stage.Done ? Stage.Todo : Stage.Done,
              updatedAt: Date.now(),
            }
          : t,
        ),
    )
  }

  function toggleSubtask(todoId: string, subtaskId: string) {
    setTodos(
      todos.map((t) => {
        if (t.id !== todoId) return t
        return {
          ...t,
          subtasks: t.subtasks.map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s,
          ),
          updatedAt: Date.now(),
        }
      }),
    )
  }

  function createSubtaskId() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36)
  }

  function addSubtask(todoId: string, title: string) {
    setTodos(
      todos.map((t) =>
        t.id === todoId
          ? {
              ...t,
              subtasks: [
                ...t.subtasks,
                { id: createSubtaskId(), title, completed: false },
              ],
              updatedAt: Date.now(),
            }
          : t,
        ),
    )
  }

  function removeSubtask(todoId: string, subtaskId: string) {
    setTodos(
      todos.map((t) =>
        t.id === todoId
          ? {
              ...t,
              subtasks: t.subtasks.filter((s) => s.id !== subtaskId),
              updatedAt: Date.now(),
            }
          : t,
        ),
    )
  }

  function onEdit(todo: Todo) {
    setEditing(todo)
  }

  return (
    <div className="w-screen h-screen p-4 overflow-hidden">
      <div className="flex h-full flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Todo</h1>
          <p className="text-muted-foreground">
            {name ? `Hello, ${name}!` : 'Welcome!'}
          </p>
        </div>
      </header>

      <motion.div layout className="flex-1 overflow-auto">
        <Board
          todos={todos}
          onChange={setTodos}
          onToggle={toggleTodo}
          onEdit={onEdit}
          onDelete={deleteTodo}
          onToggleSubtask={toggleSubtask}
          onAddSubtask={addSubtask}
          onRemoveSubtask={removeSubtask}
        />
      </motion.div>

      {/* Create */}
      {showForm && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4" onClick={() => setShowForm(false)}>
          <div className="card w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Add Todo</h2>
            </div>
            <div className="p-4">
              <TodoForm onSubmit={addTodo} onCancel={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Edit */}
      {editing && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <div className="card w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Edit Todo</h2>
            </div>
            <div className="p-4">
              <TodoForm
                initial={editing}
                onSubmit={(draft) => updateTodo(editing.id, draft)}
                onCancel={() => setEditing(null)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Ask user name on first open */}
      <UserNameForm name={name} onSubmit={setName} />
      <Button
        variant="primary"
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setShowForm(true)}
        aria-label="Add Todo"
        title="Add Todo"
      >
        <Plus className="h-6 w-6 text-primary-foreground" />
      </Button>
      </div>
    </div>
  )
}
