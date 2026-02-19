/**
 * Dev runner — watches .cdml files, diffs, processes changes.
 *
 * Flow: watch .cdml -> diff -> context engine -> headless Claude -> update
 */
import type { DevOptions } from '@claudiv/core';
export declare function runDev(projectRoot: string, opts: DevOptions): Promise<void>;
//# sourceMappingURL=dev-runner.d.ts.map