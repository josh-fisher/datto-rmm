# Documentation Guidelines

This project uses [Starlight](https://starlight.astro.build/) for human-facing documentation, located in `apps/docs/`.

## When to Write Documentation

### ALWAYS document:

1. **New features** - Every user-facing feature needs documentation
2. **Architectural decisions** - Add to `apps/docs/src/content/docs/architecture/`
3. **API changes** - Update `apps/docs/src/content/docs/api/`
4. **Setup/configuration changes** - Update getting-started guides
5. **New packages** - Document in both AI context and human docs

### Documentation is REQUIRED for:

- Any new plan or feature implementation
- Breaking changes
- New CLI commands or scripts
- Integration guides
- Troubleshooting guides

## Documentation Structure

```
apps/docs/src/content/docs/
├── getting-started/     # Onboarding, setup, quick start
├── architecture/        # System design, decisions, patterns
├── development/         # Dev guides, best practices, workflows
├── api/                 # API reference documentation
└── operations/          # Deployment, monitoring, runbooks
```

## Writing Documentation

### File Format
- Use `.md` for standard documentation
- Use `.mdx` when you need interactive components

### Frontmatter (Required)
```yaml
---
title: Page Title
description: Brief description for search/SEO
---
```

### Content Guidelines
1. Start with a brief overview
2. Use clear headings (H2 for sections, H3 for subsections)
3. Include code examples where helpful
4. Link to related documentation
5. Keep content up-to-date with code changes

### MDX Components

Starlight provides built-in components:

```mdx
import { Card, CardGrid, Tabs, TabItem } from '@astrojs/starlight/components';

<CardGrid>
  <Card title="Feature" icon="rocket">
    Description here
  </Card>
</CardGrid>

<Tabs>
  <TabItem label="npm">npm install package</TabItem>
  <TabItem label="pnpm">pnpm add package</TabItem>
</Tabs>
```

## Adding New Documentation Pages

1. Create the file in the appropriate directory
2. Add frontmatter with title and description
3. Update `astro.config.mjs` sidebar if using manual sidebar entries
4. Link from related pages

## AI Documentation vs Human Documentation

| Type | Location | Purpose |
|------|----------|---------|
| AI Context | `.ai-docs/context/` | Background for AI assistants |
| AI Instructions | `.ai-docs/instructions/` | Rules for AI behavior |
| AI Plans | `.ai-docs/plans/` | Implementation plans |
| **Human Docs** | `apps/docs/` | User-facing documentation |

### Rule of Thumb
- **AI docs** (.ai-docs/): Information AI needs to work effectively
- **Human docs** (apps/docs/): Information developers need to use the project

## Running Documentation Locally

```bash
# From repo root
pnpm --filter @datto-rmm/docs dev

# Or from docs directory
cd apps/docs
pnpm dev
```

Documentation will be available at `http://localhost:4000`.

## Documentation Review Checklist

Before completing a feature, verify:

- [ ] Feature is documented in `apps/docs/`
- [ ] Code examples are accurate and tested
- [ ] Links to related docs work
- [ ] Frontmatter includes title and description
- [ ] Content follows style guidelines
