# Development Workflow

## Before Making Changes

1. Check `.ai-docs/plans/` for existing architecture decisions
2. Check `.ai-docs/context/` for domain knowledge
3. Read relevant instruction files in `.ai-docs/instructions/`

## Making Changes

1. Create a plan in `.ai-docs/plans/` for significant changes
2. Follow code style guidelines
3. Update documentation when making architectural decisions
4. **Write human documentation for new features** (see below)

## Documentation Requirements

Every new feature or significant change MUST include documentation:

### For Plans and Feature Implementations

When creating or implementing a plan:

1. **AI Context** (if needed): Add to `.ai-docs/context/` for AI assistant knowledge
2. **Human Documentation** (required): Add to `apps/docs/src/content/docs/`

### Documentation Locations

| What | Where |
|------|-------|
| Getting started / setup | `apps/docs/src/content/docs/getting-started/` |
| Architecture decisions | `apps/docs/src/content/docs/architecture/` |
| Development guides | `apps/docs/src/content/docs/development/` |
| API documentation | `apps/docs/src/content/docs/api/` |
| Operations / runbooks | `apps/docs/src/content/docs/operations/` |

### Documentation is NOT Optional

A feature is not complete until it is documented. This includes:

- How to use the feature
- Configuration options
- Code examples
- Related concepts

See `.ai-docs/instructions/documentation.instructions.md` for detailed guidelines.

## Commits

- Use conventional commits format
- Keep commits focused and atomic
- Reference issues/plans where applicable
- Include documentation changes in the same PR as code changes
