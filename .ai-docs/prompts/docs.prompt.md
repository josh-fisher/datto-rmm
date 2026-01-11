# Documentation Generator

Generate human-facing documentation for a feature or component.

## Instructions

Create documentation in `apps/docs/src/content/docs/` following the Starlight format.

### For the given topic, create:

1. **Determine the correct section**:
   - `getting-started/` - Onboarding, setup guides
   - `architecture/` - System design, patterns, decisions
   - `development/` - Dev guides, workflows, best practices
   - `api/` - API reference documentation
   - `operations/` - Deployment, monitoring, runbooks

2. **Create the documentation file** with proper frontmatter:
   ```yaml
   ---
   title: Clear, Descriptive Title
   description: One-line description for search/SEO
   ---
   ```

3. **Include these sections as appropriate**:
   - Overview / Introduction
   - Prerequisites (if any)
   - Step-by-step instructions
   - Code examples
   - Configuration options
   - Troubleshooting / FAQ
   - Related documentation links

4. **Use MDX components** when helpful:
   - `<Card>` for feature highlights
   - `<Tabs>` for multiple options (npm/pnpm/yarn)
   - `<Steps>` for numbered procedures
   - Code blocks with syntax highlighting

### Output

Create the documentation file(s) and report what was created.

---

**Topic to document**: $ARGUMENTS
