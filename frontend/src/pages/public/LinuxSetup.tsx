import { useEffect } from 'react';
import { Card, Badge, Button } from '../../components/ui';
import { Terminal, Monitor, Keyboard, Cpu, HardDrive, MemoryStick, Wifi, Copy, Check } from 'lucide-react';
import { animate, stagger } from 'animejs';
import { useCopyToClipboard } from '../../hooks';

const distros = [
  { name: 'Arch Linux', version: 'Rolling', status: 'Daily Driver', icon: Terminal },
  { name: 'Debian 13', version: 'Trixie', status: 'Daily Driver / Server', icon: Terminal },
  { name: 'Ubuntu 22.04', version: 'Jammy', status: 'Work', icon: Terminal },
];

const desktopEnvs = [
  { name: 'Hyprland', type: 'Wayland Compositor', status: 'Primary', icon: Monitor },
  { name: 'KDE Plasma', type: 'Desktop Environment', status: 'Daily Driver', icon: Monitor },
  { name: 'i3wm', type: 'Window Manager', status: 'Legacy', icon: Monitor },
];

const terminals = [
  { name: 'Kitty', config: 'GPU accelerated, ligatures', status: 'Primary', icon: Terminal },
  { name: 'Alacritty', config: 'Fast, minimal', status: 'Backup', icon: Terminal },
  { name: 'WezTerm', config: 'Lua config, multiplexer', status: 'Testing', icon: Terminal },
];

const shells = [
  { name: 'Noctalia Shell', framework: 'Custom Asthetic', plugins: ['starship', 'zoxide', 'fzf', 'git-prompt', 'autosuggestions'], status: 'Primary', icon: Terminal },
  { name: 'Bash 5.2.37', framework: 'GNU Bash / Bashrc', plugins: ['ble.sh', 'fzf', 'bash-completion'], status: 'System Default', icon: Terminal },
  { name: 'Zsh', framework: 'Oh My Zsh', plugins: ['git', 'docker', 'fzf', 'zoxide'], status: 'Backup', icon: Terminal },
];

const editors = [
  { name: 'Neovim', config: 'LazyVim-based', plugins: ['LSP', 'Treesitter', 'Telescope', 'CMP'], status: 'Primary', icon: Keyboard },
  { name: 'VS Code', config: 'Minimal', extensions: ['Remote SSH', 'Docker', 'GitLens'], status: 'Occasional', icon: Keyboard },
];

const hardware = {
  cpu: 'Intel Core i3-1115G4 (4) @ 3.00GHz',
  motherboard: 'Lenovo IdeaPad 3 14ITL6 (LNVNB161216)',
  ram: '24GB DDR4 3200MHz',
  gpu: 'Intel Tiger Lake-LP GT2 [UHD Graphics G4]',
  storage: ['512GB INTEL NVMe SSD (OS)', '1TB T-FORCE SSD / HDD (Data)'],
  network: 'Realtek RTL8822CE 802.11ac PCIe Wi-Fi + Bluetooth',
  monitors: ['14" FHD (1920x1080) IPS 60Hz Built-in Display'],
  peripherals: ['Built-in Keyboard & Precision Touchpad', 'USB / Wireless Optical Mouse'],
};

const tools = [
  'btop', 'fzf', 'ripgrep (rg)', 'fd', 'eza', 'zoxide', 'lazygit', 'lazydocker',
  'docker', 'kubectl', 'helm', 'terraform', 'ansible', 'nvim', 'tmux',
  'git', 'gh', 'jq', 'yq', 'bat', 'delta', 'duf', 'dust',
  'procs', 'hyperfine', 'tokei', 'loc', 'sd', 'choosy', 'trash-cli',
];

const dotfiles = [
  { name: '.zshrc', description: 'Zsh configuration with plugins' },
  { name: '.config/nvim/', description: 'Neovim configuration (LazyVim)' },
  { name: '.config/hypr/', description: 'Hyprland window manager config' },
  { name: '.config/kitty/', description: 'Kitty terminal config' },
  { name: '.config/waybar/', description: 'Waybar status bar config' },
  { name: '.config/rofi/', description: 'Rofi application launcher config' },
  { name: '.gitconfig', description: 'Git configuration and aliases' },
  { name: '.ssh/config', description: 'SSH client configuration' },
];

