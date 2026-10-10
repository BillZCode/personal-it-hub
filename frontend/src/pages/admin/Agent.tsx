import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentApi } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../components/ui';
import { useDocumentTitle } from '../../hooks';
import {
  Bot,
  Terminal,
  Send,
  Play,
  RotateCcw,
  Cpu,
  HardDrive,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  FolderCog,
  ShieldCheck,
  History,
  Layers,
  Gauge,
  BarChart3,
  Database,
  ChevronDown,
  ChevronRight,
  FileCode2,
} from 'lucide-react';
import { cn } from '../../utils';

export function AdminAgent() {
  useDocumentTitle('Antigravity Remote Agent — Command Center');
  const queryClient = useQueryClient();

  // State
  const [activeTab, setActiveTab] = useState<'console' | 'prompt' | 'models' | 'diagnostics' | 'history'>('console');
  const [commandInput, setCommandInput] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<Array<{ type: 'input' | 'output' | 'error' | 'system'; text: string; time: string }>>([
    {
      type: 'system',
      text: 'Antigravity Remote Agent Connected. Interactive Shell ready. Type command or click Quick Presets.',
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [promptHistory, setPromptHistory] = useState<Array<{
    role: 'user' | 'agent';
    content: string;
    time: string;
    actionsTaken?: Array<{ command: string; output: string; exitCode: number }>;
    plan?: string;
  }>>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTerminalFullscreen, setIsTerminalFullscreen] = useState(false);
  const [expandedActions, setExpandedActions] = useState<Record<number, boolean>>({});

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const promptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  useEffect(() => {
    promptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [promptHistory]);

  // Fetch Agent Status & System Info
  const { data: statusData, isLoading: isStatusLoading, refetch: refetchStatus } = useQuery({
    queryKey: ['admin-agent-status'],
    queryFn: async () => {
      const res = await agentApi.getStatus();
      return res;
    },
    refetchInterval: 5000,
  });

  // Fetch Diagnostics
  const { data: diagData, refetch: refetchDiag } = useQuery({
    queryKey: ['admin-agent-diagnostics'],
    queryFn: async () => {
      const res = await agentApi.getDiagnostics();
      return res;
    },
    enabled: activeTab === 'diagnostics',
  });

  // Fetch History
  const { data: historyData, refetch: refetchHistory } = useQuery({
    queryKey: ['admin-agent-history'],
    queryFn: async () => {
      const res = await agentApi.getHistory();
      return res;
    },
    enabled: activeTab === 'history',
    refetchInterval: 4000,
  });

  // Fetch OmniAntigravity Models & Quota
  const { data: modelsData, isLoading: isModelsLoading, refetch: refetchModels } = useQuery({
    queryKey: ['admin-agent-models'],
    queryFn: async () => {
      const res = await agentApi.getModelsQuota();
      return res;
    },
    enabled: activeTab === 'models',
    refetchInterval: 10000,
  });

  // Mutation: Execute Shell Command
  const commandMutation = useMutation({
    mutationFn: async (cmd: string) => {
      const res = await agentApi.executeCommand(cmd);
      return res;
    },
    onSuccess: (data: any) => {
      setTerminalLogs((prev) => [
        ...prev,
        {
          type: data?.status === 'failed' ? 'error' : 'output',
          text: data?.output || (data?.status === 'success' ? '(Command executed with no output)' : 'Command failed'),
          time: new Date().toLocaleTimeString(),
        },
      ]);
      queryClient.invalidateQueries({ queryKey: ['admin-agent-history'] });
    },
    onError: (err: any) => {
      setTerminalLogs((prev) => [
        ...prev,
        {
          type: 'error',
          text: `Execution Error: ${err?.message || 'Failed to run command'}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    },
  });

  // Mutation: Execute AI Agent Prompt
  const promptMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await agentApi.executePrompt(prompt);
      return res;
    },
    onSuccess: (data: any) => {
      setPromptHistory((prev) => [
        ...prev,
        {
          role: 'agent',
          content: data?.output || 'Selesai menjalankan tugas dan pelaporan.',
          actionsTaken: Array.isArray(data?.actionsTaken) ? data.actionsTaken : [],
          plan: data?.plan || '',
          time: new Date().toLocaleTimeString(),
        },
      ]);
      queryClient.invalidateQueries({ queryKey: ['admin-agent-history'] });
    },
    onError: (err: any) => {
      setPromptHistory((prev) => [
        ...prev,
        {
          role: 'agent',
          content: `⚠️ Terjadi kendala saat memproses: ${err?.message || 'Error'}`,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    },
  });

  const handleRunCommand = (cmdToRun?: string) => {
    const cmd = cmdToRun || commandInput;
    if (!cmd.trim() || commandMutation.isPending) return;

    setTerminalLogs((prev) => [
      ...prev,
      {
        type: 'input',
        text: `$ ${cmd}`,
        time: new Date().toLocaleTimeString(),
      },
    ]);

    commandMutation.mutate(cmd);
    if (!cmdToRun) setCommandInput('');
  };

  const handleSendPrompt = () => {
    if (!promptInput.trim() || promptMutation.isPending) return;

    const userText = promptInput.trim();
    setPromptHistory((prev) => [
      ...prev,
      {
        role: 'user',
        content: userText,
        time: new Date().toLocaleTimeString(),
      },
    ]);
    setPromptInput('');
    promptMutation.mutate(userText);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearTerminal = () => {
    setTerminalLogs([
      {
        type: 'system',
        text: 'Terminal output cleared. Antigravity Agent ready.',
        time: new Date().toLocaleTimeString(),
      },
    ]);
  };

  // Preset Commands
  const presetCommands = [
    { label: 'System Uptime & Load', cmd: 'uptime' },
    { label: 'Disk Space (df -h)', cmd: 'df -h' },
    { label: 'Memory Details (free -m)', cmd: 'free -m' },
    { label: 'PM2 Process Status', cmd: 'pm2 status || true' },
    { label: 'Git Status Repo', cmd: 'git status -s' },
    { label: 'Git Recent Commits', cmd: 'git log --oneline -n 5' },
    { label: 'Docker Containers', cmd: 'docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"' },
    { label: 'Nginx Config Test', cmd: 'nginx -t 2>&1 || true' },
  ];

  const agent = statusData?.agent;
  const sys = statusData?.system;

  return (
    <div className="space-y-6 animate-in pb-10">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-850 pb-5">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-purple-500/20 border border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Bot className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                Antigravity Agent Remote
              </h1>
              <Badge variant="success" dot className="font-mono text-xs">
                ONLINE
              </Badge>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                v2.4.0 Remote
              </span>
            </div>
            <p className="text-dark-400 text-xs sm:text-sm mt-0.5">
              Pusat kendali remote untuk Antigravity autonomous agent, inspeksi lingkungan server, eksekusi task, dan terminal interaktif.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchStatus();
              if (activeTab === 'diagnostics') refetchDiag();
              if (activeTab === 'history') refetchHistory();
            }}
            className="text-xs font-mono"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* Agent Telemetry & Vitals Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-dark-900/60 border-dark-800 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-mono text-dark-400 uppercase tracking-wider">CPU Cores & Arch</p>
              <p className="text-sm font-semibold text-dark-100 truncate">
                {sys?.cpuCores ? `${sys.cpuCores} Cores (${sys.arch})` : 'Debian Linux'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-900/60 border-dark-800 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-mono text-dark-400 uppercase tracking-wider">RAM Utilization</p>
              <p className="text-sm font-semibold text-dark-100 truncate">
                {sys?.memory ? `${sys.memory.usagePercent}% (${sys.memory.usedMb}MB)` : 'Normal'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-900/60 border-dark-800 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-mono text-dark-400 uppercase tracking-wider">AI Model Backend</p>
              <p className="text-sm font-semibold text-purple-300 truncate">
                {agent?.defaultModel ? 'Gemini 2.5 / 3.8' : 'Online'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-900/60 border-dark-800 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-mono text-dark-400 uppercase tracking-wider">CLI Status</p>
              <p className="text-sm font-semibold text-amber-300 truncate">
                {agent?.cliAvailable ? 'CLI [agy] Ready' : 'API Engine Ready'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('console')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer',
            activeTab === 'console'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
              : 'text-dark-400 hover:text-dark-200 hover:bg-dark-850'
          )}
        >
          <Terminal className="h-4 w-4" />
          Remote Shell & Terminal
        </button>

        <button
          onClick={() => setActiveTab('prompt')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer',
            activeTab === 'prompt'
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]'
              : 'text-dark-400 hover:text-dark-200 hover:bg-dark-850'
          )}
        >
          <Zap className="h-4 w-4" />
          Autonomous Agent Task Prompt
        </button>

        <button
          onClick={() => setActiveTab('models')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer',
            activeTab === 'models'
              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
              : 'text-dark-400 hover:text-dark-200 hover:bg-dark-850'
          )}
        >
          <Gauge className="h-4 w-4" />
          Model Quotas & Limits
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer',
            activeTab === 'diagnostics'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
              : 'text-dark-400 hover:text-dark-200 hover:bg-dark-850'
          )}
        >
          <Layers className="h-4 w-4" />
          System & Repo Diagnostics
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer',
            activeTab === 'history'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
              : 'text-dark-400 hover:text-dark-200 hover:bg-dark-850'
          )}
        >
          <History className="h-4 w-4" />
          Task History
        </button>
      </div>

      {/* TAB 1: REMOTE SHELL & TERMINAL */}
      {activeTab === 'console' && (
        <div className="space-y-4">
          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-dark-400 mr-1 flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-cyan-400" /> Presets:
            </span>
            {presetCommands.map((preset) => (
              <button
                key={preset.cmd}
                onClick={() => handleRunCommand(preset.cmd)}
                disabled={commandMutation.isPending}
                className="px-2.5 py-1 text-xs font-mono rounded-md bg-dark-900 border border-dark-750 text-dark-300 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-dark-850 transition-all cursor-pointer disabled:opacity-50"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Terminal Console Card */}
          <div
            className={cn(
              'rounded-xl border border-dark-800 bg-[#0d1117] flex flex-col font-mono shadow-2xl transition-all duration-200 overflow-hidden',
              isTerminalFullscreen ? 'fixed inset-4 z-50' : 'h-[500px]'
            )}
          >
            {/* Terminal Window Titlebar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-dark-800/80">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                </div>
                <span className="text-xs text-dark-400 ml-2">antigravity@admin-console: ~/personal-it-hub</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearTerminal}
                  className="h-7 px-2 text-xs text-dark-400 hover:text-dark-200"
                >
                  Clear
                </Button>
                <button
                  type="button"
                  onClick={() => setIsTerminalFullscreen(!isTerminalFullscreen)}
                  className="p-1 rounded text-dark-400 hover:text-white"
                  title="Fullscreen"
                >
                  {isTerminalFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Terminal Content Screen */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2 text-xs text-dark-200 leading-relaxed font-mono select-text">
              {terminalLogs.map((log, index) => (
                <div key={index} className="space-y-0.5">
                  {log.type === 'input' && (
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                      <span>{log.text}</span>
                      <span className="text-[10px] text-dark-500 ml-auto">{log.time}</span>
                    </div>
                  )}
                  {log.type === 'output' && (
                    <pre className="text-dark-300 whitespace-pre-wrap font-mono break-words pl-2 border-l border-dark-700/50">
                      {log.text}
                    </pre>
                  )}
                  {log.type === 'error' && (
                    <pre className="text-red-400 whitespace-pre-wrap font-mono break-words pl-2 border-l border-red-500/40">
                      {log.text}
                    </pre>
                  )}
                  {log.type === 'system' && (
                    <div className="text-emerald-400/90 text-xs italic pl-2 border-l border-emerald-500/40 py-1">
                      ℹ️ {log.text}
                    </div>
                  )}
                </div>
              ))}

              {commandMutation.isPending && (
                <div className="flex items-center gap-2 text-cyan-400 animate-pulse pl-2">
                  <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse" />
                  <span>Executing command on host environment...</span>
                </div>
              )}
              <div ref={terminalEndRef} />
            </div>

            {/* Terminal Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRunCommand();
              }}
              className="flex items-center gap-2 p-2.5 bg-[#161b22] border-t border-dark-800"
            >
              <span className="text-cyan-400 font-bold pl-2">$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Ketik perintah terminal (cth: git status, node -v, ls -la, pm2 list)..."
                className="flex-1 bg-transparent border-none text-xs text-dark-100 placeholder-dark-500 focus:outline-none font-mono"
                disabled={commandMutation.isPending}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!commandInput.trim() || commandMutation.isPending}
                className="h-8 px-3 text-xs bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                <Play className="h-3.5 w-3.5 mr-1" />
                Run
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: AUTONOMOUS AGENT TASK PROMPT */}
      {activeTab === 'prompt' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-dark-900 border-dark-800 flex flex-col h-[520px]">
              <CardHeader className="py-3 px-4 border-b border-dark-800 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-purple-400" />
                  <CardTitle className="text-sm font-semibold text-dark-200">
                    Agent Intelligence Instruction Channel
                  </CardTitle>
                </div>
                <Badge variant="neutral" className="text-2xs font-mono">
                  Gemini Flash Core
                </Badge>
              </CardHeader>

              {/* Chat View */}
              <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
                {promptHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-dark-400">
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-dark-200">Siap Menerima Instruksi Remote</h3>
                    <p className="text-xs text-dark-400 max-w-sm mt-1">
                      Ketikkan instruksi arsitektur, panduan penanganan error, optimasi server, atau minta Antigravity Agent menuliskan konfigurasi sistem.
                    </p>
                  </div>
                ) : (
                  promptHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'flex flex-col gap-2 p-4 rounded-xl text-xs leading-relaxed max-w-[92%]',
                        item.role === 'user'
                          ? 'ml-auto bg-cyan-600/20 text-cyan-100 border border-cyan-500/30'
                          : 'mr-auto bg-dark-850/95 text-dark-200 border border-dark-700/60 shadow-xl'
                      )}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] text-dark-400 font-mono border-b border-dark-750/50 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={cn('font-semibold', item.role === 'user' ? 'text-cyan-300' : 'text-purple-300')}>
                            {item.role === 'user' ? 'Admin' : 'Antigravity Autonomous Core'}
                          </span>
                          {item.role === 'agent' && item.actionsTaken && item.actionsTaken.length > 0 && (
                            <Badge variant="primary" className="text-[9px] px-1.5 py-0 bg-purple-500/20 text-purple-300 border-purple-500/30">
                              ⚡ {item.actionsTaken.length} Perintah Server Dieksekusi
                            </Badge>
                          )}
                        </div>
                        <span>{item.time}</span>
                      </div>

                      {/* Autonomous Execution Actions Accordion */}
                      {item.role === 'agent' && item.actionsTaken && item.actionsTaken.length > 0 && (
                        <div className="rounded-lg border border-dark-750 bg-dark-950/80 overflow-hidden my-1">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedActions((prev) => ({
                                ...prev,
                                [idx]: !prev[idx],
                              }))
                            }
                            className="w-full flex items-center justify-between px-3 py-2 text-left bg-dark-900 hover:bg-dark-800 transition-colors"
                          >
                            <span className="flex items-center gap-2 font-mono text-[11px] text-dark-300 font-medium">
                              <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                              Log Eksekusi Bash Server ({item.actionsTaken.length} Langkah)
                            </span>
                            {expandedActions[idx] ? (
                              <ChevronDown className="h-3.5 w-3.5 text-dark-400" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5 text-dark-400" />
                            )}
                          </button>

                          {expandedActions[idx] && (
                            <div className="p-2.5 space-y-2 border-t border-dark-800 text-[11px] font-mono">
                              {item.actionsTaken.map((action, aIdx) => (
                                <div key={aIdx} className="rounded bg-dark-900/90 border border-dark-750 p-2">
                                  <div className="flex items-center justify-between text-dark-400 mb-1">
                                    <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                                      <span>$</span> {action.command}
                                    </span>
                                    <Badge
                                      variant={action.exitCode === 0 ? 'success' : 'danger'}
                                      className="text-[9px] px-1 py-0"
                                    >
                                      {action.exitCode === 0 ? 'Exit 0 (OK)' : `Exit ${action.exitCode}`}
                                    </Badge>
                                  </div>
                                  <pre className="text-dark-300 text-[10px] whitespace-pre-wrap overflow-x-auto max-h-40 bg-dark-950 p-2 rounded border border-dark-800/60 leading-tight">
                                    {action.output}
                                  </pre>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Main Message Content / Final Report */}
                      <div className="whitespace-pre-wrap select-text leading-relaxed mt-0.5">
                        {item.content}
                      </div>
                    </div>
                  ))
                )}
                {promptMutation.isPending && (
                  <div className="p-3 rounded-xl bg-dark-800/60 border border-purple-500/30 text-purple-300 text-xs flex items-center gap-2.5 animate-pulse">
                    <Sparkles className="h-4 w-4 animate-spin text-purple-400" />
                    <span>Antigravity Agent sedang menganalisis dan menyusun solusi...</span>
                  </div>
                )}
                <div ref={promptEndRef} />
              </CardContent>

              {/* Input Area */}
              <div className="p-3 border-t border-dark-800 bg-dark-950/60 flex gap-2">
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendPrompt();
                    }
                  }}
                  rows={2}
                  placeholder="Kirim instruksi task ke Antigravity Agent (cth: 'Buatkan script healthcheck Nginx & PM2 otomatis')..."
                  className="flex-1 bg-dark-900 border border-dark-750 rounded-lg p-2.5 text-xs text-dark-100 placeholder-dark-500 focus:outline-none focus:border-purple-500 resize-none font-sans"
                  disabled={promptMutation.isPending}
                />
                <Button
                  onClick={handleSendPrompt}
                  disabled={!promptInput.trim() || promptMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 self-end h-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Guidelines & Quick Directives */}
          <div className="space-y-4">
            <Card className="bg-dark-900 border-dark-800">
              <CardHeader className="py-3 px-4 border-b border-dark-800">
                <CardTitle className="text-xs font-mono font-semibold text-dark-300 uppercase tracking-wider">
                  Contoh Prompt Siap Pakai
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                {[
                  'Cek kesehatan status seluruh service PM2 dan laporkan statusnya.',
                  'Periksa penggunaan disk (df -h) dan pemakaian RAM server saat ini lalu laporkan.',
                  'Inspeksi status git branch dan commit terakhir repository personal-it-hub.',
                  'Analisis keamanan konfigurasi Nginx personal-it-hub dan rekomendasi hardening SSL.',
                ].map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPromptInput(sample);
                    }}
                    className="w-full text-left p-2.5 rounded-lg bg-dark-950/60 border border-dark-800 hover:border-purple-500/40 text-dark-300 hover:text-purple-200 text-xs transition-colors cursor-pointer"
                  >
                    "{sample}"
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB: MODEL QUOTAS & LIMITS (OmniAntigravity Engine) */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-dark-900 to-cyan-950/30 border border-blue-800/40">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  Antigravity Language Server Telemetry
                  <Badge variant="primary" className="text-[10px]">
                    {modelsData?.data?.available ? 'Connected' : 'Scanning'}
                  </Badge>
                </h3>
                <p className="text-xs text-dark-400 mt-0.5">
                  Live quota sync via local LanguageServer HTTPS service & OmniAntigravity quota telemetry.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => refetchModels()} className="text-xs font-mono">
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Sync Quota
              </Button>
            </div>
          </div>

          {/* User & Credits Overview */}
          {modelsData?.data?.user && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-dark-900 border-dark-800">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-mono text-dark-400 uppercase tracking-wider">Active Account</p>
                    <p className="text-sm font-semibold text-dark-100 truncate">
                      {modelsData.data.user.name || modelsData.data.user.email || 'Developer'}
                    </p>
                    <span className="text-[10px] text-indigo-400 font-mono">
                      Plan: {modelsData.data.user.planName || 'Pro'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-900 border-dark-800">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-mono text-dark-400 uppercase tracking-wider">Prompt Credits</p>
                    <p className="text-sm font-semibold text-emerald-300">
                      {modelsData.data.credits?.prompt?.available?.toLocaleString() ?? 0} / {modelsData.data.credits?.prompt?.monthly?.toLocaleString() ?? 0}
                    </p>
                    <div className="w-full bg-dark-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, Math.round(((modelsData.data.credits?.prompt?.available ?? 0) / (modelsData.data.credits?.prompt?.monthly || 1)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-dark-900 border-dark-800">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-mono text-dark-400 uppercase tracking-wider">Flow Credits</p>
                    <p className="text-sm font-semibold text-purple-300">
                      {modelsData.data.credits?.flow?.available?.toLocaleString() ?? 0} / {modelsData.data.credits?.flow?.monthly?.toLocaleString() ?? 0}
                    </p>
                    <div className="w-full bg-dark-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, Math.round(((modelsData.data.credits?.flow?.available ?? 0) / (modelsData.data.credits?.flow?.monthly || 1)) * 100))}%`
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Models Quota Table / Grid */}
          <Card className="bg-dark-900 border-dark-800">
            <CardHeader className="py-3 px-4 border-b border-dark-800 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-dark-200 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                Available Models & Rate Limits ({modelsData?.data?.models?.length || 0})
              </CardTitle>
              <span className="text-xs font-mono text-dark-400">
                Last Sync: {modelsData?.data?.lastUpdated ? new Date(modelsData.data.lastUpdated).toLocaleTimeString() : 'N/A'}
              </span>
            </CardHeader>
            <CardContent className="p-0">
              {isModelsLoading ? (
                <div className="p-8 text-center text-dark-400 text-xs font-mono">
                  Menghubungkan ke Antigravity Language Server...
                </div>
              ) : !modelsData?.data?.models || modelsData.data.models.length === 0 ? (
                <div className="p-8 text-center text-dark-400 text-xs font-mono space-y-2">
                  <p>Language Server tidak terdeteksi atau Antigravity IDE sedang tidak aktif.</p>
                  <p className="text-dark-500 text-[11px]">Pastikan Antigravity IDE sedang berjalan di host server.</p>
                </div>
              ) : (
                <div className="divide-y divide-dark-800/80">
                  {modelsData.data.models.map((model: any) => {
                    const isHighUsage = model.usagePercent >= 80;
                    const isMedUsage = model.usagePercent >= 50 && model.usagePercent < 80;
                    return (
                      <div key={model.id} className="p-4 hover:bg-dark-850/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-dark-100">{model.name}</span>
                            {model.recommended && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-950/80 text-blue-300 border border-blue-800/50">
                                Recommended
                              </span>
                            )}
                            {model.supportsImages && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                                Vision
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-mono text-dark-400 truncate">
                            ID: {model.id}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 sm:min-w-[240px] justify-between sm:justify-end">
                          <div className="w-32 space-y-1">
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="text-dark-400">Used</span>
                              <span className={isHighUsage ? 'text-rose-400 font-bold' : isMedUsage ? 'text-amber-400' : 'text-emerald-400'}>
                                {model.usagePercent}%
                              </span>
                            </div>
                            <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  'h-full rounded-full transition-all',
                                  isHighUsage ? 'bg-rose-500' : isMedUsage ? 'bg-amber-500' : 'bg-emerald-500'
                                )}
                                style={{ width: `${model.usagePercent}%` }}
                              />
                            </div>
                          </div>

                          <div className="text-right">
                            <Badge
                              variant={model.status === 'critical' ? 'danger' : model.status === 'warning' ? 'warning' : 'success'}
                              className="text-[10px] font-mono"
                            >
                              {model.remainingPercent}% Free
                            </Badge>
                            {model.resetTime && (
                              <p className="text-[10px] font-mono text-dark-500 mt-0.5">
                                Resets: {new Date(model.resetTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: SYSTEM & REPO DIAGNOSTICS & STATISTICS */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-4">
          <Card className="bg-dark-900 border-dark-800">
            <CardHeader className="py-3 px-4 border-b border-dark-800 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold text-dark-200 flex items-center gap-2">
                <FolderCog className="h-4 w-4 text-emerald-400" />
                System & Git Repository Telemetry Statistics
              </CardTitle>
              <Button size="sm" variant="outline" onClick={() => refetchDiag()} className="text-xs">
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Refresh Diagnostic
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Git Repository Statistics */}
                <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800 space-y-2">
                  <h4 className="text-xs font-semibold text-cyan-400 font-mono uppercase flex items-center justify-between">
                    <span>Git Repository Status</span>
                    <Badge variant="primary" className="text-[10px]">
                      {diagData?.checks?.git?.status || 'Active'}
                    </Badge>
                  </h4>
                  <div className="text-xs font-mono text-dark-400 space-y-1.5">
                    <div className="flex justify-between border-b border-dark-850/60 pb-1">
                      <span>Active Branch:</span>
                      <span className="text-cyan-300 font-bold">{diagData?.checks?.git?.branch || 'main'}</span>
                    </div>
                    <div className="flex justify-between border-b border-dark-850/60 pb-1">
                      <span>Recent Commit:</span>
                      <span className="text-dark-200">{diagData?.checks?.git?.commit || 'HEAD'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Local Workspace:</span>
                      <span className="text-dark-300 truncate max-w-[160px]" title={diagData?.checks?.git?.repoPath}>
                        personal-it-hub
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. System Resource Statistics */}
                <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800 space-y-2">
                  <h4 className="text-xs font-semibold text-emerald-400 font-mono uppercase flex items-center justify-between">
                    <span>Host Node Statistics</span>
                    <span className="text-[10px] text-dark-400 font-normal">
                      PID: {diagData?.checks?.node?.pid || 'Active'}
                    </span>
                  </h4>
                  <div className="text-xs font-mono text-dark-400 space-y-1.5">
                    <div className="flex justify-between border-b border-dark-850/60 pb-1">
                      <span>Node Engine:</span>
                      <span className="text-white font-semibold">{diagData?.checks?.node?.version || 'Node.js LTS'}</span>
                    </div>
                    <div className="flex justify-between border-b border-dark-850/60 pb-1">
                      <span>Process Heap / RSS:</span>
                      <span className="text-emerald-300">
                        {diagData?.checks?.node?.heapUsedMb ? `${diagData.checks.node.heapUsedMb} MB / ${diagData.checks.node.rssMb} MB` : 'Optimal'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Load (1, 5, 15m):</span>
                      <span className="text-dark-200">
                        {diagData?.checks?.system?.loadAvg ? diagData.checks.system.loadAvg.join(', ') : '0.12, 0.08, 0.05'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Memory & Core Statistics */}
                <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800 space-y-2">
                  <h4 className="text-xs font-semibold text-purple-400 font-mono uppercase">
                    Memory Breakdown
                  </h4>
                  <div className="text-xs font-mono text-dark-400 space-y-1.5">
                    <div className="flex justify-between border-b border-dark-850/60 pb-1">
                      <span>Total Server RAM:</span>
                      <span className="text-dark-200">{diagData?.checks?.system?.totalMemoryMb ? `${diagData.checks.system.totalMemoryMb} MB` : 'Available'}</span>
                    </div>
                    <div className="flex justify-between border-b border-dark-850/60 pb-1">
                      <span>Used / Free:</span>
                      <span className="text-purple-300">
                        {diagData?.checks?.system?.usedMemoryMb ? `${diagData.checks.system.usedMemoryMb} MB / ${diagData.checks.system.freeMemoryMb} MB` : 'Normal'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>RAM Utilization:</span>
                      <span className="text-emerald-400 font-bold">
                        {diagData?.checks?.system?.usagePercent ? `${diagData.checks.system.usagePercent}%` : 'Normal'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Critical Files Integrity */}
              <div className="p-3.5 rounded-xl bg-dark-950 border border-dark-800 space-y-2">
                <h4 className="text-xs font-semibold text-amber-400 font-mono uppercase">
                  Project Configuration Files Self-Check
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono pt-1">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900 border border-dark-800">
                    <span className="text-dark-400">.env File</span>
                    <span className={diagData?.checks?.projectFiles?.envExists ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                      {diagData?.checks?.projectFiles?.envExists ? 'VERIFIED' : 'MISSING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900 border border-dark-800">
                    <span className="text-dark-400">Prisma Schema</span>
                    <span className={diagData?.checks?.projectFiles?.prismaSchemaExists ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                      {diagData?.checks?.projectFiles?.prismaSchemaExists ? 'VERIFIED' : 'MISSING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900 border border-dark-800">
                    <span className="text-dark-400">Docker Compose</span>
                    <span className={diagData?.checks?.projectFiles?.dockerComposeExists ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                      {diagData?.checks?.projectFiles?.dockerComposeExists ? 'VERIFIED' : 'MISSING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900 border border-dark-800">
                    <span className="text-dark-400">Antigravity CLI (agy)</span>
                    <span className={diagData?.checks?.projectFiles?.agyCliExists ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {diagData?.checks?.projectFiles?.agyCliExists ? 'INSTALLED' : 'STANDBY'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900 border border-dark-800">
                    <span className="text-dark-400">Package Manifest</span>
                    <span className={diagData?.checks?.projectFiles?.packageJsonExists ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                      {diagData?.checks?.projectFiles?.packageJsonExists ? 'VERIFIED' : 'MISSING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-900 border border-dark-800">
                    <span className="text-dark-400">PM2 Ecosystem</span>
                    <span className={diagData?.checks?.projectFiles?.ecosystemExists ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                      {diagData?.checks?.projectFiles?.ecosystemExists ? 'VERIFIED' : 'MISSING'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: TASK HISTORY */}
      {activeTab === 'history' && (
        <Card className="bg-dark-900 border-dark-800">
          <CardHeader className="py-3 px-4 border-b border-dark-800 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-dark-200 flex items-center gap-2">
              <History className="h-4 w-4 text-amber-400" />
              Recent Agent Executions & Shell Logs
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => refetchHistory()} className="text-xs">
              Refresh
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {(!historyData?.data || !Array.isArray(historyData.data) || historyData.data.length === 0) ? (
              <div className="p-8 text-center text-dark-400 text-xs font-mono">
                Belum ada riwayat eksekusi remote pada sesi ini.
              </div>
            ) : (
              <div className="divide-y divide-dark-800/80">
                {historyData.data.map((item: any) => (
                  <div key={item?.id || Math.random()} className="p-4 hover:bg-dark-850/50 transition-colors space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                      <span className="text-cyan-300 font-semibold">{item?.command || 'Task'}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={item?.status === 'success' ? 'success' : item?.status === 'failed' ? 'danger' : 'warning'}
                          className="text-[10px]"
                        >
                          {String(item?.status || 'UNKNOWN').toUpperCase()}
                        </Badge>
                        <span className="text-dark-500 text-[11px]">
                          {item?.startedAt ? new Date(item.startedAt).toLocaleTimeString() : ''}
                        </span>
                      </div>
                    </div>
                    {item?.output && (
                      <pre className="text-[11px] text-dark-300 font-mono bg-dark-950 p-2.5 rounded-lg border border-dark-800/80 max-h-36 overflow-y-auto whitespace-pre-wrap">
                        {item.output}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
