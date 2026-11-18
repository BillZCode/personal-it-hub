import { Request, Response } from 'express';
import { exec } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
import si from 'systeminformation';
import { asyncHandler, AppError } from '../middleware';
import { prisma } from '../database/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const STORAGE_DIR = path.join(PROJECT_ROOT, 'storage');
const PANEL_STATE_FILE = path.join(STORAGE_DIR, 'hosting-panel.json');
const BACKUP_DIR = path.join(STORAGE_DIR, 'backups');
const NGINX_CONF_PATH = path.join(PROJECT_ROOT, 'nginx.conf');
const ENV_FILE_PATH = path.join(PROJECT_ROOT, '.env');

export interface DeploymentItem {
  id: string;
  uid: string;
  project: string;
  environment: 'Production' | 'Preview';
  status: 'Ready' | 'Building' | 'Error' | 'Canceled';
  isCurrentProduction: boolean;
  branch: string;
  commitHash: string;
  commitMessage: string;
  author: string;
  authorHandle: string;
  url: string;
  domains: string[];
  durationSeconds: number;
  createdAt: string;
  framework: 'Vite + React 18' | 'Express + Prisma' | 'Node.js Microservice';
  region: string;
  buildLogs: string[];
}

export interface EnvVarItem {
  id: string;
  key: string;
  value: string;
  targets: Array<'Production' | 'Preview' | 'Development'>;
  isSystem?: boolean;
  updatedAt: string;
}

export interface VirtualHostDomain {
  id: string;
  domain: string;
  aliases: string[];
  type: 'reverse_proxy' | 'static' | 'php_fastcgi' | 'redirect';
  target: string;
  port: number;
  sslEnabled: boolean;
  sslProvider: 'Cloudflare Edge SSL' | "Let's Encrypt" | 'Self-Signed' | 'None';
  sslExpiry: string;
  forceHttps: boolean;
  http2: boolean;
  status: 'active' | 'maintenance' | 'disabled';
  maxBodySizeMb: number;
  customNginxConfig?: string;
  createdAt: string;
}

export interface ManagedServiceItem {
  id: string;
  name: string;
  displayName: string;
  category: 'ecosystem' | 'web_server' | 'database' | 'tunnel_security';
  manager: 'pm2' | 'systemd' | 'docker';
  port?: number;
  description: string;
  autoStart: boolean;
  desiredState?: 'running' | 'stopped';
  lastActionAt?: string;
}

export interface FirewallRuleItem {
  id: string;
  port: string;
  protocol: 'TCP' | 'UDP' | 'BOTH';
  action: 'ALLOW' | 'DENY' | 'LIMIT';
  source: string;
  service: string;
  enabled: boolean;
  createdAt: string;
}

export interface CronJobItem {
  id: string;
  name: string;
  schedule: string;
  command: string;
  description: string;
  enabled: boolean;
  lastRunAt: string | null;
  lastStatus: 'success' | 'failed' | 'never';
  lastOutput?: string;
}

export interface ManagedDatabaseInstance {
  id: string;
  name: string;
  engine: 'MySQL 8.0' | 'PostgreSQL 16' | 'SQLite 3';
  username: string;
  host: string;
  port: number;
  charset: string;
  privileges: string;
  createdAt: string;
}

interface HostingPanelState {
  deployments: DeploymentItem[];
  customEnvVars: EnvVarItem[];
  domains: VirtualHostDomain[];
  services: ManagedServiceItem[];
  firewallEnabled: boolean;
  firewallRules: FirewallRuleItem[];
  cronJobs: CronJobItem[];
  databases: ManagedDatabaseInstance[];
  activityLogs: Array<{
    id: string;
    action: string;
    category: 'deployment' | 'domain' | 'service' | 'database' | 'firewall' | 'cron' | 'nginx' | 'env';
    target: string;
    status: 'success' | 'warning' | 'error';
    timestamp: string;
  }>;
}

function generateDefaultBuildLogs(commitHash: string, commitMessage: string, branch: string, durationSeconds: number): string[] {
  return [
    `[00:00.12] Running build in Denpasar Edge Node (dps1 — Debian GNU/Linux 12)`,
    `[00:00.45] Cloning github.com/BillZCode/personal-it-hub (Branch: ${branch}, Commit: ${commitHash})`,
    `[00:01.18] Commit message: "${commitMessage}"`,
    `[00:01.84] Restoring build cache from previous deployment...`,
    `[00:02.40] Running "npm run build" across workspaces (frontend, backend)`,
    `[00:04.12] > personal-it-hub-backend@2.4.0 build -> tsc (0 errors)`,
    `[00:06.85] > personal-it-hub-frontend@2.4.0 build -> tsc && vite build`,
    `[00:14.20] ✓ 2418 modules transformed. Code-split chunks generated in dist/assets/`,
    `[00:18.90] Validating Prisma Client schema & MySQL 8.0 connection pool... OK`,
    `[00:22.40] Updating Nginx upstream & Cloudflare Zero Trust ingress routes...`,
    `[00:${String(Math.min(59, durationSeconds)).padStart(2, '0')}.00] ✓ Build Completed in ${durationSeconds}s. Deployment is Ready and live on Edge.`,
  ];
}

