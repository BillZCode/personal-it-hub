import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { Router, Network as SwitchIcon, Monitor, RefreshCw, Terminal, CheckCircle2, LucideIcon } from 'lucide-react';
import { TycamiNextBanner } from '../../components/tycami/TycamiNextBanner';

interface TopologyNode {
  id: string;
  type: string;
  label: string;
  icon: LucideIcon;
  x: number;
  y: number;
}

export const TycamiLab: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const initialNodes: TopologyNode[] = [
    { id: 'router_1', type: 'Router', label: 'Cisco Gateway', icon: Router, x: 260, y: 40 },
    { id: 'switch_1', type: 'Switch', label: 'Switch Core', icon: SwitchIcon, x: 80, y: 170 },
    { id: 'pc_1', type: 'PC', label: 'Workstation 01', icon: Monitor, x: 280, y: 240 },
  ];

  const [nodes, setNodes] = useState<TopologyNode[]>(initialNodes);
  const [links, setLinks] = useState<string[][]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isOnline, setIsOnline] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'SYSTEM BOOT SEQUENCE INITIATED...',
    'AWAITING TOPOLOGY CONFIGURATION...',
    'HINT: Click a node, then click another to wire a link.',
  ]);

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev, msg].slice(-12));
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Topology validation: PC <-> Switch and Switch <-> Router (and not PC directly to Router)
  useEffect(() => {
    if (links.length === 0) {
      setIsOnline(false);
      return;
    }

    const hasPcSwitch = links.some((l) => l.includes('pc_1') && l.includes('switch_1'));
    const hasSwitchRouter = links.some((l) => l.includes('switch_1') && l.includes('router_1'));
    const hasPcRouter = links.some((l) => l.includes('pc_1') && l.includes('router_1'));

    if (hasPcSwitch && hasSwitchRouter && !hasPcRouter) {
      setIsOnline(true);
      addLog('TOPOLOGY VALIDATED. SUCCESS.');
      addLog('DHCP HANDSHAKE (DORA) COMPLETED.');
      addLog('ASSIGNING IP: 192.168.88.254/24 TO PC_1');
      addLog('DEFAULT GATEWAY: 192.168.88.1 (ROUTER_1)');
      addLog('NETWORK ONLINE • ALL PACKETS ROUTED.');
    } else {
      setIsOnline(false);
    }
  }, [links, addLog]);

  // Node Drag Handlers
  const handlePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === id);
    if (!node || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - node.x;
    const offsetY = e.clientY - rect.top - node.y;

    setDraggingNodeId(id);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!draggingNodeId || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const nodeSize = 64;

      let newX = e.clientX - rect.left - dragOffset.x;
      let newY = e.clientY - rect.top - dragOffset.y;

      newX = Math.max(0, Math.min(newX, rect.width - nodeSize));
      newY = Math.max(0, Math.min(newY, rect.height - nodeSize));

      setNodes((prev) =>
        prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
      );
    },
    [draggingNodeId, dragOffset]
  );

  const handlePointerUp = useCallback(() => {
    setDraggingNodeId(null);
  }, []);

  useEffect(() => {
    if (draggingNodeId) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    } else {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [draggingNodeId, handlePointerMove, handlePointerUp]);

  // Click to connect/disconnect nodes
  const handleNodeClick = (id: string) => {
    if (draggingNodeId) return;

    if (!selectedNode) {
      setSelectedNode(id);
      addLog(`SELECTED NODE: ${nodes.find((n) => n.id === id)?.type.toUpperCase()}`);
    } else {
      if (selectedNode !== id) {
        const fromNode = nodes.find((n) => n.id === selectedNode)?.type;
        const toNode = nodes.find((n) => n.id === id)?.type;

        const linkExists = links.some((l) => l.includes(selectedNode) && l.includes(id));
        if (linkExists) {
          setLinks((prev) => prev.filter((l) => !(l.includes(selectedNode) && l.includes(id))));
          addLog(`LINK SEVERED: ${fromNode} <-> ${toNode}`);
        } else {
          setLinks((prev) => [...prev, [selectedNode, id]]);
          addLog(`LINK ESTABLISHED: ${fromNode} <-> ${toNode}`);
        }
      }
      setSelectedNode(null);
    }
  };

  const resetTopology = () => {
    setNodes(initialNodes);
    setLinks([]);
    setSelectedNode(null);
    setIsOnline(false);
    setLogs(['TOPOLOGY RESET TO DEFAULT DEPLOYMENT.']);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reveal-text', {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power4.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pt-16 pb-16 min-h-screen flex flex-col relative">
      {/* Dynamic Background Glow */}
      <div
        className={`transition-colors duration-1000 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none ${
          isOnline ? 'bg-green-500/10' : 'bg-[var(--color-accent)]/[0.04]'
        }`}
      />

      {/* Header */}
      <div className="max-w-4xl mb-16">
        <h1 className="text-[8vw] md:text-[5vw] font-black leading-[0.9] tracking-tighter uppercase mb-8">
          <div className="overflow-hidden">
            <div className="reveal-text text-white">The</div>
          </div>
          <div className="overflow-hidden">
            <div className="reveal-text text-[var(--color-secondary)] ml-6 md:ml-12">
              Laboratory.
            </div>
          </div>
        </h1>
        <div className="overflow-hidden max-w-xl">
          <p className="reveal-text font-mono text-xs md:text-sm leading-relaxed text-[var(--color-secondary)] uppercase tracking-[0.15em]">
            Experimental grounds. Drag nodes and wire a virtual network topology to establish routing.
          </p>
        </div>
      </div>

      {/* Interactive Canvas & Terminal Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Interactive Canvas */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between font-mono text-xs text-[var(--color-secondary)] px-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span className="uppercase tracking-widest text-white">Topology Simulator</span>
            </div>
            <button
              onClick={resetTopology}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div
            ref={canvasRef}
            className="relative w-full h-[380px] md:h-[460px] border border-[var(--color-border)] rounded-2xl bg-black/50 backdrop-blur-md overflow-hidden select-none"
          >
            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* SVG Connecting Links */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {links.map(([fromId, toId], idx) => {
                const from = nodes.find((n) => n.id === fromId);
                const to = nodes.find((n) => n.id === toId);
                if (!from || !to) return null;

                const x1 = from.x + 32;
                const y1 = from.y + 32;
                const x2 = to.x + 32;
                const y2 = to.y + 32;

                return (
                  <line
                    key={idx}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isOnline ? '#22c55e' : 'var(--color-accent)'}
                    strokeWidth={2}
                    strokeDasharray="6, 6"
                    style={{ animation: 'dash 1.2s linear infinite' }}
                  />
                );
              })}
            </svg>

            {/* Draggable Topology Nodes */}
            {nodes.map((node) => {
              const Icon = node.icon;
              const isSelected = selectedNode === node.id;

              return (
                <div
                  key={node.id}
                  onPointerDown={(e) => handlePointerDown(e, node.id)}
                  onClick={() => handleNodeClick(node.id)}
                  style={{
                    transform: `translate(${node.x}px, ${node.y}px)`,
                    cursor: draggingNodeId === node.id ? 'grabbing' : 'grab',
                  }}
                  className={`absolute top-0 left-0 w-16 h-16 rounded-2xl border flex flex-col items-center justify-center transition-shadow select-none ${
                    isSelected
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/20 shadow-[0_0_20px_rgba(242,125,38,0.4)]'
                      : isOnline
                      ? 'border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                      : 'border-[var(--color-border)] bg-black/60 hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon
                    className={`w-7 h-7 ${
                      isSelected
                        ? 'text-[var(--color-accent)]'
                        : isOnline
                        ? 'text-green-400'
                        : 'text-white'
                    }`}
                    strokeWidth={1.5}
                  />
                  <div className="absolute -bottom-6 font-mono text-[9px] uppercase tracking-widest text-[var(--color-secondary)] whitespace-nowrap bg-black/80 px-2 py-0.5 rounded border border-white/5">
                    {node.type}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Diagnostics Terminal & Status */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="flex items-center justify-between font-mono text-xs text-[var(--color-secondary)] px-2">
            <span className="uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[var(--color-accent)]" />
              Terminal Diagnostics
            </span>
            <span
              className={`text-[10px] uppercase font-bold tracking-wider ${
                isOnline ? 'text-green-400' : 'text-amber-400'
              }`}
            >
              {isOnline ? 'ONLINE' : 'STANDBY'}
            </span>
          </div>

          <div className="h-[380px] md:h-[460px] rounded-2xl border border-[var(--color-border)] bg-black/70 p-5 font-mono text-xs text-[var(--color-secondary)] overflow-y-auto flex flex-col gap-2 shadow-inner">
            <div className="text-[10px] text-white/40 pb-2 border-b border-white/10 uppercase tracking-widest">
              SABBIL-TKJ-CORE v2.4.0 • INTERACTIVE LINKER
            </div>

            {logs.map((log, idx) => (
              <div
                key={idx}
                className={`leading-relaxed ${
                  log.includes('ONLINE') || log.includes('SUCCESS')
                    ? 'text-green-400 font-bold'
                    : log.includes('SEVERED')
                    ? 'text-rose-400'
                    : log.includes('ESTABLISHED')
                    ? 'text-[var(--color-accent)]'
                    : 'text-white/80'
                }`}
              >
                <span className="text-white/30 mr-2">&gt;</span>
                {log}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>

      {/* Next Page Banner */}
      <TycamiNextBanner
        to="/contact"
        text="EXPLORE CONTACT"
        label="Next — Get In Touch"
        description="Have a project in mind, need infrastructure consultation, or just want to say hi? Let's build something together."
      />
    </div>
  );
};
