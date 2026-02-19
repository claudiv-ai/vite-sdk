/**
 * Package.json script management.
 */

import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export async function addScripts(
  projectRoot: string,
  scripts: Record<string, string>
): Promise<void> {
  const pkgPath = join(projectRoot, 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));

  if (!pkg.scripts) pkg.scripts = {};
  for (const [name, command] of Object.entries(scripts)) {
    pkg.scripts[name] = command;
  }

  await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
}

export async function removeScripts(
  projectRoot: string,
  scriptNames: string[]
): Promise<void> {
  const pkgPath = join(projectRoot, 'package.json');
  const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));

  if (!pkg.scripts) return;
  for (const name of scriptNames) delete pkg.scripts[name];

  await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
}