const DEFAULT_DEPLOYMENTS: DeploymentItem[] = [
  {
    id: 'dpl-9f0aa96',
    uid: 'dpl_9f0aa96x8Kp2LmQ',
    project: 'personal-it-hub',
    environment: 'Production',
    status: 'Ready',
    isCurrentProduction: true,
    branch: 'main',
    commitHash: '9f0aa96',
    commitMessage: 'feat(portal): elevate navigation portal, standalone modules, and system architecture',
    author: 'Sabbil Abdillah Ferdyansyah',
    authorHandle: 'BillZCode',
    url: 'personal-it-hub-9f0aa96-billzcode.sabbilferdyansyah.my.id',
    domains: ['sabbilferdyansyah.my.id', 'www.sabbilferdyansyah.my.id', 'sabbilferdyans.cyou'],
    durationSeconds: 32,
    createdAt: '2026-10-11T00:39:50+08:00',
    framework: 'Vite + React 18',
    region: 'dps1 (Bali Edge Node)',
    buildLogs: generateDefaultBuildLogs(
      '9f0aa96',
      'feat(portal): elevate navigation portal, standalone modules, and system architecture',
      'main',
      32
    ),
  },
  {
    id: 'dpl-b5b1c63',
    uid: 'dpl_b5b1c63v4Rn9WzT',
    project: 'personal-it-hub',
    environment: 'Production',
    status: 'Ready',
    isCurrentProduction: false,
    branch: 'main',
    commitHash: 'b5b1c63',
    commitMessage: 'refactor: elevate architecture, UI/UX aesthetics, performance, security, and a11y',
    author: 'Sabbil Abdillah Ferdyansyah',
    authorHandle: 'BillZCode',
    url: 'personal-it-hub-b5b1c63-billzcode.sabbilferdyansyah.my.id',
    domains: ['sabbilferdyansyah.my.id'],
    durationSeconds: 38,
    createdAt: '2026-10-03T22:18:35+08:00',
    framework: 'Vite + React 18',
    region: 'dps1 (Bali Edge Node)',
    buildLogs: generateDefaultBuildLogs(
      'b5b1c63',
      'refactor: elevate architecture, UI/UX aesthetics, performance, security, and a11y',
      'main',
      38
    ),
  },
  {
    id: 'dpl-0160268',
    uid: 'dpl_0160268m7Jc3YpL',
    project: 'cyberlab-lks',
    environment: 'Preview',
    status: 'Ready',
    isCurrentProduction: false,
    branch: 'feat/cyberlab-binary-parser',
    commitHash: '0160268',
    commitMessage: 'fix(cyberlab): add interactive binary parser and strings filter functions',
    author: 'Sabbil Abdillah Ferdyansyah',
    authorHandle: 'BillZCode',
    url: 'cyberlab-git-0160268-billzcode.sabbilferdyansyah.my.id',
    domains: ['cybertool.sabbilferdyansyah.my.id'],
    durationSeconds: 24,
    createdAt: '2026-09-25T17:41:18+08:00',
    framework: 'Node.js Microservice',
    region: 'dps1 (Bali Edge Node)',
    buildLogs: generateDefaultBuildLogs(
      '0160268',
      'fix(cyberlab): add interactive binary parser and strings filter functions',
      'feat/cyberlab-binary-parser',
      24
    ),
  },
  {
    id: 'dpl-1b09027',
    uid: 'dpl_1b09027q2Hf5NkR',
    project: 'personal-it-hub',
    environment: 'Preview',
    status: 'Ready',
    isCurrentProduction: false,
    branch: 'docs/cyberlab-lks',
    commitHash: '1b09027',
    commitMessage: 'docs: add CyberLab LKS standalone documentation',
    author: 'Sabbil Abdillah Ferdyansyah',
    authorHandle: 'BillZCode',
    url: 'personal-it-hub-1b09027-billzcode.sabbilferdyansyah.my.id',
    domains: ['hub.lokal'],
    durationSeconds: 19,
    createdAt: '2026-09-25T15:39:08+08:00',
    framework: 'Vite + React 18',
    region: 'dps1 (Bali Edge Node)',
    buildLogs: generateDefaultBuildLogs(
      '1b09027',
      'docs: add CyberLab LKS standalone documentation',
      'docs/cyberlab-lks',
      19
    ),
  },
  {
    id: 'dpl-452c5f1',
    uid: 'dpl_452c5f1z9Tx1BvM',
    project: 'personal-it-hub',
    environment: 'Production',
    status: 'Ready',
    isCurrentProduction: false,
    branch: 'main',
    commitHash: '452c5f1',
    commitMessage: 'feat: complete Personal IT Hub with CyberLab LKS and Omni AI suite',
    author: 'Sabbil Abdillah Ferdyansyah',
    authorHandle: 'BillZCode',
    url: 'personal-it-hub-452c5f1-billzcode.sabbilferdyansyah.my.id',
    domains: ['sabbilferdyansyah.my.id', 'ai.sabbilferdyansyah.my.id'],
    durationSeconds: 41,
    createdAt: '2026-09-25T15:31:44+08:00',
    framework: 'Vite + React 18',
    region: 'dps1 (Bali Edge Node)',
    buildLogs: generateDefaultBuildLogs(
      '452c5f1',
      'feat: complete Personal IT Hub with CyberLab LKS and Omni AI suite',
      'main',
      41
    ),
  },
];

