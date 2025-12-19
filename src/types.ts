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
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export enum Stage {
  Backlog = 'Backlog',
  Todo = 'Todo',
  InProgress = 'InProgress',
  Done = 'Done',
}

export const STAGES: Stage[] = [Stage.Backlog, Stage.Todo, Stage.InProgress, Stage.Done]

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  category: Category
  priority: Priority
  stage: Stage
  subtasks: SubTask[]
  createdAt: number
  updatedAt: number
}

export type TodoDraft = Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'stage' | 'subtasks'> & {
  stage?: Stage
  subtasks?: SubTask[]
}

export interface FiltersState {
  status: 'all' | 'active' | 'completed'
  category: 'all' | Category
}

export const STORAGE_KEYS = {
  name: 'ts_todo:name',
  todos: 'ts_todo:items',
} as const

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export const THEME_STORAGE_KEY = 'ts_todo:theme'
