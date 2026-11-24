import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const ciPath = path.resolve('.github/workflows/ci.yml');

if (!fs.existsSync(ciPath)) {
  console.error(`FAIL: CI workflow file not found at ${ciPath}`);
  process.exit(1);
}

const fileContent = fs.readFileSync(ciPath, 'utf8');
let parsed;

try {
  parsed = YAML.parse(fileContent);
  console.log('✓ .github/workflows/ci.yml is valid YAML');
} catch (err) {
  console.error('FAIL: Failed to parse .github/workflows/ci.yml as YAML:', err);
  process.exit(1);
}

// 1. Verify Triggers
if (!parsed.on || !parsed.on.push || !parsed.on.pull_request) {
  console.error("FAIL: Workflow must trigger on 'push' and 'pull_request'");
  process.exit(1);
}
console.log("✓ CI triggers on 'push' and 'pull_request' to main");

// 2. Verify Concurrency cancellation
if (!parsed.concurrency || !parsed.concurrency['cancel-in-progress']) {
  console.error("FAIL: Workflow must configure concurrency with 'cancel-in-progress: true'");
  process.exit(1);
}
console.log('✓ Concurrency cancellation configured');

// 3. Verify Job steps
const jobs = parsed.jobs || {};
const jobKey = Object.keys(jobs)[0];
if (!jobKey) {
  console.error('FAIL: No jobs defined in CI workflow');
  process.exit(1);
}

const steps = jobs[jobKey].steps || [];
const stepRuns = steps.map((s) => s.run || s.uses || '').join('\n');

const requiredSteps = [
  { name: 'Checkout repository', pattern: 'actions/checkout' },
  { name: 'Setup pnpm', pattern: 'pnpm/action-setup' },
  { name: 'Setup Node.js', pattern: 'actions/setup-node' },
  { name: 'Install dependencies', pattern: 'pnpm install' },
  { name: 'Validate Docker Compose', pattern: 'pnpm run test:compose' },
  { name: 'ESLint', pattern: 'pnpm run lint' },
  { name: 'TypeScript Type-Check', pattern: 'pnpm run type-check' },
  { name: 'Test suite', pattern: 'pnpm run test' },
  { name: 'Build applications', pattern: 'pnpm run build' },
];

for (const req of requiredSteps) {
  if (!stepRuns.includes(req.pattern)) {
    console.error(`FAIL: Missing mandatory CI step: ${req.name} (${req.pattern})`);
    process.exit(1);
  }
  console.log(`✓ Step '${req.name}' is present`);
}

console.log('\nAll CI workflow validations passed successfully!');
