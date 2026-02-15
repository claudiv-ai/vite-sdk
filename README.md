# @claudiv/vite-sdk

> Vite plugin for Claudiv integration - Add CDML generation with HMR to your Vite projects

[![npm version](https://img.shields.io/npm/v/@claudiv/vite-sdk.svg)](https://www.npmjs.com/package/@claudiv/vite-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

**@claudiv/vite-sdk** brings Claudiv's declarative generation capabilities to Vite projects with seamless Hot Module Replacement (HMR) integration.

**Features:**
- 🔥 **Hot Module Replacement** - Changes to .cdml files trigger instant reloads
- 📁 **Automatic File Watching** - Watches `claudiv/**/*.cdml` by default
- ⚡ **Vite-Optimized** - Leverages Vite's fast build pipeline
- 🔄 **Auto-Regeneration** - Code regenerates on .cdml file changes
- 🎯 **Type-Safe** - Full TypeScript support

## Installation

```bash
npm install --save-dev @claudiv/vite-sdk
```

**Peer Dependencies:**
- `vite` ^6.0.0

## Quick Start

### 1. Add Plugin to Vite Config

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { claudiv } from '@claudiv/vite-sdk';

export default defineConfig({
  plugins: [
    claudiv({
      specFile: 'claudiv/app.cdml',
      outputDir: 'src/generated'
    })
  ]
});
```

### 2. Create CDML File

```bash
mkdir claudiv
```

```xml
<!-- claudiv/app.cdml -->
<app target="html">
  <dashboard gen>
    Create an analytics dashboard with charts and stats
  </dashboard>
</app>
```

### 3. Run Vite

```bash
npm run dev
```

Changes to `claudiv/app.cdml` will automatically regenerate code and trigger HMR!

## Configuration

### Plugin Options

```typescript
interface ClaudivPluginOptions {
  /**
   * Path to main CDML spec file
   * @default 'claudiv/app.cdml'
   */
  specFile?: string;

  /**
   * Directory for generated code output
   * @default 'src/generated'
   */
  outputDir?: string;

  /**
   * Generation mode
   * - 'cli': Use Claude Code CLI (requires subscription)
   * - 'api': Use Anthropic API (pay-per-use)
   * @default 'cli'
   */
  mode?: 'cli' | 'api';

  /**
   * Default target language
   * @default 'html'
   */
  target?: 'html' | 'react' | 'vue' | 'python' | 'bash';

  /**
   * Enable/disable file watching
   * @default true
   */
  watch?: boolean;
}
```

### Full Example

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import { claudiv } from '@claudiv/vite-sdk';

export default defineConfig({
  plugins: [
    claudiv({
      specFile: 'claudiv/app.cdml',
      outputDir: 'src/generated',
      mode: 'api',      // Use Anthropic API
      target: 'react',  // Generate React components
      watch: true       // Enable HMR (default)
    })
  ]
});
```

## Project Structure

### Recommended Folder Layout

```
my-vite-app/
├── claudiv/               # CDML source files (version controlled)
│   ├── app.cdml          # Main spec
│   ├── components/       # Component specs
│   │   ├── header.cdml
│   │   └── footer.cdml
│   └── pages/            # Page specs
│       ├── home.cdml
│       └── about.cdml
│
├── src/
│   ├── generated/        # Generated code (gitignored)
│   │   ├── app.html
│   │   └── components/
│   └── main.ts           # Your entry point
│
├── .gitignore            # Ignore src/generated/
├── claudiv.json          # Claudiv config (optional)
├── package.json
└── vite.config.ts
```

### .gitignore

```gitignore
# Claudiv generated files
src/generated/

# Claudiv metadata
.claudiv/
```

## Usage Patterns

### Basic HTML Generation

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    claudiv({
      specFile: 'claudiv/app.cdml',
      target: 'html'
    })
  ]
});
```

```xml
<!-- claudiv/app.cdml -->
<app target="html">
  <landing-page gen>
    Hero section with gradient background,
    feature cards, and call-to-action buttons
  </landing-page>
</app>
```

Generated: `src/generated/app.html`

### React Components

```typescript
// vite.config.ts
import react from '@vitejs/plugin-react';
import { claudiv } from '@claudiv/vite-sdk';

export default defineConfig({
  plugins: [
    react(),
    claudiv({
      specFile: 'claudiv/app.cdml',
      target: 'react',
      outputDir: 'src/components'
    })
  ]
});
```

```xml
<!-- claudiv/app.cdml -->
<app target="react">
  <Dashboard gen>
    Analytics dashboard with charts using recharts
  </Dashboard>
