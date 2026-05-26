# Quickstart: Overdue Todo Items Feature

**Feature Branch**: `001-overdue-todo-items`
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

---

## Prerequisites

- Node.js ≥ v16
- npm ≥ v7 (for workspaces support)

---

## Running the App

```bash
# From repo root — installs all workspace dependencies
npm install

# Start both frontend and backend
npm run start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3030

---

## Manually Testing the Overdue Feature

1. Open http://localhost:3000
2. Create a todo with a **past due date** (e.g., `2025-01-01`) and leave it incomplete
   - Verify: card has a red/orange border, red "Overdue" badge appears below the title
3. Create a todo with **today's date** as the due date
   - Verify: no overdue indicator (today is not overdue)
4. Create a todo with a **future due date**
   - Verify: no overdue indicator
5. Create a todo with **no due date**
   - Verify: no overdue indicator
6. Mark the overdue todo from step 2 as **complete** (check the checkbox)
   - Verify: overdue badge disappears immediately (no reload)
7. **Uncheck** the completed overdue todo
   - Verify: overdue badge reappears immediately

---

## Running Tests

```bash
# All tests from repo root
npm test

# Frontend tests only (with coverage)
cd packages/frontend && npm test

# Backend tests only
cd packages/backend && npm test
```

### Coverage Requirement

The project must maintain **≥80% coverage** across all packages. After implementation, verify:

```bash
# Coverage report is printed at end of test run
npm test
```

---

## Key Files for This Feature

| File | Status | Description |
|------|--------|-------------|
| `packages/frontend/src/utils/todoUtils.js` | **NEW** | `isOverdue(dueDate, completed)` pure utility |
| `packages/frontend/src/utils/__tests__/todoUtils.test.js` | **NEW** | Unit tests for `isOverdue` |
| `packages/frontend/src/components/TodoCard.js` | **MODIFY** | Render overdue CSS class + "Overdue" badge |
| `packages/frontend/src/components/__tests__/TodoCard.test.js` | **MODIFY** | Add overdue rendering test scenarios |
| `packages/frontend/src/App.css` | **MODIFY** | `.todo-card.overdue` and `.todo-overdue-badge` styles |
| `packages/frontend/src/styles/theme.css` | **MODIFY** | Add `--overdue-bg` design token (light + dark) |

---

## Architecture Summary

```
[TodoCard renders]
        │
        ▼
isOverdue(todo.dueDate, todo.completed)
        │
   ┌────┴────┐
  true     false
   │         │
   ▼         ▼
add class  normal
'overdue'  render
render
"Overdue"
badge
```

No backend changes. No API changes. No database schema changes.
