import https from 'node:https';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const API_ENDPOINT = '/exa.language_server_pb.LanguageServerService/GetUserStatus';
const CSRF_HEADER = 'x-codeium-csrf-token';
const REQUEST_TIMEOUT_MS = 4000;

export const MODEL_NAMES: Record<string, string> = {
  MODEL_PLACEHOLDER_M12: 'Claude Opus 4.6',
  MODEL_PLACEHOLDER_M18: 'Gemini 3 Flash',
  MODEL_PLACEHOLDER_M26: 'Claude Opus 4.6 (Thinking)',
  MODEL_PLACEHOLDER_M35: 'Claude Sonnet 4.6 (Thinking)',
  MODEL_PLACEHOLDER_M36: 'Gemini 3.1 Pro (Low)',
  MODEL_PLACEHOLDER_M37: 'Gemini 3.1 Pro (High)',
  MODEL_PLACEHOLDER_M47: 'Gemini 3 Flash',
  MODEL_CLAUDE_4_5_SONNET: 'Claude Sonnet 4.6',
  MODEL_CLAUDE_4_5_SONNET_THINKING: 'Claude Sonnet 4.6 (Thinking)',
  MODEL_OPENAI_GPT_OSS_120B_MEDIUM: 'GPT-OSS 120B (Medium)',
  MODEL_PLACEHOLDER_M318: 'Gemini 3.8 Flash (High)',
  MODEL_PLACEHOLDER_M320: 'Gemini 3.8 Flash (Low)',
  MODEL_PLACEHOLDER_M299: 'Gemini 3.7 Flash (Medium)',
  MODEL_PLACEHOLDER_M72: 'Gemini 3.6 Flash (Medium)',
  MODEL_PLACEHOLDER_M73: 'Gemini 3.6 Flash (Low)',
  MODEL_PLACEHOLDER_M16: 'Gemini 3.1 Pro (High)',
  MODEL_PLACEHOLDER_M319: 'Gemini 3.8 Flash (Medium)',
  MODEL_PLACEHOLDER_M300: 'Gemini 3.7 Flash (Low)',
  MODEL_PLACEHOLDER_M298: 'Gemini 3.7 Flash (High)',
  MODEL_PLACEHOLDER_M71: 'Gemini 3.6 Flash (High)',
  MODEL_PLACEHOLDER_M401: 'Claude Opus 5.5 (Medium)',
  MODEL_PLACEHOLDER_M405: 'Claude Sonnet 5.5 (High)',
  MODEL_PLACEHOLDER_M403: 'Claude Sonnet 5.5 (Low)',
  MODEL_PLACEHOLDER_M402: 'Claude Opus 5.5 (High)',
  MODEL_PLACEHOLDER_M400: 'Claude Opus 5.5 (Low)',
  MODEL_PLACEHOLDER_M404: 'Claude Sonnet 5.5 (Medium)',
};

function readFlagValue(commandLine: string, flag: string): string {
  const match = String(commandLine || '').match(new RegExp(`(?:^|\\s)${flag}\\s+([^\\s]+)`));
  return match ? match[1] : '';
}

function parseListeningPort(line: string): number | null {
  const match = String(line).match(/:(\d+)\s+/);
  return match ? Number.parseInt(match[1], 10) : null;
}

export function normalizeModelName(modelId: string, fallbackLabel = ''): string {
  if (fallbackLabel) return fallbackLabel;
  if (MODEL_NAMES[modelId]) return MODEL_NAMES[modelId];
  return String(modelId || 'Unknown model')
    .replace(/^MODEL_/, '')
    .replaceAll('_', ' ')
    .trim();
}

async function listProcessesLinux() {
  const { stdout } = await execFileAsync('ps', ['-eo', 'pid=,args=']);
  return stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => /language_server/i.test(line))
    .map((line) => {
      const pidMatch = line.match(/^\s*(\d+)\s+/);
      const pid = pidMatch ? Number.parseInt(pidMatch[1], 10) : NaN;
      const cmd = pidMatch ? line.slice(pidMatch[0].length) : line;
      return {
        pid: Number.isFinite(pid) ? pid : null,
        commandLine: cmd,
        csrfToken: readFlagValue(cmd, '--csrf_token'),
        extensionServerPort: Number.parseInt(readFlagValue(cmd, '--extension_server_port') || '0', 10),
        workspaceId: readFlagValue(cmd, '--workspace_id'),
        appDataDir: readFlagValue(cmd, '--app_data_dir'),
      };
    })
    .filter((entry) => entry.pid);
}

