import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';

export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha512';

export function computeHash(contentOrPath: string, algo: HashAlgorithm): string {
  const hash = createHash(algo);

  if (existsSync(contentOrPath)) {
    const fileBuf = readFileSync(contentOrPath);
    hash.update(fileBuf);
  } else {
    hash.update(contentOrPath, 'utf8');
  }

  return hash.digest('hex');
}

export function generateRandomBytes(numBytes = 32, encoding: BufferEncoding = 'hex'): string {
  return randomBytes(numBytes).toString(encoding);
}

export function generateUUID(version: 'v4' = 'v4'): string {
  if (version === 'v4') {
    return randomUUID();
  }
  return randomUUID();
}

export function generatePassword(options: {
  length?: number;
  numbers?: boolean;
  symbols?: boolean;
  uppercase?: boolean;
  lowercase?: boolean;
}): string {
  const length = Math.max(4, Math.min(256, options.length ?? 16));
  const hasUpper = options.uppercase ?? true;
  const hasLower = options.lowercase ?? true;
  const hasNumbers = options.numbers ?? true;
  const hasSymbols = options.symbols ?? true;

  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const numChars = '0123456789';
  const symChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let charPool = '';
  const guaranteed: string[] = [];

  if (hasUpper) {
    charPool += upperChars;
    guaranteed.push(upperChars[randomBytes(1)[0] % upperChars.length]);
  }
  if (hasLower) {
    charPool += lowerChars;
    guaranteed.push(lowerChars[randomBytes(1)[0] % lowerChars.length]);
  }
  if (hasNumbers) {
    charPool += numChars;
    guaranteed.push(numChars[randomBytes(1)[0] % numChars.length]);
  }
  if (hasSymbols) {
    charPool += symChars;
    guaranteed.push(symChars[randomBytes(1)[0] % symChars.length]);
  }

  if (charPool === '') {
    charPool = lowerChars + numChars;
  }

  const remainingLength = length - guaranteed.length;
  const bytes = randomBytes(remainingLength);
  const resultChars = [...guaranteed];

  for (let i = 0; i < remainingLength; i++) {
    resultChars.push(charPool[bytes[i] % charPool.length]);
  }

  // Cryptographically shuffle array using Fisher-Yates
  for (let i = resultChars.length - 1; i > 0; i--) {
    const j = randomBytes(1)[0] % (i + 1);
    [resultChars[i], resultChars[j]] = [resultChars[j], resultChars[i]];
  }

  return resultChars.join('');
}
