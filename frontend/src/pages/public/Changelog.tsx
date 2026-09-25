import { useQuery } from '@tanstack/react-query';
import { changelogApi } from '../../services/api';
import { Card, CardContent, Badge, Button } from '../../components/ui';
import { LoadingState } from '../../components/feedback/LoadingStates';
import { GitBranch, Plus, Calendar, Package, ArrowUp, Bug, Wrench, Sparkles } from 'lucide-react';
import { cn, formatDate, formatRelativeTime } from '../../utils';
import { ChangelogEntry } from '../../types';

const sampleChangelog: ChangelogEntry[] = [
  {
    id: '0', version: 'v2.6.2', date: '2026-09-12',
    added: ['PHP Runtime & PHP-FPM technical note', 'Modern PHP 8+ PDO & REST API technical note', 'FastCGI Apache & Nginx integration guides', 'Hardening security guidelines for php.ini'],
    changed: ['Updated Technical Notes catalog with Backend category', 'Enhanced Dashboard latest notes section'],
    fixed: [],
    improved: ['Fast search indexing across PHP keywords', 'Reading time & responsive code highlights'],
    createdAt: '', updatedAt: ''
  },
  {
    id: '1', version: 'v2.4.0', date: '2026-09-09',
    added: ['Server monitoring dashboard', 'Network tools suite', 'Guestbook spam protection', 'Dark mode toggle'],
    changed: ['Improved dashboard layout', 'Updated navigation structure'],
    fixed: ['Mobile sidebar toggle', 'Chart rendering on Safari'],
    improved: ['Performance optimization', 'Accessibility improvements', 'TypeScript strict mode'],
    createdAt: '', updatedAt: ''
  },
  {
    id: '2', version: 'v2.3.0', date: '2026-08-15',
    added: ['File downloader tool', 'Base64 encoder/decoder', 'Hash generator', 'JSON formatter'],
    changed: ['Refactored tools page', 'Updated dependencies'],
    fixed: ['Timestamp converter edge cases', 'QR code generation'],
    improved: ['Bundle size reduction', 'Build performance'],
    createdAt: '', updatedAt: ''
  },
  {
    id: '3', version: 'v2.2.0', date: '2026-07-20',
    added: ['Technical notes section', 'Markdown rendering', 'Syntax highlighting', 'Table of contents'],
    changed: ['Redesigned notes page', 'Category filtering'],
    fixed: ['Code block copy button', 'Reading time calculation'],
    improved: ['SEO meta tags', 'Search functionality'],
    createdAt: '', updatedAt: ''
  },
  {
    id: '4', version: 'v2.1.0', date: '2026-06-10',
    added: ['Projects showcase', 'Certificates page', 'Gallery with lightbox', 'Contact form'],
    changed: ['New design system', 'Tailwind CSS v3.4'],
    fixed: ['Image lazy loading', 'Modal focus trap'],
    improved: ['Responsive breakpoints', 'Animation performance'],
    createdAt: '', updatedAt: ''
  },
  {
    id: '5', version: 'v2.0.0', date: '2026-05-01',
    added: ['Complete rewrite with React 18', 'TypeScript strict mode', 'Vite 5', 'TanStack Query'],
    changed: ['New routing structure', 'State management with Zustand'],
    fixed: ['Hydration mismatches', 'SSR compatibility'],
    improved: ['Developer experience', 'Build times', 'Bundle analysis'],
    createdAt: '', updatedAt: ''
  },
  {
    id: '6', version: 'v1.5.0', date: '2026-03-15',
    added: ['Admin panel', 'JWT authentication', 'Project CRUD', 'Notes management'],
    changed: ['Protected routes', 'Role-based access'],
    fixed: ['Token refresh logic', 'Form validation'],
    improved: ['Security headers', 'Rate limiting'],
    createdAt: '', updatedAt: ''
  },
  {
    id: '7', version: 'v1.4.0', date: '2026-02-01',
    added: ['Network tools (DNS, WHOIS, Ping)', 'IP calculator', 'Subnet calculator'],
    changed: ['Backend API structure', 'Database schema'],
    fixed: ['CORS configuration', 'API error handling'],
    improved: ['API response times', 'Input validation'],
    createdAt: '', updatedAt: ''
  },
  {
    id: '8', version: 'v1.3.0', date: '2026-01-10',
    added: ['System status page', 'Server metrics', 'Statistics dashboard', 'Chart.js integration'],
    changed: ['Real-time data polling', 'WebSocket preparation'],
    fixed: ['Memory leaks in charts', 'Timezone handling'],
    improved: ['Data visualization', 'Export functionality'],
    createdAt: '', updatedAt: ''
  },
  {
    id: '9', version: 'v1.2.0', date: '2025-12-01',
    added: ['Guestbook', 'Personal section', 'Linux setup page', 'Search across content'],
    changed: ['Content structure', 'Navigation groups'],
    fixed: ['Mobile menu', 'Scroll restoration'],
    improved: ['Content editing workflow', 'Image optimization'],
    createdAt: '', updatedAt: ''
  },
  {
    id: '10', version: 'v1.1.0', date: '2025-11-01',
    added: ['About page', 'Skills matrix', 'Technology stack', 'Learning goals'],
    changed: ['Profile layout', 'Social links'],
    fixed: ['Avatar generation', 'Contact form'],
    improved: ['Accessibility', 'Color contrast'],
    createdAt: '', updatedAt: ''
  },
];

