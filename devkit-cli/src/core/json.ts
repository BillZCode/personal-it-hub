import { readFileSync, existsSync } from 'node:fs';

export function formatJson(content: string, indent = 2): string {
  const parsed = JSON.parse(content);
  return JSON.stringify(parsed, null, indent);
}

export function minifyJson(content: string): string {
  const parsed = JSON.parse(content);
  return JSON.stringify(parsed);
}

export function validateJson(content: string): { valid: boolean; error?: string; line?: number } {
  try {
    JSON.parse(content);
    return { valid: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const lineMatch = errorMsg.match(/line (\d+)/i) || errorMsg.match(/position (\d+)/i);
    const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
    return { valid: false, error: errorMsg, line };
  }
}

export function getJsonPath(content: string, pathExpression: string): unknown {
  const parsed = JSON.parse(content);
  const keys = pathExpression.replace(/\[(\d+)\]/g, '.$1').split('.');

  let current: unknown = parsed;
  for (const k of keys) {
    if (!k) continue;
    if (current && typeof current === 'object' && k in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[k];
    } else {
      return undefined;
    }
  }

  return current;
}

export function inspectJson(content: string): {
  type: string;
  keysCount?: number;
  keys?: string[];
  arrayLength?: number;
  byteSize: number;
} {
  const parsed = JSON.parse(content);
  const byteSize = Buffer.byteLength(content, 'utf8');

  if (Array.isArray(parsed)) {
    return {
      type: 'Array',
      arrayLength: parsed.length,
      byteSize
    };
  }

  if (parsed !== null && typeof parsed === 'object') {
    const keys = Object.keys(parsed);
    return {
      type: 'Object',
      keysCount: keys.length,
      keys: keys.slice(0, 20),
      byteSize
    };
  }

  return {
    type: typeof parsed,
    byteSize
  };
}

export function parseJsonFileOrContent(input: string): string {
  if (existsSync(input)) {
    return readFileSync(input, 'utf8');
  }
  return input;
}
