Next.js port (incremental) of editor-ui NodeView components

This folder contains an incremental port of selected `packages/frontend/editor-ui` Vue components to Next.js (React). We start component-by-component, keeping styling and behavior as close as possible while adapting to React APIs.

Getting started
- pnpm i
- pnpm dev (runs Next.js dev server)

Notes
- Client-side components use the "use client" directive.
- Styling variables (e.g., CSS custom properties like `--color-canvas-read-only-line`) are referenced as-is; define them globally in your app theme if needed.
- For canvas features we use `reactflow`'s Background where applicable.
