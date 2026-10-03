// DevKit Client Engine - Pure Client-side Developer Tools mirroring CLI capabilities

// 1. Navigation switching
function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(el => el.style.display = 'none');

  const navEl = document.getElementById(`nav-${tabId}`);
  const paneEl = document.getElementById(`pane-${tabId}`);
  if (navEl) navEl.classList.add('active');
  if (paneEl) paneEl.style.display = 'block';
}

// 2. Subnet Calculator
function runSubnetCalc() {
  const cidrInput = document.getElementById('subnet-cidr').value.trim();
  const [ip, maskStr] = cidrInput.split('/');
  const prefix = parseInt(maskStr, 10);

  if (!ip || isNaN(prefix) || prefix < 0 || prefix > 32) {
    alert('Format CIDR tidak valid. Contoh: 192.168.1.0/24');
    return;
  }

  function ipToLong(ipStr) {
    return ipStr.split('.').reduce((acc, oct) => ((acc << 8) + parseInt(oct, 10)) >>> 0, 0);
  }

  function longToIp(long) {
    return [(long >>> 24) & 255, (long >>> 16) & 255, (long >>> 8) & 255, long & 255].join('.');
  }

  const ipLong = ipToLong(ip);
  const maskLong = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const wildcardLong = ~maskLong >>> 0;
  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | wildcardLong) >>> 0;
  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : totalHosts - 2;
  const firstUsable = prefix >= 31 ? networkLong : networkLong + 1;
  const lastUsable = prefix >= 31 ? broadcastLong : broadcastLong - 1;

  document.getElementById('sub-net').innerText = longToIp(networkLong);
  document.getElementById('sub-bcast').innerText = longToIp(broadcastLong);
  document.getElementById('sub-mask').innerText = longToIp(maskLong);
  document.getElementById('sub-wildcard').innerText = longToIp(wildcardLong);
  document.getElementById('sub-range').innerText = `${longToIp(firstUsable)} - ${longToIp(lastUsable)}`;
  document.getElementById('sub-hosts').innerText = usableHosts.toLocaleString();
}

// 3. Cryptographic Hashes & Passwords
async function runHash() {
  const text = document.getElementById('hash-input').value;
  const enc = new TextEncoder();
  const data = enc.encode(text);

  const hashBuf256 = await crypto.subtle.digest('SHA-256', data);
  const hashArray256 = Array.from(new Uint8Array(hashBuf256));
  const sha256Hex = hashArray256.map(b => b.toString(16).padStart(2, '0')).join('');

  const hashBuf512 = await crypto.subtle.digest('SHA-512', data);
  const hashArray512 = Array.from(new Uint8Array(hashBuf512));
  const sha512Hex = hashArray512.map(b => b.toString(16).padStart(2, '0')).join('');

  document.getElementById('hash-sha256').innerText = sha256Hex;
  document.getElementById('hash-sha512').innerText = sha512Hex;
}

function runGeneratePassword() {
  const length = parseInt(document.getElementById('pass-len').value, 10) || 20;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  const pass = Array.from(array).map(x => chars[x % chars.length]).join('');
  document.getElementById('pass-output').value = pass;
}

function runGenerateUUID() {
  const uuid = crypto.randomUUID();
  document.getElementById('uuid-output').value = uuid;
}

// 4. JSON Tools
function runJsonFormat() {
  const raw = document.getElementById('json-input').value;
  try {
    const parsed = JSON.parse(raw);
    document.getElementById('json-output').innerText = JSON.stringify(parsed, null, 2);
    document.getElementById('json-status').innerText = '✓ Valid JSON (Formatted)';
    document.getElementById('json-status').style.color = '#10b981';
  } catch (e) {
    document.getElementById('json-output').innerText = `Error: ${e.message}`;
    document.getElementById('json-status').innerText = '✗ Syntax Error';
    document.getElementById('json-status').style.color = '#ef4444';
  }
}

function runJsonMinify() {
  const raw = document.getElementById('json-input').value;
  try {
    const parsed = JSON.parse(raw);
    document.getElementById('json-output').innerText = JSON.stringify(parsed);
    document.getElementById('json-status').innerText = '✓ Minified';
    document.getElementById('json-status').style.color = '#10b981';
  } catch (e) {
    document.getElementById('json-output').innerText = `Error: ${e.message}`;
    document.getElementById('json-status').innerText = '✗ Syntax Error';
    document.getElementById('json-status').style.color = '#ef4444';
  }
}

// 5. JWT Decode
function runJwtDecode() {
  const token = document.getElementById('jwt-input').value.trim();
  const parts = token.split('.');
  if (parts.length !== 3) {
    document.getElementById('jwt-output').innerText = 'Invalid token structure. Must have 3 parts separated by dots.';
    return;
  }

  function b64decode(str) {
    let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    return decodeURIComponent(escape(window.atob(b64)));
  }

  try {
    const header = JSON.parse(b64decode(parts[0]));
    const payload = JSON.parse(b64decode(parts[1]));

    let status = 'Status: Valid Structure (Signatures Unverified)';
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000);
      if (Date.now() > expDate.getTime()) {
        status += `\n⚠️ EXPIRED on ${expDate.toISOString()}`;
      } else {
        status += `\n✓ Active until ${expDate.toISOString()}`;
      }
    }

    document.getElementById('jwt-output').innerText = `${status}\n\nHEADER:\n${JSON.stringify(header, null, 2)}\n\nPAYLOAD:\n${JSON.stringify(payload, null, 2)}`;
  } catch (e) {
    document.getElementById('jwt-output').innerText = `Decode error: ${e.message}`;
  }
}

