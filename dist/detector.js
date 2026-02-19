/**
 * Vite framework detector.
 *
 * Checks if a project uses Vite and extracts project metadata.
 */
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, basename } from 'path';
export class ViteDetector {
    async detect(projectRoot) {
        const configFiles = [
            'vite.config.ts',
            'vite.config.js',
            'vite.config.mts',
            'vite.config.mjs',
        ];
        for (const config of configFiles) {
            if (existsSync(join(projectRoot, config))) {
                return true;
            }
        }
        try {
            const pkgPath = join(projectRoot, 'package.json');
            if (existsSync(pkgPath)) {
                const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
                const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
                return 'vite' in allDeps;
            }
        }
        catch {
            // Ignore
        }
        return false;
    }
    async getAppName(projectRoot) {
        try {
            const pkgPath = join(projectRoot, 'package.json');
            if (existsSync(pkgPath)) {
                const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
                if (pkg.name)
                    return pkg.name.replace(/^@[^/]+\//, '');
            }
        }
        catch {
            // Fall through
        }
        return basename(projectRoot);
    }
    async getSourcePaths(projectRoot) {
        const candidates = ['src', 'lib', 'app', 'pages', 'components'];
        const result = [];
        for (const dir of candidates) {
            if (existsSync(join(projectRoot, dir))) {
                result.push(dir);
            }
        }
        return result.length > 0 ? result : ['src'];
    }
    getIgnorePatterns() {
        return [
            'node_modules',
            'dist',
            '.vite',
            'public',
        ];
    }
}
//# sourceMappingURL=detector.js.map