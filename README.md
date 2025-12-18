# Type-Safe Todo (React + TS + Tailwind)

A minimal, modern, and fully typed Todo app scaffold built with Vite, React, TypeScript, TailwindCSS, shadcn-like UI primitives, and Framer Motion. Todos and the user name persist in LocalStorage. Includes native HTML5 drag-and-drop for reordering.

## Tech Stack
- Vite + React + TypeScript
- TailwindCSS
- shadcn-like UI primitives (Button, Input, Label, Card, Dialog, Select)
- Framer Motion (animations)
- Native HTML5 drag-and-drop

## Features
- First-run name prompt stored in LocalStorage
- Typed Todo model with category (union) and priority (enum)
- CRUD for todos, controlled forms, and filters (status, category)
- Reorder with drag-and-drop; smooth animations
- Responsive, minimal UI

## Scripts
```bash
# Install deps
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure
- src/types.ts: TypeScript types (Category union, Priority enum, Todo)
- src/hooks/useLocalStorage.ts: Generic typed LocalStorage hook
- src/components/ui: Reusable primitives (shadcn-like)
- src/components: Feature components (UserNameForm, TodoForm, TodoList, etc.)
- src/App.tsx: App composition and state management

## Notes
- This scaffold focuses on type-safety, composition, and DX. You can swap the UI primitives for official shadcn/ui later if you prefer.
- Framer Motion handles list entrance/exit and layout transitions.