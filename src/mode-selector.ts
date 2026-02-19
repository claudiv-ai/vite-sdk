/**
 * Mode selector — prompt user to choose CLI or API mode.
 * Writes selection to .claudiv/config.json.
 */

import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import prompts from 'prompts';

export async function selectMode(projectRoot: string): Promise<void> {
  const response = await prompts({
    type: 'select',
    name: 'mode',
    message: 'How should Claudiv invoke Claude?',
    choices: [
      { title: 'CLI (claude --print)', description: 'Requires claude CLI installed', value: 'cli' },
      { title: 'API (Anthropic SDK)', description: 'Requires ANTHROPIC_API_KEY', value: 'api' },
    ],
    initial: 0,
  });

  if (!response.mode) {
    console.log('Cancelled');
    return;
  }

  const config: Record<string, any> = { mode: response.mode };

  if (response.mode === 'api') {
    const apiKeyResponse = await prompts({
      type: 'text',
      name: 'apiKey',
      message: 'Enter your Anthropic API key (or set ANTHROPIC_API_KEY env var):',
    });
    if (apiKeyResponse.apiKey) config.apiKey = apiKeyResponse.apiKey;
  }

  const claudivDir = join(projectRoot, '.claudiv');
  if (!existsSync(claudivDir)) await mkdir(claudivDir, { recursive: true });

  await writeFile(join(claudivDir, 'config.json'), JSON.stringify(config, null, 2), 'utf-8');
  console.log(`Mode set to: ${response.mode}`);
}
