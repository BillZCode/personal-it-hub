export function encodeBase64(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64');
}

export function decodeBase64(input: string): string {
  return Buffer.from(input, 'base64').toString('utf8');
}

export function encodeUrl(input: string): string {
  return encodeURIComponent(input);
}

export function decodeUrl(input: string): string {
  return decodeURIComponent(input);
}

export function encodeHex(input: string): string {
  return Buffer.from(input, 'utf8').toString('hex');
}

export function decodeHex(input: string): string {
  return Buffer.from(input.replace(/\s+/g, ''), 'hex').toString('utf8');
}