// 6. Base64 & Encoders
function runEncodeBase64() {
  const val = document.getElementById('enc-input').value;
  document.getElementById('enc-output').value = btoa(unescape(encodeURIComponent(val)));
}

function runDecodeBase64() {
  const val = document.getElementById('enc-input').value;
  try {
    document.getElementById('enc-output').value = decodeURIComponent(escape(atob(val)));
  } catch {
    document.getElementById('enc-output').value = 'Error: Invalid base64 string';
  }
}

// 7. Regex Tester
function runRegexTest() {
  const pattern = document.getElementById('regex-pattern').value;
  const flags = document.getElementById('regex-flags').value || 'g';
  const text = document.getElementById('regex-text').value;

  try {
    const rx = new RegExp(pattern, flags);
    const matches = [];
    let m;
    while ((m = rx.exec(text)) !== null) {
      matches.push(`Match: "${m[0]}" at position ${m.index}`);
      if (m.index === rx.lastIndex) rx.lastIndex++;
    }

    if (matches.length > 0) {
      document.getElementById('regex-output').innerText = `✓ Total Matches: ${matches.length}\n\n${matches.join('\n')}`;
    } else {
      document.getElementById('regex-output').innerText = 'No matches found.';
    }
  } catch (e) {
    document.getElementById('regex-output').innerText = `Regex error: ${e.message}`;
  }
}

// 8. Time telemetry
function updateTimeClock() {
  const now = new Date();
  const unixSec = Math.floor(now.getTime() / 1000);
  const unixMs = now.getTime();
  const iso = now.toISOString();

  const secEl = document.getElementById('clock-unix-sec');
  const msEl = document.getElementById('clock-unix-ms');
  const isoEl = document.getElementById('clock-iso');

  if (secEl) secEl.innerText = unixSec;
  if (msEl) msEl.innerText = unixMs;
  if (isoEl) isoEl.innerText = iso;
}

// 9. Go CLI Snippet Viewer
function loadCliSnippet(cmdName) {
  const terminal = document.getElementById('cli-mock-terminal');
  if (!terminal) return;

  const snippets = {
    'devkit doctor': `$ devkit doctor\n\nDEVKIT DOCTOR - ENVIRONMENT DIAGNOSTIC\n──────────────────────────────────────────────\nOS: linux | Arch: amd64 | CPUs: 4 | Host Go: go1.22.7\n\n✓ Go             go version go1.22.7 linux/amd64\n✓ Git            git version 2.47.3\n✓ Docker         Docker version 29.7.2, build a7dcaa6\n✓ Node.js        v20.18.0\n✓ npm            10.8.2\n✓ Python         Python 3.13.5\n✓ SSH            OpenSSH_10.0p2 Debian\n✓ cURL           curl 8.14.1\n✓ Wget           GNU Wget 1.25.0\n\n✓ Your developer workstation is fully operational!`,
    'devkit project info .': `$ devkit project info .\n\nPROJECT INFORMATION\n───────────────────────────\nType:             Node.js Application\nLanguage:         TypeScript\nFramework:        Vite / React\nPackage Manager:  npm\nGit Repository:   true\nDirectories:      126\nFiles:            605\nTotal Size:       44.43 MB\n\nLargest files:\n  devkit-cli/bin/devkit                      11.03 MB\n  frontend/public/images/personal/bukiyou_senpai.png 1016.36 KB`,
    'devkit clean --dry-run': `$ devkit clean --dry-run\n\nWORKSPACE ARTIFACT SCANNER\n──────────────────────────────────\nPotential cleanup:\n  backend/dist                    265.00 KB  (Build output directory)\n  backend/node_modules              2.18 MB  (Node.js dependencies)\n  devkit-cli/dist                  67.02 KB  (Build output directory)\n  frontend/dist                    18.98 MB  (Build output directory)\n  frontend/node_modules            34.28 MB  (Node.js dependencies)\n  node_modules                    302.28 MB  (Node.js dependencies)\n\nTotal reclaimable: 358.04 MB\n\nℹ Dry-run active: no files were removed.`,
    'devkit markdown links README.md': `$ devkit markdown links README.md\n\nMARKDOWN LINK INTEGRITY AUDIT\n─────────────────────────────────────\nFiles checked: 1\nLinks checked: 3\nBroken links:  0\n\n✓ All links verified successfully!`
  };

  terminal.innerText = snippets[cmdName] || `$ ${cmdName}\nExecuting...`;
}

setInterval(updateTimeClock, 1000);
window.onload = () => {
  updateTimeClock();
  runSubnetCalc();
  runGeneratePassword();
  runGenerateUUID();
  loadCliSnippet('devkit doctor');
};

