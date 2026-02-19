#!/usr/bin/env node

/**
 * claudiv-vite-init — Initialize a Vite project for Claudiv.
 */

import { ViteSdk } from '../dist/index.js';

const sdk = new ViteSdk();
const projectRoot = process.cwd();

const result = await sdk.init(projectRoot);

if (result.success) {
  console.log('Claudiv initialized successfully!');
  console.log('Files created:');
  for (const file of result.filesCreated) {
    console.log(`  + ${file}`);
  }
  console.log('');
  console.log('Next steps:');
  console.log('  npm run claudiv:dev   — watch & generate');
  console.log('  npm run claudiv:gen   — one-shot generation');
  console.log('  npm run claudiv:mode  — switch CLI/API mode');
} else {
  console.error('Initialization failed:');
  for (const w of result.warnings || []) {
    console.error(`  ${w}`);
  }
  process.exit(1);
}
