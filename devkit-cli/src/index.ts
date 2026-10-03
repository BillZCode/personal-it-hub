import { Command } from 'commander';
import chalk from 'chalk';
import { askSelect, askText } from './utils/prompter.js';
import { formatSuccess, formatError, formatWarning, formatInfo, renderOutput, renderTable } from './formatters/output.js';
import { getInput } from './utils/stdin.js';
import { computeHash, generateRandomBytes, generateUUID, generatePassword } from './core/crypto.js';
import { decodeJWT } from './core/jwt.js';
import { calculateSubnet, lookupDns, getLocalIpAddresses } from './core/network.js';
import { getSystemInfo, runDoctorAudit } from './core/system.js';
import { formatJson, minifyJson, validateJson, getJsonPath, inspectJson, parseJsonFileOrContent } from './core/json.js';
import { encodeBase64, decodeBase64, encodeUrl, decodeUrl, encodeHex, decodeHex } from './core/encode.js';
import { countText, toSlug, reverseText, testRegex, explainRegex } from './core/text.js';
import { parseTime } from './core/time.js';
import { parseEnvFile, getMaskedEnv } from './core/env.js';
import { getGitSummary } from './core/git.js';
import { measureHttpTiming, requestApi } from './core/http.js';
import { initProject } from './core/project.js';
import { loadConfig, setConfigValue, resetConfig } from './config/manager.js';

