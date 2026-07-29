# Quickstart: Validate Support for Overdue Todo Items

This guide validates the feature end-to-end using the existing app and test suite. It assumes the
implementation described in [plan.md](./plan.md) — a new `isOverdue` utility consumed by
`TodoCard` — is in place.

## Prerequisites

- Node.js and npm installed
- Dependencies installed once at repo root: `npm run install:all`

## Run the app manually

1. Start both packages from the repo root:
   ```bash
   npm start
   ```
2. Open the frontend (default: `http://localhost:3000`).
3. Create three todos:
   - One with a due date in the past (e.g., yesterday's date)
   - One with a due date of today
   - One with a due date in the future
   - One with no due date
4. **Expected**: Only the past-due, incomplete todo shows an "Overdue" text label next to its due
   date (FR-001–FR-004, SC-002, SC-003).
5. Mark the overdue todo complete.
   - **Expected**: The "Overdue" label disappears immediately, with no page reload (FR-005,
     SC-004).
6. Mark it incomplete again.
   - **Expected**: The "Overdue" label reappears (still past due).
7. Edit the overdue todo's due date to a future date.
   - **Expected**: The label is removed. Edit it back to a past date.
   - **Expected**: The label reappears.
8. Reload the page.
   - **Expected**: Overdue/non-overdue state is unchanged after reload, and list ordering
     (newest-created first) is unaffected (FR-008).

## Automated validation

Run the frontend test suite (unit + integration):

```bash
npm run test:frontend
```

Expected coverage additions:

- `packages/frontend/src/utils/__tests__/todoStatus.test.js` — unit tests for `isOverdue` covering:
  past due + incomplete → `true`; due today → `false`; future due → `false`; no due date →
  `false`; past due + completed → `false`.
- `packages/frontend/src/components/__tests__/TodoCard.test.js` — updated/added cases asserting
  the "Overdue" text label renders/does not render for the same scenarios, and disappears after
  toggling completion.

All existing tests in `packages/frontend` and `packages/backend` must continue to pass, since no
backend or API contract changes are made:

```bash
npm test
```

## Success criteria mapping

| Success Criterion | How it's validated here |
|---|---|
| SC-001 | Manual scan of a list with mixed due dates — label makes overdue items instantly identifiable |
| SC-002 | `todoStatus.test.js` + `TodoCard.test.js` past-due-incomplete case |
| SC-003 | `todoStatus.test.js` + `TodoCard.test.js` completed/future/today/no-due-date cases |
| SC-004 | Manual toggle step above + `TodoCard.test.js` toggle re-render assertion |
