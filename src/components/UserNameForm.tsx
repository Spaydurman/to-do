import * as React from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface UserNameFormProps {
  name: string
  onSubmit: (name: string) => void
}

export function UserNameForm({ name, onSubmit }: UserNameFormProps) {
  const [value, setValue] = React.useState(name)
  const open = !name

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) onSubmit(trimmed)
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogHeader>
        <h2 className="text-lg font-semibold">Welcome!</h2>
      </DialogHeader>
      <DialogContent>
        <form id="username-form" onSubmit={handleSubmit} className="space-y-2">
          <Label htmlFor="name">Enter your name</Label>
          <Input
            id="name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Your name"
            autoFocus
          />
        </form>
      </DialogContent>
      <DialogFooter className="flex items-center justify-end gap-2">
        <Button form="username-form" type="submit">Save</Button>
      </DialogFooter>
    </Dialog>
  )
}
