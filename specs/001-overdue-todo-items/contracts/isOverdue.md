# Contract: `isOverdue` Utility Function

**Package**: `packages/frontend`
**File**: `src/utils/todoUtils.js`
**Consumer**: `packages/frontend/src/components/TodoCard.js`

---

## Signature

```js
/**
 * Determines whether a todo item is overdue.
 *
 * A todo is overdue when ALL of the following are true:
 *   1. dueDate is a non-empty string
 *   2. dueDate is strictly before today's date (YYYY-MM-DD string comparison)
 *   3. completed is falsy (0, false, null, undefined)
 *
 * @param {string|null} dueDate - ISO date string ('YYYY-MM-DD') or null/undefined
 * @param {boolean|number} completed - Whether the todo is completed (truthy = done)
 * @returns {boolean} true if the todo is overdue, false otherwise
 */
function isOverdue(dueDate, completed)
```

---

## Input/Output Table

| `dueDate` | `completed` | Returns | Reason |
|-----------|------------|---------|--------|
| `null` | any | `false` | No due date, never overdue |
| `undefined` | any | `false` | No due date, never overdue |
| `''` | any | `false` | No due date, never overdue |
| `'2025-01-01'` | `false` | `true` | Past date, incomplete |
| `'2025-01-01'` | `0` | `true` | Past date, SQLite integer false |
| `'2025-01-01'` | `true` | `false` | Completed |
| `'2025-01-01'` | `1` | `false` | Completed, SQLite integer true |
| today's date | `false` | `false` | Today is NOT overdue |
| future date | `false` | `false` | Future date, not overdue |

---

## Guarantees

- **Pure function**: no side effects, no external dependencies, no mutation
- **Timezone-safe**: uses `YYYY-MM-DD` string comparison only; no `Date` object parsing of `dueDate`
- **Null-safe**: returns `false` for any falsy `dueDate` value
- **SQLite-safe**: treats both `0` and `false` as incomplete; both `1` and `true` as completed
- **Deterministic**: given the same inputs and the same current date, always returns the same result

---

## Non-Goals

- Does NOT modify the todo object
- Does NOT make API calls
- Does NOT determine visual styling (that is the caller's responsibility)
- Does NOT cache or memoize results (re-evaluated on each render)
