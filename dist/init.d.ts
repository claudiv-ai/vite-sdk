/**
 * Vite project initialization for Claudiv.
 *
 * Detects Vite project -> scans source -> generates .cdml + context.cdml
 * + project manifest -> adds claudiv:* scripts to package.json.
 */
import type { FrameworkDetector, InitResult } from '@claudiv/core';
export declare function initViteProject(projectRoot: string, detector: FrameworkDetector): Promise<InitResult>;
//# sourceMappingURL=init.d.ts.map