/**
 * Gen runner — one-shot diff -> process -> exit.
 */

import { readFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import {
  diffCdml,
  getChangedElements,
  assembleContext,
  loadContextManifest,
  executeClaudeHeadless,
  loadProject,
  parseSpecFile,
  parseResponse,
  commitFiles,
} from '@claudiv/core';
import type { GenOptions, ContextManifest, ProjectRegistry } from '@claudiv/core';
import { CdmlCache } from './cache.js';

export async function runGen(projectRoot: string, opts: GenOptions): Promise<void> {
  const manifestPath = join(projectRoot, 'claudiv.project.cdml');
  let registry: ProjectRegistry | null = null;
  if (existsSync(manifestPath)) {
    registry = await loadProject(manifestPath);
  }

  const contextPath = join(projectRoot, '.claudiv', 'context.cdml');
  let contextManifest: ContextManifest | null = null;
  if (existsSync(contextPath)) {
    contextManifest = await loadContextManifest(contextPath);
  }

  const entries = await readdir(projectRoot);
  const cdmlFiles = entries.filter((f) => f.endsWith('.cdml') && f !== 'claudiv.project.cdml');

  if (cdmlFiles.length === 0) {
    console.log('[claudiv:gen] No .cdml files found');
    return;
  }

  const cache = new CdmlCache();

  for (const cdmlFile of cdmlFiles) {
    const filePath = join(projectRoot, cdmlFile);
    const content = await readFile(filePath, 'utf-8');
    const oldContent = cache.get(cdmlFile) || '';
    const diff = diffCdml(oldContent, content);

    if (!diff.hasChanges && oldContent) {
      console.log(`[claudiv:gen] No changes in ${cdmlFile}`);
      continue;
    }

    const changes = getChangedElements(diff);
    console.log(`[claudiv:gen] Processing ${cdmlFile}: ${changes.length} change(s)`);

    const filteredChanges = opts.scope
      ? changes.filter((c: { path: string }) => c.path.includes(opts.scope!))
      : changes;

    for (const change of filteredChanges) {
      if (!contextManifest) {
        const parsed = parseSpecFile(content);
        if (parsed.component) console.log(`[claudiv:gen] Component: ${parsed.component.name}`);
        continue;
      }

      const assembled = await assembleContext(change, change.path, contextManifest, registry, projectRoot);

      if (opts.dryRun) {
        console.log(`[claudiv:gen] Dry run — prompt: ${assembled.prompt.length} chars`);
        continue;
      }

      const result = await executeClaudeHeadless(assembled, { mode: opts.mode || 'cli', apiKey: opts.apiKey });

      if (result.success) {
        const blocks = parseResponse(result.response);
        if (blocks.length > 0) {
          const commit = await commitFiles(blocks, projectRoot);
          for (const f of commit.written) {
            console.log(`[claudiv:gen] Wrote: ${f}`);
          }
          if (commit.error) {
            console.error(`[claudiv:gen] Commit failed (rolled back): ${commit.error}`);
          }
        } else {
          console.log(`[claudiv:gen] Generated (${result.durationMs}ms) — no file blocks detected`);
          process.stdout.write(result.response);
        }
      } else {
        console.error(`[claudiv:gen] Failed: ${result.error}`);
        process.exit(1);
      }
    }

    cache.set(cdmlFile, content);
  }

  console.log('[claudiv:gen] Done');
}
