import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export interface DevkitConfig {
  defaultFormat: 'plain' | 'json';
  defaultTimeout: number;
  apiAuthTokens?: Record<string, string>;
  preferredPackageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  authorName?: string;
  authorEmail?: string;
}

const DEFAULT_CONFIG: DevkitConfig = {
  defaultFormat: 'plain',
  defaultTimeout: 5000,
  preferredPackageManager: 'npm',
  authorName: 'Developer',
  authorEmail: 'dev@localhost'
};

function getConfigPath(): string {
  const baseDir = process.env.XDG_CONFIG_HOME || join(homedir(), '.config');
  const configDir = join(baseDir, 'devkit');
  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }
  return join(configDir, 'config.json');
}

export function loadConfig(): DevkitConfig {
  const file = getConfigPath();
  if (!existsSync(file)) {
    saveConfig(DEFAULT_CONFIG);
    return { ...DEFAULT_CONFIG };
  }
  try {
    const raw = readFileSync(file, 'utf8');
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(cfg: DevkitConfig): void {
  const file = getConfigPath();
  writeFileSync(file, JSON.stringify(cfg, null, 2), 'utf8');
}

export function getConfigValue<K extends keyof DevkitConfig>(key: K): DevkitConfig[K] {
  const cfg = loadConfig();
  return cfg[key];
}

export function setConfigValue<K extends keyof DevkitConfig>(key: K, val: DevkitConfig[K]): void {
  const cfg = loadConfig();
  cfg[key] = val;
  saveConfig(cfg);
}

export function resetConfig(): void {
  saveConfig(DEFAULT_CONFIG);
}
