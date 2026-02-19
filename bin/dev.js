#!/usr/bin/env node

/**
 * claudiv-vite-dev — Watch .cdml files and process changes.
 */

import { runDev } from '../dist/dev-runner.js';
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

runDev(projectRoot, opts).catch((err) => {
  console.error(`[claudiv:dev] Fatal: ${err.message}`);
  process.exit(1);
});
