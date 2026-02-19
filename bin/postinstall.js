#!/usr/bin/env node

/**
 * Postinstall hook: adds only claudiv:init to user's package.json.
 * Other scripts are added during init.
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const projectRoot = process.env.INIT_CWD || process.cwd();

async function main() {
  try {
    const pkgPath = join(projectRoot, 'package.json');
    const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));

    if (!pkg.scripts) pkg.scripts = {};

    // Only add init script on postinstall
    if (!pkg.scripts['claudiv:init']) {
      pkg.scripts['claudiv:init'] = 'claudiv-vite-init';
      await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
      console.log('[claudiv] Added claudiv:init script. Run: npm run claudiv:init');
    }
  } catch {
    // Silently skip if package.json can't be modified
  }
}

main();
