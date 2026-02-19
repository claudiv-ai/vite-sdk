/**
 * Vite SDK — implements ClaudivSDK for Vite-based projects.
 */

import type { ClaudivSDK, FrameworkDetector, InitResult, DevOptions, GenOptions } from '@claudiv/core';
import { ViteDetector } from './detector.js';
import { initViteProject } from './init.js';
import { runDev } from './dev-runner.js';
import { runGen } from './gen-runner.js';

export class ViteSdk implements ClaudivSDK {
  name = 'vite';
  frameworkDetector: FrameworkDetector = new ViteDetector();

  async init(projectRoot: string): Promise<InitResult> {
    return initViteProject(projectRoot, this.frameworkDetector);
  }

  async dev(projectRoot: string, opts: DevOptions): Promise<void> {
    return runDev(projectRoot, opts);
  }

  async gen(projectRoot: string, opts: GenOptions): Promise<void> {
    return runGen(projectRoot, opts);
  }

  getScripts(): Record<string, string> {
    return {
      'claudiv:init': 'claudiv-vite-init',
      'claudiv:dev': 'claudiv-vite-dev',
      'claudiv:gen': 'claudiv-vite-gen',
      'claudiv:mode': 'claudiv-vite-mode',
    };
  }
}
