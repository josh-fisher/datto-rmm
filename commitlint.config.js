export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation only
        'style',    // Code style (formatting, semicolons, etc)
        'refactor', // Code refactoring
        'perf',     // Performance improvement
        'test',     // Adding or updating tests
        'build',    // Build system or dependencies
        'ci',       // CI configuration
        'chore',    // Other changes (tooling, etc)
        'revert',   // Revert a previous commit
      ],
    ],
    'scope-enum': [
      1,
      'always',
      [
        'api',      // TypeScript API client
        'rust',     // Rust API client
        'docs',     // Documentation
        'specs',    // OpenAPI specs
        'ci',       // CI/CD workflows
        'deps',     // Dependencies
      ],
    ],
  },
};
