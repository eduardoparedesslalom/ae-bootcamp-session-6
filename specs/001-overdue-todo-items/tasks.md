---

description: "Task list for Support for Overdue Todo Items"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todo-items/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/isOverdue.md ✅, quickstart.md ✅

**Tests**: Test tasks are included — the plan requires ≥80% coverage (Constitution Principle II) and the quickstart explicitly calls for `todoUtils.test.js` and updates to `TodoCard.test.js`.

**Organization**: Tasks are grouped by user story. All changes are confined to `packages/frontend`. No backend changes are required.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths are included in all descriptions

---

## Phase 1: Setup

**Purpose**: Establish the new `src/utils/` module directory for the `isOverdue` utility.

- [ ] T001 Create `packages/frontend/src/utils/todoUtils.js` with an empty named export stub to establish the `src/utils/` directory

**Checkpoint**: `src/utils/` directory exists and is importable

---

## Phase 2: Foundational — isOverdue Utility

**Purpose**: Implement the pure `isOverdue` utility function that ALL user stories depend on. No user story can be implemented until this phase is complete.

**⚠️ CRITICAL**: Phases 3–5 cannot begin until T002 is complete.

- [ ] T002 Implement `isOverdue(dueDate, completed)` pure function following the contract in `packages/frontend/src/utils/todoUtils.js`
- [ ] T003 [P] Create unit tests covering all input/output cases from `contracts/isOverdue.md` (null, undefined, empty string, past date + incomplete, past date + complete, today, future date) in `packages/frontend/src/utils/__tests__/todoUtils.test.js`

**Checkpoint**: `isOverdue` is implemented, all unit tests pass, and the function is importable by `TodoCard`

---

## Phase 3: User Story 1 — View Overdue Tasks at a Glance (Priority: P1) 🎯 MVP

**Goal**: A user can immediately distinguish overdue incomplete todo items in the list via a visible color change and "Overdue" badge, without checking dates manually.

**Independent Test**: Create a todo with a past due date and leave it incomplete → confirm it displays a red/orange border, a red "Overdue" badge below the title. Create a completed todo with the same past date → confirm no badge. Create a todo with today's date → confirm no badge. Create a todo with no due date → confirm no badge.

### Implementation for User Story 1

- [ ] T004 [P] [US1] Add `--overdue-bg` design token with light mode value `rgba(198, 40, 40, 0.06)` and dark mode value `rgba(239, 83, 80, 0.10)` in `packages/frontend/src/styles/theme.css`
- [ ] T005 [P] [US1] Add `.todo-card.overdue` (border + background using `--danger-color` and `--overdue-bg`) and `.todo-overdue-badge` (text style using `--danger-color`) CSS rules in `packages/frontend/src/App.css`
- [ ] T006 [US1] Import `isOverdue` from `../utils/todoUtils`, conditionally apply `overdue` CSS class to the card root element, and render `<span className="todo-overdue-badge">Overdue</span>` inside `.todo-content` (after title, before due date) in `packages/frontend/src/components/TodoCard.js`
- [ ] T007 [P] [US1] Add US1 acceptance scenario tests (overdue badge shown for past+incomplete, not shown for completed, not shown for today, not shown for future, not shown for no due date, accessible text label present) to `packages/frontend/src/components/__tests__/TodoCard.test.js`

**Checkpoint**: User Story 1 is fully functional and independently testable. This alone constitutes a shippable MVP.

---

## Phase 4: User Story 2 — Overdue State Updates When Completed (Priority: P2)

**Goal**: When a user marks an overdue todo as complete, the "Overdue" badge disappears immediately; when unchecked, it reappears immediately.

**Independent Test**: Render a TodoCard with a past due date and `completed: false` → badge visible. Simulate toggling `completed` to `true` → badge gone. Toggle back to `false` → badge reappears. No page reload required.

### Implementation for User Story 2

> No new implementation files required. The `isOverdue` call inside `TodoCard` re-evaluates on every render, so toggling `completed` automatically updates the badge. This phase validates that behavior.

- [ ] T008 [US2] Add completion-toggle test scenarios (badge disappears on mark-complete, badge reappears on uncheck) to `packages/frontend/src/components/__tests__/TodoCard.test.js`

**Checkpoint**: User Stories 1 AND 2 both pass independently

---

## Phase 5: User Story 3 — Overdue State Consistently Applied Across the List (Priority: P3)

**Goal**: In a list with mixed due dates and completion states, each todo item shows the correct overdue status — only incomplete todos with past due dates show the indicator.

**Independent Test**: Render a `TodoList` (or multiple `TodoCard`s) with a mix of overdue, current, completed, and no-due-date todos. Confirm only the incomplete+past-due items have the badge.

### Implementation for User Story 3

> No new implementation files required. Correctness is guaranteed by the `isOverdue` utility being called per `TodoCard`. This phase validates list-wide consistency.

- [ ] T009 [US3] Add list-wide consistency test scenarios (mixed todo states produce correct badge presence/absence for each item) to `packages/frontend/src/components/__tests__/TodoCard.test.js`

**Checkpoint**: All three user stories pass independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify coverage requirement and confirm no regressions.

- [ ] T010 Run full test suite from repo root (`npm test`) and confirm ≥80% code coverage threshold is met across all packages per Constitution Principle II

---

## Dependencies

```
T001
 └── T002
      ├── T003 [P]   (can start alongside T002 using the contract as spec)
      ├── T004 [P]   (can start in parallel — different file)
      ├── T005 [P]   (can start in parallel — different file)
      └── T006       (depends on T002, T004, T005)
           └── T007 [P]   (can start alongside T006 — different file)
                └── T008
                     └── T009
                          └── T010
```

**User Story Completion Order**: US1 → US2 → US3 (each adds test coverage on top of shared implementation)

---

## Parallel Execution Examples

### Phase 2 (Foundational)
| Stream A | Stream B |
|----------|----------|
| T002: Implement `isOverdue` in `todoUtils.js` | T003: Write unit tests in `todoUtils.test.js` |

### Phase 3 (US1 — three parallel streams)
| Stream A | Stream B | Stream C |
|----------|----------|----------|
| T004: Add `--overdue-bg` token to `theme.css` | T005: Add CSS rules to `App.css` | — |
| T006: Update `TodoCard.js` | T007: Update `TodoCard.test.js` | — |

---

## Implementation Strategy

**MVP Scope**: Phase 1 + Phase 2 + Phase 3 (T001–T007) delivers all P1 user story value and is independently shippable.

**Incremental Delivery**:
1. Implement T001–T003 → `isOverdue` utility is tested and ready
2. Implement T004–T007 → visual indicator live in UI; US1 complete
3. Implement T008 → completion-toggle validated; US2 complete
4. Implement T009 → list consistency validated; US3 complete
5. Run T010 → coverage gated; ready for merge

**No backend changes required.** All 10 tasks are confined to `packages/frontend`.
