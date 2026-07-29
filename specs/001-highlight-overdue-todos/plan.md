# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-highlight-overdue-todos` | **Date**: 2026-07-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-highlight-overdue-todos/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Incomplete todos whose due date has passed must display a visible "Overdue" text label next to
their due date. The status is a derived, non-persisted value computed client-side from the
existing `dueDate` and `completed` fields by comparing calendar dates (no time-of-day component).
It is recomputed whenever the todo list renders/reloads and whenever a todo's completion status
changes (immediate UI update, no page reload or background timer). No backend or API changes are
required since all source data already exists.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18.2

**Primary Dependencies**: React 18 (frontend), react-scripts 5 (build/test runner); no new
dependencies required

**Storage**: N/A — overdue status is derived at render time from the existing `dueDate` and
`completed` fields; nothing new is persisted

**Testing**: Jest + `@testing-library/react`, following existing patterns in
`packages/frontend/src/components/__tests__/TodoCard.test.js`

**Target Platform**: Web browser (desktop-focused, per functional requirements)

**Project Type**: Web application monorepo (`packages/frontend` + `packages/backend`); this
feature is frontend-only

**Performance Goals**: Negligible overhead — a single date comparison per todo per render; must
not introduce any perceptible delay when toggling completion (SC-004)

**Constraints**: No new persisted field or API changes; recompute overdue status only on
render/reload of the list (FR-006, no polling/background timer); must not change existing list
ordering or add filtering/grouping (FR-008); indicator must be a visible text label, not
color-only (FR-007)

**Scale/Scope**: Single-user todo list of modest size (tens of items); change is scoped to the
frontend presentation layer only

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Single-Responsibility Architecture**: PASS. Overdue computation is extracted into a small
  shared utility (`isOverdue`) rather than duplicated inline in components, keeping `TodoCard`
  focused on presentation.
- **II. Consistent Code Standards**: PASS. New code will follow existing naming, import ordering,
  and JSDoc conventions already used in `packages/frontend/src`.
- **III. Test-First Quality Gates**: PASS (planned). Unit tests for the new utility and updated
  `TodoCard`/`TodoList` tests will be added alongside the change, consistent with existing
  `__tests__` colocation.
- **IV. Product Scope Fidelity**: PASS. Feature matches approved functional requirements; no
  filtering, sorting, or out-of-scope capability is introduced (FR-008).
- **V. Accessible, Themed User Experience**: PASS. Indicator is a text label (not color-only),
  satisfying WCAG AA / color-vision-deficiency guidance (FR-007); no new colors are required
  beyond existing theme tokens (e.g., `--danger-color`) used for emphasis only.

No violations identified; Complexity Tracking section is not needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-highlight-overdue-todos/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md         # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

No `contracts/` directory is generated: this feature makes no API or external interface changes
(purely a derived, client-side presentation concern), so there is nothing new to contract.

### Source Code (repository root)

```text
packages/frontend/src/
├── utils/
│   ├── todoStatus.js          # NEW: isOverdue(todo) derived-status helper
│   └── __tests__/
│       └── todoStatus.test.js # NEW: unit tests for isOverdue
├── components/
│   ├── TodoCard.js            # MODIFIED: render "Overdue" label using isOverdue
│   └── __tests__/
│       └── TodoCard.test.js   # MODIFIED: add overdue-label test cases
└── services/
    └── todoService.js         # UNCHANGED: no API shape changes needed

packages/backend/                 # UNCHANGED: no backend changes required
```

**Structure Decision**: Web application monorepo already exists at `packages/frontend` (React) and
`packages/backend` (Express). This feature is additive and frontend-only: a new `utils/todoStatus.js`
helper encapsulates the overdue-computation logic (Single-Responsibility principle), and `TodoCard.js`
is updated to render the label. No backend, service-layer, or API changes are required since overdue
status is fully derivable from data the API already returns.

## Post-Design Constitution Check

*Re-evaluated after Phase 1 design (data-model.md, research.md, quickstart.md).*

- **I. Single-Responsibility Architecture**: PASS. Design confirms the derivation logic lives in
  one pure `isOverdue` helper (see [data-model.md](./data-model.md)), not duplicated across
  components.
- **II. Consistent Code Standards**: PASS. No deviations introduced by the design artifacts.
- **III. Test-First Quality Gates**: PASS. [quickstart.md](./quickstart.md) enumerates the specific
  unit/integration test cases required before/alongside implementation.
- **IV. Product Scope Fidelity**: PASS. Data model explicitly confirms no new persisted fields,
  no filtering/sorting changes, and no API changes — scope stays within the approved feature.
- **V. Accessible, Themed User Experience**: PASS. Presentation mapping in
  [data-model.md](./data-model.md) confirms a text label is used, not a color-only signal.

No violations; no Complexity Tracking entries required.
