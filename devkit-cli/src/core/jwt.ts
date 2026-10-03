export interface DecodedJWT {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  issuedAt?: string;
  expiresAt?: string;
  isExpired: boolean;
  issuer?: string;
  subject?: string;
  audience?: string | string[];
}

export function decodeJWT(token: string): DecodedJWT {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format: Token must have 3 dot-separated segments (header.payload.signature).');
  }

  function base64UrlDecode(str: string): string {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return Buffer.from(base64, 'base64').toString('utf8');
  }

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;

  try {
    header = JSON.parse(base64UrlDecode(parts[0]));
  } catch {
    throw new Error('Failed to decode JWT Header segment.');
  }

  try {
    payload = JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    throw new Error('Failed to decode JWT Payload segment.');
  }

  let isExpired = false;
  let expiresAt: string | undefined;
  let issuedAt: string | undefined;

  if (typeof payload.exp === 'number') {
    const expDate = new Date(payload.exp * 1000);
    expiresAt = expDate.toISOString();
    if (Date.now() > expDate.getTime()) {
      isExpired = true;
    }
  }

  if (typeof payload.iat === 'number') {
    issuedAt = new Date(payload.iat * 1000).toISOString();
  }

  return {
    header,
    payload,
    issuedAt,
    expiresAt,
    isExpired,
    issuer: typeof payload.iss === 'string' ? payload.iss : undefined,
    subject: typeof payload.sub === 'string' ? payload.sub : undefined,
    audience: typeof payload.aud === 'string' || Array.isArray(payload.aud) ? (payload.aud as string | string[]) : undefined
  };
}
