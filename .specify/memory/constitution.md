<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0
Added sections:
  - Core Principles (I–V)
  - Technology Stack Constraints
  - Development Workflow
  - Governance
Modified principles: N/A (initial creation)
Removed sections: N/A (initial creation)
Templates reviewed:
  - .specify/templates/plan-template.md ✅ — "Constitution Check" gate aligned with principles below
  - .specify/templates/spec-template.md ✅ — User story structure consistent with Functional Simplicity principle
  - .specify/templates/tasks-template.md ✅ — Phase structure consistent with Test-Driven Quality principle
  - .specify/templates/checklist-template.md ✅ — no constitution-specific references requiring update
Follow-up TODOs: none
-->

# Todo App Constitution

## Core Principles

### I. Code Quality & Simplicity (NON-NEGOTIABLE)

Every module, component, and function MUST have a single, well-defined responsibility (SRP).
Code MUST follow the DRY principle — duplicate logic MUST be extracted into shared utilities or
components. The KISS principle governs all implementation decisions: prefer the simplest correct
solution over a clever one. All code MUST pass ESLint before being committed; no lint errors or
suppressed warnings are permitted without documented justification.

Naming conventions are mandatory:
- Variables/functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- React components and classes: `PascalCase` with matching file names

Imports MUST be ordered: external libraries → internal modules → styles, separated by blank lines.
Circular dependencies are prohibited.

**Rationale**: Consistency and simplicity reduce cognitive load, accelerate onboarding, and prevent
the accumulation of technical debt in a bootcamp-paced project.

### II. Test-Driven Quality (NON-NEGOTIABLE)

Tests MUST be written as an integral part of development, not as an afterthought.
The project MUST maintain ≥80% code coverage across all packages (frontend and backend).
Every test MUST follow the Arrange–Act–Assert (AAA) pattern.

Test categories in scope:
- **Unit tests**: individual components, route handlers, utility functions — mocking all
  external dependencies
- **Integration tests**: component interactions, API-to-service chains, frontend-to-backend
  communication

End-to-end tests are explicitly out of scope for initial development.

Tests MUST be isolated: no shared mutable state between tests; each test sets up and cleans up
its own data. Mock data MUST be defined in `__mocks__/` or `fixtures/` directories rather than
inlined repeatedly across test files.

**Rationale**: High test coverage at the unit and integration level gives the confidence needed to
refactor and extend the application without regressions.

### III. Functional Simplicity

The application scope is strictly bounded to single-user todo CRUD operations with backend
persistence. Features outside the documented functional requirements (filtering, search, bulk
operations, authentication, priorities, reminders) MUST NOT be implemented.

Destructive actions (delete) MUST always require user confirmation via a dialog before execution.
All mutations MUST persist immediately to the backend; optimistic UI updates without backend
confirmation are prohibited.

**Rationale**: Preventing scope creep keeps the codebase understandable and ensures bootcamp
participants can reason about the full system end-to-end.

### IV. Design Consistency

All UI MUST conform to the project design system:
- Spacing: 8px grid (xs=8px, sm=16px, md=24px, lg=32px, xl=48px) — no arbitrary pixel values
- Colors: MUST use the defined light-mode and dark-mode palette tokens; hardcoded hex values
  outside the design system are prohibited
- Typography: system font stack; heading=28px/700, subheading=18px/600, body=16px/400,
  caption=12px/400, button=14px/600
- Layout: single-column, max-width 600px, with required light/dark mode toggle

Components MUST implement all specified interaction states (hover, focus, disabled, completed).
The application MUST support both light and dark modes without visual regressions.

**Rationale**: A consistent design system ensures the UI remains coherent as components are added
and modified across bootcamp sessions.

### V. Monorepo Architecture

The project MUST remain organized as an npm workspaces monorepo with exactly two packages:
`packages/frontend` (React) and `packages/backend` (Express.js + Node.js).

Root-level scripts (`npm run start`, `npm test`) MUST orchestrate both packages. Package-local
scripts MAY be used for individual package development. No new top-level packages may be added
without amending this constitution.

Dependencies MUST be installed via the appropriate package manager scope; shared dev tooling
(lint, test runner config) SHOULD be hoisted to the root where possible.

**Rationale**: The monorepo structure enables coordinated full-stack development while keeping
frontend and backend concerns cleanly separated.

## Technology Stack Constraints

The following technology choices are fixed for this project and MUST NOT be replaced without
a constitution amendment:

| Layer | Technology |
|---|---|
| Frontend runtime | React (with React DOM) |
| Backend runtime | Node.js ≥ v16 / Express.js |
| Test runner (both) | Jest |
| Frontend test utilities | @testing-library/react |
| Package management | npm workspaces |
| Styling | Plain CSS (no CSS-in-JS, no Tailwind) |

No new runtime dependencies may be introduced without explicit documentation of purpose.
Dev/test dependencies require no amendment but MUST be justified in the PR description.

## Development Workflow

1. **Feature branches**: All new work MUST be done on a feature branch named
   `feature/<short-description>` (e.g., `feature/todo-editing`).
2. **Commit discipline**: Commits MUST be atomic and use Conventional Commits format
   (`feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`).
3. **Pull requests**: All changes MUST be reviewed via a PR before merging to `main`.
   PRs MUST pass all tests and lint checks before merge.
4. **Constitution compliance gate**: Every plan.md MUST include a Constitution Check section
   validating compliance with Principles I–V before implementation begins.
5. **No bypassing safety checks**: `--no-verify` and `--force` push flags are prohibited
   without explicit approval.

## Governance

This constitution supersedes all other practices documented in the project. In cases of conflict,
this document takes precedence over the `docs/` guidelines.

**Amendment procedure**:
1. Propose the amendment with documented rationale (PR or issue).
2. Obtain approval from at least one other bootcamp participant or instructor.
3. Update this file with a new version per semantic versioning:
   - MAJOR: principle removal, redefinition, or backward-incompatible governance change
   - MINOR: new principle or section added, or materially expanded guidance
   - PATCH: clarification, wording, or typo fix
4. Update `LAST_AMENDED_DATE` and propagate changes to affected templates.

All PRs and code reviews MUST verify compliance with the Core Principles. Non-compliant code
MUST be corrected before merge; exceptions require documented justification in the PR.

Runtime development guidance is in `docs/` (coding-guidelines.md, testing-guidelines.md,
ui-guidelines.md, functional-requirements.md).

**Version**: 1.0.0 | **Ratified**: 2026-05-26 | **Last Amended**: 2026-05-26
