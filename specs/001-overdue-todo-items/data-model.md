# Data Model: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items`
**Phase**: 1 — Design

---

## Entities

### Todo (Existing — No Schema Changes)

The existing `todos` table schema is sufficient for this feature. No new columns, tables, or migrations are required.

| Field | Type | Constraints | Changed? |
|-------|------|-------------|---------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | No |
| `title` | TEXT | NOT NULL, max 255 chars | No |
| `dueDate` | TEXT | Nullable; ISO date string `YYYY-MM-DD` | No |
| `completed` | BOOLEAN | DEFAULT 0; stored as integer (0 or 1) | No |
| `createdAt` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | No |

---

## Computed Properties

### `isOverdue` — Display-Time Derived Attribute

**Not stored in the database.** Evaluated at render time in the frontend component.

| Property | Type | Formula |
|----------|------|---------|
| `isOverdue` | `boolean` | `dueDate !== null && dueDate < todayString && !completed` |

Where `todayString` = current local date as `YYYY-MM-DD`, derived from:
```js
new Date().toISOString().split('T')[0]
```

### Truth Table

| `dueDate` | `completed` | `isOverdue` | Reason |
|-----------|------------|-------------|--------|
| `null` | any | `false` | No due date → never overdue (FR-004) |
| past date | `0` / `false` | `true` | Incomplete + past due → overdue (FR-001) |
| past date | `1` / `true` | `false` | Completed → never overdue (FR-003) |
| today | `false` | `false` | Today is not overdue (FR-005, edge case) |
| future date | `false` | `false` | Future due date → not overdue (FR-005) |

---

## State Transitions

Overdue state is **recalculated on every render** of `TodoCard`. There is no stored state to transition.

The key user-visible transitions are:

```
[incomplete + past due date]
        │
        ▼ user checks "complete"
[completed + past due date]   ← isOverdue = false (FR-006)
        │
        ▼ user unchecks "complete"
[incomplete + past due date]  ← isOverdue = true (FR-006)
```

No page reload is required — React re-renders `TodoCard` whenever `todo.completed` changes, which triggers a fresh `isOverdue()` evaluation.

---

## Validation Rules

- `dueDate` comparison uses ISO string format only: `'YYYY-MM-DD' < 'YYYY-MM-DD'` is lexicographically correct.
- `completed` is stored as SQLite integer (0 or 1). The `isOverdue` function treats both `0` and `false` as incomplete.
- The `isOverdue` function is a pure function: no mutations, no side effects, no external calls.

---

## Frontend Component Contract

### `TodoCard` Props (Unchanged)

| Prop | Type | Description |
|------|------|-------------|
| `todo` | object | Todo object with `id`, `title`, `dueDate`, `completed`, `createdAt` |
| `onToggle` | function | Called with `todo.id` when checkbox is changed |
| `onEdit` | function | Called with `(id, title, dueDate)` when edit is saved |
| `onDelete` | function | Called with `todo.id` when delete is confirmed |
| `isLoading` | boolean | Disables interactive elements during async operations |

### `TodoCard` Rendering Contract (Extended)

When `isOverdue(todo.dueDate, todo.completed)` is `true`:
- The card root element receives class `todo-card overdue` (in addition to existing classes)
- A `<span className="todo-overdue-badge">Overdue</span>` is rendered inside `.todo-content`
- The badge is placed after the title and before the due date

When `isOverdue` is `false`:
- Rendering is identical to pre-feature behavior (no regressions)
