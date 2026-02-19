/**
 * Vite framework detector.
 *
 * Checks if a project uses Vite and extracts project metadata.
 */
import type { FrameworkDetector } from '@claudiv/core';
export declare class ViteDetector implements FrameworkDetector {
    detect(projectRoot: string): Promise<boolean>;
    getAppName(projectRoot: string): Promise<string>;
    getSourcePaths(projectRoot: string): Promise<string[]>;
    getIgnorePatterns(): string[];
}
//# sourceMappingURL=detector.d.ts.map