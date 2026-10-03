import { readFileSync, existsSync } from 'node:fs';

export function countText(contentOrPath: string): {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  bytes: number;
} {
  const content = existsSync(contentOrPath) ? readFileSync(contentOrPath, 'utf8') : contentOrPath;
  const characters = content.length;
  const charactersNoSpaces = content.replace(/\s/g, '').length;
  const words = content.trim().length === 0 ? 0 : content.trim().split(/\s+/).length;
  const lines = content.length === 0 ? 0 : content.split(/\r\n|\r|\n/).length;
  const bytes = Buffer.byteLength(content, 'utf8');

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    bytes
  };
}

export function toSlug(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function reverseText(input: string): string {
  return Array.from(input).reverse().join('');
}

export function testRegex(pattern: string, text: string, flags = 'g'): {
  matched: boolean;
  matchCount: number;
  matches: Array<{ match: string; index: number; groups?: Record<string, string> }>;
} {
  try {
    const rx = new RegExp(pattern, flags);
    const matches: Array<{ match: string; index: number; groups?: Record<string, string> }> = [];
    let m: RegExpExecArray | null;

    if (flags.includes('g')) {
      while ((m = rx.exec(text)) !== null) {
        matches.push({
          match: m[0],
          index: m.index,
          groups: m.groups ? { ...m.groups } : undefined
        });
        if (m.index === rx.lastIndex) {
          rx.lastIndex++;
        }
      }
    } else {
      m = rx.exec(text);
      if (m) {
        matches.push({
          match: m[0],
          index: m.index,
          groups: m.groups ? { ...m.groups } : undefined
        });
      }
    }

    return {
      matched: matches.length > 0,
      matchCount: matches.length,
      matches
    };
  } catch (err: unknown) {
    throw new Error(`Invalid Regular Expression: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export function explainRegex(pattern: string): string[] {
  const explanations: string[] = [];
  if (pattern.startsWith('^')) explanations.push('^ : Asserts position at start of a line');
  if (pattern.endsWith('$')) explanations.push('$ : Asserts position at end of a line');
  if (pattern.includes('\\d')) explanations.push('\\d : Matches any ASCII digit character [0-9]');
  if (pattern.includes('\\w')) explanations.push('\\w : Matches any word character (alphanumeric + underscore)');
  if (pattern.includes('\\s')) explanations.push('\\s : Matches any whitespace character (space, tab, newline)');
  if (pattern.includes('+')) explanations.push('+ : Matches 1 or more of the preceding token');
  if (pattern.includes('*')) explanations.push('* : Matches 0 or more of the preceding token');
  if (pattern.includes('?')) explanations.push('? : Matches 0 or 1 of the preceding token (or lazy quantifier)');
  if (pattern.includes('.')) explanations.push('. : Matches any character except line breaks');

  if (explanations.length === 0) {
    explanations.push(`Standard pattern matching substring: "${pattern}"`);
  }

  return explanations;
}