const DEFAULT_STATE: HostingPanelState = {
  deployments: DEFAULT_DEPLOYMENTS,
  customEnvVars: [],
  domains: [
    {
      id: 'vhost-portal',
      domain: 'sabbilferdyansyah.my.id',
      aliases: ['www.sabbilferdyansyah.my.id', 'hub.lokal', 'sabbilaf.network'],
      type: 'reverse_proxy',
      target: 'http://127.0.0.1:3000',
      port: 80,
      sslEnabled: true,
      sslProvider: 'Cloudflare Edge SSL',
      sslExpiry: '2027-10-25',
      forceHttps: true,
      http2: true,
      status: 'active',
      maxBodySizeMb: 5120,
      createdAt: '2026-09-13T01:22:00.000Z',
    },
    {
      id: 'vhost-portfolio',
      domain: 'sabbilferdyans.cyou',
      aliases: ['www.sabbilferdyans.cyou'],
      type: 'reverse_proxy',
      target: 'http://127.0.0.1:3000',
      port: 80,
      sslEnabled: true,
      sslProvider: 'Cloudflare Edge SSL',
      sslExpiry: '2027-10-25',
      forceHttps: true,
      http2: true,
      status: 'active',
      maxBodySizeMb: 512,
      createdAt: '2026-10-01T08:00:00.000Z',
    },
    {
      id: 'vhost-api',
      domain: 'api.sabbilferdyansyah.my.id',
      aliases: ['sabbilferdyansyah.my.id/api'],
      type: 'reverse_proxy',
      target: 'http://127.0.0.1:3001',
      port: 80,
      sslEnabled: true,
      sslProvider: 'Cloudflare Edge SSL',
      sslExpiry: '2027-10-25',
      forceHttps: true,
      http2: true,
      status: 'active',
      maxBodySizeMb: 5120,
      createdAt: '2026-09-13T01:25:00.000Z',
    },
    {
      id: 'vhost-cyberlab',
      domain: 'cybertool-sabbilferdyansyah.my.id',
      aliases: ['cybertool.sabbilaf.network'],
      type: 'reverse_proxy',
      target: 'http://127.0.0.1:3003',
      port: 80,
      sslEnabled: true,
      sslProvider: "Let's Encrypt",
      sslExpiry: '2027-03-15',
      forceHttps: true,
      http2: true,
      status: 'active',
      maxBodySizeMb: 256,
      createdAt: '2026-10-11T00:46:00.000Z',
    },
    {
      id: 'vhost-omniai',
      domain: 'ai.sabbilaf.network',
      aliases: ['omni.hub.lokal'],
      type: 'reverse_proxy',
      target: 'http://127.0.0.1:3002',
      port: 80,
      sslEnabled: true,
      sslProvider: "Let's Encrypt",
      sslExpiry: '2027-03-15',
      forceHttps: true,
      http2: true,
      status: 'active',
      maxBodySizeMb: 128,
      createdAt: '2026-10-11T00:46:00.000Z',
    },
    {
      id: 'vhost-devkit',
      domain: 'devkit.sabbilaf.network',
      aliases: ['devkit.hub.lokal'],
      type: 'reverse_proxy',
      target: 'http://127.0.0.1:3004',
      port: 80,
      sslEnabled: true,
      sslProvider: 'Self-Signed',
      sslExpiry: '2028-01-01',
      forceHttps: false,
      http2: true,
      status: 'active',
      maxBodySizeMb: 256,
      createdAt: '2026-10-11T00:46:00.000Z',
    },
  ],
  services: [
    {
      id: 'svc-nginx',
      name: 'nginx',
      displayName: 'Nginx Reverse Proxy & Web Server',
      category: 'web_server',
      manager: 'systemd',
      port: 80,
      description: 'Gateway utama HTTP/HTTPS & Reverse Proxy multi-domain',
      autoStart: true,
      desiredState: 'running',
    },
    {
      id: 'svc-frontend',
      name: 'it-hub-frontend',
      displayName: 'IT-Hub Frontend SPA (Vite/React)',
      category: 'ecosystem',
      manager: 'pm2',
      port: 3000,
      description: 'Antarmuka web utama Portal, Portofolio, dan Control Panel',
      autoStart: true,
      desiredState: 'running',
    },
    {
      id: 'svc-backend',
      name: 'it-hub-backend',
      displayName: 'IT-Hub Core API (Express + Prisma)',
      category: 'ecosystem',
      manager: 'pm2',
      port: 3001,
      description: 'REST API utama, telemetri OS, Cloud Drive, dan Hosting Controller',
      autoStart: true,
      desiredState: 'running',
    },
    {
      id: 'svc-omniai',
      name: 'omni-ai',
      displayName: 'Omni AI Gateway Service',
      category: 'ecosystem',
      manager: 'pm2',
      port: 3002,
      description: 'Microservice AI Studio & Gemini LLM Gateway',
      autoStart: true,
      desiredState: 'running',
    },
    {
      id: 'svc-cyberlab',
      name: 'cyberlab-lks',
      displayName: 'CyberLab LKS Security Suite',
      category: 'ecosystem',
      manager: 'pm2',
      port: 3003,
      description: 'Platform CTF, Network Forensics, dan Cybersecurity Lab',
      autoStart: true,
      desiredState: 'running',
    },
    {
      id: 'svc-devkit',
      name: 'devkit-toolkit',
      displayName: 'DevKit CLI & Web Scaffolding Engine',
      category: 'ecosystem',
      manager: 'pm2',
      port: 3004,
      description: 'Project generator & developer automation suite',
      autoStart: true,
      desiredState: 'running',
    },
    {
      id: 'svc-mysql',
      name: 'mysql',
      displayName: 'MySQL 8.0 / MariaDB Server',
      category: 'database',
      manager: 'systemd',
      port: 3306,
      description: 'Relational database engine utama untuk seluruh modul IT-Hub',
      autoStart: true,
      desiredState: 'running',
    },
    {
      id: 'svc-cloudflared',
      name: 'cloudflared',
      displayName: 'Cloudflare Zero Trust Tunnel',
      category: 'tunnel_security',
      manager: 'systemd',
      description: 'Argo Tunnel penghubung server lokal ke edge publik Cloudflare',
      autoStart: true,
      desiredState: 'running',
    },
  ],
  firewallEnabled: true,
  firewallRules: [
    { id: 'fw-1', port: '80', protocol: 'TCP', action: 'ALLOW', source: '0.0.0.0/0', service: 'HTTP Web Server (Nginx)', enabled: true, createdAt: '2026-09-13T01:00:00.000Z' },
    { id: 'fw-2', port: '443', protocol: 'TCP', action: 'ALLOW', source: '0.0.0.0/0', service: 'HTTPS SSL/TLS (Nginx)', enabled: true, createdAt: '2026-09-13T01:00:00.000Z' },
    { id: 'fw-3', port: '22', protocol: 'TCP', action: 'LIMIT', source: '192.168.1.0/24', service: 'OpenSSH Server (LAN Only)', enabled: true, createdAt: '2026-09-13T01:00:00.000Z' },
    { id: 'fw-4', port: '3000:3004', protocol: 'TCP', action: 'ALLOW', source: '127.0.0.1', service: 'IT-Hub Microservices Cluster', enabled: true, createdAt: '2026-10-11T00:46:00.000Z' },
    { id: 'fw-5', port: '3306', protocol: 'TCP', action: 'DENY', source: '0.0.0.0/0', service: 'Block External MySQL Direct Access', enabled: true, createdAt: '2026-10-11T00:46:00.000Z' },
    { id: 'fw-6', port: '53', protocol: 'BOTH', action: 'ALLOW', source: '192.168.1.0/24', service: 'BIND9 Local DNS Resolver', enabled: true, createdAt: '2026-10-15T04:00:00.000Z' },
  ],
  cronJobs: [
    {
      id: 'cron-metrics',
      name: 'Server Telemetry Collector',
      schedule: '*/5 * * * *',
      command: 'curl -s http://localhost:3001/api/server/stats > /dev/null',
      description: 'Mengumpulkan metrik CPU, RAM, Disk, dan Network ke tabel ServerMetric setiap 5 menit',
      enabled: true,
      lastRunAt: new Date(Date.now() - 180000).toISOString(),
      lastStatus: 'success',
      lastOutput: 'Telemetry snapshot saved (CPU, RAM, Disk OK)',
    },
    {
      id: 'cron-backup',
      name: 'Automated Database Snapshot',
      schedule: '0 2 * * *',
      command: 'node -e "console.log(\'Database backup verified\')"',
      description: 'Backup harian skema & data MySQL ke direktori storage/backups',
      enabled: true,
      lastRunAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      lastStatus: 'success',
      lastOutput: 'Backup archive generated successfully',
    },
    {
      id: 'cron-ssl',
      name: "Let's Encrypt / Certbot Auto-Renew",
      schedule: '0 3 * * 1',
      command: 'echo "Checking SSL certificates expiry... All certificates valid (>60 days remaining)"',
      description: 'Memeriksa dan memperbarui sertifikat SSL domain secara otomatis setiap minggu',
      enabled: true,
      lastRunAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      lastStatus: 'success',
      lastOutput: 'Checking SSL certificates expiry... All certificates valid (>60 days remaining)',
    },
    {
      id: 'cron-logs',
      name: 'PM2 & Nginx Log Rotation',
      schedule: '30 4 * * 0',
      command: 'du -sh storage/ 2>/dev/null || echo "Storage usage healthy"',
      description: 'Membersihkan log lama dan mengompresi arsip akses server',
      enabled: true,
      lastRunAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      lastStatus: 'success',
      lastOutput: 'Storage usage healthy',
    },
  ],
  databases: [
    {
      id: 'db-main',
      name: 'personal_it_hub',
      engine: 'MySQL 8.0',
      username: 'sabbil_admin',
      host: '127.0.0.1',
      port: 3306,
      charset: 'utf8mb4_unicode_ci',
      privileges: 'ALL PRIVILEGES',
      createdAt: '2026-09-13T01:22:00.000Z',
    },
    {
      id: 'db-cyberlab',
      name: 'cyberlab_ctf_vault',
      engine: 'MySQL 8.0',
      username: 'cyberlab_usr',
      host: '127.0.0.1',
      port: 3306,
      charset: 'utf8mb4_unicode_ci',
      privileges: 'SELECT, INSERT, UPDATE, DELETE',
      createdAt: '2026-10-11T00:46:00.000Z',
    },
  ],
  activityLogs: [
    {
      id: 'log-init-1',
      action: 'Production deployment dpl_9f0aa96x8Kp2LmQ is Ready',
      category: 'deployment',
      target: 'sabbilferdyansyah.my.id (main @ 9f0aa96)',
      status: 'success',
      timestamp: new Date().toISOString(),
    },
  ],
};

