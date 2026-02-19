#!/usr/bin/env node

/**
 * claudiv-vite-gen — One-shot generation from .cdml files.
 */

import { runGen } from '../dist/gen-runner.js';
import { readFile } from 'fs/promises';
import { join, existsSync } from 'path';

const projectRoot = process.cwd();

// Load config
let opts = {};
const configPath = join(projectRoot, '.claudiv', 'config.json');
try {
  if (existsSync(configPath)) {
    opts = JSON.parse(await readFile(configPath, 'utf-8'));
  }
} catch {
  // Use defaults
}

// Check for --dry-run flag
if (process.argv.includes('--dry-run')) {
  opts.dryRun = true;
}

// Check for --scope flag
const scopeIdx = process.argv.indexOf('--scope');
if (scopeIdx !== -1 && process.argv[scopeIdx + 1]) {
  opts.scope = process.argv[scopeIdx + 1];
}

runGen(projectRoot, opts).catch((err) => {
  console.error(`[claudiv:gen] Fatal: ${err.message}`);
  process.exit(1);
});
