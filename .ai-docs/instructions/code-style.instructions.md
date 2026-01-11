# Code Style Guidelines

## TypeScript

- Strict mode enabled
- Prefer explicit types over inference for public APIs
- Avoid `any` - use `unknown` with type guards when needed
- Use type imports: `import type { Foo } from './foo'`

## Formatting & Linting

- ESLint for linting
- Prettier for formatting
- Run `pnpm lint` before committing

## Naming Conventions

- Files: kebab-case (`my-component.ts`)
- Classes/Types/Interfaces: PascalCase
- Functions/Variables: camelCase
- Constants: SCREAMING_SNAKE_CASE
