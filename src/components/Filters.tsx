import * as React from 'react'
import { CATEGORIES, Category, FiltersState } from '@/types'
import { Select } from './ui/select'

interface FiltersProps {
  value: FiltersState
  onChange: (value: FiltersState) => void
}

export function Filters({ value, onChange }: FiltersProps) {
  function set<K extends keyof FiltersState>(key: K, val: FiltersState[K]) {
    onChange({ ...value, [key]: val })
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
      <div>
        <label className="label mb-1 block">Status</label>
        <Select value={value.status} onChange={(e) => set('status', e.target.value as FiltersState['status'])}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </Select>
      </div>
      <div>
        <label className="label mb-1 block">Category</label>
        <Select value={value.category} onChange={(e) => set('category', e.target.value as Category | 'all')}>
          <option value="all">All</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c[0].toUpperCase() + c.slice(1)}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
