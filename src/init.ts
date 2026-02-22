/**
 * Vite project initialization for Claudiv.
 *
 * Detects Vite project -> scans source -> generates .cdml + context.cdml
 * + project manifest -> adds claudiv:* scripts to package.json.
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import type { FrameworkDetector, InitResult } from '@claudiv/core';
import { scanProject } from '@claudiv/core';
import { addScripts } from './package-json.js';

export async function initViteProject(
  projectRoot: string,
  detector: FrameworkDetector
): Promise<InitResult> {
  const filesCreated: string[] = [];
  const warnings: string[] = [];

  const isVite = await detector.detect(projectRoot);
  if (!isVite) {
    return {
      success: false,
      filesCreated: [],
      scriptsAdded: {},
      warnings: ['Not a Vite project'],
    };
  }

  const scanResult = await scanProject(projectRoot, detector);

  // Create .claudiv directory
  const claudivDir = join(projectRoot, '.claudiv');
  if (!existsSync(claudivDir)) {
    await mkdir(claudivDir, { recursive: true });
  }

  // Write CDML skeleton
  const cdmlPath = join(projectRoot, `${scanResult.projectName}.cdml`);
  if (!existsSync(cdmlPath)) {
    await writeFile(cdmlPath, scanResult.cdmlContent, 'utf-8');
    filesCreated.push(`${scanResult.projectName}.cdml`);
  } else {
    warnings.push(`${scanResult.projectName}.cdml already exists, skipping`);
  }

  // Write context manifest
  const contextPath = join(claudivDir, 'context.cdml');
  if (!existsSync(contextPath)) {
    await writeFile(contextPath, scanResult.contextContent, 'utf-8');
    filesCreated.push('.claudiv/context.cdml');
  }

  // Write project manifest
  const manifestPath = join(projectRoot, 'claudiv.project.cdml');
  if (!existsSync(manifestPath)) {
    await writeFile(manifestPath, scanResult.projectManifestContent, 'utf-8');
    filesCreated.push('claudiv.project.cdml');
  }

  // Write default config
  const configPath = join(claudivDir, 'config.json');
  if (!existsSync(configPath)) {
    await writeFile(configPath, JSON.stringify({ mode: 'sdk' }, null, 2), 'utf-8');
    filesCreated.push('.claudiv/config.json');
  }

  // Add scripts to package.json
  const scripts: Record<string, string> = {
    'claudiv:init': 'claudiv-vite-init',
    'claudiv:dev': 'claudiv-vite-dev',
    'claudiv:gen': 'claudiv-vite-gen',
    'claudiv:mode': 'claudiv-vite-mode',
  };

  await addScripts(projectRoot, scripts);

  return {
    success: true,
    filesCreated,
    scriptsAdded: scripts,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}
