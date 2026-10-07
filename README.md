# React To-Do List

A to-do list application built with **React** and **SCSS modules**, using the
[JSONPlaceholder](https://jsonplaceholder.typicode.com/todos) API as its data source.
No UI libraries or CSS frameworks are used.

## Features

- Loads todos from the API with loading, error and retry states
- Add, edit (inline, Enter to save / Esc to cancel, or double-click the title), complete and delete todos
- Filter by **All / Active / Completed** with live counts
- Debounced search
- Client-side pagination (10 per page)
- Progress summary and "Clear completed"
- Optimistic UI updates with automatic rollback and a dismissible notice if a request fails
- Responsive light layout, keyboard and screen-reader friendly

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev       # start the dev server at http://localhost:5173
npm run build     # production build into dist/
npm run preview   # preview the production build
npm run lint      # lint with oxlint
```

## Project structure

```
src/
├── api/
│   └── todoApi.js            # fetch wrapper + CRUD calls to JSONPlaceholder
├── context/
│   ├── TodoContext.js        # React context object
│   ├── TodoProvider.jsx      # provides todo state + actions to the tree
│   └── todoReducer.js        # pure reducer and action types
├── hooks/
│   ├── useTodos.js           # useReducer + async actions (optimistic updates)
│   ├── useTodoContext.js     # safe consumer hook for the context
│   └── useDebounce.js        # debounces the search input
├── components/
│   ├── ui/                   # generic, reusable building blocks
│   │   ├── Button/  Checkbox/  TextInput/  Icon/
│   │   └── Loader/  ErrorMessage/  EmptyState/
│   └── todo/                 # feature components
│       ├── TodoPage/         # composes the screen, owns filter/search/page state
│       ├── Header/  TodoForm/  TodoFilters/
│       ├── TodoList/  TodoItem/
│       └── TodoStats/  Pagination/
├── styles/
│   ├── _variables.scss       # spacing, radii, breakpoints
│   ├── _mixins.scss          # focus ring, media query, helpers
│   └── global.scss           # reset + theme CSS custom properties
└── utils/
    ├── todoHelpers.js        # filtering, stats, pagination, validation
    └── cx.js                 # className joiner
```

## Design decisions

**State management: `useReducer` + Context.**
Todo data is shared across several components (form, list, filters, stats), so it lives in a
single reducer exposed through context. The reducer is pure and easy to reason about; all
side effects (API calls) live in the `useTodos` hook. A dedicated library like Redux would
be overkill for an app of this size.

**Server state vs. UI state.**
The todo list and request status live in context. View-only state such as the active
filter, search query and current page lives locally in `TodoPage`, because no other part
of the app needs it. Derived data (filtered list, stats, current page slice) is computed
with `useMemo` instead of being stored, so it can never get out of sync.

**Optimistic updates.**
Changes are applied to the UI immediately and the API call happens in the background. If
the request fails, the change is reverted and a notice is shown. This keeps the app feeling
instant despite network latency.

**Reusable components.**
`components/ui` contains generic, presentational components (`Button` with variants and
sizes, `TextInput` with label/error/icon support, accessible `Checkbox`, etc.) that know
nothing about todos. `components/todo` contains feature components that compose them.

**Performance.**
`TodoItem` is wrapped in `React.memo` and receives stable callbacks (`useCallback`), so
toggling one todo doesn't re-render the others. The context value is memoized, and the
search input is debounced so filtering doesn't run on every keystroke.

**Styling.**
SCSS modules give locally scoped class names per component. Colors live as CSS custom
properties in a single light theme. Shared spacing, breakpoints and mixins come from
`styles/`.

**Accessibility.**
All inputs have labels (visually hidden where the design doesn't show one), icon buttons
have `aria-label`s, filter buttons use `aria-pressed`, pagination uses `aria-current`,
errors use `role="alert"`, and there are visible focus styles for keyboard users.

## JSONPlaceholder limitations

JSONPlaceholder is a fake API: write requests (`POST`, `PATCH`, `DELETE`) return a
successful response but **nothing is actually saved** on the server. Because of this:

- Every `POST` returns `id: 201`. New todos are given a unique client-side id
  (`local-<uuid>`) so React keys stay unique when several todos are added.
- Todos created in the app only exist locally (flagged `isLocal`), so they skip the
  `PATCH`/`DELETE` network calls, which would return 404/500 for ids the server doesn't know.
- Refreshing the page reloads the original 200 todos from the API.

## Deployment

The project deploys to [Vercel](https://vercel.com) with zero configuration: import the
repository and Vercel detects Vite automatically (build command `npm run build`, output
directory `dist`).
