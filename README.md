# @claudiv/vite-sdk

> Vite framework SDK for the Claudiv declarative AI interaction platform

## Overview

@claudiv/vite-sdk integrates Claudiv into Vite projects as an add-on package. It provides `claudiv:*` npm scripts for initializing, watching, and generating from `.cdml` files.

## Installation

```bash
npm install --save-dev @claudiv/vite-sdk
```

On install, `claudiv:init` script is added to your `package.json`.

## npm Scripts

After `npm run claudiv:init`, these scripts are available:

```bash
npm run claudiv:init        # Scan project, generate .cdml + context
npm run claudiv:dev         # Watch .cdml files, diff and process
npm run claudiv:gen         # One-shot generation
npm run claudiv:mode        # Switch between cli/api mode
```

## How It Works

### Init
1. Detects Vite project (vite.config.* or vite in package.json)
2. Scans source directories (src/, lib/, app/, etc.)
3. Generates component `.cdml` skeleton
4. Generates `.claudiv/context.cdml` with scope-to-file mappings
5. Generates `claudiv.project.cdml` manifest
6. Adds remaining `claudiv:*` scripts to package.json

### Dev Mode
Watches `*.cdml` files with chokidar. On change:
1. Diffs against cached state
2. Processes changes through context engine
3. Executes headless Claude for each changed scope

### Gen Mode
One-shot processing. Supports `--scope` filter and `--dry-run`.

## SDK Interface

Implements `ClaudivSDK` from `@claudiv/core`:

```typescript
interface ClaudivSDK {
  name: string;
  frameworkDetector: FrameworkDetector;
  init(projectRoot: string): Promise<InitResult>;
  dev(projectRoot: string, opts: DevOptions): Promise<void>;
  gen(projectRoot: string, opts: GenOptions): Promise<void>;
  getScripts(): Record<string, string>;
}
```

## Bin Scripts

| Script | Purpose |
|--------|---------|
| `claudiv-vite-init` | Project initialization |
| `claudiv-vite-dev` | Dev mode watcher |
| `claudiv-vite-gen` | One-shot generation |
| `claudiv-vite-mode` | Mode selection prompt |

## License

MIT
