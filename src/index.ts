/**
 * @claudiv/vite-sdk - Vite plugin for Claudiv integration
 *
 * Enables Claudiv generation in Vite projects with HMR support.
 */

// Main plugin export
export { claudiv, claudivPlugin } from './plugin.js';

// Types
export type { ClaudivPluginOptions } from './types.js';

// Utilities (for advanced usage)
export { ClaudivViteWatcher } from './watcher.js';
