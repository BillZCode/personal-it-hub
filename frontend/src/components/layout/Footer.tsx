import { Link } from 'react-router-dom';
import { Github, Instagram, Mail, Rss } from 'lucide-react';

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/BillZCode', icon: Github, ariaLabel: 'Kunjungi GitHub profil @BillZCode' },
  { name: 'Discord', href: 'https://discord.com/users/enzbern_', icon: DiscordIcon, ariaLabel: 'Kunjungi Discord profil enzbern_' },
  { name: 'Instagram', href: 'https://instagram.com/sabbilferdyans', icon: Instagram, ariaLabel: 'Kunjungi Instagram profil @sabbilferdyans' },
  { name: 'Email', href: 'mailto:skyroomtl@gmail.com', icon: Mail, ariaLabel: 'Kirim email ke skyroomtl@gmail.com' },
  { name: 'RSS', href: '/rss.xml', icon: Rss, ariaLabel: 'Buka RSS Feed' },
];

const quickLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Certificates', path: '/certificates' },
  { name: 'Technical Notes', path: '/notes' },
  { name: 'Guestbook', path: '/guestbook' },
  { name: 'Contact', path: '/contact' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-dark-700/80 bg-dark-950/70 backdrop-blur-xl relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-mono text-lg font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent mb-4">IT-HUB</h3>
            <p className="text-dark-400 text-sm max-w-md leading-relaxed">
              Personal IT Hub: Portfolio • Infrastructure • Networking • Linux • Development
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="text-dark-400 hover:text-amber-400 transition-colors p-1 -m-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded-lg"
                  aria-label={link.ariaLabel}
                >
                  <link.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-dark-100 mb-4 text-sm font-sans tracking-tight">Quick Links</h4>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2 text-sm">
                {quickLinks.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-dark-400 hover:text-amber-400 transition-colors font-sans text-xs sm:text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-dark-100 mb-4 text-sm font-sans tracking-tight">System Status</h4>
            <ul className="space-y-2 text-xs sm:text-sm font-mono text-dark-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span>Status: <strong className="text-emerald-400 font-semibold">Operational</strong></span>
              </li>
              <li>Uptime: <span className="text-dark-200">99.98%</span></li>
              <li>Version: <span className="text-dark-200">v2.4.0</span></li>
              <li>Last Deploy: <span className="text-dark-200">Sep 2026</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-dark-500">
            © {currentYear} Sabbil Abdillah Ferdyansyah. Built with React, TypeScript, Tailwind CSS
          </p>
          <p className="text-xs font-mono text-dark-500">
            Node: Production Edge
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;