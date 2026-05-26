# Research: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items`
**Phase**: 0 — Research

---

## 1. Overdue Computation: Client-Side vs. Server-Side

**Decision**: Compute overdue state client-side in a pure utility function `isOverdue(dueDate, completed)` located at `packages/frontend/src/utils/todoUtils.js`.

**Rationale**: The spec explicitly states overdue status is a "display-time calculation" not stored in the database. The backend API already returns `dueDate` and `completed` on every todo object. Client-side computation avoids any backend changes, keeps the feature fully frontend-scoped, and naturally re-evaluates on every render — automatically reflecting day-boundary transitions.

**Alternatives considered**:
- Store `isOverdue` as a DB column: rejected — violates spec assumption ("display-time, not persisted"), adds sync and staleness complexity
- Compute in backend and include in API response: rejected — couples display logic to the API layer and contradicts the spec's stated assumption

---

## 2. Date Comparison Strategy

**Decision**: Use ISO string comparison. Compare `dueDate` (already stored as `YYYY-MM-DD`) against today's date derived from `new Date().toISOString().split('T')[0]`.

**Rationale**: `YYYY-MM-DD` string comparison is lexicographically correct and avoids timezone parsing bugs. The spec says "strictly before today" — string comparison `dueDate < todayString` satisfies this precisely and deterministically.

**Implementation**:
```js
function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
  return dueDate < today;
}
```

**Alternatives considered**:
- `new Date(dueDate) < new Date()`: rejected — `new Date('2026-05-25')` parses as UTC midnight, creating a timezone bug where "yesterday" appears as "today" for users in UTC+ timezones
- Moment.js or date-fns: rejected — adds a new runtime dependency, constitution requires justification; string comparison suffices here

---

## 3. Color Tokens for Overdue Indicator

**Decision**: Use existing `--danger-color` token for the badge text and card border highlight. Add a new design token `--overdue-bg` for the card background tint.

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--danger-color` | `#c62828` (existing) | `#ef5350` (existing) |
| `--overdue-bg` | `rgba(198, 40, 40, 0.06)` (new) | `rgba(239, 83, 80, 0.10)` (new) |

**Rationale**: `--danger-color` is already defined for both light and dark themes and semantically matches the "overdue = danger" concept. A separate `--overdue-bg` token provides a subtle background tint that is visually distinct from `--bg-surface` and `--bg-primary`, without reusing an existing token for a different semantic meaning. Adding it as a token (not a hardcoded value) maintains compliance with Constitution Principle IV.

**Alternatives considered**:
- Reuse `--color-primary` (Halloween orange): rejected — primary orange is used for interactive elements; reusing it reduces visual distinction for overdue vs. normal primary actions
- Hardcoded hex values: rejected — prohibited by Constitution Principle IV ("hardcoded hex values outside the design system are prohibited")

---

## 4. Accessibility Implementation

**Decision**: Render the badge text "Overdue" as visible text within a `<span className="todo-overdue-badge">`. The text itself conveys the semantic meaning to screen readers without a separate visually-hidden element.

**Rationale**: FR-009 requires the overdue state to be perceivable by screen readers. A visible text badge (not icon-only) satisfies this requirement directly — the word "Overdue" is announced when a screen reader traverses the todo item. No additional `aria-label` or `.sr-only` helper is needed since the text is already the accessible description.

**JSX pattern**:
```jsx
{isOverdue(todo.dueDate, todo.completed) && (
  <span className="todo-overdue-badge">Overdue</span>
)}
```

**Alternatives considered**:
- Icon-only indicator: rejected — requires visual interpretation; fails FR-009 (not perceivable by screen readers without extra aria attributes)
- `aria-live` region: rejected — overdue state is static at render time, not a dynamic async update; live regions are for real-time streaming changes
- Separate `.sr-only` span: rejected — redundant when the badge already contains visible text

---

## 5. Badge Visual Design and Placement

**Decision**: Render the "Overdue" badge as an inline `<span>` placed inside `.todo-content`, below the title, rendered before the due date paragraph. Style as a small pill-shaped label using `--danger-color` border and text.

**CSS**:
```css
.todo-card.overdue {
  border-color: var(--danger-color);
  background-color: var(--overdue-bg);
}

.todo-overdue-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  border-radius: var(--radius-sm);
  padding: 2px var(--space-xs);
  margin-top: 4px;
}
```

**Rationale**: Consistent with the existing `todo-due-date` paragraph pattern. Badge is scoped inside the card, always visible in list view (FR-007), and doesn't require additional navigation or interaction to see.

**Alternatives considered**:
- Top-level colored banner above the card: rejected — would alter list visual structure and may conflict with FR-008 (no ordering changes)
- Left border stripe only (no text): rejected — spec requires both color AND a visible text label (FR-001)

---

## Summary: All NEEDS CLARIFICATION Resolved

| Question | Resolution |
|----------|-----------|
| Where to compute overdue? | Client-side pure utility function |
| Date comparison approach? | ISO string comparison `dueDate < todayString` |
| Which color tokens? | `--danger-color` (existing) + `--overdue-bg` (new) |
| Accessibility mechanism? | Visible text badge "Overdue" — no extra sr-only needed |
| Badge placement? | Inside `.todo-content`, below title |
