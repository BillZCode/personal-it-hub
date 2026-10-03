import { existsSync, readFileSync } from 'node:fs';

const SENSITIVE_KEYWORDS = [
  'SECRET',
  'PASSWORD',
  'KEY',
  'TOKEN',
  'AUTH',
  'CREDENTIAL',
  'PRIVATE'
];

export function isSensitiveKey(key: string): boolean {
  const upper = key.toUpperCase();
  return SENSITIVE_KEYWORDS.some((kw) => upper.includes(kw));
}

export function parseEnvFile(filePath = '.env'): Record<string, string> {
  if (!existsSync(filePath)) {
    throw new Error(`Environment file "${filePath}" not found in current directory.`);
  }

  const content = readFileSync(filePath, 'utf8');
  const lines = content.split(/\r\n|\r|\n/);
  const result: Record<string, string> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let val = trimmed.slice(eqIndex + 1).trim();

    // Remove quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    result[key] = val;
  }

  return result;
}

export function getMaskedEnv(envObj: Record<string, string>): Record<string, string> {
  const masked: Record<string, string> = {};
  for (const [k, v] of Object.entries(envObj)) {
    if (isSensitiveKey(k)) {
      masked[k] = '[REDACTED]';
    } else {
      masked[k] = v;
    }
  }
  return masked;
}
