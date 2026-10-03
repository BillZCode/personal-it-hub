import { platform, release, arch, cpus, totalmem, freemem, hostname, uptime } from 'node:os';
import { execSync } from 'node:child_process';

export interface SystemInfoData {
  os: string;
  kernel: string;
  architecture: string;
  cpuModel: string;
  cpuCores: number;
  totalMemoryGb: string;
  freeMemoryGb: string;
  usedMemoryGb: string;
  hostname: string;
  uptimeHours: string;
  nodeVersion: string;
  npmVersion?: string;
  gitVersion?: string;
}

export function getSystemInfo(): SystemInfoData {
  const cpuList = cpus();
  const cpuModel = cpuList.length > 0 ? cpuList[0].model : 'Unknown';
  const totalMb = totalmem() / (1024 * 1024 * 1024);
  const freeMb = freemem() / (1024 * 1024 * 1024);
  const usedMb = totalMb - freeMb;

  let npmVersion: string | undefined;
  let gitVersion: string | undefined;

  try {
    npmVersion = execSync('npm --version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    npmVersion = undefined;
  }

  try {
    gitVersion = execSync('git --version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    gitVersion = undefined;
  }

  return {
    os: `${platform()} (${process.platform})`,
    kernel: release(),
    architecture: arch(),
    cpuModel,
    cpuCores: cpuList.length,
    totalMemoryGb: totalMb.toFixed(2) + ' GB',
    freeMemoryGb: freeMb.toFixed(2) + ' GB',
    usedMemoryGb: usedMb.toFixed(2) + ' GB',
    hostname: hostname(),
    uptimeHours: (uptime() / 3600).toFixed(2) + ' Hours',
    nodeVersion: process.version,
    npmVersion,
    gitVersion
  };
}

export interface DoctorCheckItem {
  name: string;
  status: 'ok' | 'warning' | 'error';
  versionOrInfo?: string;
  message?: string;
  solution?: string;
}

export function runDoctorAudit(): DoctorCheckItem[] {
  const checks: DoctorCheckItem[] = [];

  // 1. Node.js
  const nodeVer = process.version;
  const major = parseInt(nodeVer.replace('v', '').split('.')[0], 10);
  if (major >= 18) {
    checks.push({ name: 'Node.js', status: 'ok', versionOrInfo: nodeVer });
  } else {
    checks.push({
      name: 'Node.js',
      status: 'warning',
      versionOrInfo: nodeVer,
      message: 'Node.js version is below LTS 18.x',
      solution: 'Upgrade Node.js using nvm or your system package manager.'
    });
  }

  // 2. npm
  try {
    const npmV = execSync('npm --version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    checks.push({ name: 'npm', status: 'ok', versionOrInfo: `v${npmV}` });
  } catch {
    checks.push({
      name: 'npm',
      status: 'error',
      message: 'npm package manager is not found.',
      solution: 'Install Node.js with npm included.'
    });
  }

  // 3. Git
  try {
    const gitV = execSync('git --version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    checks.push({ name: 'Git', status: 'ok', versionOrInfo: gitV });
  } catch {
    checks.push({
      name: 'Git',
      status: 'warning',
      message: 'Git is not installed or not in PATH.',
      solution: 'Install Git: sudo apt install git (Linux) or brew install git (macOS).'
    });
  }

  // 4. Python
  try {
    const pyV = execSync('python3 --version || python --version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    checks.push({ name: 'Python', status: 'ok', versionOrInfo: pyV });
  } catch {
    checks.push({
      name: 'Python',
      status: 'warning',
      message: 'Python 3 not found in PATH.',
      solution: 'Install Python 3 for scripting support.'
    });
  }

  // 5. Docker
  try {
    const dockV = execSync('docker --version', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    checks.push({ name: 'Docker', status: 'ok', versionOrInfo: dockV });
  } catch {
    checks.push({
      name: 'Docker',
      status: 'warning',
      message: 'Docker daemon not installed or not accessible.',
      solution: 'Install Docker Engine if containerized builds are needed.'
    });
  }

  // 6. Memory & Disk Space Check
  const freeMemGb = freemem() / (1024 * 1024 * 1024);
  if (freeMemGb > 1.0) {
    checks.push({ name: 'Available RAM', status: 'ok', versionOrInfo: `${freeMemGb.toFixed(2)} GB Free` });
  } else {
    checks.push({
      name: 'Available RAM',
      status: 'warning',
      versionOrInfo: `${freeMemGb.toFixed(2)} GB Free`,
      message: 'Low system RAM detected.',
      solution: 'Close unused browser tabs or memory-intensive background tasks.'
    });
  }

  return checks;
}
