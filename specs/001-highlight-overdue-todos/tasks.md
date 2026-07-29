---

description: "Task list for Support for Overdue Todo Items"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-highlight-overdue-todos/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md)

**Tests**: Included — the constitution's Test-First Quality Gates principle and quickstart.md both call for unit/integration tests to accompany this change.

**Organization**: Tasks are grouped by user story (US1, US2, US3 from spec.md) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is the existing web app monorepo: frontend code lives in `packages/frontend/src/`. This
feature is frontend-only per [plan.md](./plan.md) — no backend files are touched.

---

## Phase 1: Setup

**Purpose**: Confirm the baseline before making changes (no new dependencies or scaffolding are required for this feature)

- [X] T001 Run `npm run test:frontend` from the repo root to confirm the existing frontend test suite passes cleanly before starting, establishing a clean baseline

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the single derived-status helper that every user story's UI behavior depends on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Write unit tests for the `isOverdue` helper in `packages/frontend/src/utils/__tests__/todoStatus.test.js` covering all cases from data-model.md: past-due + incomplete → `true`; due today → `false`; future due date → `false`; no due date → `false`; past-due + completed → `false`
- [X] T003 Implement `isOverdue(todo, referenceDate = new Date())` in `packages/frontend/src/utils/todoStatus.js` as a pure function that compares calendar dates only (no time-of-day component), per research.md's date-comparison decision, so the tests in T002 pass

**Checkpoint**: `isOverdue` utility is fully implemented and unit-tested — ready for UI integration in any user story

---

## Phase 3: User Story 1 - Spot overdue todos at a glance (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos with a due date earlier than today display a visible "Overdue" text label; todos due today, due in the future, or without a due date do not.

**Independent Test**: Create todos with due dates in the past, today, future, and no due date; view the list; confirm only the past-due, incomplete todo shows the "Overdue" label.

### Tests for User Story 1

- [X] T004 [P] [US1] Add test cases to `packages/frontend/src/components/__tests__/TodoCard.test.js` asserting the "Overdue" text label renders for an incomplete todo with a past due date, and does NOT render for todos due today, due in the future, or with no due date (spec.md Acceptance Scenarios 1-4)

### Implementation for User Story 1

- [X] T005 [US1] In `packages/frontend/src/components/TodoCard.js`, import `isOverdue` from `../utils/todoStatus` and conditionally render a visible "Overdue" text label next to the due date whenever `isOverdue(todo)` is `true` (FR-001, FR-003, FR-004, FR-007)

**Checkpoint**: User Story 1 is fully functional and independently testable — viewing the list correctly distinguishes overdue todos

---

## Phase 4: User Story 2 - Completed todos never appear overdue (Priority: P2)

**Goal**: A completed todo never shows the overdue indicator, and toggling completion updates the indicator immediately without a page reload.

**Independent Test**: Create a todo with a past due date, mark it complete, confirm the "Overdue" label does not display (before or after a refresh); mark it incomplete again and confirm the label reappears.

### Tests for User Story 2

- [X] T006 [P] [US2] Add test cases to `packages/frontend/src/components/__tests__/TodoCard.test.js` asserting the "Overdue" label is absent for a completed todo with a past due date (even after re-render), and reappears when the same todo is toggled back to incomplete (spec.md Acceptance Scenarios 1-3)

### Implementation for User Story 2

- [X] T007 [US2] Verify in `packages/frontend/src/components/TodoCard.js` that the existing `onToggle` re-render flow immediately reflects the updated `isOverdue(todo)` result with no extra state or effects, satisfying FR-002 and FR-005; adjust the T005 integration only if the label does not update immediately

**Checkpoint**: User Stories 1 AND 2 both work independently — completed todos are never mislabeled as overdue

---

## Phase 5: User Story 3 - Overdue status stays current over time (Priority: P3)

**Goal**: A todo's overdue status is correctly recalculated the next time the list is rendered or reloaded, once the current date advances past its due date — no background timer required.

**Independent Test**: Create a todo due "today," advance the simulated current date past the due date, re-render/reload the list, and confirm the todo now shows the "Overdue" label.

### Tests for User Story 3