</app>
```

Generated: `src/components/Dashboard.tsx`

### Multi-File Setup

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    claudiv({
      specFile: 'claudiv/**/*.cdml',  // Watch all .cdml files
      outputDir: 'src/generated'
    })
  ]
});
```

## API Mode Setup

### Using Anthropic API

1. Install @anthropic-ai/sdk:
```bash
npm install @anthropic-ai/sdk
```

2. Create `.env` file:
```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

3. Configure plugin:
```typescript
export default defineConfig({
  plugins: [
    claudiv({
      mode: 'api',
      specFile: 'claudiv/app.cdml'
    })
  ]
});
```

## CLI Mode Setup

### Using Claude Code Subscription

1. Install Claude Code:
```bash
# Follow installation at https://claude.ai/code
```

2. Configure plugin:
```typescript
export default defineConfig({
  plugins: [
    claudiv({
      mode: 'cli',  // Default mode
      specFile: 'claudiv/app.cdml'
    })
  ]
});
```

## Hot Module Replacement (HMR)

The plugin automatically enables HMR for .cdml files:

1. Edit your CDML file:
```xml
<!-- claudiv/app.cdml -->
<button gen>Make it blue</button>
```

2. Save the file
3. Browser automatically reloads with updated code
4. No manual refresh needed!

### HMR Behavior

- **Full Reload:** Changes to .cdml files trigger full page reload
- **Instant:** Vite's dev server provides sub-second feedback
- **Automatic:** No configuration needed - works out of the box

## Build-Time Generation

During production builds, Claudiv generates code before bundling:

```bash
npm run build
```

**Build Process:**
1. Parse all .cdml files
2. Generate code to `outputDir`
3. Vite bundles generated code
4. Outputs production-ready assets

## Advanced Usage

### Custom Watcher

```typescript
import { ClaudivViteWatcher } from '@claudiv/vite-sdk';

const watcher = new ClaudivViteWatcher({
  specFile: 'custom-path/**/*.cdml'
});

watcher.on('change', (file) => {
  console.log('CDML file changed:', file);
});

watcher.start();
```

### Programmatic Generation

```typescript
import { claudiv } from '@claudiv/vite-sdk';
import { generateCode } from '@claudiv/core';

// Use core package for custom logic
const generated = await generateCode(response, pattern, context);
```

## Troubleshooting

### Plugin Not Watching Files

**Issue:** Changes to .cdml files don't trigger reloads

**Solution:**
```typescript
// Ensure watch is enabled (default)
claudiv({
  watch: true,
  specFile: 'claudiv/**/*.cdml'  // Correct glob pattern
})
```

### Generated Files Not Found

**Issue:** Import errors for generated files

**Solution:**
1. Check `outputDir` matches import paths
2. Verify .cdml files have `gen` attributes
3. Check Vite dev server logs for generation errors

### API Key Not Found

**Issue:** `ANTHROPIC_API_KEY` not detected

**Solution:**
```bash
# Create .env file in project root
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
```

## Status

⚠️ **Alpha Release** - Core functionality implemented, active development ongoing

**Current Features:**
- ✅ File watching with HMR
- ✅ Basic code generation
- ✅ Vite dev server integration

**Planned Features:**
- 🚧 Build-time generation optimization
- 🚧 Source maps for debugging
- 🚧 Multi-target support in single project
- 🚧 Plugin hooks for customization

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Clean dist
npm run clean
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

MIT © 2026 Amir Guterman

See [LICENSE](./LICENSE) for details.

## Links

- **Homepage:** [https://claudiv.org](https://claudiv.org)
- **GitHub:** [https://github.com/claudiv-ai/vite-sdk](https://github.com/claudiv-ai/vite-sdk)
- **npm:** [https://npmjs.com/package/@claudiv/vite-sdk](https://npmjs.com/package/@claudiv/vite-sdk)
- **Documentation:** [https://docs.claudiv.org/vite-sdk](https://docs.claudiv.org/vite-sdk)

## Related Packages

- [@claudiv/core](https://npmjs.com/package/@claudiv/core) - Core generation engine
- [@claudiv/cli](https://npmjs.com/package/@claudiv/cli) - CLI tool for CDML generation

---

**Add declarative AI-powered generation to your Vite projects!**
