/**
 * Dev runner — watches .cdml files, diffs, processes changes.
 *
 * Flow: watch .cdml -> diff -> context engine -> headless Claude -> update
 */

import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import chokidar from 'chokidar';
import {
  diffCdml,
  getChangedElements,
  assembleContext,
  loadContextManifest,
  executeClaudeHeadless,
  loadProject,
  detectPlanDirectives,
  parsePlanQuestions,
  allQuestionsAnswered,
  questionsToFacts,
  serializeContextManifest,
  parseSpecFile,
} from '@claudiv/core';
import type { DevOptions, ContextManifest, ProjectRegistry } from '@claudiv/core';
import { CdmlCache } from './cache.js';

export async function runDev(projectRoot: string, opts: DevOptions): Promise<void> {
  const cache = new CdmlCache();
  const debounceMs = opts.debounceMs || 300;
  let processing = false;

  // Load project registry
  const manifestPath = join(projectRoot, 'claudiv.project.cdml');
  let registry: ProjectRegistry | null = null;
  if (existsSync(manifestPath)) {
    registry = await loadProject(manifestPath);
  }

  // Load context manifest
  const contextPath = join(projectRoot, '.claudiv', 'context.cdml');
  let contextManifest: ContextManifest | null = null;
  if (existsSync(contextPath)) {
    contextManifest = await loadContextManifest(contextPath);
  }

  // Watch .cdml files
  const watcher = chokidar.watch('**/*.cdml', {
    cwd: projectRoot,
    persistent: true,
    ignoreInitial: false,
    ignored: ['**/node_modules/**', '**/.claudiv/**', '**/claudiv.project.cdml'],
    awaitWriteFinish: { stabilityThreshold: debounceMs, pollInterval: 50 },
  });

  console.log('[claudiv:dev] Watching for .cdml changes...');

  // Cache files on initial scan
  watcher.on('add', async (relativePath) => {
    try {
      const content = await readFile(join(projectRoot, relativePath), 'utf-8');
      cache.set(relativePath, content);
    } catch {
      // Ignore
    }
  });

  watcher.on('change', async (relativePath) => {
    if (processing) return;
    processing = true;

    try {
      const filePath = join(projectRoot, relativePath);
      const newContent = await readFile(filePath, 'utf-8');
      const oldContent = cache.get(relativePath);

      if (!oldContent) {
        cache.set(relativePath, newContent);
        return;
      }

      const diff = diffCdml(oldContent, newContent);
      if (!diff.hasChanges) return;

      console.log(
        `[claudiv:dev] Change in ${relativePath}: ` +
        `+${diff.summary.added} -${diff.summary.removed} ~${diff.summary.modified}`
      );

      const changes = getChangedElements(diff);

      // Handle plan directives and questions
      const parsed = parseSpecFile(newContent);
      if (parsed.hasPlanQuestions) {
        const questions = parsePlanQuestions(parsed.dom);
        if (allQuestionsAnswered(questions)) {
          const facts = questionsToFacts(questions, `plan:${new Date().toISOString().split('T')[0]}`);
          if (contextManifest) {
            contextManifest.global.facts.push(...facts);
            await writeFile(contextPath, serializeContextManifest(contextManifest), 'utf-8');
          }
        }
      }

      // Process changes
      for (const change of changes) {
        if (!contextManifest) continue;

        const assembled = await assembleContext(change, change.path, contextManifest, registry, projectRoot);
        const result = await executeClaudeHeadless(assembled, { mode: opts.mode || 'cli', apiKey: opts.apiKey });

        if (result.success) {
          console.log(`[claudiv:dev] Generated (${result.durationMs}ms)`);
        } else {
          console.error(`[claudiv:dev] Failed: ${result.error}`);
        }
      }

      cache.set(relativePath, newContent);
    } catch (error) {
      console.error(`[claudiv:dev] Error: ${(error as Error).message}`);
    } finally {
      processing = false;
    }
  });

  // Block forever
  await new Promise(() => {});
}
