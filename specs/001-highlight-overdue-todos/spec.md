# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-highlight-overdue-todos`

**Created**: 2026-07-29

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items - As a todo application user, I want to easily identify and distinguish overdue tasks in my todo list, so that I can prioritize my work and quickly see which tasks are past their due date. Users need a clear, visual way to identify which todos have not been completed by their due date. This helps users quickly spot overdue items without having to manually check dates against today's date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Spot overdue todos at a glance (Priority: P1)

As a user viewing my todo list, I want incomplete todos whose due date has passed to be visually distinguished from other todos, so I can immediately see what needs my attention without comparing each due date to today's date myself.

**Why this priority**: This is the core value of the feature - without a visible distinction, users gain no benefit. This alone delivers a usable, testable improvement.

**Independent Test**: Can be fully tested by creating todos with due dates in the past, present, and future (and no due date), viewing the list, and confirming only past-due, incomplete todos show the overdue indicator.

**Acceptance Scenarios**:

1. **Given** an incomplete todo with a due date earlier than today, **When** the user views the todo list, **Then** that todo displays a visible overdue indicator distinguishing it from other todos.
2. **Given** an incomplete todo with a due date of today, **When** the user views the todo list, **Then** that todo does NOT display an overdue indicator.
3. **Given** an incomplete todo with a due date in the future, **When** the user views the todo list, **Then** that todo does NOT display an overdue indicator.
4. **Given** an incomplete todo with no due date set, **When** the user views the todo list, **Then** that todo does NOT display an overdue indicator.

---

### User Story 2 - Completed todos never appear overdue (Priority: P2)

As a user, I want a todo I've already completed to never show as overdue, even if I finished it after its due date, so my list accurately reflects only outstanding work that needs attention.

**Why this priority**: Prevents a confusing and misleading experience where finished work is flagged as needing attention; builds directly on User Story 1's indicator logic.

**Independent Test**: Can be fully tested by creating a todo with a past due date, marking it complete, and confirming the overdue indicator does not display (before or after refresh).

**Acceptance Scenarios**:

1. **Given** a todo with a due date earlier than today, **When** the user marks it complete, **Then** the overdue indicator is removed immediately without needing a page refresh.
2. **Given** a completed todo with a due date earlier than today, **When** the user reopens/refreshes the todo list, **Then** the todo still does NOT display an overdue indicator.
3. **Given** a completed todo, **When** the user marks it incomplete again and its due date is still in the past, **Then** the overdue indicator reappears.

---

### User Story 3 - Overdue status stays current over time (Priority: P3)

As a user who keeps the app open across days, I want a todo's overdue status to reflect the current date automatically, so I don't need to reload the page for a todo to correctly become marked overdue once its due date passes.

**Why this priority**: A refinement over the base indicator; valuable for accuracy but the app remains useful even if this only updates on each page load/reload.

**Independent Test**: Can be fully tested by creating a todo due "today," then verifying that after the calendar day changes and the list is viewed again (including via a simple reload), the todo is now shown as overdue.

**Acceptance Scenarios**:

1. **Given** a todo due today that is not yet overdue, **When** the current date advances past the due date and the user views the list again, **Then** the todo now displays the overdue indicator.

---

### Edge Cases

- A todo with no due date is never marked overdue, regardless of completion status.
- A todo due exactly "today" is not overdue; it only becomes overdue starting the day after its due date.
- Marking an overdue todo complete removes the overdue indicator immediately; unmarking it as complete (while still past due) restores the indicator.
- Editing a todo's due date to a future date removes the overdue indicator; editing it to a past date adds the indicator (if incomplete).
- The overdue indicator does not change the todo list's existing sort order (creation date, newest first) or introduce filtering.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST visually distinguish any incomplete todo whose due date is earlier than the current date from all other todos in the list.
- **FR-002**: System MUST NOT display an overdue indicator for any todo marked complete, regardless of its due date.
- **FR-003**: System MUST NOT display an overdue indicator for any todo without a due date.
- **FR-004**: System MUST NOT treat a todo due on the current date as overdue; a todo becomes overdue only once its due date has fully passed.
- **FR-005**: System MUST update a todo's overdue indicator immediately when its completion status changes, without requiring a page reload.
- **FR-006**: System MUST re-evaluate each todo's overdue status whenever the todo list is viewed or refreshed, based on the current date at that time.
- **FR-007**: The overdue indicator MUST be distinguishable without relying on color alone (e.g., accompanied by a text label or icon), so the status is perceivable by users with color vision deficiencies.
- **FR-008**: System MUST NOT alter the existing todo list ordering or introduce any filtering/grouping as part of this feature.

### Key Entities

- **Todo Item**: Existing entity with title, due date (optional), and completion status. This feature adds a derived, non-persisted "overdue" state computed from the todo's existing due date and completion status compared against the current date - it is not a new stored field.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can correctly identify all overdue todos in a list of 20 items within 5 seconds of viewing it, without checking individual due dates.
- **SC-002**: 100% of incomplete todos with a due date earlier than the current date display the overdue indicator when the list is viewed.
- **SC-003**: 0% of completed todos, future-dated todos, todos due today, or todos without a due date are ever shown with the overdue indicator.
- **SC-004**: Completing or reopening a todo updates its overdue indicator with no perceptible delay (no manual page refresh required).

## Assumptions

- "Past due date" is evaluated by comparing calendar dates only (no time-of-day component), consistent with due dates being date-only values per existing functional requirements.
- The overdue indicator is a visual/textual treatment only (e.g., styling and/or a label); it does not add new filtering, sorting, search, or bulk-action capabilities, which remain explicitly out of scope for the application.
- No new backend data or API changes are required, since overdue status is derived entirely from existing due date and completion status fields already returned by the API.
- The feature applies uniformly across all todos in the single-user list; no per-user configuration of overdue thresholds is needed.
