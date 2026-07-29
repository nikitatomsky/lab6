# Research: Support for Overdue Todo Items

No open "NEEDS CLARIFICATION" markers remain in the Technical Context — the two ambiguities in
the original feature description were already resolved during `/speckit.clarify` (see
[spec.md](./spec.md) Clarifications section: recompute-on-render only, text-label-only indicator).
The items below record the small implementation-level decisions made while turning those
clarifications into a concrete technical approach.

## Decision: Where to compute overdue status

- **Decision**: Add a single pure helper, `isOverdue(todo, referenceDate = new Date())`, in a new
  `packages/frontend/src/utils/todoStatus.js` module. `TodoCard` calls this helper on each render.
- **Rationale**: Keeps the derivation logic in one place (DRY, Single-Responsibility principle in
  the constitution), makes it independently unit-testable without rendering a component, and
  matches the documented frontend file organization (`utils/` for shared logic, e.g. the
  `dateFormatter.js` pattern already described in the coding guidelines).
- **Alternatives considered**:
  - *Inline computation inside `TodoCard`*: Rejected — duplicates logic if another component
    (e.g., a future summary/count view) needs the same check, and is harder to unit test in
    isolation from rendering.
  - *Compute in the backend and add an `overdue` field to API responses*: Rejected — spec
    explicitly states no backend/API changes are needed (Assumptions section) and this would
    introduce a stale-data risk if the todo list is left open across a day boundary, contradicting
    FR-006 (recompute at render time using the current date, not a stored value).

## Decision: Date comparison method

- **Decision**: Compare using calendar-date-only granularity: normalize both `dueDate` and "today"
  to local `YYYY-MM-DD` (or midnight-truncated `Date` objects) before comparing, so overdue is
  `dueDate < today` (strictly earlier), never based on time-of-day.
- **Rationale**: Matches FR-004 and the spec's Assumptions section ("Past due date" is evaluated
  by comparing calendar dates only, consistent with due dates being date-only values). Due dates
  are already stored/transmitted as date-only strings (e.g., `'2025-12-25'`), so no timezone-aware
  time arithmetic is needed.
- **Alternatives considered**:
  - *`Date` object subtraction with millisecond thresholds (e.g., `now - due > 86400000`)*:
    Rejected — fragile around daylight saving time and time-of-day, and unnecessarily complex for
    date-only values.

## Decision: Triggering recomputation on completion toggle

- **Decision**: No special mechanism is needed beyond normal React re-rendering — `isOverdue` is
  called during `TodoCard`'s render using the current `todo.completed` and `todo.dueDate` props,
  so toggling completion (which already triggers a re-render via existing `onToggle` state update)
  automatically recomputes the label with no additional state or effect.
- **Rationale**: Satisfies FR-005 (indicator updates immediately on completion change, no reload)
  using the existing toggle flow already implemented in `TodoCard`/`TodoList`/`App`, without adding
  timers, effects, or extra state.
- **Alternatives considered**:
  - *`useEffect` + `setInterval` to poll and refresh overdue state*: Rejected — explicitly out of
    scope per FR-006 ("Continuous background polling or a live timer... is NOT required").

## Summary

All technical unknowns are resolved. No new dependencies, no backend changes, and no persisted
data changes are required. The approach is a small, pure, unit-testable utility function consumed
by the existing `TodoCard` render path.
