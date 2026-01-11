import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, '..');
const WORKSPACE_ROOT = resolve(PACKAGE_ROOT, '../..');
const SPEC_PATH = resolve(WORKSPACE_ROOT, 'specs/datto-rmm-openapi.json');
const OUTPUT_DIR = resolve(PACKAGE_ROOT, 'src/generated');
const OUTPUT_PATH = resolve(OUTPUT_DIR, 'types.ts');

console.log('Generating TypeScript types from OpenAPI spec...');
console.log(`  Spec: ${SPEC_PATH}`);
console.log(`  Output: ${OUTPUT_PATH}`);

// Check spec exists
if (!existsSync(SPEC_PATH)) {
  console.error(`Error: OpenAPI spec not found at ${SPEC_PATH}`);
  console.error('Run "pnpm sync:openapi" first to fetch the spec.');
  process.exit(1);
}

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Run openapi-typescript
try {
  execSync(`npx openapi-typescript "${SPEC_PATH}" -o "${OUTPUT_PATH}"`, {
    stdio: 'inherit',
    cwd: PACKAGE_ROOT,
  });
  console.log('\nTypes generated successfully!');
} catch (error) {
  console.error('Failed to generate types:', error);
  process.exit(1);
}