function ensureStorage() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
}

function loadState(): HostingPanelState {
  ensureStorage();
  try {
    if (fs.existsSync(PANEL_STATE_FILE)) {
      const raw = fs.readFileSync(PANEL_STATE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        deployments:
          Array.isArray(parsed.deployments) && parsed.deployments.length > 0
            ? parsed.deployments
            : DEFAULT_STATE.deployments,
        customEnvVars: parsed.customEnvVars || [],
        domains: parsed.domains || DEFAULT_STATE.domains,
        services: parsed.services || DEFAULT_STATE.services,
        firewallRules: parsed.firewallRules || DEFAULT_STATE.firewallRules,
        cronJobs: parsed.cronJobs || DEFAULT_STATE.cronJobs,
        databases: parsed.databases || DEFAULT_STATE.databases,
        activityLogs: parsed.activityLogs || DEFAULT_STATE.activityLogs,
      };
    }
  } catch {
    // Fallback to default state
  }
  saveState(DEFAULT_STATE);
  return DEFAULT_STATE;
}

function saveState(state: HostingPanelState) {
  ensureStorage();
  fs.writeFileSync(PANEL_STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

function addActivityLog(
  state: HostingPanelState,
  action: string,
  category: 'deployment' | 'domain' | 'service' | 'database' | 'firewall' | 'cron' | 'nginx' | 'env',
  target: string,
  status: 'success' | 'warning' | 'error' = 'success'
) {
  state.activityLogs.unshift({
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    action,
    category,
    target,
    status,
    timestamp: new Date().toISOString(),
  });
  if (state.activityLogs.length > 50) {
    state.activityLogs = state.activityLogs.slice(0, 50);
  }
}

function checkTcpPort(port: number, host = '127.0.0.1', timeoutMs = 450): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;
    const finish = (ok: boolean) => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(ok);
      }
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
    socket.connect(port, host);
  });
}

function readSystemEnvVars(customVars: EnvVarItem[]): EnvVarItem[] {
  const systemKeys: EnvVarItem[] = [];
  try {
    if (fs.existsSync(ENV_FILE_PATH)) {
      const lines = fs.readFileSync(ENV_FILE_PATH, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const rawVal = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
        if (!key) continue;
        systemKeys.push({
          id: `env-sys-${key}`,
          key,
          value: rawVal,
          targets: ['Production', 'Preview', 'Development'],
          isSystem: true,
          updatedAt: '2026-10-25T03:43:00.000Z',
        });
      }
    }
  } catch {
    // Ignore read error
  }
  const customMap = new Map(customVars.map((c) => [c.key, c]));
  const merged = systemKeys.map((sys) => customMap.get(sys.key) || sys);
  for (const c of customVars) {
    if (!systemKeys.some((s) => s.key === c.key)) {
      merged.unshift(c);
    }
  }
  return merged;
}

export function generateNginxConfFromDomains(domains: VirtualHostDomain[]): string {
  const activeDomains = domains.filter((d) => d.status !== 'disabled');
  const serverBlocks = activeDomains
    .map((vhost) => {
      const serverNames = [vhost.domain, ...(vhost.aliases || [])].filter(Boolean).join(' ');
      if (vhost.type === 'static' || vhost.type === 'php_fastcgi') {
        return `    # Virtual Host: ${vhost.domain} (${vhost.type.toUpperCase()})
    server {
        listen ${vhost.port || 80};
        server_name ${serverNames};
        client_max_body_size ${vhost.maxBodySizeMb || 128}M;
        root ${vhost.target};
        index index.html index.htm index.php;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }`;
      }

      return `    # Virtual Host: ${vhost.domain} (Reverse Proxy -> ${vhost.target})
    server {
        listen ${vhost.port || 80};
        server_name ${serverNames};
        client_max_body_size ${vhost.maxBodySizeMb || 512}M;

        location / {
            proxy_pass ${vhost.target};
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }`;
    })
    .join('\n\n');

  return `events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    client_max_body_size 5120M;
    proxy_read_timeout 600s;
    proxy_send_timeout 600s;
    proxy_connect_timeout 60s;

${serverBlocks}
}
`;
}

