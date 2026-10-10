import { Request, Response } from 'express';
import { exec, spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { asyncHandler, AppError } from '../middleware';
import { getAntigravityQuotas } from '../services/antigravityQuota';
import { runAgentAutonomousCycle } from '../services/agentTaskRunner';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');

interface AgentExecutionLog {
  id: string;
  command: string;
  output: string;
  exitCode: number | null;
  status: 'running' | 'success' | 'failed';
  startedAt: string;
  endedAt?: string;
}

const executionHistory: AgentExecutionLog[] = [];
const MAX_HISTORY = 50;

export const agentController = {
  // Get Antigravity Agent runtime and system status
  getStatus: asyncHandler(async (req: Request, res: Response) => {
    const agyBinPath = '/home/sabbil/.local/bin/agy';
    const hasAgy = fs.existsSync(agyBinPath);
    
    // Check if Gemini API key is configured
    const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY);

    // Get system load & specs
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const uptime = os.uptime();

    res.json({
      success: true,
      agent: {
        name: 'Antigravity IDE & Autonomous Agent',
        version: '2.4.0-pro',
        status: 'ONLINE',
        mode: 'REMOTE_ADMIN_CONTROL',
        cliAvailable: hasAgy,
        cliPath: hasAgy ? agyBinPath : null,
        workspaceRoot: PROJECT_ROOT,
        geminiKeyConfigured: hasGeminiKey,
        defaultModel: 'gemini-2.5-flash / gemini-3.8-flash',
      },
      system: {
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
        uptimeSeconds: uptime,
        cpuModel: cpus[0]?.model || 'Unknown',
        cpuCores: cpus.length,
        memory: {
          totalMb: Math.round(totalMem / (1024 * 1024)),
          usedMb: Math.round(usedMem / (1024 * 1024)),
          freeMb: Math.round(freeMem / (1024 * 1024)),
          usagePercent: Math.round((usedMem / totalMem) * 100),
        },
      },
      activeExecutions: executionHistory.filter(h => h.status === 'running').length,
    });
  }),

  // Execute instructions/tasks via Gemini AI or Antigravity Agent logic
  executePrompt: asyncHandler(async (req: Request, res: Response) => {
    const { prompt, mode = 'smart' } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      throw new AppError('Prompt / instruksi task harus diisi', 400);
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;
    if (!apiKey) {
      throw new AppError('GEMINI_API_KEY belum dikonfigurasi di server environment.', 500);
    }
    const execId = `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    
    const executionItem: AgentExecutionLog = {
      id: execId,
      command: `Agent Prompt: ${prompt.slice(0, 120)}...`,
      output: '',
      exitCode: null,
      status: 'running',
      startedAt: new Date().toISOString(),
    };
    executionHistory.unshift(executionItem);
    if (executionHistory.length > MAX_HISTORY) executionHistory.pop();

    try {
      // Run full autonomous agent cycle: Reason -> Plan -> Execute Actions -> Verify & Final Report
      const result = await runAgentAutonomousCycle(prompt, apiKey, PROJECT_ROOT);

      executionItem.status = 'success';
      executionItem.exitCode = 0;
      executionItem.output = result.finalReport;
      executionItem.endedAt = new Date().toISOString();

      res.json({
        success: true,
        taskId: execId,
        output: result.finalReport,
        plan: result.thought,
        actionsTaken: result.actionsTaken,
        actionsCount: result.actionsTaken.length,
        startedAt: executionItem.startedAt,
        endedAt: executionItem.endedAt,
      });
    } catch (err: any) {
      executionItem.status = 'failed';
      executionItem.exitCode = 1;
      executionItem.output = err?.message || 'Unknown agent execution error';
      executionItem.endedAt = new Date().toISOString();
      return res.status(502).json({
        success: false,
        error: `Gagal menjalankan tugas agent: ${err.message}`,
        taskId: execId,
      });
    }
  }),

  // Execute safe terminal shell command on behalf of admin
  executeCommand: asyncHandler(async (req: Request, res: Response) => {
    const { command, cwd } = req.body;
    if (!command || typeof command !== 'string') {
      throw new AppError('Command harus diisi', 400);
    }

    // Safety checks against destructive commands
    const trimmed = command.trim();
    const disallowedPatterns = [
      /rm\s+-rf\s+\/($|\s)/,
      /mkfs/,
      /:(){ :\|:& };:/,
      /dd\s+if=/,
      />\s*\/dev\/sd/,
      />\s*\/dev\/nvme/,
    ];

    for (const pattern of disallowedPatterns) {
      if (pattern.test(trimmed)) {
        throw new AppError('Perintah diblokir oleh Safety Protocol Antigravity Agent.', 403);
      }
    }

    const execId = `cmd-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const workingDir = cwd ? path.resolve(PROJECT_ROOT, cwd) : PROJECT_ROOT;

    const executionItem: AgentExecutionLog = {
      id: execId,
      command: trimmed,
      output: '',
      exitCode: null,
      status: 'running',
      startedAt: new Date().toISOString(),
    };
    executionHistory.unshift(executionItem);
    if (executionHistory.length > MAX_HISTORY) executionHistory.pop();

    exec(trimmed, { cwd: workingDir, timeout: 45000, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      executionItem.endedAt = new Date().toISOString();
      const output = (stdout || '') + (stderr ? (stdout ? '\n' : '') + stderr : '');
      executionItem.output = output;

      if (error) {
        executionItem.status = 'failed';
        executionItem.exitCode = error.code ?? 1;
      } else {
        executionItem.status = 'success';
        executionItem.exitCode = 0;
      }
    });

    // Return task metadata immediately or await short running commands
    // Wait up to 3 seconds for fast completion
    const startTime = Date.now();
    const checkInterval = 200;
    
    const waitForFinish = new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (executionItem.status !== 'running' || Date.now() - startTime > 3000) {
          clearInterval(interval);
          resolve();
        }
      }, checkInterval);
    });

    await waitForFinish;

    res.json({
      success: true,
      taskId: execId,
      command: trimmed,
      status: executionItem.status,
      exitCode: executionItem.exitCode,
      output: executionItem.output,
      startedAt: executionItem.startedAt,
      endedAt: executionItem.endedAt,
    });
  }),

  // Get execution logs/history
  getHistory: asyncHandler(async (req: Request, res: Response) => {
    res.json({
      success: true,
      data: executionHistory,
    });
  }),

  // Quick Antigravity Project Diagnostics & Health Check
  getHealthDiagnostics: asyncHandler(async (req: Request, res: Response) => {
    const checks: Record<string, any> = {};

    // 1. Node & Process
    const memUsage = process.memoryUsage();
    checks.node = {
      version: process.version,
      pid: process.pid,
      uptimeSeconds: Math.round(process.uptime()),
      heapUsedMb: Math.round(memUsage.heapUsed / (1024 * 1024)),
      heapTotalMb: Math.round(memUsage.heapTotal / (1024 * 1024)),
      rssMb: Math.round(memUsage.rss / (1024 * 1024)),
    };

    // 2. System Load & Memory
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    checks.system = {
      hostname: os.hostname(),
      platform: os.platform(),
      release: os.release(),
      loadAvg: os.loadavg().map(v => Number(v.toFixed(2))),
      totalMemoryMb: Math.round(totalMem / (1024 * 1024)),
      usedMemoryMb: Math.round(usedMem / (1024 * 1024)),
      freeMemoryMb: Math.round(freeMem / (1024 * 1024)),
      usagePercent: Math.round((usedMem / totalMem) * 100),
    };

    // 3. Key Files Integrity
    checks.projectFiles = {
      envExists: fs.existsSync(path.join(PROJECT_ROOT, '.env')),
      dockerComposeExists: fs.existsSync(path.join(PROJECT_ROOT, 'docker-compose.yml')),
      prismaSchemaExists: fs.existsSync(path.join(PROJECT_ROOT, 'prisma/schema.prisma')),
      agyCliExists: fs.existsSync('/home/sabbil/.local/bin/agy'),
      packageJsonExists: fs.existsSync(path.join(PROJECT_ROOT, 'package.json')),
      ecosystemExists: fs.existsSync(path.join(PROJECT_ROOT, 'ecosystem.config.cjs')),
    };

    // 4. Git Repository Telemetry & Statistics
    try {
      const gitHead = fs.readFileSync(path.join(PROJECT_ROOT, '.git/HEAD'), 'utf8').trim();
      const branchName = gitHead.replace('ref: refs/heads/', '');
      
      let lastCommit = 'Unknown';

      try {
        // Read recent commit from logs/HEAD or command
        const commitHashPath = path.join(PROJECT_ROOT, '.git/refs/heads', branchName);
        if (fs.existsSync(commitHashPath)) {
          lastCommit = fs.readFileSync(commitHashPath, 'utf8').trim().slice(0, 7);
        }
      } catch {
        // Ignore fallback
      }

      checks.git = {
        branch: branchName,
        commit: lastCommit,
        repoPath: PROJECT_ROOT,
        status: 'Connected',
      };
    } catch {
      checks.git = { branch: 'unknown', commit: 'none', status: 'detached' };
    }

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      checks,
    });
  }),

  // OmniAntigravity Models & Quota Live Inspector
  getModelsQuota: asyncHandler(async (req: Request, res: Response) => {
    const quotaData = await getAntigravityQuotas();
    res.json({
      success: true,
      data: quotaData,
    });
  }),
};
