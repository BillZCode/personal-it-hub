import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { hostingApi } from '../../services/api';
import { useDocumentTitle } from '../../hooks';
import {
  Globe,
  Server,
  Database,
  Shield,
  Clock,
  FileCode2,
  Play,
  Square,
  RotateCcw,
  RefreshCw,
  Plus,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  HardDrive,
  MemoryStick,
  Terminal,
  ExternalLink,
  Activity,
  Download,
  Save,
  GitBranch,
  GitCommit,
  Search,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Rocket,
  History,
  KeyRound,
  FolderOpen,
  Network,
  Copy,
  Check,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '../../utils';

type VercelTab =
  | 'overview'
  | 'deployments'
  | 'domains'
  | 'storage'
  | 'runtime'
  | 'settings';

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const sec = Math.max(1, Math.floor(diffMs / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

export function AdminHostingPanel() {
  useDocumentTitle('personal-it-hub – Overview – Vercel Edge Control Panel');
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<VercelTab>('overview');
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Deployments state
  const [deploySearch, setDeploySearch] = useState('');
  const [deployEnvFilter, setDeployEnvFilter] = useState<'ALL' | 'Production' | 'Preview'>('ALL');
  const [selectedDeploymentId, setSelectedDeploymentId] = useState<string | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showOverviewBuildLogs, setShowOverviewBuildLogs] = useState(false);
  const [deployForm, setDeployForm] = useState({
    project: 'personal-it-hub',
    branch: 'main',
    environment: 'Production',
    commitMessage: '',
  });

  // Domain Form State
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [domainForm, setDomainForm] = useState({
    domain: '',
    aliases: '',
    type: 'reverse_proxy',
    target: 'http://127.0.0.1:3000',
    port: 80,
    sslEnabled: true,
    sslProvider: 'Cloudflare Edge SSL',
    forceHttps: true,
    http2: true,
    maxBodySizeMb: 512,
  });

  // Database Form State
  const [dbForm, setDbForm] = useState({
    name: '',
    username: '',
    engine: 'MySQL 8.0',
  });

  // Firewall Rule Form State
  const [fwForm, setFwForm] = useState({
    port: '',
    protocol: 'TCP',
    action: 'ALLOW',
    source: '0.0.0.0/0',
    service: '',
  });

  // Cron Job Form State
  const [cronForm, setCronForm] = useState({
    name: '',
    schedule: '0 * * * *',
    command: '',
    description: '',
  });

  // Environment Variables State
  const [envForm, setEnvForm] = useState({
    key: '',
    value: '',
    Production: true,
    Preview: true,
    Development: true,
  });
  const [revealedEnvKeys, setRevealedEnvKeys] = useState<Record<string, boolean>>({});

  // Nginx Editor State
  const [nginxEditorContent, setNginxEditorContent] = useState<string>('');
  const [nginxLoaded, setNginxLoaded] = useState(false);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const copyToClipboard = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedText(val);
    setTimeout(() => setCopiedText(null), 1800);
  };

  const { data, refetch, isFetching } = useQuery({
    queryKey: ['admin-hosting-overview'],
    queryFn: async () => {
      const res = await hostingApi.getOverview();
      if (!nginxLoaded && res?.nginx?.currentConfig) {
        setNginxEditorContent(res.nginx.currentConfig);
        setNginxLoaded(true);
      }
      return res;
    },
    refetchInterval: 6000,
  });

  // Mutations
  const triggerDeployMut = useMutation({
    mutationFn: (payload: any) => hostingApi.triggerDeployment(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      setShowDeployModal(false);
      setDeployForm({ ...deployForm, commitMessage: '' });
      if (res?.deployment?.id) {
        setSelectedDeploymentId(res.deployment.id);
      }
      notify(`Deployment ${res?.deployment?.uid || ''} berhasil di-build dan Ready!`);
    },
    onError: (err: any) => notify(err?.message || 'Gagal memulai deployment', 'error'),
  });

  const promoteDeployMut = useMutation({
    mutationFn: (id: string) => hostingApi.promoteDeployment(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      notify(`Deployment ${res?.deployment?.uid || ''} dipromosikan ke Production!`);
    },
    onError: (err: any) => notify(err?.message || 'Gagal promote deployment', 'error'),
  });

  const deleteDeployMut = useMutation({
    mutationFn: (id: string) => hostingApi.deleteDeployment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      notify('Riwayat deployment dihapus');
    },
    onError: (err: any) => notify(err?.message || 'Deployment aktif tidak dapat dihapus', 'error'),
  });

  const upsertEnvMut = useMutation({
    mutationFn: (payload: { key: string; value: string; targets: string[] }) =>
      hostingApi.upsertEnvVar(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      setEnvForm({ key: '', value: '', Production: true, Preview: true, Development: true });
      notify(`Environment variable ${res?.envVar?.key || ''} disimpan`);
    },
    onError: (err: any) => notify(err?.message || 'Gagal menyimpan environment variable', 'error'),
  });

  const deleteEnvMut = useMutation({
    mutationFn: (key: string) => hostingApi.deleteEnvVar(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      notify('Environment variable dihapus');
    },
  });

  const createDomainMut = useMutation({
    mutationFn: (payload: any) => hostingApi.createDomain(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      setShowAddDomain(false);
      setDomainForm({
        domain: '',
        aliases: '',
        type: 'reverse_proxy',
        target: 'http://127.0.0.1:3000',
        port: 80,
        sslEnabled: true,
        sslProvider: 'Cloudflare Edge SSL',
        forceHttps: true,
        http2: true,
        maxBodySizeMb: 512,
      });
      notify('Domain berhasil ditambahkan ke project!');
    },
    onError: (err: any) => notify(err?.message || 'Gagal membuat domain', 'error'),
  });

  const updateDomainMut = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => hostingApi.updateDomain(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      notify('Konfigurasi domain diperbarui');
    },
    onError: (err: any) => notify(err?.message || 'Gagal memperbarui domain', 'error'),
  });

  const deleteDomainMut = useMutation({
    mutationFn: (id: string) => hostingApi.deleteDomain(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      notify('Domain dihapus');
    },
  });

  const serviceControlMut = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'start' | 'stop' | 'restart' | 'reload' }) =>
      hostingApi.controlService(id, action),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      notify(res?.output || 'Status service diperbarui');
    },
    onError: (err: any) => notify(err?.message || 'Gagal mengeksekusi aksi service', 'error'),
  });

  const createDbMut = useMutation({
    mutationFn: (payload: any) => hostingApi.createDatabase(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      setDbForm({ name: '', username: '', engine: 'MySQL 8.0' });
      notify('Database & user baru berhasil dibuat');
    },
    onError: (err: any) => notify(err?.message || 'Gagal membuat database', 'error'),
  });

  const deleteDbMut = useMutation({
    mutationFn: (id: string) => hostingApi.deleteDatabase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      notify('Database berhasil dihapus');
    },
    onError: (err: any) => notify(err?.message || 'Database dilindungi', 'error'),
  });

  const backupDbMut = useMutation({
    mutationFn: () => hostingApi.createDatabaseBackup(),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      notify(`Snapshot backup berhasil dibuat: ${res?.backup?.filename || ''}`);
    },
    onError: (err: any) => notify(err?.message || 'Gagal membuat backup', 'error'),
  });

  const toggleFirewallMut = useMutation({
    mutationFn: (enabled: boolean) => hostingApi.toggleFirewall(enabled),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      notify(res?.firewallEnabled ? 'Firewall UFW diaktifkan' : 'Firewall UFW dinonaktifkan');
    },
  });

  const createFwRuleMut = useMutation({
    mutationFn: (payload: any) => hostingApi.createFirewallRule(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      setFwForm({ port: '', protocol: 'TCP', action: 'ALLOW', source: '0.0.0.0/0', service: '' });
      notify('Aturan port firewall berhasil ditambahkan');
    },
    onError: (err: any) => notify(err?.message || 'Gagal menambah aturan firewall', 'error'),
  });

  const deleteFwRuleMut = useMutation({
    mutationFn: (id: string) => hostingApi.deleteFirewallRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      notify('Aturan firewall dihapus');
    },
  });

  const createCronMut = useMutation({
    mutationFn: (payload: any) => hostingApi.createCronJob(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      setCronForm({ name: '', schedule: '0 * * * *', command: '', description: '' });
      notify('Scheduled Cron Job ditambahkan');
    },
    onError: (err: any) => notify(err?.message || 'Gagal membuat cron job', 'error'),
  });

  const runCronMut = useMutation({
    mutationFn: (id: string) => hostingApi.runCronJobNow(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      notify(`Cron dieksekusi: ${res?.output || 'OK'}`);
    },
    onError: (err: any) => notify(err?.message || 'Gagal menjalankan cron job', 'error'),
  });

  const deleteCronMut = useMutation({
    mutationFn: (id: string) => hostingApi.deleteCronJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      notify('Cron job dihapus');
    },
  });

  const saveNginxMut = useMutation({
    mutationFn: (payload: { content?: string; mode?: 'sync_vhosts' | 'raw' }) =>
      hostingApi.saveNginxConfig(payload),
    onSuccess: (res) => {
      if (res?.content) setNginxEditorContent(res.content);
      queryClient.invalidateQueries({ queryKey: ['admin-hosting-overview'] });
      notify(res?.message || 'Konfigurasi nginx.conf berhasil disimpan');
    },
    onError: (err: any) => notify(err?.message || 'Gagal menyimpan nginx.conf', 'error'),
  });

  const server = data?.server;
  const summary = data?.summary;
  const deployments: any[] = data?.deployments || [];
  const envVars: any[] = data?.envVars || [];
  const domains: any[] = data?.domains || [];
  const services: any[] = data?.services || [];
  const databases = data?.databases || { instances: [], tables: [], backups: [] };
  const firewall = data?.firewall || { enabled: true, rules: [], listeningPorts: [] };
  const cronJobs: any[] = data?.cronJobs || [];
  const activityLogs: any[] = data?.activityLogs || [];

  const currentProdDeployment = useMemo(
    () => deployments.find((d) => d.isCurrentProduction) || deployments[0],
    [deployments]
  );

  const selectedDeployment = useMemo(
    () => deployments.find((d) => d.id === selectedDeploymentId) || currentProdDeployment,
    [deployments, selectedDeploymentId, currentProdDeployment]
  );

  const filteredDeployments = useMemo(() => {
    return deployments.filter((d) => {
      if (deployEnvFilter !== 'ALL' && d.environment !== deployEnvFilter) return false;
      if (!deploySearch.trim()) return true;
      const q = deploySearch.toLowerCase();
      return (
        d.commitMessage?.toLowerCase().includes(q) ||
        d.commitHash?.toLowerCase().includes(q) ||
        d.branch?.toLowerCase().includes(q) ||
        d.uid?.toLowerCase().includes(q) ||
        d.project?.toLowerCase().includes(q)
      );
    });
  }, [deployments, deployEnvFilter, deploySearch]);

  const memPercent = server?.memory?.totalMb
    ? Math.round((server.memory.usedMb / server.memory.totalMb) * 100)
    : 42;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in text-zinc-100">
      {/* Toast Notification (Vercel Monochrome Style) */}
      {toastMsg && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-2xl backdrop-blur-xl font-mono text-xs transition-all',
            toastMsg.type === 'success'
              ? 'bg-[#0a0a0a] border-zinc-700 text-zinc-100'
              : 'bg-rose-950/95 border-rose-500/40 text-rose-200'
          )}
        >
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Trigger New Deployment Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl bg-[#0a0a0a] border border-zinc-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <Rocket className="h-4 w-4 text-white" />
                <h3 className="text-sm font-semibold text-white">Trigger New Edge Deployment</h3>
              </div>
              <button
                onClick={() => setShowDeployModal(false)}
                className="text-xs font-mono text-zinc-400 hover:text-white"
              >
                ESC
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                triggerDeployMut.mutate(deployForm);
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Project Target</label>
                  <select
                    value={deployForm.project}
                    onChange={(e) => setDeployForm({ ...deployForm, project: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-zinc-800 text-xs font-mono text-white focus:border-zinc-500 focus:outline-none"
                  >
                    <option value="personal-it-hub">personal-it-hub (Fullstack)</option>
                    <option value="flagship-portfolio">flagship-portfolio (Tycami)</option>
                    <option value="cyberlab-lks">cyberlab-lks (Security Suite)</option>
                    <option value="omni-ai-gateway">omni-ai-gateway (AI Studio)</option>
                    <option value="devkit-suite">devkit-suite (CLI & Web)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Target Environment</label>
                  <select
                    value={deployForm.environment}
                    onChange={(e) => setDeployForm({ ...deployForm, environment: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-zinc-800 text-xs font-mono text-white focus:border-zinc-500 focus:outline-none"
                  >
                    <option value="Production">Production (Assign Live Domains)</option>
                    <option value="Preview">Preview (Isolated Staging URL)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Git Branch</label>
                <div className="relative">
                  <GitBranch className="h-3.5 w-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={deployForm.branch}
                    onChange={(e) => setDeployForm({ ...deployForm, branch: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#111111] border border-zinc-800 text-xs font-mono text-white focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">
                  Commit / Deployment Description (kosongkan untuk membaca HEAD Git terbaru)
                </label>
                <input
                  type="text"
                  placeholder="feat(edge): deploy latest production bundle..."
                  value={deployForm.commitMessage}
                  onChange={(e) => setDeployForm({ ...deployForm, commitMessage: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-zinc-800 text-xs font-mono text-white focus:border-zinc-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={triggerDeployMut.isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black transition-all"
                >
                  <Rocket className="h-3.5 w-3.5" />
                  {triggerDeployMut.isPending ? 'Building & Deploying...' : 'Create Deployment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERCEL TOP PROJECT BAR */}
      <div className="rounded-xl bg-[#0a0a0a] border border-zinc-800/90 p-5 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Breadcrumb: ▲ Team / Project */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white text-black font-bold text-xs select-none">
              ▲
            </div>
            <span className="text-zinc-600 font-light">/</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-300">sabbil-infrastructure</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800">
                PRO EDGE
              </span>
            </div>
            <span className="text-zinc-600 font-light">/</span>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">personal-it-hub</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ready
              </span>
            </div>
          </div>

          {/* Right Action Bar (Vercel style buttons) */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://github.com/BillZCode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#111111] hover:bg-zinc-900 text-zinc-200 border border-zinc-800 transition-colors"
            >
              <GitBranch className="h-3.5 w-3.5 text-zinc-400" />
              <span className="font-mono">BillZCode/personal-it-hub</span>
            </a>

            <Link
              to="/drive"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#111111] hover:bg-zinc-900 text-zinc-200 border border-zinc-800 transition-colors"
            >
              <FolderOpen className="h-3.5 w-3.5 text-zinc-400" />
              Storage Drive
            </Link>

            <Link
              to="/admin/agent"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#111111] hover:bg-zinc-900 text-zinc-200 border border-zinc-800 transition-colors"
            >
              <Terminal className="h-3.5 w-3.5 text-zinc-400" />
              CLI / Shell
            </Link>

            <button
              onClick={() => setShowDeployModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#111111] hover:bg-zinc-900 text-white border border-zinc-700 transition-colors"
            >
              <Rocket className="h-3.5 w-3.5 text-emerald-400" />
              Deploy
            </button>

            <a
              href="https://sabbilferdyansyah.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black transition-colors"
            >
              <span>Visit</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Vercel Clean Horizontal Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-t border-zinc-800/80 pt-3 -mb-2">
          {[
            { id: 'overview' as VercelTab, label: 'Overview' },
            {
              id: 'deployments' as VercelTab,
              label: 'Deployments',
              badge: deployments.length,
            },
            {
              id: 'domains' as VercelTab,
              label: 'Domains',
              badge: domains.length,
            },
            {
              id: 'storage' as VercelTab,
              label: 'Storage & Databases',
              badge: databases.instances?.length ?? 2,
            },
            {
              id: 'runtime' as VercelTab,
              label: 'Runtime & Nginx Logs',
              badge: `${summary?.runningServices ?? services.length}/${summary?.totalServices ?? services.length}`,
            },
            {
              id: 'settings' as VercelTab,
              label: 'Firewall, Cron & Env',
              badge: envVars.length,
            },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                  active
                    ? 'text-white bg-zinc-900/90 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                )}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={cn(
                      'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                      active
                        ? 'bg-white text-black font-bold'
                        : 'bg-zinc-800/90 text-zinc-400'
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          TAB 1: VERCEL PRODUCTION OVERVIEW
      ===================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Production Deployment</h2>
              <p className="text-xs text-zinc-400">
                The deployment that is available to your visitors on production domains.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('deployments')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0a0a0a] hover:bg-zinc-900 text-zinc-300 border border-zinc-800"
              >
                <History className="h-3.5 w-3.5 text-zinc-400" />
                View All Deployments ({deployments.length})
              </button>
              <button
                onClick={() =>
                  triggerDeployMut.mutate({
                    project: 'personal-it-hub',
                    branch: 'main',
                    environment: 'Production',
                  })
                }
                disabled={triggerDeployMut.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0a0a0a] hover:bg-zinc-900 text-zinc-200 border border-zinc-800"
              >
                <RotateCcw className={cn('h-3.5 w-3.5', triggerDeployMut.isPending && 'animate-spin')} />
                Redeploy
              </button>
            </div>
          </div>

          {/* Vercel Production Deployment Hero Card */}
          {currentProdDeployment && (
            <div className="rounded-xl bg-[#0a0a0a] border border-zinc-800 overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left Column: Live Visual Browser Preview Frame */}
                <div className="lg:col-span-5 bg-[#050505] border-b lg:border-b-0 lg:border-r border-zinc-800 p-4 flex flex-col justify-between">
                  <div className="rounded-lg border border-zinc-800 bg-[#0d0d0d] overflow-hidden shadow-inner flex flex-col h-full min-h-[230px]">
                    {/* Browser Chrome Topbar */}
                    <div className="flex items-center justify-between px-3 py-2 bg-[#141414] border-b border-zinc-800">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-black/70 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                        <Lock className="h-2.5 w-2.5 text-emerald-400" />
                        <span>sabbilferdyansyah.my.id</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">200 OK</span>
                    </div>

                    {/* Preview Canvas */}
                    <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-br from-zinc-950 via-[#09090b] to-amber-950/15 relative overflow-hidden">
                      <div className="space-y-2 z-10">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          ● LIVE PRODUCTION EDGE
                        </span>
                        <h3 className="text-base font-bold text-white tracking-tight">
                          Sabbil Abdillah Ferdyansyah — Personal IT Hub
                        </h3>
                        <p className="text-[11px] text-zinc-400 line-clamp-2">
                          Navigation Portal, Flagship Tycami Portfolio, CyberLab LKS, Omni AI Studio, & Cloud Drive.
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-4 z-10 font-mono text-[10px]">
                        <div className="p-2 rounded bg-black/60 border border-zinc-800/80">
                          <span className="text-zinc-500 block">CPU LOAD</span>
                          <span className="text-emerald-400 font-bold">{server?.cpuLoadPercent ?? 12}%</span>
                        </div>
                        <div className="p-2 rounded bg-black/60 border border-zinc-800/80">
                          <span className="text-zinc-500 block">RAM USED</span>
                          <span className="text-cyan-400 font-bold">{memPercent}%</span>
                        </div>
                        <div className="p-2 rounded bg-black/60 border border-zinc-800/80">
                          <span className="text-zinc-500 block">UPTIME</span>
                          <span className="text-white font-bold">
                            {server?.uptimeSeconds ? formatUptime(server.uptimeSeconds) : '99.98%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Vercel Deployment Metadata Fields */}
                <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    {/* Deployment URL */}
                    <div>
                      <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block mb-1">
                        Deployment
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://${currentProdDeployment.domains?.[0] || 'sabbilferdyansyah.my.id'}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm font-semibold text-white hover:underline flex items-center gap-1.5"
                        >
                          {currentProdDeployment.url}
                          <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                        </a>
                        <button
                          onClick={() => copyToClipboard(currentProdDeployment.url)}
                          className="p-1 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white"
                          title="Copy deployment URL"
                        >
                          {copiedText === currentProdDeployment.url ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Domains */}
                    <div>
                      <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block mb-1">
                        Domains
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {(currentProdDeployment.domains || ['sabbilferdyansyah.my.id']).map((dom: string) => (
                          <a
                            key={dom}
                            href={`https://${dom}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141414] hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-200 transition-colors"
                          >
                            <Globe className="h-3 w-3 text-emerald-400" />
                            <span>{dom}</span>
                            <ExternalLink className="h-2.5 w-2.5 text-zinc-500" />
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Status, Created, Duration, Region Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
                      <div>
                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block mb-1">
                          Status
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          {currentProdDeployment.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block mb-1">
                          Created
                        </span>
                        <span className="text-xs text-zinc-200 font-mono">
                          {formatRelativeTime(currentProdDeployment.createdAt)} by{' '}
                          <strong className="text-white">@{currentProdDeployment.authorHandle}</strong>
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block mb-1">
                          Build Duration
                        </span>
                        <span className="text-xs text-zinc-200 font-mono flex items-center gap-1">
                          <Clock className="h-3 w-3 text-zinc-400" />
                          {currentProdDeployment.durationSeconds}s
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block mb-1">
                          Edge Region
                        </span>
                        <span className="text-xs text-zinc-200 font-mono">
                          {currentProdDeployment.region || 'dps1 (Bali)'}
                        </span>
                      </div>
                    </div>

                    {/* Source Git Branch & Commit */}
                    <div className="pt-2 border-t border-zinc-800/80">
                      <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block mb-1.5">
                        Source
                      </span>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200">
                          <GitBranch className="h-3 w-3 text-zinc-400" />
                          {currentProdDeployment.branch}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-300">
                          <GitCommit className="h-3 w-3" />
                          {currentProdDeployment.commitHash}
                        </span>
                        <span className="text-zinc-300 truncate max-w-md">
                          {currentProdDeployment.commitMessage}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Build Logs Accordion Bar (like Vercel's Deployment Details bar) */}
                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <button
                      onClick={() => setShowOverviewBuildLogs(!showOverviewBuildLogs)}
                      className="inline-flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white"
                    >
                      {showOverviewBuildLogs ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span>Build Logs & Runtime Verification</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        0 errors
                      </span>
                    </button>

                    <span className="text-[11px] font-mono text-zinc-500">
                      UID: {currentProdDeployment.uid}
                    </span>
                  </div>
                </div>
              </div>

              {/* Build Output Drawer inside Overview Card */}
              {showOverviewBuildLogs && (
                <div className="border-t border-zinc-800 bg-black p-4 font-mono text-xs space-y-1 max-h-64 overflow-y-auto">
                  {(currentProdDeployment.buildLogs || []).map((line: string, idx: number) => (
                    <div
                      key={idx}
                      className={cn(
                        'py-0.5 leading-relaxed',
                        line.includes('✓') ? 'text-emerald-400 font-semibold' : 'text-zinc-400'
                      )}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Middle Grid: Recent Deployments + Active Edge Services */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Recent Deployments List */}
            <div className="lg:col-span-7 rounded-xl bg-[#0a0a0a] border border-zinc-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Recent Deployments</h3>
                  <p className="text-xs text-zinc-500">Git push & manual edge builds</p>
                </div>
                <button
                  onClick={() => setActiveTab('deployments')}
                  className="text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Inspect All →
                </button>
              </div>

              <div className="divide-y divide-zinc-800/70">
                {deployments.slice(0, 5).map((dpl) => (
                  <div
                    key={dpl.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <span className="font-mono text-xs font-semibold text-white truncate">
                          {dpl.uid}
                        </span>
                        <span
                          className={cn(
                            'px-1.5 py-0.2 rounded text-[10px] font-mono border',
                            dpl.environment === 'Production'
                              ? 'bg-white/10 text-white border-zinc-700'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                          )}
                        >
                          {dpl.environment}
                        </span>
                        {dpl.isCurrentProduction && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono truncate">
                        <GitBranch className="h-3 w-3 text-zinc-500 shrink-0" />
                        <span className="text-zinc-300">{dpl.branch}</span>
                        <span className="text-amber-300/90">({dpl.commitHash})</span>
                        <span className="truncate">{dpl.commitMessage}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-mono text-zinc-500">
                        {dpl.durationSeconds}s • {formatRelativeTime(dpl.createdAt)}
                      </span>
                      {!dpl.isCurrentProduction && (
                        <button
                          onClick={() => promoteDeployMut.mutate(dpl.id)}
                          disabled={promoteDeployMut.isPending}
                          className="px-2.5 py-1 rounded text-[11px] font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700"
                          title="Instant Rollback / Promote to Production"
                        >
                          Promote
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Infrastructure Vitals & Active Daemons */}
            <div className="lg:col-span-5 rounded-xl bg-[#0a0a0a] border border-zinc-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Edge Node & Daemons Status</h3>
                  <p className="text-xs text-zinc-500">
                    {server?.hostname || 'debian-12'} • {summary?.runningServices ?? 8}/
                    {summary?.totalServices ?? 8} Services Online
                  </p>
                </div>
                <button
                  onClick={() => refetch()}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', isFetching && 'animate-spin')} />
                </button>
              </div>

              {/* Hardware Bars */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-lg bg-[#111111] border border-zinc-800/90">
                  <span className="text-[10px] font-mono text-zinc-500 block">CPU ({server?.cpuCores || 4}C)</span>
                  <span className="text-base font-mono font-bold text-white">
                    {server?.cpuLoadPercent ?? 12.4}%
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#111111] border border-zinc-800/90">
                  <span className="text-[10px] font-mono text-zinc-500 block">MEMORY</span>
                  <span className="text-base font-mono font-bold text-white">{memPercent}%</span>
                </div>
                <div className="p-3 rounded-lg bg-[#111111] border border-zinc-800/90">
                  <span className="text-[10px] font-mono text-zinc-500 block">STORAGE</span>
                  <span className="text-base font-mono font-bold text-white">
                    {server?.disks?.[0]?.usePercent ?? 54}%
                  </span>
                </div>
              </div>

              {/* Compact Services List */}
              <div className="space-y-1.5">
                {services.slice(0, 6).map((svc) => (
                  <div
                    key={svc.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#111111] border border-zinc-800/70 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full shrink-0',
                          svc.status === 'running' ? 'bg-emerald-400' : 'bg-rose-500'
                        )}
                      />
                      <span className="text-zinc-200 truncate">{svc.displayName}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-zinc-500">{svc.port ? `:${svc.port}` : 'TUNNEL'}</span>
                      <button
                        onClick={() => serviceControlMut.mutate({ id: svc.id, action: 'restart' })}
                        className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px]"
                      >
                        Restart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: VERCEL DEPLOYMENTS & BUILD LOGS HISTORY
      ===================================================================== */}
      {activeTab === 'deployments' && (
        <div className="space-y-5">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-1 items-center gap-2.5">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search deployments by commit, branch, or UID..."
                  value={deploySearch}
                  onChange={(e) => setDeploySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0a0a0a] border border-zinc-800 text-xs font-mono text-white focus:border-zinc-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center rounded-lg bg-[#0a0a0a] border border-zinc-800 p-0.5">
                {(['ALL', 'Production', 'Preview'] as const).map((env) => (
                  <button
                    key={env}
                    onClick={() => setDeployEnvFilter(env)}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-mono transition-colors',
                      deployEnvFilter === env
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    )}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowDeployModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black transition-all"
            >
              <Rocket className="h-3.5 w-3.5" />
              Create Deployment
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Deployments List */}
            <div className="lg:col-span-7 rounded-xl bg-[#0a0a0a] border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden">
              {filteredDeployments.map((dpl) => {
                const isSelected = selectedDeployment?.id === dpl.id;
                return (
                  <div
                    key={dpl.id}
                    onClick={() => setSelectedDeploymentId(dpl.id)}
                    className={cn(
                      'p-4 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3',
                      isSelected ? 'bg-zinc-900/90' : 'hover:bg-zinc-900/40'
                    )}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{dpl.uid}</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {dpl.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-700">
                          {dpl.environment}
                        </span>
                        {dpl.isCurrentProduction && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                            Current Production
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-200 font-medium truncate">
                        {dpl.commitMessage}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-500">
                        <span className="inline-flex items-center gap-1 text-zinc-400">
                          <GitBranch className="h-3 w-3" /> {dpl.branch}
                        </span>
                        <span className="inline-flex items-center gap-1 text-amber-300/90">
                          <GitCommit className="h-3 w-3" /> {dpl.commitHash}
                        </span>
                        <span>•</span>
                        <span>{dpl.durationSeconds}s</span>
                        <span>•</span>
                        <span>
                          {formatRelativeTime(dpl.createdAt)} by @{dpl.authorHandle}
                        </span>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-1.5 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {!dpl.isCurrentProduction && (
                        <button
                          onClick={() => promoteDeployMut.mutate(dpl.id)}
                          disabled={promoteDeployMut.isPending}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700"
                          title="Instant Rollback / Promote to Production"
                        >
                          Promote
                        </button>
                      )}
                      {!dpl.isCurrentProduction && (
                        <button
                          onClick={() => deleteDeployMut.mutate(dpl.id)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 border border-zinc-800"
                          title="Delete deployment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Selected Deployment Build Logs & Inspector */}
            <div className="lg:col-span-5 rounded-xl bg-[#0a0a0a] border border-zinc-800 overflow-hidden flex flex-col">
              {selectedDeployment ? (
                <>
                  <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-[#111111]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {selectedDeployment.uid}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400">
                          ({selectedDeployment.durationSeconds}s)
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                        {selectedDeployment.branch} @ {selectedDeployment.commitHash}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          triggerDeployMut.mutate({
                            project: selectedDeployment.project,
                            branch: selectedDeployment.branch,
                            environment: selectedDeployment.environment,
                            commitMessage: `Redeploy: ${selectedDeployment.commitMessage}`,
                          })
                        }
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-white"
                      >
                        Redeploy
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-black font-mono text-xs space-y-1.5 flex-1 min-h-[340px] max-h-[460px] overflow-y-auto">
                    <div className="text-[11px] text-zinc-500 pb-2 mb-2 border-b border-zinc-900 flex items-center justify-between">
                      <span>BUILD & EDGE DEPLOYMENT LOGS</span>
                      <span>REGION: {selectedDeployment.region || 'dps1'}</span>
                    </div>
                    {(selectedDeployment.buildLogs || []).map((line: string, i: number) => (
                      <div
                        key={i}
                        className={cn(
                          'leading-relaxed',
                          line.includes('✓')
                            ? 'text-emerald-400 font-semibold'
                            : line.includes('Running') || line.includes('Cloning')
                            ? 'text-zinc-200'
                            : 'text-zinc-400'
                        )}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-xs font-mono text-zinc-500">
                  Pilih salah satu deployment untuk melihat Build Logs.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: VERCEL DOMAINS & SSL CERTIFICATES
      ===================================================================== */}
      {activeTab === 'domains' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">Domains</h2>
              <p className="text-xs text-zinc-400">
                Domains assigned to your production and preview deployments with automatic SSL & Nginx routing.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => saveNginxMut.mutate({ mode: 'sync_vhosts' })}
                disabled={saveNginxMut.isPending}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono bg-[#0a0a0a] hover:bg-zinc-900 text-zinc-200 border border-zinc-800"
              >
                <Save className="h-3.5 w-3.5 text-zinc-400" />
                Sync nginx.conf
              </button>
              <button
                onClick={() => setShowAddDomain(!showAddDomain)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-zinc-200 text-black"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Domain
              </button>
            </div>
          </div>

          {showAddDomain && (
            <div className="rounded-xl p-5 bg-[#0a0a0a] border border-zinc-700 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="font-mono text-xs font-bold text-white uppercase">
                  Add Custom Domain & Upstream Route
                </h3>
                <button
                  onClick={() => setShowAddDomain(false)}
                  className="text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Close
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createDomainMut.mutate(domainForm);
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Domain Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="fortexsfer.bond"
                    value={domainForm.domain}
                    onChange={(e) => setDomainForm({ ...domainForm, domain: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-zinc-800 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Aliases (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="www.fortexsfer.bond"
                    value={domainForm.aliases}
                    onChange={(e) => setDomainForm({ ...domainForm, aliases: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-zinc-800 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Upstream Target URL / Root Path *
                  </label>
                  <input
                    type="text"
                    required
                    value={domainForm.target}
                    onChange={(e) => setDomainForm({ ...domainForm, target: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-zinc-800 text-xs text-white font-mono"
                  />
                </div>
                <div className="md:col-span-3 flex items-center justify-between pt-2 border-t border-zinc-800">
                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-300">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={domainForm.sslEnabled}
                        onChange={(e) => setDomainForm({ ...domainForm, sslEnabled: e.target.checked })}
                      />
                      Auto-SSL Certificate
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={domainForm.forceHttps}
                        onChange={(e) => setDomainForm({ ...domainForm, forceHttps: e.target.checked })}
                      />
                      Force HTTPS
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={createDomainMut.isPending}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-white text-black hover:bg-zinc-200"
                  >
                    Add Domain
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="space-y-3">
            {domains.map((vhost: any) => (
              <div
                key={vhost.id}
                className="rounded-xl p-5 bg-[#0a0a0a] border border-zinc-800 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`https://${vhost.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-base font-bold text-white hover:underline flex items-center gap-2"
                    >
                      {vhost.domain}
                      <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                    </a>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/25">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Valid Configuration
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800">
                      Production
                    </span>
                    {vhost.sslEnabled ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                        <Lock className="h-3 w-3" /> {vhost.sslProvider}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/25">
                        <Unlock className="h-3 w-3" /> HTTP
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                    <span>
                      Upstream: <strong className="text-zinc-200">{vhost.target}</strong>
                    </span>
                    {vhost.aliases?.length > 0 && (
                      <>
                        <span>•</span>
                        <span>Aliases: {vhost.aliases.join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateDomainMut.mutate({
                        id: vhost.id,
                        payload: { status: vhost.status === 'active' ? 'disabled' : 'active' },
                      })
                    }
                    className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#111111] hover:bg-zinc-900 text-zinc-200 border border-zinc-800"
                  >
                    {vhost.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deleteDomainMut.mutate(vhost.id)}
                    className="p-2 rounded-lg bg-[#111111] hover:bg-rose-950 text-zinc-400 hover:text-rose-400 border border-zinc-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: VERCEL STORAGE & DATABASES
      ===================================================================== */}
      {activeTab === 'storage' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-xl p-5 bg-[#0a0a0a] border border-zinc-800 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Database className="h-4 w-4 text-zinc-300" /> Create Database Instance
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createDbMut.mutate(dbForm);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Database Name *</label>
                <input
                  type="text"
                  required
                  placeholder="analytics_prod"
                  value={dbForm.name}
                  onChange={(e) => setDbForm({ ...dbForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-zinc-800 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Database User *</label>
                <input
                  type="text"
                  required
                  placeholder="analytics_usr"
                  value={dbForm.username}
                  onChange={(e) => setDbForm({ ...dbForm, username: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-zinc-800 text-xs text-white font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={createDbMut.isPending}
                className="w-full py-2 rounded-lg text-xs font-semibold bg-white text-black hover:bg-zinc-200"
              >
                Provision Database
              </button>
            </form>

            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">Snapshots</span>
                <button
                  onClick={() => backupDbMut.mutate()}
                  disabled={backupDbMut.isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#111111] hover:bg-zinc-900 text-white border border-zinc-700"
                >
                  <Download className="h-3.5 w-3.5 text-emerald-400" />
                  {backupDbMut.isPending ? 'Exporting...' : 'Create Snapshot'}
                </button>
              </div>
              {databases.backups?.slice(0, 3).map((b: any) => (
                <div
                  key={b.filename}
                  className="flex items-center justify-between text-[11px] font-mono p-2 rounded bg-[#111111] border border-zinc-800"
                >
                  <span className="text-zinc-200 truncate max-w-[180px]">{b.filename}</span>
                  <span className="text-zinc-500">{formatBytes(b.sizeBytes)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl p-5 bg-[#0a0a0a] border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  Connected Databases & Prisma Tables ({summary?.totalDbRows ?? 0} rows)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500">
                      <th className="py-2 px-3">MODEL / TABLE</th>
                      <th className="py-2 px-3">ENGINE</th>
                      <th className="py-2 px-3">ROWS</th>
                      <th className="py-2 px-3">SIZE</th>
                      <th className="py-2 px-3 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {databases.tables?.map((t: any) => (
                      <tr key={t.tableName} className="hover:bg-zinc-900/40">
                        <td className="py-2.5 px-3 font-semibold text-white">{t.tableName}</td>
                        <td className="py-2.5 px-3 text-zinc-400">{t.engine}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{t.rows}</td>
                        <td className="py-2.5 px-3 text-zinc-400">{t.sizeKb} KB</td>
                        <td className="py-2.5 px-3 text-right text-emerald-400">Ready</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: RUNTIME DAEMONS & NGINX CONFIG STUDIO
      ===================================================================== */}
      {activeTab === 'runtime' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((svc: any) => {
              const isRunning = svc.status === 'running';
              return (
                <div
                  key={svc.id}
                  className="p-5 rounded-xl bg-[#0a0a0a] border border-zinc-800 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'w-2.5 h-2.5 rounded-full',
                            isRunning ? 'bg-emerald-400' : 'bg-rose-500'
                          )}
                        />
                        <h3 className="font-mono text-sm font-bold text-white">
                          {svc.displayName}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800 uppercase">
                        {svc.manager} • {svc.port ? `:${svc.port}` : 'TUNNEL'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{svc.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs font-mono">
                    <span className="text-zinc-500">
                      PID: {svc.pid || '—'} • {svc.cpuPercent}% CPU • {svc.memMb} MB
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => serviceControlMut.mutate({ id: svc.id, action: 'start' })}
                        className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-800"
                      >
                        Start
                      </button>
                      <button
                        onClick={() => serviceControlMut.mutate({ id: svc.id, action: 'restart' })}
                        className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800"
                      >
                        Restart
                      </button>
                      <button
                        onClick={() => serviceControlMut.mutate({ id: svc.id, action: 'stop' })}
                        disabled={svc.name === 'it-hub-backend'}
                        className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-rose-950 text-rose-400 border border-zinc-800 disabled:opacity-40"
                      >
                        Stop
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nginx Config & Audit Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl p-5 bg-[#0a0a0a] border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-mono text-xs font-bold text-white uppercase flex items-center gap-2">
                  <FileCode2 className="h-4 w-4 text-zinc-400" /> Edge Reverse Proxy Config (nginx.conf)
                </h3>
                <button
                  onClick={() => saveNginxMut.mutate({ content: nginxEditorContent, mode: 'raw' })}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-zinc-200"
                >
                  Save nginx.conf
                </button>
              </div>
              <textarea
                rows={14}
                value={nginxEditorContent}
                onChange={(e) => setNginxEditorContent(e.target.value)}
                spellCheck={false}
                className="w-full p-4 rounded-lg bg-black border border-zinc-800 font-mono text-xs text-zinc-200 focus:outline-none"
              />
            </div>

            <div className="rounded-xl p-5 bg-[#0a0a0a] border border-zinc-800 space-y-3">
              <h3 className="font-mono text-xs font-bold text-white uppercase">
                Deployment & Control Activity Log
              </h3>
              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {activityLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-[#111111] border border-zinc-800/80 font-mono text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 uppercase">[{log.category}]</span>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-white font-medium">{log.action}</p>
                    <p className="text-zinc-400 truncate text-[11px]">{log.target}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 6: ENVIRONMENT VARIABLES, FIREWALL & CRON SETTINGS
      ===================================================================== */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Environment Variables Section (Vercel Style) */}
          <div className="rounded-xl p-6 bg-[#0a0a0a] border border-zinc-800 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-zinc-300" />
                Environment Variables
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Encrypted secrets and runtime configuration injected into Production, Preview, and Development environments.
              </p>
            </div>

            {/* Add New Env Var Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const targets: string[] = [];
                if (envForm.Production) targets.push('Production');
                if (envForm.Preview) targets.push('Preview');
                if (envForm.Development) targets.push('Development');
                upsertEnvMut.mutate({ key: envForm.key, value: envForm.value, targets });
              }}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-lg bg-[#111111] border border-zinc-800"
            >
              <div className="md:col-span-4">
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Key</label>
                <input
                  type="text"
                  required
                  placeholder="NEXT_PUBLIC_API_URL"
                  value={envForm.key}
                  onChange={(e) => setEnvForm({ ...envForm, key: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs font-mono text-white"
                />
              </div>
              <div className="md:col-span-5">
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">Value</label>
                <input
                  type="text"
                  required
                  placeholder="https://api.sabbilferdyansyah.my.id"
                  value={envForm.value}
                  onChange={(e) => setEnvForm({ ...envForm, value: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs font-mono text-white"
                />
              </div>
              <div className="md:col-span-3 flex items-end">
                <button
                  type="submit"
                  disabled={upsertEnvMut.isPending}
                  className="w-full py-2 rounded-lg text-xs font-semibold bg-white text-black hover:bg-zinc-200"
                >
                  Save Variable
                </button>
              </div>
            </form>

            {/* Env Vars List */}
            <div className="divide-y divide-zinc-800/80 border border-zinc-800 rounded-lg overflow-hidden">
              {envVars.map((env) => {
                const isRevealed = Boolean(revealedEnvKeys[env.key]);
                return (
                  <div
                    key={env.key}
                    className="p-3.5 bg-[#0a0a0a] hover:bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 font-mono text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <KeyRound className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                      <span className="font-bold text-white">{env.key}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800">
                        {(env.targets || ['Production', 'Preview']).join(', ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-[#111111] border border-zinc-800 text-zinc-300 max-w-xs truncate">
                        {isRevealed ? env.value : '••••••••••••••••••••••••'}
                      </span>
                      <button
                        onClick={() =>
                          setRevealedEnvKeys((prev) => ({ ...prev, [env.key]: !prev[env.key] }))
                        }
                        className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
                        title={isRevealed ? 'Hide value' : 'Reveal value'}
                      >
                        {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      {!env.isSystem && (
                        <button
                          onClick={() => deleteEnvMut.mutate(env.key)}
                          className="p-1.5 rounded bg-zinc-900 hover:bg-rose-950 text-zinc-400 hover:text-rose-400 border border-zinc-800"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Firewall & Cron Jobs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Firewall */}
            <div className="rounded-xl p-5 bg-[#0a0a0a] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Edge Firewall (UFW Rules)</h3>
                </div>
                <button
                  onClick={() => toggleFirewallMut.mutate(!firewall.enabled)}
                  className="px-3 py-1 rounded-lg text-xs font-mono bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700"
                >
                  {firewall.enabled ? 'Active (Disable)' : 'Disabled (Enable)'}
                </button>
              </div>

              <div className="space-y-2">
                {firewall.rules?.map((r: any) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#111111] border border-zinc-800 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          'px-1.5 py-0.5 rounded text-[10px] font-bold',
                          r.action === 'ALLOW'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : r.action === 'DENY'
                            ? 'bg-rose-500/15 text-rose-400'
                            : 'bg-amber-500/15 text-amber-400'
                        )}
                      >
                        {r.action}
                      </span>
                      <span className="text-white font-bold">
                        {r.port}/{r.protocol}
                      </span>
                      <span className="text-zinc-400 truncate">{r.service}</span>
                    </div>
                    <button
                      onClick={() => deleteFwRuleMut.mutate(r.id)}
                      className="text-zinc-500 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cron Jobs */}
            <div className="rounded-xl p-5 bg-[#0a0a0a] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-zinc-300" />
                  <h3 className="text-sm font-bold text-white">Vercel Cron Jobs</h3>
                </div>
                <span className="text-xs font-mono text-zinc-500">{cronJobs.length} Active</span>
              </div>

              <div className="space-y-2.5">
                {cronJobs.map((job: any) => (
                  <div
                    key={job.id}
                    className="p-3 rounded-lg bg-[#111111] border border-zinc-800 flex items-center justify-between gap-2 font-mono text-xs"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{job.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-900 text-zinc-300 border border-zinc-700">
                          {job.schedule}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">{job.command}</p>
                    </div>
                    <button
                      onClick={() => runCronMut.mutate(job.id)}
                      disabled={runCronMut.isPending}
                      className="px-2.5 py-1 rounded bg-white text-black font-semibold text-[11px] hover:bg-zinc-200 shrink-0"
                    >
                      Run
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminHostingPanel;
