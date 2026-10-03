import { execSync } from 'node:child_process';

export interface GitSummaryData {
  branch: string;
  isRepo: boolean;
  status: string[];
  clean: boolean;
  lastCommit?: string;
  remoteUrl?: string;
}

export function isGitInstalled(): boolean {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function isInsideGitRepo(): boolean {
  try {
    const res = execSync('git rev-parse --is-inside-work-tree', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    return res === 'true';
  } catch {
    return false;
  }
}

export function getGitSummary(): GitSummaryData {
  if (!isGitInstalled()) {
    throw new Error('Git is not installed or not in system PATH. Install Git to use git commands.');
  }

  if (!isInsideGitRepo()) {
    return {
      branch: 'none',
      isRepo: false,
      status: [],
      clean: true
    };
  }

  let branch = 'unknown';
  try {
    branch = execSync('git branch --show-current', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    branch = 'detached';
  }

  const statusRaw = execSync('git status --short', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  const statusLines = statusRaw ? statusRaw.split('\n') : [];

  let lastCommit: string | undefined;
  try {
    lastCommit = execSync('git log -1 --pretty=format:"%h - %s (%cr) <%an>"', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    lastCommit = undefined;
  }

  let remoteUrl: string | undefined;
  try {
    remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    remoteUrl = undefined;
  }

  return {
    branch,
    isRepo: true,
    status: statusLines,
    clean: statusLines.length === 0,
    lastCommit,
    remoteUrl
  };
}
