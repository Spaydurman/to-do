import * as React from 'react'
import { motion } from 'framer-motion'
import { STORAGE_KEYS, Todo, TodoDraft, FiltersState, Priority, Status } from '@/types'
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

  // Migrate existing todos without status
  React.useEffect(() => {
    if (todos.some((t) => (t as any).status === undefined)) {
      const migrated = todos.map((t) => ({
        ...t,
        status: t.completed ? ('done' as Status) : ('new' as Status),
      }))
      setTodos(migrated)
    }
  }, [])

  function addTodo(draft: TodoDraft) {
    const now = Date.now()
    const todo: Todo = { id: createTodoId(), createdAt: now, updatedAt: now, status: draft.status ?? 'new', ...draft }
    setTodos([todo, ...todos])
    setShowForm(false)
  }

  function updateTodo(id: string, draft: TodoDraft) {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, ...draft, updatedAt: Date.now() } : t))
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
              completed: t.status !== 'done',
              status: t.status === 'done' ? 'new' : 'done',
              updatedAt: Date.now(),
            }
          : t
      )
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
          <h1 className="text-2xl font-bold">Type-Safe Todo</h1>
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