async function getListeningPortsForPid(pid: number | null): Promise<number[]> {
  if (!pid) return [];
  let ports: number[] = [];
  try {
    const { stdout } = await execFileAsync('ss', ['-ltnp']);
    ports = stdout
      .split('\n')
      .filter((line) => line.includes(`pid=${pid}`))
      .map((line) => parseListeningPort(line))
      .filter((v): v is number => Number.isFinite(v) && v !== null);
  } catch {
    // fallback
  }
  return [...new Set(ports)].sort((a, b) => a - b);
}

export async function fetchQuotaPayload(port: number, csrfToken: string): Promise<any> {
  const payload = JSON.stringify({});
  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: '127.0.0.1',
        port,
        method: 'POST',
        path: API_ENDPOINT,
        rejectUnauthorized: false,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          [CSRF_HEADER]: csrfToken,
        },
      },
      (response) => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.on('end', () => {
          if ((response.statusCode || 500) >= 400) {
            reject(new Error(`Quota request failed (${response.statusCode})`));
            return;
          }
          try {
            resolve(JSON.parse(body || '{}'));
          } catch (err: any) {
            reject(new Error(`Quota parse error: ${err.message}`));
          }
        });
      }
    );

    request.setTimeout(REQUEST_TIMEOUT_MS, () => {
      request.destroy(new Error('Quota request timed out'));
    });
    request.on('error', reject);
    request.write(payload);
    request.end();
  });
}

export async function getAntigravityQuotas() {
  try {
    const processes = await listProcessesLinux();
    if (!processes.length) {
      return { available: false, error: 'No language_server process running' };
    }

    for (const proc of processes) {
      if (!proc.csrfToken) continue;
      const ports = await getListeningPortsForPid(proc.pid);
      const candidates = [...new Set([proc.extensionServerPort, ...ports])].filter((p) => p > 0);

      for (const port of candidates) {
        try {
          const raw = await fetchQuotaPayload(port, proc.csrfToken);
          const userStatus = raw?.userStatus || {};
          const planStatus = userStatus?.planStatus || {};
          const planInfo = planStatus?.planInfo || {};
          const cascadeData = userStatus?.cascadeModelConfigData || {};
          const configs = Array.isArray(cascadeData?.clientModelConfigs)
            ? cascadeData.clientModelConfigs
            : [];

          const models = configs.map((cfg: any) => {
            const rawId = cfg?.modelOrAlias?.model || cfg?.modelOrAlias?.alias || cfg?.label || 'UNKNOWN';
            const quota = cfg?.quotaInfo || {};
            const fraction = Math.max(0, Math.min(1, Number(quota?.remainingFraction ?? 1)));
            const remainingPercent = Math.round(fraction * 100);
            const usagePercent = 100 - remainingPercent;
            const label = normalizeModelName(rawId, cfg?.label);

            return {
              id: rawId,
              name: label,
              usagePercent,
              remainingPercent,
              resetTime: quota?.resetTime || '',
              recommended: Boolean(cfg?.isRecommended),
              supportsImages: Boolean(cfg?.supportsImages),
              status: usagePercent >= 80 ? 'critical' : usagePercent >= 60 ? 'warning' : 'ok',
            };
          }).sort((a: any, b: any) => b.usagePercent - a.usagePercent);

          return {
            available: true,
            source: 'OmniAntigravity Quota Engine',
            port,
            pid: proc.pid,
            user: {
              name: userStatus.name || 'Antigravity User',
              email: userStatus.email || '',
              planName: planInfo.planName || 'Pro',
              teamTier: planInfo.teamsTier || 'TEAMS_TIER_PRO',
            },
            credits: {
              prompt: {
                available: planStatus.availablePromptCredits ?? 0,
                monthly: planInfo.monthlyPromptCredits ?? 0,
              },
              flow: {
                available: planStatus.availableFlowCredits ?? 0,
                monthly: planInfo.monthlyFlowCredits ?? 0,
              },
            },
            models,
            totalModels: models.length,
            lastUpdated: new Date().toISOString(),
          };
        } catch {
          // try next port
        }
      }
    }

    return { available: false, error: 'Could not contact language server endpoint' };
  } catch (err: any) {
    return { available: false, error: err.message };
  }
}
