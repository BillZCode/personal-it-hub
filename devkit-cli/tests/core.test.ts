import { describe, it, expect } from 'vitest';
import { computeHash, generateUUID, generatePassword } from '../src/core/crypto.js';
import { calculateSubnet } from '../src/core/network.js';
import { formatJson, minifyJson, validateJson, getJsonPath } from '../src/core/json.js';
import { encodeBase64, decodeBase64 } from '../src/core/encode.js';
import { countText, toSlug } from '../src/core/text.js';
import { decodeJWT } from '../src/core/jwt.js';

describe('Devkit Crypto', () => {
  it('computes correct sha256 hash', () => {
    const hash = computeHash('hello', 'sha256');
    expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  it('generates valid UUID v4', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('generates strong passwords of given length', () => {
    const pass = generatePassword({ length: 24 });
    expect(pass.length).toBe(24);
  });
});

describe('Devkit Subnet Calculator', () => {
  it('correctly calculates /24 subnet properties', () => {
    const sub = calculateSubnet('192.168.1.0/24');
    expect(sub.networkAddress).toBe('192.168.1.0');
    expect(sub.broadcastAddress).toBe('192.168.1.255');
    expect(sub.subnetMask).toBe('255.255.255.0');
    expect(sub.usableHosts).toBe(254);
    expect(sub.firstUsableIp).toBe('192.168.1.1');
    expect(sub.lastUsableIp).toBe('192.168.1.254');
  });
});

describe('Devkit JSON Utilities', () => {
  it('formats and minifies JSON properly', () => {
    const raw = '{"a":1,"b":[2,3]}';
    expect(formatJson(raw)).toBe('{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}');
    expect(minifyJson(raw)).toBe('{"a":1,"b":[2,3]}');
    expect(validateJson(raw).valid).toBe(true);
    expect(getJsonPath(raw, 'b.1')).toBe(3);
  });
});

describe('Devkit Encoding & Text', () => {
  it('encodes and decodes base64 properly', () => {
    const text = 'Sabbil Devkit 2026';
    const b64 = encodeBase64(text);
    expect(decodeBase64(b64)).toBe(text);
  });

  it('counts characters, words, and slugs correctly', () => {
    const str = 'Personal IT Hub Toolkit';
    const count = countText(str);
    expect(count.words).toBe(4);
    expect(toSlug(str)).toBe('personal-it-hub-toolkit');
  });
});

describe('Devkit JWT Decoder', () => {
  it('decodes header and payload without verifying signature', () => {
    // Standard mock token: header={"alg":"HS256","typ":"JWT"}, payload={"sub":"user123","iat":1516239022}
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const decoded = decodeJWT(token);
    expect(decoded.header.alg).toBe('HS256');
    expect(decoded.payload.sub).toBe('user123');
    expect(decoded.subject).toBe('user123');
  });
});
