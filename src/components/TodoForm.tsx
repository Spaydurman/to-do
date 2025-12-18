import * as React from 'react'
import { CATEGORIES, Category, Priority, TodoDraft, Stage } from '@/types'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select } from './ui/select'

interface TodoFormProps {
  initial?: Partial<TodoDraft>
  onSubmit: (draft: TodoDraft) => void
  onCancel?: () => void
}

export function TodoForm({ initial, onSubmit, onCancel }: TodoFormProps) {
  const [title, setTitle] = React.useState(initial?.title ?? '')
  const [description, setDescription] = React.useState(initial?.description ?? '')
  const [category, setCategory] = React.useState<Category>(initial?.category ?? 'other')
  const [priority, setPriority] = React.useState<Priority>(initial?.priority ?? Priority.Medium)
  const [stage] = React.useState<Stage>(initial?.stage ?? Stage.Backlog)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      completed: initial?.completed ?? false,
      category,
      priority,
      stage,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="desc">Description</Label>
        <textarea
          id="desc"
          className="input h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select id="category" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c[0].toUpperCase() + c.slice(1)}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            {Object.values(Priority).map((p) => (
              <option key={p} value={p}>
                {p[0].toUpperCase() + p.slice(1)}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
