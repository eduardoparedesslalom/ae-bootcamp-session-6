# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items`

**Created**: 2026-05-26

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items — visually identify and distinguish overdue tasks in the todo list so users can prioritize work and quickly see which tasks are past their due date"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Overdue Tasks at a Glance (Priority: P1)

A user opens their todo list and immediately notices that some items are visually marked as overdue. Without checking any dates manually, they can tell which tasks are past their due date and still incomplete.

**Why this priority**: This is the core value of the feature — if a user cannot distinguish overdue items at a glance, the entire feature has no value. Delivering this alone constitutes a complete MVP.

**Independent Test**: Can be fully tested by creating a todo with a past due date, leaving it incomplete, and confirming it displays with a visual overdue indicator in the list view.

**Acceptance Scenarios**:

1. **Given** a todo exists with a due date in the past AND is incomplete, **When** the user views the todo list, **Then** that todo displays a clear visual overdue indicator (e.g., distinct color, label, or icon)
2. **Given** a todo exists with a due date today or in the future AND is incomplete, **When** the user views the todo list, **Then** that todo does NOT display an overdue indicator
3. **Given** a todo exists with a due date in the past AND is marked complete, **When** the user views the todo list, **Then** that todo does NOT display an overdue indicator
4. **Given** a todo exists with NO due date, **When** the user views the todo list, **Then** that todo does NOT display an overdue indicator

---

### User Story 2 - Overdue State Updates When Task Is Completed (Priority: P2)

A user marks an overdue task as complete. The overdue visual indicator disappears, reflecting that the task is no longer pending, regardless of the original due date.

**Why this priority**: Consistency of state is critical — showing a completed task as overdue is confusing and misleading. This delivers accurate status feedback.

**Independent Test**: Can be fully tested by completing a previously overdue todo and confirming the overdue indicator is removed from the display.

**Acceptance Scenarios**:

1. **Given** a todo is displayed with an overdue indicator, **When** the user marks it as complete, **Then** the overdue indicator is removed immediately
2. **Given** a todo is marked complete and previously had a past due date, **When** the user unchecks it (marks it incomplete again), **Then** the overdue indicator reappears immediately

---

### User Story 3 - Overdue State Is Consistently Applied Across the List (Priority: P3)

A user views their full todo list with a mix of overdue, current, and completed items. Each item's overdue status is correctly reflected, making it easy to scan and prioritize.

**Why this priority**: Consistency across all items builds trust and usability. Without this, the feature is unreliable and may mislead users.

**Independent Test**: Can be fully tested by populating a list with multiple todos covering all status/date combinations and confirming each is labeled correctly.

**Acceptance Scenarios**:

1. **Given** a list contains todos with varying due dates and completion states, **When** the user views the list, **Then** only incomplete todos with past due dates show the overdue indicator
2. **Given** a list where all todos have future due dates or no due date, **When** the user views the list, **Then** no overdue indicators are shown

---

### Edge Cases

- What happens when a todo's due date is today? (Today is NOT considered overdue; only dates strictly before today trigger the overdue state)
- How does the system handle todos with no due date? (They are never overdue)
- What happens if a user re-opens the app the next day and a task has crossed into overdue? (The overdue state is determined at display time based on the current date, so it updates automatically)
- What happens when a user marks a previously overdue todo as incomplete again? (The overdue indicator reappears immediately)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST visually distinguish incomplete todo items whose due date is strictly before today's date from all other todos
- **FR-002**: System MUST determine overdue status at the time of display, based on comparing the todo's due date to the current date
- **FR-003**: System MUST NOT display an overdue indicator on any todo that is marked as complete, regardless of its due date
- **FR-004**: System MUST NOT display an overdue indicator on any todo that has no due date
- **FR-005**: System MUST NOT display an overdue indicator on any todo whose due date is today or in the future
- **FR-006**: System MUST update the overdue visual indicator immediately when a user changes the completion status of a todo (without requiring a page reload)
- **FR-007**: The overdue indicator MUST be visible within the standard todo list view without requiring additional navigation or interaction

### Key Entities

- **Todo Item**: Represents a task with a title, optional due date, and completion status. The overdue state is a derived property: `due_date < today AND NOT completed`
- **Overdue State**: A computed display attribute, not a stored field. Calculated from `due_date` and `completed` at render time

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify all overdue incomplete tasks at a glance, without manually comparing dates — verifiable by user observation of the list
- **SC-002**: 100% of incomplete todos with a past due date display the overdue indicator; 0% of completed or no-due-date todos display it
- **SC-003**: Overdue state refreshes immediately (no perceptible delay) when a todo's completion status changes
- **SC-004**: Users report reduced time spent identifying which tasks need immediate attention, compared to scanning dates manually

## Assumptions

- A todo is considered overdue only when its due date is **strictly before** today's date (e.g., yesterday or earlier). A task due today is still on time.
- Overdue status is a **display-time calculation** — it is not stored or persisted as a separate field on the todo item.
- Completed todos are never shown as overdue, even if their due date has passed, since the task is already done.
- Todos without a due date are never overdue.
- The visual overdue indicator style (color, icon, or label) will be defined and implemented in alignment with the existing UI design system; the specification does not prescribe the exact visual treatment.
- The feature applies to the existing single-user todo list view; no new views or routes are introduced.
- The current date used for comparison is the client's local date at the time of rendering.