const typeConfig = {
  added: { label: 'Added', icon: Plus, color: 'text-green-400', bg: 'bg-green-500/20' },
  changed: { label: 'Changed', icon: Wrench, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  fixed: { label: 'Fixed', icon: Bug, color: 'text-red-400', bg: 'bg-red-500/20' },
  improved: { label: 'Improved', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/20' },
} as const;

export function Changelog() {
  const { data, isLoading } = useQuery({
    queryKey: ['changelog'],
    queryFn: () => changelogApi.getAll(),
    placeholderData: sampleChangelog,
  });

  const entries = data || sampleChangelog;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Changelog</h1>
        <p className="text-dark-400 mt-2">Version history and release notes</p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-dark-700" />
        {entries.map((entry, index) => (
          <div key={entry.id} className="relative mb-10 pl-16 pb-6 last:pb-0">
            <div className="absolute left-0 top-1 w-16 text-right pr-4">
              <span className="font-mono font-bold text-primary-500 text-lg">{entry.version}</span>
              <p className="text-xs text-dark-500 mt-1">{formatDate(entry.date)}</p>
              <p className="text-xs text-dark-400">{formatRelativeTime(entry.date)}</p>
            </div>
            <div className="absolute left-6 top-4 w-3 h-3 rounded-full bg-primary-500 border-2 border-dark-950 z-10" />
            {index < entries.length - 1 && (
              <div className="absolute left-7 top-10 h-full w-0.5 bg-dark-700" />
            )}

            <Card className="p-5">
              <div className="space-y-4">
                {(['added', 'changed', 'fixed', 'improved'] as const).map((type) => {
                  const items = entry[type];
                  if (!items.length) return null;
                  const config = typeConfig[type];
                  const Icon = config.icon;

                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn('p-1.5 rounded', config.bg)}>
                          <Icon className={cn('h-4 w-4', config.color)} />
                        </div>
                        <h4 className={cn('font-semibold text-sm uppercase tracking-wide', config.color)}>
                          {config.label}
                        </h4>
                      </div>
                      <ul className="ml-8 space-y-1.5 border-l border-dark-700 pl-4">
                        {items.map((item, i) => (
                          <li key={i} className="text-dark-300 text-sm relative before:absolute before:left-[-10px] before:top-[6px] before:w-2 before:h-2 before:rounded-full before:bg-primary-500/50">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="text-center pt-8 border-t border-dark-700">
        <p className="text-dark-400 mb-4">Showing {entries.length} releases</p>
        <Button variant="outline" leftIcon={<GitBranch className="h-4 w-4" />}>
          View on GitHub
        </Button>
      </div>
    </div>
  );
}