export function LinuxSetup() {
  const { copied, copy } = useCopyToClipboard();

  // Anime.js staggered card entrance
  useEffect(() => {
    animate('.linux-setup-card', {
      opacity: [0, 1],
      translateY: [16, 0],
      delay: stagger(30, { start: 40 }),
      duration: 380,
      ease: 'outCubic',
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in pb-16">
      <div className="border-b border-dark-800/80 pb-6">
        <h1 className="text-3xl font-bold text-dark-100 tracking-tight font-sans">Linux Setup</h1>
        <p className="text-dark-400 text-sm mt-1">Sabbil's daily workstation, system configurations, and engineering dotfiles</p>
      </div>

      {/* Distributions */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide flex items-center gap-2">
          <Terminal className="h-5 w-5 text-emerald-400" />
          Distributions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {distros.map((distro, i) => (
            <Card key={i} className="linux-setup-card p-4 bg-dark-900/60 border border-dark-800/90 hover:border-emerald-500/40 hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.15)] transition-all duration-200 group">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                  <distro.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark-100 text-base">{distro.name}</h3>
                  <p className="text-dark-400 text-xs font-mono">{distro.version}</p>
                  <Badge variant="primary" className="text-2xs mt-2">{distro.status}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Desktop Environment / Window Manager */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide flex items-center gap-2">
          <Monitor className="h-5 w-5 text-cyan-400" />
          Desktop Environment / Window Manager
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {desktopEnvs.map((de, i) => (
            <Card key={i} className="linux-setup-card p-4 bg-dark-900/60 border border-dark-800/90 hover:border-cyan-500/40 hover:shadow-[0_8px_20px_-6px_rgba(6,182,212,0.15)] transition-all duration-200 group">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
                  <de.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-dark-100 text-base">{de.name}</h3>
                  <p className="text-dark-400 text-xs">{de.type}</p>
                  <Badge variant="info" className="text-2xs mt-2">{de.status}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Terminals & Shells */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-400" />
            Terminals
          </h2>
          <div className="space-y-3">
            {terminals.map((term, i) => (
              <Card key={i} className="p-4 bg-dark-900/60 border border-dark-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-dark-100 text-sm font-mono">{term.name}</h3>
                    <p className="text-dark-400 text-xs mt-0.5">{term.config}</p>
                  </div>
                  <Badge variant="success" className="text-2xs">{term.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide flex items-center gap-2">
            <Terminal className="h-5 w-5 text-purple-400" />
            Shells
          </h2>
          <div className="space-y-3">
            {shells.map((shell, i) => (
              <Card key={i} className="p-4 bg-dark-900/60 border border-dark-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-dark-100 text-sm font-mono">{shell.name}</h3>
                    <p className="text-dark-400 text-xs mt-0.5">Framework: {shell.framework}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {shell.plugins.map((p) => (
                        <span key={p} className="text-2xs font-mono px-1.5 py-0.5 rounded bg-dark-850 text-dark-300 border border-dark-750">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Badge variant="primary" className="text-2xs">{shell.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Editors */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide flex items-center gap-2">
          <Keyboard className="h-5 w-5 text-amber-400" />
          Editors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {editors.map((editor, i) => (
            <Card key={i} className="p-4 bg-dark-900/60 border border-dark-800">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
                  <editor.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-dark-100 text-sm sm:text-base">{editor.name}</h3>
                    <Badge variant="success" className="text-2xs">{editor.status}</Badge>
                  </div>
                  <p className="text-dark-400 text-xs mt-1">Config: {editor.config || editor.extensions?.join(', ')}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Real Hardware */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide flex items-center gap-2">
          <Cpu className="h-5 w-5 text-emerald-400" />
          Hardware Specifications
        </h2>
        <Card className="p-6 bg-dark-900/60 border border-dark-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-dark-100 mb-3 font-mono text-xs uppercase text-emerald-400">Core Rig</h3>
              <dl className="space-y-2 text-xs">
                <div className="py-1 border-b border-dark-800">
                  <dt className="text-dark-400">Processor (CPU)</dt>
                  <dd className="font-mono text-dark-100 font-medium">{hardware.cpu}</dd>
                </div>
                <div className="py-1 border-b border-dark-800">
                  <dt className="text-dark-400">Motherboard</dt>
                  <dd className="font-mono text-dark-100">{hardware.motherboard}</dd>
                </div>
                <div className="py-1 border-b border-dark-800">
                  <dt className="text-dark-400">Memory (RAM)</dt>
                  <dd className="font-mono text-emerald-400 font-semibold">{hardware.ram}</dd>
                </div>
                <div className="py-1">
                  <dt className="text-dark-400">Graphics (GPU)</dt>
                  <dd className="font-mono text-dark-100">{hardware.gpu}</dd>
                </div>
              </dl>
            </div>

            <div>
              <h3 className="font-semibold text-dark-100 mb-3 font-mono text-xs uppercase text-emerald-400">Storage Drives</h3>
              <ul className="space-y-2 text-xs font-mono">
                {hardware.storage.map((s, i) => (
                  <li key={i} className="p-2 rounded bg-dark-950/60 border border-dark-800 flex items-center gap-2 text-dark-200">
                    <HardDrive className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-dark-100 mb-3 font-mono text-xs uppercase text-emerald-400">Network & Peripherals</h3>
              <dl className="space-y-2 text-xs">
                <div className="py-1 border-b border-dark-800">
                  <dt className="text-dark-400">Network Adapter</dt>
                  <dd className="font-mono text-dark-100 text-2xs">{hardware.network}</dd>
                </div>
                <div className="py-1 border-b border-dark-800">
                  <dt className="text-dark-400">Display</dt>
                  <dd className="font-mono text-dark-100 text-2xs">{hardware.monitors[0]}</dd>
                </div>
                <div className="py-1">
                  <dt className="text-dark-400">Peripherals</dt>
                  <dd className="font-mono text-dark-100 text-2xs">{hardware.peripherals[0]}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Card>
      </section>

      {/* Important Tools */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide flex items-center gap-2">
          <Terminal className="h-5 w-5 text-emerald-400" />
          Important CLI & Sysadmin Tools
        </h2>
        <Card className="p-5 bg-dark-900/60 border border-dark-800">
          <div className="flex flex-wrap gap-2">
            {tools.map((tool) => (
              <span key={tool} className="text-xs font-mono px-2.5 py-1 rounded bg-dark-850 text-emerald-400 border border-dark-750">
                {tool}
              </span>
            ))}
          </div>
        </Card>
      </section>

      {/* Dotfiles */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide flex items-center gap-2">
          <Terminal className="h-5 w-5 text-emerald-400" />
          Dotfiles & Configurations
        </h2>
        <Card className="p-5 bg-dark-900/60 border border-dark-800">
          <div className="space-y-2.5">
            {dotfiles.map((dotfile, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-dark-950/60 rounded-lg border border-dark-800 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-emerald-400 font-semibold">{dotfile.name}</span>
                  <span className="text-dark-400 text-xs hidden sm:inline">{dotfile.description}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copy(`cat ~/${dotfile.name}`)}
                  className="text-2xs font-mono h-7 px-2 text-dark-400 hover:text-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  Copy Path
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}

export default LinuxSetup;