export function createProgram(): Command {
  const program = new Command();

  program
    .name('devkit')
    .description(chalk.bold('devkit-cli: Modern Developer Toolbox for Terminal & Workstations'))
    .version('1.0.0', '-v, --version', 'Output current devkit-cli version')
    .option('--json', 'Output results in valid JSON format')
    .option('--quiet', 'Suppress non-essential output')
    .option('--verbose', 'Show extended diagnostic details');

  // ==========================================
  // DOCTOR
  // ==========================================
  program
    .command('doctor')
    .description('Run comprehensive developer environment diagnostic')
    .action(async () => {
      const opts = program.opts();
      const audit = runDoctorAudit();

      if (opts.json) {
        console.log(JSON.stringify(audit, null, 2));
        return;
      }

      console.log(chalk.bold('\nDEVKIT DOCTOR DIAGNOSTIC'));
      console.log(chalk.dim('─'.repeat(40)));

      let hasIssues = false;
      for (const item of audit) {
        if (item.status === 'ok') {
          console.log(`${chalk.green('✓')} ${chalk.bold(item.name)}: ${chalk.dim(item.versionOrInfo || 'OK')}`);
        } else if (item.status === 'warning') {
          console.log(`${chalk.yellow('⚠')} ${chalk.bold(item.name)}: ${item.message || 'Warning'}`);
          if (item.solution) console.log(`  ${chalk.dim('Solution:')} ${item.solution}`);
        } else {
          hasIssues = true;
          console.log(`${chalk.red('✗')} ${chalk.bold(item.name)}: ${item.message || 'Error'}`);
          if (item.solution) console.log(`  ${chalk.cyan('Solution:')} ${item.solution}`);
        }
      }
      console.log(chalk.dim('─'.repeat(40)));
      if (!hasIssues) {
        console.log(chalk.green('All core development utilities are operational.\n'));
      }
    });

  // ==========================================
  // SYSTEM
  // ==========================================
  const systemCmd = program.command('system').description('System inspection and telemetry utilities');

  systemCmd
    .command('info')
    .description('Display detailed operating system, CPU, memory, and runtime specs')
    .action(() => {
      const opts = program.opts();
      const sys = getSystemInfo();

      if (opts.json) {
        console.log(JSON.stringify(sys, null, 2));
        return;
      }

      console.log(chalk.bold('\nDEVKIT SYSTEM TELEMETRY'));
      console.log(chalk.dim('─'.repeat(45)));
      const rows = [
        ['OS', sys.os],
        ['Kernel', sys.kernel],
        ['Architecture', sys.architecture],
        ['CPU Model', sys.cpuModel],
        ['CPU Cores', sys.cpuCores],
        ['Total Memory', sys.totalMemoryGb],
        ['Used Memory', sys.usedMemoryGb],
        ['Free Memory', sys.freeMemoryGb],
        ['Hostname', sys.hostname],
        ['Uptime', sys.uptimeHours],
        ['Node.js', sys.nodeVersion],
        ['npm', sys.npmVersion || 'Not found'],
        ['Git', sys.gitVersion || 'Not found']
      ];
      renderTable(['Property', 'Value'], rows);
      console.log();
    });

  // ==========================================
  // JSON
  // ==========================================
  const jsonCmd = program.command('json').description('JSON validation, formatting, and query utilities');

  jsonCmd
    .command('format [file]')
    .description('Pretty-print JSON with 2-space indentation')
    .action(async (file) => {
      try {
        const raw = await getInput(undefined, file);
        if (!raw) {
          formatError('No JSON input provided', 'Provide a file argument or pipe input through stdin.');
          return;
        }
        console.log(formatJson(raw));
      } catch (e: unknown) {
        formatError('Failed to parse JSON', e instanceof Error ? e.message : String(e));
      }
    });

  jsonCmd
    .command('minify [file]')
    .description('Minify JSON into a single line string')
    .action(async (file) => {
      try {
        const raw = await getInput(undefined, file);
        console.log(minifyJson(raw));
      } catch (e: unknown) {
        formatError('Failed to minify JSON', e instanceof Error ? e.message : String(e));
      }
    });

  jsonCmd
    .command('validate [file]')
    .description('Validate whether input JSON is strictly syntactically sound')
    .action(async (file) => {
      const raw = await getInput(undefined, file);
      const res = validateJson(raw);
      if (res.valid) {
        formatSuccess('Valid JSON structure.');
      } else {
        formatError('Invalid JSON structure', res.error, res.line ? `Check around line ${res.line}` : undefined);
        process.exitCode = 1;
      }
    });

  jsonCmd
    .command('get <path> [file]')
    .description('Query JSON property by dot notation (e.g. devkit json get dependencies.react package.json)')
    .action(async (pathKey, file) => {
      try {
        const raw = await getInput(undefined, file);
        const val = getJsonPath(raw, pathKey);
        renderOutput(val, program.opts());
      } catch (e: unknown) {
        formatError('Error extracting JSON path', e instanceof Error ? e.message : String(e));
      }
    });

  jsonCmd
    .command('inspect [file]')
    .description('Inspect JSON structure size, type, and top-level key counts')
    .action(async (file) => {
      try {
        const raw = await getInput(undefined, file);
        const data = inspectJson(raw);
        renderOutput(data, program.opts(), (d) => {
          const info = d as ReturnType<typeof inspectJson>;
          console.log(chalk.bold('\nJSON Inspection Report:'));
          console.log(`  Type:       ${info.type}`);
          console.log(`  Size:       ${info.byteSize} bytes`);
          if (info.keysCount !== undefined) console.log(`  Keys Count: ${info.keysCount}`);
          if (info.arrayLength !== undefined) console.log(`  Array Size: ${info.arrayLength}`);
          if (info.keys) console.log(`  Sample Keys: ${info.keys.join(', ')}`);
          console.log();
        });
      } catch (e: unknown) {
        formatError('Failed to inspect JSON', e instanceof Error ? e.message : String(e));
      }
    });

  // ==========================================
  // ENCODE & DECODE
  // ==========================================
  const encodeCmd = program.command('encode').description('Encoding conversion tools (base64, url, hex)');
  encodeCmd
    .command('base64 [input]')
    .description('Encode string or piped data to Base64')
    .action(async (input) => {
      const data = await getInput(input);
      console.log(encodeBase64(data));
    });

  encodeCmd
    .command('url [input]')
    .description('Encode string to URI component')
    .action(async (input) => {
      const data = await getInput(input);
      console.log(encodeUrl(data));
    });

  encodeCmd
    .command('hex [input]')
    .description('Encode string to Hexadecimal representation')
    .action(async (input) => {
      const data = await getInput(input);
      console.log(encodeHex(data));
    });

  const decodeCmd = program.command('decode').description('Decoding conversion tools (base64, url, hex)');
  decodeCmd
    .command('base64 [input]')
    .description('Decode Base64 string to utf8')
    .action(async (input) => {
      const data = await getInput(input);
      console.log(decodeBase64(data));
    });

  decodeCmd
    .command('url [input]')
    .description('Decode URI encoded string')
    .action(async (input) => {
      const data = await getInput(input);
      console.log(decodeUrl(data));
    });

  decodeCmd
    .command('hex [input]')
    .description('Decode Hex string to readable utf8')
    .action(async (input) => {
      const data = await getInput(input);
      console.log(decodeHex(data));
    });

  // ==========================================
  // HASH & CRYPTO & UUID & PASSWORD
  // ==========================================
  const hashCmd = program.command('hash').description('Cryptographic hashing tools (md5, sha1, sha256, sha512)');
  for (const algo of ['md5', 'sha1', 'sha256', 'sha512'] as const) {
    hashCmd
      .command(`${algo} [target]`)
      .description(`Compute ${algo.toUpperCase()} hash for text or file path`)
      .action(async (target) => {
        const input = await getInput(target);
        console.log(computeHash(input, algo));
      });
  }

  const cryptoCmd = program.command('crypto').description('Cryptographic entropy and random generators');
  cryptoCmd
    .command('random')
    .description('Generate cryptographically secure random bytes')
    .option('-b, --bytes <number>', 'Number of bytes', '32')
    .action((opts) => {
      const n = parseInt(opts.bytes, 10) || 32;
      console.log(generateRandomBytes(n));
    });

  program
    .command('uuid [version]')
    .description('Generate cryptographically secure RFC 4122 UUID (default v4)')
    .action(() => {
      console.log(generateUUID('v4'));
    });

  program
    .command('password')
    .description('Generate cryptographically random password')
    .option('-l, --length <number>', 'Length of password', '16')
    .option('--no-symbols', 'Exclude special symbols')
    .option('--no-numbers', 'Exclude numbers')
    .action((opts) => {
      console.log(
        generatePassword({
          length: parseInt(opts.length, 10) || 16,
          symbols: opts.symbols,
          numbers: opts.numbers
        })
      );
    });

  // ==========================================
  // JWT
  // ==========================================
  const jwtCmd = program.command('jwt').description('JSON Web Token inspection and decode utilities');
  jwtCmd
    .command('decode [token]')
    .description('Decode and inspect header, payload, and claims of a JWT')
    .action(async (tokenArg) => {
      const token = await getInput(tokenArg);
      if (!token) {
        formatError('Missing JWT token', 'Provide token as argument or pipe via stdin.');
        return;
      }

      try {
        const decoded = decodeJWT(token);
        if (program.opts().json) {
          console.log(JSON.stringify(decoded, null, 2));
          return;
        }

        console.log(chalk.bold('\nJWT INSPECTOR REPORT (Signatures Unverified)'));
        console.log(chalk.dim('─'.repeat(45)));
        if (decoded.isExpired) {
          console.log(`${chalk.red('⚠')} ${chalk.red.bold('TOKEN HAS EXPIRED!')} (${decoded.expiresAt})`);
        } else if (decoded.expiresAt) {
          console.log(`${chalk.green('✓')} Token is Active (Expires: ${decoded.expiresAt})`);
        }

        console.log(`\n${chalk.bold('HEADER:')}`);
        console.log(chalk.cyan(JSON.stringify(decoded.header, null, 2)));

        console.log(`\n${chalk.bold('PAYLOAD:')}`);
        console.log(chalk.yellow(JSON.stringify(decoded.payload, null, 2)));

        if (decoded.subject) console.log(`  Subject (sub): ${decoded.subject}`);
        if (decoded.issuer) console.log(`  Issuer (iss):  ${decoded.issuer}`);
        if (decoded.issuedAt) console.log(`  Issued At (iat): ${decoded.issuedAt}`);
        console.log();
      } catch (e: unknown) {
        formatError('JWT Decode Failed', e instanceof Error ? e.message : String(e));
      }
    });

  // ==========================================
  // NETWORK & SUBNET
  // ==========================================
  const netCmd = program.command('network').description('Network utilities, IP resolution, and subnet calculators');

  netCmd
    .command('subnet <cidr>')
    .description('Calculate IPv4 subnet boundaries, masks, broadcast, and usable host count')
    .action((cidr) => {
      try {
        const sub = calculateSubnet(cidr);
        if (program.opts().json) {
          console.log(JSON.stringify(sub, null, 2));
          return;
        }

        console.log(chalk.bold(`\nIPv4 SUBNET ANALYSIS: ${sub.cidr}`));
        console.log(chalk.dim('─'.repeat(45)));
        const rows = [
          ['Network Address', sub.networkAddress],
          ['Broadcast Address', sub.broadcastAddress],
          ['Subnet Mask', sub.subnetMask],
          ['Wildcard Mask', sub.wildcardMask],
          ['First Usable IP', sub.firstUsableIp],
          ['Last Usable IP', sub.lastUsableIp],
          ['Usable Hosts', sub.usableHosts.toLocaleString()],
          ['Total Hosts', sub.totalHosts.toLocaleString()],
          ['IP Class', sub.ipClass]
        ];
        renderTable(['Field', 'Value'], rows);
        console.log();
      } catch (e: unknown) {
        formatError('Subnet calculation error', e instanceof Error ? e.message : String(e));
      }
    });

  netCmd
    .command('dns <domain>')
    .description('Query DNS records (A, AAAA, MX, TXT) for target hostname')
    .action(async (domain) => {
      try {
        const res = await lookupDns(domain);
        renderOutput(res, program.opts(), (d) => {
          console.log(chalk.bold(`\nDNS RECORDS FOR: ${domain}`));
          console.log(chalk.dim('─'.repeat(40)));
          console.log(JSON.stringify(d, null, 2));
        });
      } catch (e: unknown) {
        formatError('DNS resolution failed', e instanceof Error ? e.message : String(e));
      }
    });

  netCmd
    .command('ip')
    .description('Display local machine network interface IP addresses')
    .action(() => {
      const ips = getLocalIpAddresses();
      if (program.opts().json) {
        console.log(JSON.stringify(ips, null, 2));
        return;
      }
      console.log(chalk.bold('\nLOCAL NETWORK INTERFACES'));
      console.log(chalk.dim('─'.repeat(40)));
      const rows = ips.map((i) => [i.interface, i.address, i.family]);
      renderTable(['Interface', 'IP Address', 'Family'], rows);
      console.log();
    });

  // ==========================================
  // HTTP TIMING & API
  // ==========================================
  const httpCmd = program.command('http').description('HTTP network latency probe and header inspector');
  httpCmd
    .command('timing <url>')
    .description('Probe connection timing breakdown (DNS, TCP, TLS, TTFB, Total)')
    .action(async (urlStr) => {
      try {
        const timing = await measureHttpTiming(urlStr);
        if (program.opts().json) {
          console.log(JSON.stringify(timing, null, 2));
          return;
        }

        console.log(chalk.bold(`\nHTTP LATENCY BREAKDOWN: ${urlStr}`));
        console.log(chalk.dim('─'.repeat(45)));
        console.log(`  Status Code:     ${timing.statusCode ? chalk.green(timing.statusCode) : 'N/A'}`);
        console.log(`  DNS Lookup:      ${chalk.cyan(timing.dnsLookupMs)} ms`);
        console.log(`  TCP Connection:  ${chalk.cyan(timing.tcpConnectionMs)} ms`);
        console.log(`  TLS Handshake:   ${chalk.cyan(timing.tlsHandshakeMs)} ms`);
        console.log(`  First Byte (TTFB): ${chalk.yellow(timing.firstByteMs)} ms`);
        console.log(`  Total Duration:  ${chalk.bold.green(timing.totalMs)} ms\n`);
      } catch (e: unknown) {
        formatError('HTTP probe failed', e instanceof Error ? e.message : String(e));
      }
    });

  // ==========================================
  // TIME & TEXT
  // ==========================================
  const timeCmd = program.command('time').description('Unix timestamp and timezone converter');
  timeCmd
    .command('now')
    .description('Display current time across Unix, ISO 8601, and local timezone formats')
    .action(() => {
      const data = parseTime();
      renderOutput(data, program.opts(), (d) => {
        const t = d as ReturnType<typeof parseTime>;
        console.log(chalk.bold('\nCURRENT TIME TELEMETRY:'));
        console.log(`  Unix (Seconds):      ${chalk.green(t.unixSeconds)}`);
        console.log(`  Unix (Milliseconds): ${chalk.green(t.unixMilliseconds)}`);
        console.log(`  ISO 8601:            ${chalk.cyan(t.iso8601)}`);
        console.log(`  Local:               ${t.localString}`);
        console.log(`  Timezone:            ${t.timezone}\n`);
      });
    });

  timeCmd
    .command('convert <input>')
    .description('Convert given Unix timestamp or date string to all standard formats')
    .action((input) => {
      try {
        const data = parseTime(input);
        renderOutput(data, program.opts(), (d) => {
          const t = d as ReturnType<typeof parseTime>;
          console.log(chalk.bold('\nCONVERTED TIME SPEC:'));
          console.log(`  Unix Seconds:  ${t.unixSeconds}`);
          console.log(`  ISO 8601:      ${t.iso8601}`);
          console.log(`  Local String:  ${t.localString}\n`);
        });
      } catch (e: unknown) {
        formatError('Time conversion failed', e instanceof Error ? e.message : String(e));
      }
    });

  const textCmd = program.command('text').description('Text string utilities: count, slug, reverse');
  textCmd
    .command('count [input]')
    .description('Count characters, words, lines, and bytes in input')
    .action(async (input) => {
      const raw = await getInput(input);
      const res = countText(raw);
      renderOutput(res, program.opts(), (d) => {
        const c = d as ReturnType<typeof countText>;
        console.log(chalk.bold('\nTEXT COUNT METRICS:'));
        console.log(`  Words:       ${c.words}`);
        console.log(`  Characters:  ${c.characters}`);
        console.log(`  No Spaces:   ${c.charactersNoSpaces}`);
        console.log(`  Lines:       ${c.lines}`);
        console.log(`  Bytes:       ${c.bytes}\n`);
      });
    });

  textCmd
    .command('slug [input]')
    .description('Generate URL-friendly slug from text')
    .action(async (input) => {
      const raw = await getInput(input);
      console.log(toSlug(raw));
    });

  textCmd
    .command('reverse [input]')
    .description('Reverse text string')
    .action(async (input) => {
      const raw = await getInput(input);
      console.log(reverseText(raw));
    });

  // ==========================================
  // REGEX
  // ==========================================
  const regexCmd = program.command('regex').description('Regular Expression tester and pattern explainer');
  regexCmd
    .command('test <pattern> [text]')
    .description('Test regex pattern against string with detailed match positions')
    .action(async (pattern, textArg) => {
      const raw = await getInput(textArg);
      try {
        const res = testRegex(pattern, raw);
        if (program.opts().json) {
          console.log(JSON.stringify(res, null, 2));
          return;
        }

        console.log(chalk.bold(`\nREGEX EVALUATION: /${pattern}/g`));
        if (res.matched) {
          formatSuccess(`Pattern matched! Total occurrences: ${res.matchCount}`);
          res.matches.forEach((m, idx) => {
            console.log(`  [Match #${idx + 1}] at index ${m.index}: "${chalk.cyan(m.match)}"`);
          });
        } else {
          formatWarning('No matches found for given pattern.');
        }
        console.log();
      } catch (e: unknown) {
        formatError('Regex execution error', e instanceof Error ? e.message : String(e));
      }
    });

  regexCmd
    .command('explain <pattern>')
    .description('Explain regex pattern tokens in plain English')
    .action((pattern) => {
      const tokens = explainRegex(pattern);
      console.log(chalk.bold(`\nEXPLANATION FOR /${pattern}/:`));
      tokens.forEach((t) => console.log(`  • ${t}`));
      console.log();
    });

  // ==========================================
  // GIT
  // ==========================================
  const gitCmd = program.command('git').description('Git repository status and summary wrapper');
  gitCmd
    .command('summary')
    .description('Display branch, modified files count, remote, and last commit')
    .action(() => {
      try {
        const s = getGitSummary();
        renderOutput(s, program.opts(), (d) => {
          const g = d as ReturnType<typeof getGitSummary>;
          console.log(chalk.bold('\nGIT REPOSITORY TELEMETRY:'));
          console.log(`  Branch:      ${chalk.cyan(g.branch)}`);
          console.log(`  Status:      ${g.clean ? chalk.green('Clean working directory') : chalk.yellow(`${g.status.length} modified files`)}`);
          if (g.lastCommit) console.log(`  Last Commit: ${chalk.dim(g.lastCommit)}`);
          if (g.remoteUrl) console.log(`  Remote:      ${chalk.dim(g.remoteUrl)}`);
          console.log();
        });
      } catch (e: unknown) {
        formatError('Git summary error', e instanceof Error ? e.message : String(e));
      }
    });

  // ==========================================
  // ENV
  // ==========================================
  const envCmd = program.command('env').description('Environment variables scanner with safety redaction');
  envCmd
    .command('list [file]')
    .description('List environment variables with passwords and tokens safely masked')
    .action((file) => {
      try {
        const envs = parseEnvFile(file || '.env');
        const masked = getMaskedEnv(envs);
        renderOutput(masked, program.opts(), (d) => {
          console.log(chalk.bold(`\nENVIRONMENT VARIABLES (${file || '.env'}):`));
          console.log(chalk.dim('─'.repeat(45)));
          for (const [k, v] of Object.entries(d as Record<string, string>)) {
            console.log(`  ${chalk.cyan(k.padEnd(24))} = ${v === '[REDACTED]' ? chalk.red(v) : chalk.dim(v)}`);
          }
          console.log();
        });
      } catch (e: unknown) {
        formatError('Env inspection failed', e instanceof Error ? e.message : String(e));
      }
    });

  // ==========================================
  // CONFIG
  // ==========================================
  const cfgCmd = program.command('config').description('Manage persistent devkit-cli configuration');
  cfgCmd
    .command('list')
    .description('List current devkit-cli settings')
    .action(() => {
      const cfg = loadConfig();
      renderOutput(cfg, program.opts(), (d) => {
        console.log(chalk.bold('\nDEVKIT CONFIGURATION:'));
        console.log(JSON.stringify(d, null, 2));
      });
    });

  cfgCmd
    .command('reset')
    .description('Reset devkit-cli settings to defaults')
    .action(() => {
      resetConfig();
      formatSuccess('Configuration reset to defaults.');
    });

  // ==========================================
  // PROJECT INIT
  // ==========================================
  const projCmd = program.command('project').description('Interactive developer project bootstrapping');
  projCmd
    .command('init [name]')
    .description('Initialize a new modular project scaffold')
    .action(async (nameArg) => {
      let projectName = nameArg;
      if (!projectName) {
        projectName = await askText('Project name', 'my-devkit-app');
      }

      if (!projectName) {
        formatError('Cancelled', 'Project name is required.');
        return;
      }

      try {
        const res = initProject(
          {
            name: projectName,
            template: 'typescript',
            packageManager: 'npm'
          },
          process.cwd()
        );
        formatSuccess(`Project "${projectName}" created successfully!`);
        res.filesCreated.forEach((f) => console.log(`  ${chalk.dim('+')} ${f}`));
        console.log(`\nNext steps:`);
        console.log(`  cd ${projectName}`);
        console.log(`  npm install\n`);
      } catch (e: unknown) {
        formatError('Failed to create project', e instanceof Error ? e.message : String(e));
      }
    });

  // ==========================================
  // INTERACTIVE MODE FALLBACK
  // ==========================================
  program
    .command('interactive')
    .description('Launch interactive developer utilities menu')
    .action(async () => {
      console.log(chalk.bold('\n⚡ DEVKIT-CLI: Developer Modular Toolkit'));
    console.log(chalk.dim('Run "devkit --help" to view full command reference.\n'));

    const cmd = await askSelect('Choose a developer utility to launch:', [
      { title: '🩺 Doctor Diagnostic', value: 'doctor' },
      { title: '🖥️ System Telemetry Info', value: 'system' },
      { title: '🌐 Subnet CIDR Calculator', value: 'subnet' },
      { title: '🔑 UUID & Password Generator', value: 'pass' },
      { title: '📦 Parse JSON Web Token (JWT)', value: 'jwt' },
      { title: '⏳ Timestamp & Time Converter', value: 'time' },
      { title: '🚪 Exit', value: 'exit' }
    ]);

    if (cmd === 'doctor') {
      const audit = runDoctorAudit();
      audit.forEach((a) => console.log(`${a.status === 'ok' ? chalk.green('✓') : chalk.yellow('⚠')} ${a.name}: ${a.versionOrInfo || a.message}`));
    } else if (cmd === 'system') {
      const s = getSystemInfo();
      console.log(`OS: ${s.os} | CPU: ${s.cpuModel} (${s.cpuCores} cores) | RAM: ${s.usedMemoryGb}/${s.totalMemoryGb}`);
    } else if (cmd === 'subnet') {
      const sub = calculateSubnet('192.168.1.0/24');
      console.log(`Subnet 192.168.1.0/24: Net ${sub.networkAddress}, Mask ${sub.subnetMask}, Broadcast ${sub.broadcastAddress}, Hosts: ${sub.usableHosts}`);
    } else if (cmd === 'pass') {
      console.log(`Generated Password: ${chalk.green(generatePassword({ length: 20 }))}`);
      console.log(`Generated UUID v4:  ${chalk.cyan(generateUUID())}`);
    } else if (cmd === 'time') {
      const t = parseTime();
      console.log(`Unix: ${t.unixSeconds} | ISO: ${t.iso8601}`);
    }
  });

  return program;
}
