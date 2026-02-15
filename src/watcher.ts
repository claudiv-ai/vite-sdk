/**
 * CDML file watcher for Vite integration
 */

import { EventEmitter } from 'events';
import chokidar, { type FSWatcher } from 'chokidar';
import type { ClaudivPluginOptions } from './types.js';

export class ClaudivViteWatcher extends EventEmitter {
  private watcher: FSWatcher | null = null;
  private options: ClaudivPluginOptions;

  constructor(options: ClaudivPluginOptions) {
    super();
    this.options = options;
  }

  start() {
    const watchPattern = this.options.specFile || 'claudiv/**/*.cdml';

    this.watcher = chokidar.watch(watchPattern, {
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50,
      },
    });

    this.watcher.on('change', (path) => {
      this.emit('change', path);
    });

    this.watcher.on('add', (path) => {
      this.emit('add', path);
    });
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
}
