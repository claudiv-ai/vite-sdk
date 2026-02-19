/**
 * Vite SDK — implements ClaudivSDK for Vite-based projects.
 */
import type { ClaudivSDK, FrameworkDetector, InitResult, DevOptions, GenOptions } from '@claudiv/core';
export declare class ViteSdk implements ClaudivSDK {
    name: string;
    frameworkDetector: FrameworkDetector;
    init(projectRoot: string): Promise<InitResult>;
    dev(projectRoot: string, opts: DevOptions): Promise<void>;
    gen(projectRoot: string, opts: GenOptions): Promise<void>;
    getScripts(): Record<string, string>;
}
//# sourceMappingURL=plugin.d.ts.map