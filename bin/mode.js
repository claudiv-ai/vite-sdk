#!/usr/bin/env node

/**
 * claudiv-vite-mode — Select CLI or API mode.
 */

import { selectMode } from '../dist/mode-selector.js';

selectMode(process.cwd()).catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