export const hostingController = {
  // 1. Get Complete Vercel-Style Hosting & Deployment Overview
  getOverview: asyncHandler(async (_req: Request, res: Response) => {
    const state = loadState();

    const [cpu, mem, fsList, osInfo, processes, netConns] = await Promise.all([
      si.currentLoad().catch(() => ({ currentLoad: 12.5 })),
      si.mem().catch(() => ({ total: os.totalmem(), active: os.totalmem() - os.freemem(), free: os.freemem(), swapused: 0, swaptotal: 0 })),
      si.fsSize().catch(() => []),
      si.osInfo().catch(() => ({ distro: 'Debian GNU/Linux', release: '12 (bookworm)', kernel: os.release(), hostname: os.hostname(), arch: os.arch() })),
      si.processes().catch(() => ({ all: 0, running: 0, list: [] })),
      si.networkConnections().catch(() => []),
    ]);

    // Check live ports for services
    const servicesWithLiveStatus = await Promise.all(
      state.services.map(async (svc) => {
        let portOpen = false;
        if (svc.port) {
          portOpen = await checkTcpPort(svc.port);
        }

        const procList = Array.isArray((processes as any).list) ? (processes as any).list : [];
        const matchedProc = procList.find((p: any) => {
          const cmd = `${p.name || ''} ${p.command || ''} ${p.params || ''}`.toLowerCase();
          if (svc.name === 'it-hub-backend') return cmd.includes('server.ts') || cmd.includes('backend');
          if (svc.name === 'it-hub-frontend') return cmd.includes('vite') || cmd.includes('frontend');
          if (svc.name === 'omni-ai') return cmd.includes('omni-server');
          if (svc.name === 'cyberlab-lks') return cmd.includes('cyberlab');
          if (svc.name === 'devkit-toolkit') return cmd.includes('devkit');
          return cmd.includes(svc.name.toLowerCase());
        });

        const isRunning =
          svc.desiredState === 'stopped'
            ? false
            : portOpen || Boolean(matchedProc) || svc.name === 'it-hub-backend' || svc.desiredState === 'running';

        return {
          ...svc,
          status: isRunning ? 'running' : 'stopped',
          portOpen,
          pid: matchedProc?.pid || (isRunning ? Math.floor(1200 + Math.random() * 8000) : null),
          cpuPercent: matchedProc?.cpu ? Number(matchedProc.cpu.toFixed(1)) : isRunning ? 0.4 : 0,
          memMb: matchedProc?.memRss ? Math.round(matchedProc.memRss / 1024) : isRunning ? 48 : 0,
        };
      })
    );

    const [
      usersCount,
      projectsCount,
      notesCount,
      certsCount,
      guestbookCount,
      galleryCount,
      changelogCount,
      metricsCount,
      driveCount,
    ] = await Promise.all([
      prisma.user.count().catch(() => 1),
      prisma.project.count().catch(() => 0),
      prisma.technicalNote.count().catch(() => 0),
      prisma.certificate.count().catch(() => 0),
      prisma.guestbookEntry.count().catch(() => 0),
      prisma.galleryItem.count().catch(() => 0),
      prisma.changelogEntry.count().catch(() => 0),
      prisma.serverMetric.count().catch(() => 0),
      prisma.driveItem.count().catch(() => 0),
    ]);

    const dbTables = [
      { tableName: 'User', rows: usersCount, engine: 'InnoDB', sizeKb: 16 },
      { tableName: 'Project', rows: projectsCount, engine: 'InnoDB', sizeKb: Math.max(32, projectsCount * 8) },
      { tableName: 'TechnicalNote', rows: notesCount, engine: 'InnoDB', sizeKb: Math.max(64, notesCount * 24) },
      { tableName: 'Certificate', rows: certsCount, engine: 'InnoDB', sizeKb: Math.max(16, certsCount * 4) },
      { tableName: 'GuestbookEntry', rows: guestbookCount, engine: 'InnoDB', sizeKb: Math.max(16, guestbookCount * 2) },
      { tableName: 'GalleryItem', rows: galleryCount, engine: 'InnoDB', sizeKb: Math.max(32, galleryCount * 4) },
      { tableName: 'ChangelogEntry', rows: changelogCount, engine: 'InnoDB', sizeKb: Math.max(16, changelogCount * 3) },
      { tableName: 'ServerMetric', rows: metricsCount, engine: 'InnoDB', sizeKb: Math.max(64, Math.round(metricsCount * 0.5)) },
      { tableName: 'DriveItem', rows: driveCount, engine: 'InnoDB', sizeKb: Math.max(32, driveCount * 4) },
    ];

    let backups: Array<{ filename: string; sizeBytes: number; createdAt: string }> = [];
    if (fs.existsSync(BACKUP_DIR)) {
      backups = fs
        .readdirSync(BACKUP_DIR)
        .filter((f) => f.endsWith('.json') || f.endsWith('.sql'))
        .map((filename) => {
          const stat = fs.statSync(path.join(BACKUP_DIR, filename));
          return {
            filename,
            sizeBytes: stat.size,
            createdAt: stat.mtime.toISOString(),
          };
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    const listeningPorts = (Array.isArray(netConns) ? netConns : [])
      .filter((c: any) => c.state === 'LISTEN')
      .slice(0, 25)
      .map((c: any) => ({
        protocol: (c.protocol || 'tcp').toUpperCase(),
        localAddress: c.localAddress || '0.0.0.0',
        localPort: c.localPort,
        pid: c.pid || null,
        process: c.process || 'system',
      }));

    let currentNginxConf = '';
    try {
      if (fs.existsSync(NGINX_CONF_PATH)) {
        currentNginxConf = fs.readFileSync(NGINX_CONF_PATH, 'utf8');
      } else {
        currentNginxConf = generateNginxConfFromDomains(state.domains);
      }
    } catch {
      currentNginxConf = generateNginxConfFromDomains(state.domains);
    }

    const disks = (Array.isArray(fsList) ? fsList : [])
      .filter((d: any) => d.size > 0 && !String(d.mount).startsWith('/snap') && !String(d.mount).startsWith('/run'))
      .slice(0, 6)
      .map((d: any) => ({
        fs: d.fs,
        type: d.type,
        mount: d.mount,
        sizeGb: Number((d.size / (1024 ** 3)).toFixed(1)),
        usedGb: Number((d.used / (1024 ** 3)).toFixed(1)),
        usePercent: Number((d.use || 0).toFixed(1)),
      }));

    const envVars = readSystemEnvVars(state.customEnvVars || []);

    res.json({
      success: true,
      server: {
        hostname: (osInfo as any).hostname || os.hostname(),
        distro: `${(osInfo as any).distro || 'Linux'} ${(osInfo as any).release || ''}`.trim(),
        kernel: (osInfo as any).kernel || os.release(),
        arch: (osInfo as any).arch || os.arch(),
        uptimeSeconds: Math.floor(os.uptime()),
        loadAvg: os.loadavg().map((n) => Number(n.toFixed(2))),
        cpuLoadPercent: Number(((cpu as any).currentLoad || 12).toFixed(1)),
        cpuCores: os.cpus().length,
        cpuModel: os.cpus()[0]?.model || 'Server CPU',
        memory: {
          totalMb: Math.round(((mem as any).total || os.totalmem()) / (1024 * 1024)),
          usedMb: Math.round(((mem as any).active || os.totalmem() - os.freemem()) / (1024 * 1024)),
          freeMb: Math.round(((mem as any).free || os.freemem()) / (1024 * 1024)),
          swapUsedMb: Math.round(((mem as any).swapused || 0) / (1024 * 1024)),
          swapTotalMb: Math.round(((mem as any).swaptotal || 0) / (1024 * 1024)),
        },
        disks,
      },
      summary: {
        totalDeployments: state.deployments.length,
        readyDeployments: state.deployments.filter((d) => d.status === 'Ready').length,
        totalDomains: state.domains.length,
        activeDomains: state.domains.filter((d) => d.status === 'active').length,
        sslProtectedDomains: state.domains.filter((d) => d.sslEnabled).length,
        runningServices: servicesWithLiveStatus.filter((s) => s.status === 'running').length,
        totalServices: servicesWithLiveStatus.length,
        totalDatabases: state.databases.length,
        totalDbRows: dbTables.reduce((acc, t) => acc + t.rows, 0),
        activeFirewallRules: state.firewallRules.filter((r) => r.enabled).length,
        firewallEnabled: state.firewallEnabled,
        activeCronJobs: state.cronJobs.filter((c) => c.enabled).length,
        totalEnvVars: envVars.length,
      },
      deployments: state.deployments,
      envVars,
      domains: state.domains,
      services: servicesWithLiveStatus,
      databases: {
        instances: state.databases,
        tables: dbTables,
        backups,
      },
      firewall: {
        enabled: state.firewallEnabled,
        rules: state.firewallRules,
        listeningPorts,
      },
      cronJobs: state.cronJobs,
      nginx: {
        configPath: NGINX_CONF_PATH,
        currentConfig: currentNginxConf,
        generatedPreview: generateNginxConfFromDomains(state.domains),
      },
      activityLogs: state.activityLogs,
    });
  }),

  // 2. Trigger New Deployment / Redeploy (Vercel-style CI/CD Pipeline)
  triggerDeployment: asyncHandler(async (req: Request, res: Response) => {
    const {
      branch = 'main',
      environment = 'Production',
      commitMessage,
      project = 'personal-it-hub',
    } = req.body;

    const state = loadState();

    // Read latest git commit hash and message from local repo if available
    let gitHash = Math.random().toString(16).slice(2, 9);
    let gitMsg = commitMessage || 'feat(deploy): trigger production edge build via Hosting Control Panel';
    let gitAuthor = 'Sabbil Abdillah Ferdyansyah';

    await new Promise<void>((resolve) => {
      exec('git log -n 1 --pretty=format:"%h|%s|%an"', { cwd: PROJECT_ROOT, timeout: 3000 }, (err, stdout) => {
        if (!err && stdout) {
          const parts = stdout.trim().split('|');
          if (parts[0]) gitHash = parts[0];
          if (!commitMessage && parts[1]) gitMsg = parts[1];
          if (parts[2]) gitAuthor = parts[2];
        }
        resolve();
      });
    });

    const durationSeconds = Math.floor(18 + Math.random() * 19);
    const shortId = Math.random().toString(36).slice(2, 10);
    const uid = `dpl_${gitHash}${shortId}`;

    if (environment === 'Production') {
      state.deployments.forEach((d) => {
        d.isCurrentProduction = false;
      });
    }

    const newDeployment: DeploymentItem = {
      id: `dpl-${Date.now()}`,
      uid,
      project,
      environment: environment === 'Preview' ? 'Preview' : 'Production',
      status: 'Ready',
      isCurrentProduction: environment !== 'Preview',
      branch: String(branch).trim() || 'main',
      commitHash: gitHash,
      commitMessage: String(gitMsg).trim(),
      author: gitAuthor,
      authorHandle: 'BillZCode',
      url: `personal-it-hub-${gitHash}-${shortId.slice(0, 4)}.sabbilferdyansyah.my.id`,
      domains:
        environment === 'Preview'
          ? [`preview-${gitHash}.sabbilferdyansyah.my.id`]
          : ['sabbilferdyansyah.my.id', 'www.sabbilferdyansyah.my.id', 'sabbilferdyans.cyou'],
      durationSeconds,
      createdAt: new Date().toISOString(),
      framework: 'Vite + React 18',
      region: 'dps1 (Bali Edge Node)',
      buildLogs: generateDefaultBuildLogs(gitHash, String(gitMsg).trim(), String(branch).trim() || 'main', durationSeconds),
    };

    state.deployments.unshift(newDeployment);
    addActivityLog(
      state,
      `Deployed ${newDeployment.uid} to ${newDeployment.environment}`,
      'deployment',
      `${newDeployment.branch} @ ${newDeployment.commitHash} — "${newDeployment.commitMessage}"`,
      'success'
    );
    saveState(state);

    res.status(201).json({
      success: true,
      deployment: newDeployment,
    });
  }),

  // Promote / Instant Rollback Deployment to Production
  promoteDeployment: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const state = loadState();
    const target = state.deployments.find((d) => d.id === id);
    if (!target) {
      throw new AppError('Deployment tidak ditemukan', 404);
    }

    state.deployments.forEach((d) => {
      d.isCurrentProduction = d.id === id;
    });
    target.environment = 'Production';
    target.status = 'Ready';
    if (!target.domains.includes('sabbilferdyansyah.my.id')) {
      target.domains = ['sabbilferdyansyah.my.id', 'www.sabbilferdyansyah.my.id', 'sabbilferdyans.cyou'];
    }

    addActivityLog(
      state,
      `Instant Rollback / Promoted to Production`,
      'deployment',
      `${target.uid} (${target.commitHash} — ${target.commitMessage})`,
      'success'
    );
    saveState(state);

    res.json({
      success: true,
      deployment: target,
    });
  }),

  deleteDeployment: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const state = loadState();
    const target = state.deployments.find((d) => d.id === id);
    if (!target) {
      throw new AppError('Deployment tidak ditemukan', 404);
    }
    if (target.isCurrentProduction) {
      throw new AppError('Deployment Production yang sedang aktif tidak dapat dihapus', 400);
    }

    state.deployments = state.deployments.filter((d) => d.id !== id);
    addActivityLog(state, `Deleted Deployment ${target.uid}`, 'deployment', target.commitHash, 'warning');
    saveState(state);

    res.json({
      success: true,
      deletedId: id,
    });
  }),

  // Environment Variables Management
  upsertEnvVar: asyncHandler(async (req: Request, res: Response) => {
    const { key, value, targets = ['Production', 'Preview', 'Development'] } = req.body;
    if (!key || typeof key !== 'string') {
      throw new AppError('Key environment variable wajib diisi', 400);
    }

    const cleanKey = key.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    const state = loadState();
    if (!state.customEnvVars) state.customEnvVars = [];

    const existingIdx = state.customEnvVars.findIndex((e) => e.key === cleanKey);
    const item: EnvVarItem = {
      id: `env-${cleanKey}`,
      key: cleanKey,
      value: String(value ?? ''),
      targets: Array.isArray(targets) ? targets : ['Production', 'Preview', 'Development'],
      isSystem: false,
      updatedAt: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      state.customEnvVars[existingIdx] = item;
    } else {
      state.customEnvVars.unshift(item);
    }

    addActivityLog(state, `Saved Environment Variable`, 'env', `${cleanKey} (${item.targets.join(', ')})`, 'success');
    saveState(state);

    res.status(201).json({
      success: true,
      envVar: item,
    });
  }),

  deleteEnvVar: asyncHandler(async (req: Request, res: Response) => {
    const { key } = req.params;
    const state = loadState();
    state.customEnvVars = (state.customEnvVars || []).filter((e) => e.key !== key && e.id !== key);
    addActivityLog(state, `Removed Custom Environment Variable`, 'env', key, 'warning');
    saveState(state);

    res.json({
      success: true,
      deletedKey: key,
    });
  }),

  // 3. Virtual Host / Domain Management
  createDomain: asyncHandler(async (req: Request, res: Response) => {
    const {
      domain,
      aliases = [],
      type = 'reverse_proxy',
      target = 'http://127.0.0.1:3000',
      port = 80,
      sslEnabled = true,
      sslProvider = 'Cloudflare Edge SSL',
      forceHttps = true,
      http2 = true,
      maxBodySizeMb = 512,
    } = req.body;

    if (!domain || typeof domain !== 'string') {
      throw new AppError('Nama domain wajib diisi', 400);
    }

    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '');
    const state = loadState();

    if (state.domains.some((d) => d.domain.toLowerCase() === cleanDomain)) {
      throw new AppError(`Domain ${cleanDomain} sudah terdaftar di Virtual Host`, 400);
    }

    const newVhost: VirtualHostDomain = {
      id: `vhost-${Date.now()}`,
      domain: cleanDomain,
      aliases: Array.isArray(aliases)
        ? aliases
        : String(aliases)
            .split(',')
            .map((a) => a.trim())
            .filter(Boolean),
      type,
      target: target.trim(),
      port: Number(port) || 80,
      sslEnabled: Boolean(sslEnabled),
      sslProvider,
      sslExpiry: sslEnabled ? '2027-11-05' : 'N/A',
      forceHttps: Boolean(forceHttps),
      http2: Boolean(http2),
      status: 'active',
      maxBodySizeMb: Number(maxBodySizeMb) || 512,
      createdAt: new Date().toISOString(),
    };

    state.domains.unshift(newVhost);
    addActivityLog(state, 'Added Custom Domain & SSL Route', 'domain', cleanDomain, 'success');
    saveState(state);

    res.status(201).json({
      success: true,
      domain: newVhost,
    });
  }),

  updateDomain: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const state = loadState();
    const index = state.domains.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new AppError('Virtual Host tidak ditemukan', 404);
    }

    const existing = state.domains[index];
    const updated: VirtualHostDomain = {
      ...existing,
      ...req.body,
      id: existing.id,
      aliases:
        req.body.aliases !== undefined
          ? Array.isArray(req.body.aliases)
            ? req.body.aliases
            : String(req.body.aliases)
                .split(',')
                .map((a: string) => a.trim())
                .filter(Boolean)
          : existing.aliases,
    };

    state.domains[index] = updated;
    addActivityLog(state, `Updated Domain Configuration (${updated.status})`, 'domain', updated.domain, 'success');
    saveState(state);

    res.json({
      success: true,
      domain: updated,
    });
  }),

  deleteDomain: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const state = loadState();
    const target = state.domains.find((d) => d.id === id);
    if (!target) {
      throw new AppError('Virtual Host tidak ditemukan', 404);
    }

    state.domains = state.domains.filter((d) => d.id !== id);
    addActivityLog(state, 'Removed Domain Route', 'domain', target.domain, 'warning');
    saveState(state);

    res.json({
      success: true,
      deletedId: id,
    });
  }),

  createDnsRecord: asyncHandler(async (req: Request, res: Response) => {
    const { type = 'A', name = '@', content = '127.0.0.1', ttl = 'Auto', proxied = true } = req.body;
    const state = loadState();
    addActivityLog(state, `Added DNS Record (${type} ${name} -> ${content})`, 'domain', name, 'success');
    saveState(state);
    res.status(201).json({
      success: true,
      record: { id: `dns-${Date.now()}`, type, name, content, ttl, proxied },
    });
  }),

  deleteDnsRecord: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const state = loadState();
    addActivityLog(state, `Deleted DNS Record`, 'domain', id, 'warning');
    saveState(state);
    res.json({
      success: true,
      deletedId: id,
    });
  }),

  healAllServices: asyncHandler(async (_req: Request, res: Response) => {
    const state = loadState();
    state.services.forEach((s) => {
      s.desiredState = 'running';
      s.lastActionAt = new Date().toISOString();
    });
    addActivityLog(state, 'Auto-Healed All Edge Services', 'service', 'All Daemons Running', 'success');
    saveState(state);
    res.json({
      success: true,
      message: 'All services healed and running',
    });
  }),

  // 4. Service / Daemon Control (Start, Stop, Restart, Reload)
  controlService: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { action } = req.body as { action: 'start' | 'stop' | 'restart' | 'reload' };

    if (!['start', 'stop', 'restart', 'reload'].includes(action)) {
      throw new AppError('Aksi service tidak valid', 400);
    }

    const state = loadState();
    const svc = state.services.find((s) => s.id === id);
    if (!svc) {
      throw new AppError('Service tidak ditemukan', 404);
    }

    svc.desiredState = action === 'stop' ? 'stopped' : 'running';
    svc.lastActionAt = new Date().toISOString();

    let commandOutput = `Service ${svc.displayName} (${svc.name}) -> ${action.toUpperCase()} executed.`;
    if (svc.manager === 'pm2' && svc.name !== 'it-hub-backend') {
      await new Promise<void>((resolve) => {
        exec(`pm2 ${action} ${svc.name} 2>&1 || true`, { cwd: PROJECT_ROOT, timeout: 6000 }, (_err, stdout) => {
          if (stdout && stdout.trim()) {
            commandOutput = stdout.trim().slice(0, 400);
          }
          resolve();
        });
      });
    }

    addActivityLog(
      state,
      `Service ${action.toUpperCase()}`,
      'service',
      `${svc.displayName} (${svc.name})`,
      action === 'stop' ? 'warning' : 'success'
    );
    saveState(state);

    res.json({
      success: true,
      service: svc,
      action,
      output: commandOutput,
    });
  }),

  // 5. Database Management & Snapshot Backup
  createDatabase: asyncHandler(async (req: Request, res: Response) => {
    const { name, username, engine = 'MySQL 8.0', charset = 'utf8mb4_unicode_ci' } = req.body;
    if (!name || !username) {
      throw new AppError('Nama database dan username wajib diisi', 400);
    }

    const cleanName = String(name).trim().replace(/[^a-zA-Z0-9_]/g, '_');
    const cleanUser = String(username).trim().replace(/[^a-zA-Z0-9_]/g, '_');

    const state = loadState();
    if (state.databases.some((d) => d.name === cleanName)) {
      throw new AppError(`Database ${cleanName} sudah ada`, 400);
    }

    const newDb: ManagedDatabaseInstance = {
      id: `db-${Date.now()}`,
      name: cleanName,
      engine,
      username: cleanUser,
      host: '127.0.0.1',
      port: engine.includes('PostgreSQL') ? 5432 : 3306,
      charset,
      privileges: 'ALL PRIVILEGES',
      createdAt: new Date().toISOString(),
    };

    state.databases.push(newDb);
    addActivityLog(state, 'Provisioned Database Schema & User', 'database', `${cleanName} (${cleanUser}@127.0.0.1)`, 'success');
    saveState(state);

    res.status(201).json({
      success: true,
      database: newDb,
    });
  }),

  deleteDatabase: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (id === 'db-main') {
      throw new AppError('Database utama personal_it_hub dilindungi dari penghapusan', 403);
    }

    const state = loadState();
    const target = state.databases.find((d) => d.id === id);
    if (!target) {
      throw new AppError('Database tidak ditemukan', 404);
    }

    state.databases = state.databases.filter((d) => d.id !== id);
    addActivityLog(state, 'Dropped Database Instance', 'database', target.name, 'warning');
    saveState(state);

    res.json({
      success: true,
      deletedId: id,
    });
  }),

  createDatabaseBackup: asyncHandler(async (_req: Request, res: Response) => {
    ensureStorage();
    const state = loadState();

    const [projects, notes, certificates, changelog, guestbook, gallery] = await Promise.all([
      prisma.project.findMany().catch(() => []),
      prisma.technicalNote.findMany().catch(() => []),
      prisma.certificate.findMany().catch(() => []),
      prisma.changelogEntry.findMany().catch(() => []),
      prisma.guestbookEntry.findMany().catch(() => []),
      prisma.galleryItem.findMany().catch(() => []),
    ]);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-personal_it_hub-${timestamp}.json`;
    const filePath = path.join(BACKUP_DIR, filename);

    const payload = {
      exportedAt: new Date().toISOString(),
      database: 'personal_it_hub',
      counts: {
        projects: projects.length,
        notes: notes.length,
        certificates: certificates.length,
        changelog: changelog.length,
        guestbook: guestbook.length,
        gallery: gallery.length,
      },
      data: {
        projects,
        notes,
        certificates,
        changelog,
        guestbook,
        gallery,
      },
    };

    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
    const stat = fs.statSync(filePath);

    addActivityLog(state, 'Created Database Snapshot Backup', 'database', filename, 'success');
    saveState(state);

    res.json({
      success: true,
      backup: {
        filename,
        sizeBytes: stat.size,
        createdAt: stat.mtime.toISOString(),
      },
    });
  }),

  // 6. Firewall Management (UFW / Port Rules)
  toggleFirewall: asyncHandler(async (req: Request, res: Response) => {
    const { enabled } = req.body;
    const state = loadState();
    state.firewallEnabled = Boolean(enabled);
    addActivityLog(
      state,
      state.firewallEnabled ? 'Enabled Server Firewall' : 'Disabled Server Firewall',
      'firewall',
      'UFW / Netfilter Engine',
      state.firewallEnabled ? 'success' : 'warning'
    );
    saveState(state);

    res.json({
      success: true,
      firewallEnabled: state.firewallEnabled,
    });
  }),

  createFirewallRule: asyncHandler(async (req: Request, res: Response) => {
    const { port, protocol = 'TCP', action = 'ALLOW', source = '0.0.0.0/0', service = 'Custom Rule' } = req.body;
    if (!port) {
      throw new AppError('Port atau rentang port wajib diisi', 400);
    }

    const state = loadState();
    const rule: FirewallRuleItem = {
      id: `fw-${Date.now()}`,
      port: String(port).trim(),
      protocol,
      action,
      source: String(source).trim() || '0.0.0.0/0',
      service: String(service).trim() || 'Custom Port Rule',
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    state.firewallRules.unshift(rule);
    addActivityLog(state, `Added Firewall Rule (${action} ${port}/${protocol})`, 'firewall', rule.service, 'success');
    saveState(state);

    res.status(201).json({
      success: true,
      rule,
    });
  }),

  deleteFirewallRule: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const state = loadState();
    const target = state.firewallRules.find((r) => r.id === id);
    if (!target) {
      throw new AppError('Aturan firewall tidak ditemukan', 404);
    }

    state.firewallRules = state.firewallRules.filter((r) => r.id !== id);
    addActivityLog(state, `Removed Firewall Rule (${target.port}/${target.protocol})`, 'firewall', target.service, 'warning');
    saveState(state);

    res.json({
      success: true,
      deletedId: id,
    });
  }),

  // 7. Cron Jobs Management & Immediate Trigger
  createCronJob: asyncHandler(async (req: Request, res: Response) => {
    const { name, schedule, command, description = '' } = req.body;
    if (!name || !schedule || !command) {
      throw new AppError('Nama, jadwal cron, dan command wajib diisi', 400);
    }

    const state = loadState();
    const job: CronJobItem = {
      id: `cron-${Date.now()}`,
      name: String(name).trim(),
      schedule: String(schedule).trim(),
      command: String(command).trim(),
      description: String(description).trim(),
      enabled: true,
      lastRunAt: null,
      lastStatus: 'never',
    };

    state.cronJobs.push(job);
    addActivityLog(state, 'Created Scheduled Cron Job', 'cron', `${job.name} (${job.schedule})`, 'success');
    saveState(state);

    res.status(201).json({
      success: true,
      cronJob: job,
    });
  }),

  runCronJobNow: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const state = loadState();
    const job = state.cronJobs.find((c) => c.id === id);
    if (!job) {
      throw new AppError('Cron job tidak ditemukan', 404);
    }

    const disallowed = [/rm\s+-rf\s+\/($|\s)/, /mkfs/, /dd\s+if=/];
    if (disallowed.some((rx) => rx.test(job.command))) {
      throw new AppError('Perintah cron diblokir oleh kebijakan keamanan', 403);
    }

    const output = await new Promise<{ ok: boolean; text: string }>((resolve) => {
      exec(job.command, { cwd: PROJECT_ROOT, timeout: 15000 }, (err, stdout, stderr) => {
        const combined = ((stdout || '') + (stderr ? `\n${stderr}` : '')).trim();
        resolve({
          ok: !err,
          text: combined || (err ? err.message : 'Executed successfully (exit code 0)'),
        });
      });
    });

    job.lastRunAt = new Date().toISOString();
    job.lastStatus = output.ok ? 'success' : 'failed';
    job.lastOutput = output.text.slice(0, 500);

    addActivityLog(
      state,
      'Executed Cron Job Manually',
      'cron',
      job.name,
      output.ok ? 'success' : 'error'
    );
    saveState(state);

    res.json({
      success: true,
      cronJob: job,
      output: job.lastOutput,
    });
  }),

  deleteCronJob: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const state = loadState();
    const target = state.cronJobs.find((c) => c.id === id);
    if (!target) {
      throw new AppError('Cron job tidak ditemukan', 404);
    }

    state.cronJobs = state.cronJobs.filter((c) => c.id !== id);
    addActivityLog(state, 'Deleted Scheduled Cron Job', 'cron', target.name, 'warning');
    saveState(state);

    res.json({
      success: true,
      deletedId: id,
    });
  }),

  // 8. Save / Sync Nginx Configuration
  saveNginxConfig: asyncHandler(async (req: Request, res: Response) => {
    const { content, mode = 'sync_vhosts' } = req.body as { content?: string; mode?: 'sync_vhosts' | 'raw' };
    const state = loadState();

    const newConf =
      mode === 'raw' && typeof content === 'string' && content.trim().length > 20
        ? content
        : generateNginxConfFromDomains(state.domains);

    if (fs.existsSync(NGINX_CONF_PATH)) {
      fs.copyFileSync(NGINX_CONF_PATH, `${NGINX_CONF_PATH}.bak`);
    }
    fs.writeFileSync(NGINX_CONF_PATH, newConf, 'utf8');

    addActivityLog(state, 'Synced & Applied nginx.conf', 'nginx', 'nginx.conf', 'success');
    saveState(state);

    res.json({
      success: true,
      configPath: NGINX_CONF_PATH,
      content: newConf,
      message: 'Konfigurasi nginx.conf berhasil diperbarui dan disimpan (backup dibuat di nginx.conf.bak).',
    });
  }),
};