- [X] T008 [P] [US3] Add a unit test in `packages/frontend/src/utils/__tests__/todoStatus.test.js` calling `isOverdue(todo, referenceDate)` with a `referenceDate` one calendar day after `todo.dueDate` (expect `true`) and with `referenceDate` equal to `todo.dueDate` (expect `false`), demonstrating the result is recomputed fresh from the reference date rather than cached (FR-006)
- [X] T009 [P] [US3] Add a test in `packages/frontend/src/components/__tests__/TodoCard.test.js` that re-renders the same todo after advancing the system date with `jest.useFakeTimers().setSystemTime(...)`, confirming the "Overdue" label appears once the due date has passed (spec.md Acceptance Scenario 1)

### Implementation for User Story 3

- [X] T010 [US3] Confirm in `packages/frontend/src/components/TodoCard.js` that `isOverdue(todo)` is called fresh on every render (no memoization or cached result across renders), so the tests in T008-T009 pass without further production code changes

**Checkpoint**: All three user stories are independently functional — overdue status is accurate on first render, after toggling, and after the date advances

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup affecting the whole feature

- [X] T011 [P] Run `npm test` from the repo root to confirm all existing backend and frontend tests, plus the new tests from T002/T004/T006/T008/T009, pass with no regressions
- [X] T012 Execute the manual validation steps in [specs/001-highlight-overdue-todos/quickstart.md](./quickstart.md) end-to-end against the running app (create past/today/future/no-due-date todos, toggle completion, edit due dates, reload the page)
- [X] T013 [P] Add a short JSDoc comment above `isOverdue` in `packages/frontend/src/utils/todoStatus.js` documenting its parameters and return value, consistent with existing conventions in `packages/frontend/src`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories (the `isOverdue` helper is required by every story)
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (P1): No dependency on other stories
  - User Story 2 (P2): Builds on the T005 integration from US1 but is independently testable
  - User Story 3 (P3): Builds on the T005 integration from US1 but is independently testable
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — no dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2); reuses the label rendered by US1's T005 but adds its own tests/verification for the completed-toggle behavior
- **User Story 3 (P3)**: Can start after Foundational (Phase 2); reuses the label rendered by US1's T005 but adds its own tests/verification for the recompute-over-time behavior

### Within Each User Story

- Tests are written before/alongside the corresponding implementation/verification task
- Story complete before moving to the next priority (if working sequentially)

### Parallel Opportunities

- T002 (foundational test) can be written in parallel with drafting T003, though T003 should satisfy T002 before being considered done
- T004, T006, T008, T009 (test tasks across different stories) touch different test files or independent test cases and can be written in parallel
- T011 and T013 in Polish can run in parallel with each other

---

## Parallel Example: Phase 2 + User Story 1

```bash
# Foundational tests can be authored while implementation is planned:
Task: "Write unit tests for isOverdue in packages/frontend/src/utils/__tests__/todoStatus.test.js"

# Once T002/T003 land, US1's test task can proceed independently of US2/US3 test tasks:
Task: "Add TodoCard test cases for Overdue label rendering in packages/frontend/src/components/__tests__/TodoCard.test.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (`isOverdue` helper — CRITICAL, blocks all stories)
3. Complete Phase 3: User Story 1 (label renders for overdue todos)
4. **STOP and VALIDATE**: Confirm US1's independent test passes
5. Deploy/demo if ready — this alone delivers the core value described in spec.md

### Incremental Delivery

1. Complete Setup + Foundational → `isOverdue` ready
2. Add User Story 1 → test independently → deploy/demo (MVP!)
3. Add User Story 2 → test independently → deploy/demo
4. Add User Story 3 → test independently → deploy/demo
5. Finish with Polish phase (full test suite + quickstart validation)

### Single-Developer Sequential Strategy

Given the small scope of this feature (one new utility file, one modified component), completing
Phases 1-6 strictly in order is expected to be the simplest path — parallel opportunities are
noted above but are optional.

---

## Notes

- [P] tasks touch different files or independent test cases within the same file
- [Story] label maps each task to its user story for traceability
- No backend changes, no new dependencies, and no new persisted fields are involved (per plan.md and data-model.md)
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
