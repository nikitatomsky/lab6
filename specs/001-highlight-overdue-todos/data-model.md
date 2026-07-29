# Data Model: Support for Overdue Todo Items

## Overview

This feature introduces no new persisted entities or storage fields. It adds one **derived
(computed) value** based on the existing Todo Item entity already defined by the application's
functional requirements.

## Existing Entity: Todo Item

Unchanged, shown here for reference (source: `packages/backend` schema / API responses consumed
by `packages/frontend/src/services/todoService.js`):

| Field       | Type              | Notes                                                        |
|-------------|-------------------|---------------------------------------------------------------|
| `id`        | number            | Unique identifier                                              |
| `title`     | string            | Required, max 255 characters                                   |
| `dueDate`   | string (`YYYY-MM-DD`) or `null` | Optional; date-only, no time component            |
| `completed` | boolean (`0`/`1` at API boundary) | Completion status                              |
| `createdAt` | string (ISO timestamp) | Used for existing newest-first list ordering (unchanged) |

No fields are added, renamed, or removed on this entity.

## Derived Value: Overdue Status

- **Name**: `isOverdue` (boolean)
- **Persistence**: None — computed on demand, never stored, never sent to/from the API.
- **Inputs**: `todo.dueDate`, `todo.completed`, and the current date at evaluation time.
- **Computation rule**:
  ```text
  isOverdue(todo) =
      todo.dueDate is set
      AND todo.completed is false
      AND calendar-date(todo.dueDate) < calendar-date(today)
  ```
- **Recomputation trigger**: Every render of the todo list/card (component render), which covers:
  - Initial list load / page reload (FR-006)
  - Toggling completion status (FR-005 — recomputed immediately as part of the existing re-render)
  - Editing the due date (existing edit flow already re-renders with new props)
- **Validation / edge cases** (from spec Edge Cases and Acceptance Scenarios):
  - No due date → always `false`.
  - Due date equal to today → `false` (only strictly-past dates are overdue).
  - Completed todo → always `false`, regardless of due date.
  - Marking complete → `false` immediately; unmarking complete (still past due) → `true` again.
  - Does not affect sort order or introduce filtering (FR-008); it is a presentation-only flag
    read by `TodoCard` to conditionally render the "Overdue" text label.

## Presentation Mapping

| Derived state       | UI treatment                                                           |
|----------------------|-------------------------------------------------------------------------|
| `isOverdue === true`  | Render a visible "Overdue" text label adjacent to the due date in `TodoCard` (FR-007) |
| `isOverdue === false` | No label rendered; due date displays as today                          |

No new state transitions are introduced beyond the existing todo completion toggle already
modeled by the application.
