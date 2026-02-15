/**
 * Vite plugin for Claudiv integration
 */

import type { Plugin } from 'vite';
import { ClaudivViteWatcher } from './watcher.js';
import type { ClaudivPluginOptions } from './types.js';

/**
 * Claudiv Vite plugin
 *
 * Integrates Claudiv generation with Vite's dev server and build process.
 * Watches .cdml files and regenerates code with HMR support.
 */
export function claudiv(options: ClaudivPluginOptions = {}): Plugin {
  let watcher: ClaudivViteWatcher;

  const config = {
    specFile: options.specFile || 'claudiv/app.cdml',
    outputDir: options.outputDir || 'src/generated',
    mode: options.mode || 'cli',
    target: options.target || 'html',
    watch: options.watch !== false, // Default to true
  };

  return {
    name: 'claudiv',

    async configureServer(server) {
      if (!config.watch) return;

      // Initialize watcher for .cdml files
      watcher = new ClaudivViteWatcher(config);
      watcher.start();

      // Handle .cdml file changes
      watcher.on('change', async (cdmlFile) => {
        server.ws.send({
          type: 'full-reload',
          path: '*',
        });
      });
    },

    async buildStart() {
      // Generate all code before build
      // TODO: Implement build-time generation
    },

    async closeBundle() {
      if (watcher) {
        watcher.stop();
      }
    },
  };
}

// Export alias for convenience
export const claudivPlugin = claudiv;
