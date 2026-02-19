/**
 * Vite SDK — implements ClaudivSDK for Vite-based projects.
 */
import { ViteDetector } from './detector.js';
import { initViteProject } from './init.js';
import { runDev } from './dev-runner.js';
import { runGen } from './gen-runner.js';
export class ViteSdk {
    name = 'vite';
    frameworkDetector = new ViteDetector();
    async init(projectRoot) {
        return initViteProject(projectRoot, this.frameworkDetector);
    }
    async dev(projectRoot, opts) {
        return runDev(projectRoot, opts);
    }
    async gen(projectRoot, opts) {
        return runGen(projectRoot, opts);
    }
    getScripts() {
        return {
            'claudiv:init': 'claudiv-vite-init',
            'claudiv:dev': 'claudiv-vite-dev',
            'claudiv:gen': 'claudiv-vite-gen',
            'claudiv:mode': 'claudiv-vite-mode',
        };
    }
}
//# sourceMappingURL=plugin.js.map