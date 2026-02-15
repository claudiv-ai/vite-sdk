/**
 * Vite SDK type definitions
 */

export interface ClaudivPluginOptions {
  /**
   * Path to the main .cdml spec file
   * @default 'claudiv/app.cdml'
   */
  specFile?: string;

  /**
   * Output directory for generated files
   * @default 'src/generated'
   */
  outputDir?: string;

  /**
   * Mode for Claude integration
   * - 'cli': Use Claude Code CLI
   * - 'api': Use Anthropic API directly
   * @default 'cli'
   */
  mode?: 'cli' | 'api';

  /**
   * Default target language/framework
   * @default 'html'
   */
  target?: string;

  /**
   * Enable file watching for hot reload
   * @default true
   */
  watch?: boolean;
}
