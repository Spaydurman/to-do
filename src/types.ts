export type Category =
  | 'work'
  | 'personal'
  | 'shopping'
  | 'learning'
  | 'health'
  | 'other'

export const CATEGORIES: Category[] = [
  'work',
  'personal',
  'shopping',
  'learning',
  'health',
  'other',
]

export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export type Status = 'new' | 'ongoing' | 'done'

export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  category: Category
  priority: Priority
  status: Status
  createdAt: number
  updatedAt: number
}

export type TodoDraft = Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
  status?: Status
}

export interface FiltersState {
  status: 'all' | 'active' | 'completed'
  category: 'all' | Category
}

export const STORAGE_KEYS = {
  name: 'ts_todo:name',
  todos: 'ts_todo:items',
} as const
