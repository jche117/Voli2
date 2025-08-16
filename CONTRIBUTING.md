# Contributing to Voli

## Workflow
1. Create a feature branch: `feat/<scope>-<desc>` or `fix/<issue>`.
2. Keep PRs small & focused; update docs/tests alongside code.
3. Run tests locally before pushing.
4. Open PR with summary & test notes.

## Commit Messages (Conventional Commits)
`type(scope): description`
Types: feat, fix, docs, style, refactor, perf, test, chore, build.

## Tests
Add at least: happy path, auth/permission failure (if secured), one edge case.

## Quality Checklist
- [ ] Tests pass
- [ ] No secrets committed
- [ ] Migrations added/updated if models changed
- [ ] Docs updated

## Security
Use strong SECRET_KEY; never commit real credentials.

## Roadmap Labels
`area/backend`, `area/web`, `area/mobile`, `techdebt`, `good-first-issue`.

## Versioning
Semantic versioning post-MVP.

Thanks for contributing!
