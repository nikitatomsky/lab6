<!--
Sync Impact Report
- Version change: template-draft -> 1.0.0
- Modified principles:
	- Principle 1 placeholder -> I. Single-Responsibility Architecture
	- Principle 2 placeholder -> II. Consistent Code Standards
	- Principle 3 placeholder -> III. Test-First Quality Gates (NON-NEGOTIABLE)
	- Principle 4 placeholder -> IV. Product Scope Fidelity
	- Principle 5 placeholder -> V. Accessible, Themed User Experience
- Added sections:
	- Engineering Constraints
	- Development Workflow & Quality Gates
- Removed sections:
	- Section 2 placeholder
	- Section 3 placeholder
- Follow-up TODOs:
	- None
-->

# Lab6 Todo App Constitution

## Core Principles

### I. Single-Responsibility Architecture
All modules, components, and services MUST have one clear responsibility and one primary reason
to change. Frontend presentation logic MUST remain in React components, and data access/business
logic MUST remain in service-layer modules. Shared behavior MUST be extracted instead of repeated.

Rationale: Enforcing SRP and DRY keeps the monorepo maintainable as frontend and backend evolve
independently.

### II. Consistent Code Standards
All source files MUST follow repository formatting and naming rules: 2-space indentation, LF line
endings, no trailing whitespace, and descriptive naming conventions (`camelCase`, `PascalCase`,
`UPPER_SNAKE_CASE` as applicable). Imports MUST be grouped by external, internal, then styles,
with blank lines between groups. Public or shared functions SHOULD include concise JSDoc when
intent or contract is non-obvious.

Rationale: Uniform style and structure improve readability, reduce review friction, and prevent
avoidable defects.

### III. Test-First Quality Gates (NON-NEGOTIABLE)
Behavioral tests MUST be authored or updated alongside any functional change before merge.
Unit and integration tests MUST remain independent, deterministic, and focused on externally
observable behavior. The repository MUST maintain at least 80% coverage overall, with critical
todo workflows covered end-to-end across frontend and backend integration boundaries.

Rationale: Test-first discipline and coverage thresholds protect core task-management behavior from
regressions.

### IV. Product Scope Fidelity
Changes MUST align with approved functional requirements for a single-user todo application.
Core capabilities are create, view, update, toggle completion, and delete with confirmation;
all changes MUST persist through the backend API. Out-of-scope features (authentication,
collaboration, advanced filtering/search, reminders, bulk operations, and similar expansions)
MUST NOT be introduced without a formal constitution or requirements amendment.

Rationale: Scope discipline preserves delivery focus and prevents accidental product drift.

### V. Accessible, Themed User Experience
UI implementations MUST preserve the documented design system: Halloween-inspired color palette,
single-column structure, and support for both light and dark themes with persisted preference.
Interactive controls MUST be keyboard accessible, have visible focus states, and satisfy WCAG AA
contrast expectations. Simplicity and clarity of task management interactions MUST take precedence
over decorative complexity.

Rationale: Consistent, accessible UX ensures the app is usable and recognizable across devices
while meeting project design intent.

## Engineering Constraints

- The technology stack MUST remain React frontend plus Express backend within npm workspaces,
	unless explicitly amended.
- Backend persistence behavior MUST remain durable for all todo mutations.
- API and data-shape changes MUST include coordinated updates in both packages where applicable.
- Architectural complexity MUST be justified in pull request descriptions when a simpler approach
	can satisfy requirements.

## Development Workflow & Quality Gates

- Work MUST be delivered through small, logical, atomic commits with clear intent.
- Pull requests MUST pass automated tests for affected packages before merge.
- Lint and style violations MUST be resolved before review completion.
- Bug fixes MUST include or update regression tests that fail before the fix and pass after it.
- Reviewers MUST verify constitution compliance as part of acceptance criteria.

## Governance

This constitution is the highest-priority project governance document. In case of conflict,
this constitution overrides informal practices and local preferences.

Amendment process:
- Amendments MUST be proposed in a pull request that explains rationale, affected principles,
	and migration impact.
- At least one maintainer approval is REQUIRED before merging constitutional changes.
- Ratification date records initial adoption; last amended date MUST be updated for any merged
	constitutional change.

Versioning policy:
- MAJOR: Backward-incompatible governance changes, principle removals, or principle redefinitions.
- MINOR: New principle or section, or substantial expansion of existing guidance.
- PATCH: Clarifications, wording improvements, and non-semantic refinements.

Compliance review expectations:
- Every pull request review MUST include an explicit check for constitution compliance.
- Exceptions MUST be documented in the pull request and followed by a tracked amendment or
	remediation task.

**Version**: 1.0.0 | **Ratified**: 2026-07-29 | **Last Amended**: 2026-07-29
