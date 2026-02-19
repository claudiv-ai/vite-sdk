/**
 * Gen runner — one-shot diff -> process -> exit.
 */
import { readFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { diffCdml, getChangedElements, assembleContext, loadContextManifest, executeClaudeHeadless, loadProject, parseSpecFile, } from '@claudiv/core';
import { CdmlCache } from './cache.js';
export async function runGen(projectRoot, opts) {
    const manifestPath = join(projectRoot, 'claudiv.project.cdml');
    let registry = null;
    if (existsSync(manifestPath)) {
        registry = await loadProject(manifestPath);
    }
    const contextPath = join(projectRoot, '.claudiv', 'context.cdml');
    let contextManifest = null;
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
            ? changes.filter((c) => c.path.includes(opts.scope))
            : changes;
        for (const change of filteredChanges) {
            if (!contextManifest) {
                const parsed = parseSpecFile(content);
                if (parsed.component)
                    console.log(`[claudiv:gen] Component: ${parsed.component.name}`);
                continue;
            }
            const assembled = await assembleContext(change, change.path, contextManifest, registry, projectRoot);
            if (opts.dryRun) {
                console.log(`[claudiv:gen] Dry run — prompt: ${assembled.prompt.length} chars`);
                continue;
            }
            const result = await executeClaudeHeadless(assembled, { mode: opts.mode || 'cli', apiKey: opts.apiKey });
            if (result.success) {
                console.log(`[claudiv:gen] Generated (${result.durationMs}ms)`);
                process.stdout.write(result.response);
            }
            else {
                console.error(`[claudiv:gen] Failed: ${result.error}`);
                process.exit(1);
            }
        }
        cache.set(cdmlFile, content);
    }
    console.log('[claudiv:gen] Done');
}
//# sourceMappingURL=gen-runner.js.map