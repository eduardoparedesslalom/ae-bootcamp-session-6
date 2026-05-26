# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todo-items` | **Date**: 2026-05-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-overdue-todo-items/spec.md`

## Summary

Add visual overdue indicators to incomplete todo items whose `dueDate` is strictly before today's date. Overdue state is a **display-time computed property** (`dueDate < today AND NOT completed`) — no backend or database changes are required. The implementation introduces a pure utility function `isOverdue`, CSS classes using existing design tokens, and a visible + accessible "Overdue" badge rendered within `TodoCard`.

## Technical Context

**Language/Version**: JavaScript (ES6+), React 18.2.0, Node.js ≥ v16

**Primary Dependencies**:
- Frontend: React 18.2.0, react-scripts 5.0.1, @testing-library/react 14.0, msw 1.3.2
- Backend: Express.js 4.18, better-sqlite3 11.10, Jest 29 — **no changes for this feature**

**Storage**: In-memory SQLite (`:memory:`) via better-sqlite3 — **no schema changes required**

**Testing**: Jest (both packages), @testing-library/react + msw (frontend), supertest (backend)

**Target Platform**: Browser SPA (React CRA) + Node.js/Express server

**Project Type**: Web application — React SPA frontend + Express REST API backend (monorepo)

**Performance Goals**: Immediate DOM update when completion status changes; no perceptible delay (FR-006)

**Constraints**:
- Plain CSS only (no CSS-in-JS, no Tailwind)
- Color values via design tokens only (`--danger-color` existing; `--overdue-bg` new)
- 8px grid spacing system
- ≥80% code coverage across all packages (Constitution Principle II)

**Scale/Scope**: Single-user local todo list; all changes confined to `packages/frontend`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality & Simplicity | ✅ PASS | `isOverdue` is a single-purpose pure function; camelCase naming; ordered imports |
| II. Test-Driven Quality | ✅ PASS | Unit tests for `isOverdue` utility + `TodoCard` overdue rendering scenarios cover all acceptance scenarios |
| III. Functional Simplicity | ✅ PASS | Display-only; no new views, routes, sorting, or stored state; strictly within functional requirements |
| IV. Design Consistency | ✅ PASS | Uses `--danger-color` (existing) + `--overdue-bg` (new token); 8px grid; light and dark mode both addressed |
| V. Monorepo Architecture | ✅ PASS | Changes in `packages/frontend` only; no new packages |

**Post-Phase 1 re-check**: All principles still PASS. No violations introduced by design decisions.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-items/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/
│   └── isOverdue.md     # Phase 1 output — utility function contract
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   └── TodoCard.js                    # MODIFY: add overdue CSS class + "Overdue" badge rendering
│   ├── utils/
│   │   └── todoUtils.js                   # NEW: isOverdue(dueDate, completed) pure utility function
│   ├── App.css                            # MODIFY: add .todo-card.overdue + .todo-overdue-badge styles
│   └── styles/
│       └── theme.css                      # MODIFY: add --overdue-bg design token (light + dark)
└── src/
    ├── utils/
    │   └── __tests__/
    │       └── todoUtils.test.js          # NEW: unit tests for isOverdue
    └── components/
        └── __tests__/
            └── TodoCard.test.js           # MODIFY: add overdue rendering test scenarios
```

**Structure Decision**: Web application (frontend + backend monorepo). All changes are confined to `packages/frontend`. No backend files are modified. No new packages are introduced.

## Complexity Tracking

*No constitution violations — section not applicable.*
