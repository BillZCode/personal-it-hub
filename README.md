# Personal IT Hub

A comprehensive personal IT dashboard combining portfolio, technical documentation, developer tools, network utilities, server monitoring, and system administration features.

## Features

- **Portfolio** - Projects, certificates, and showcase
- **Technical Notes** - Markdown-based knowledge base with syntax highlighting
- **Developer Tools** - 11 client-side utilities (Base64, Hash, JSON, QR, etc.)
- **Network Tools** - 9 utilities with backend APIs (DNS, WHOIS, Ping, Subnet calc, etc.)
- **Server Monitoring** - Real-time CPU, RAM, Disk, Network metrics
- **System Status** - Service health checks and uptime tracking
- **Statistics** - Visitor analytics, tool usage, article views with charts
- **Guestbook** - Moderated visitor messages with spam protection
- **Personal Section** - Currently playing/listening, anime/movie tracking
- **Gallery** - Image gallery with lightbox and categories
- **Linux Setup** - Documented system configuration
- **Changelog** - Version history with timeline view
- **Admin Panel** - Full CRUD for all content with JWT authentication

## Tech Stack

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS (custom dark theme)
- React Router 6
- TanStack Query (React Query)
- Zustand (state management)
- Chart.js + react-chartjs-2
- React Markdown + Prism.js

### Backend
- Node.js 20 + Express + TypeScript
- Prisma ORM + MySQL 8
- JWT Authentication (httpOnly cookies)
- express-rate-limit, helmet, cors
- systeminformation (server metrics)

### DevOps
- Docker + Docker Compose
- Nginx reverse proxy
- Multi-stage builds

## Quick Start

### Prerequisites
- Node.js 20+
- MySQL 8.0+
- Docker (optional)

### Development

```bash
# Clone and install
cd personal-it-hub
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start database (Docker)
docker compose up -d mysql

# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed

# Start development servers
npm run dev
```

Frontend: http://localhost:3000  
Backend: http://localhost:3001  
Admin: http://localhost:3000/admin/login (admin@example.com / password123)

### Production Deployment

```bash
# Build and start all services
docker compose -f docker-compose.yml up -d --build

# Or with environment file
docker compose --env-file .env up -d --build
```

### Manual Production Build

```bash
# Build frontend
npm run build:frontend

# Build backend
npm run build:backend

# Run database migrations
npm run db:migrate:prod

# Start backend
npm run start --workspace=backend
```

## Project Structure

```
personal-it-hub/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── layouts/          # Page layouts
│   │   ├── pages/            # Route components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API services
│   │   ├── api/              # API client & queries
│   │   ├── store/            # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   └── styles/           # Global styles
│   └── ...
├── backend/                  # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/           # Configuration
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # Route definitions
│   │   ├── middleware/       # Auth, validation, rate-limit
│   │   ├── services/         # Business logic
│   │   ├── database/         # Prisma client
│   │   └── utils/            # Helpers
│   └── prisma/               # Database schema & migrations
├── docker/                   # Docker configs
├── nginx.conf               # Nginx reverse proxy
├── docker-compose.yml       # Multi-container orchestration
└── Makefile                 # Convenience commands
```

## Available Routes

### Public
- `/` - Dashboard with system status, server stats, latest notes
- `/about` - Profile, biography, skills, technologies
- `/projects` - Project showcase with filters
- `/certificates` - Professional certifications
- `/notes` - Technical notes with categories/tags
- `/notes/:slug` - Individual note with TOC, syntax highlighting
- `/tools` - 11 developer tools (client-side)
- `/network` - 9 network tools (backend APIs)
- `/status` - System status & uptime
- `/server` - Real-time server metrics
- `/statistics` - Analytics with charts
- `/guestbook` - Visitor messages
- `/personal` - Games, music, anime/movies, Linux setup
- `/gallery` - Image gallery with lightbox
- `/linux-setup` - Documented system configuration
- `/changelog` - Version history timeline
- `/contact` - Contact form

### Admin (Protected)
- `/admin/login` - JWT authentication
- `/admin` - Admin dashboard
- `/admin/projects` - Project CRUD
- `/admin/notes` - Notes CRUD
- `/admin/certificates` - Certificate CRUD
- `/admin/gallery` - Gallery CRUD
- `/admin/changelog` - Changelog CRUD
- `/admin/guestbook` - Moderate entries
- `/admin/statistics` - Admin analytics

## API Endpoints

### Public
```
GET  /api/health
GET  /api/status
GET  /api/server/stats
GET  /api/server/stats/history
GET  /api/statistics
GET  /api/projects
GET  /api/projects/featured
GET  /api/projects/:slug
GET  /api/certificates
GET  /api/certificates/:id
GET  /api/notes
GET  /api/notes/:slug
GET  /api/notes/categories
GET  /api/notes/tags
GET  /api/notes/related/:slug
GET  /api/changelog
GET  /api/changelog/latest
GET  /api/guestbook
POST /api/guestbook
GET  /api/gallery
GET  /api/gallery/:id
GET  /api/personal/media
GET  /api/personal/linux-setup
POST /api/contact
POST /api/network/dns
POST /api/network/whois
POST /api/network/ping
POST /api/network/traceroute
POST /api/network/http-headers
GET  /api/network/public-ip
POST /api/network/ip-calculator
POST /api/network/subnet-calculator
POST /api/network/cidr-converter
```

### Admin
```
POST /api/admin/auth/login
POST /api/admin/auth/logout
GET  /api/admin/auth/me
GET/POST/PUT/DELETE /api/admin/projects
GET/POST/PUT/DELETE /api/admin/notes
GET/POST/PUT/DELETE /api/admin/certificates
GET/POST/PUT/DELETE /api/admin/gallery
GET/POST/PUT/DELETE /api/admin/changelog
GET/PUT/DELETE /api/admin/guestbook
GET /api/admin/statistics
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | Yes |
| `JWT_SECRET` | Access token secret (32+ chars) | Yes |
| `JWT_REFRESH_SECRET` | Refresh token secret (32+ chars) | Yes |
| `CORS_ORIGIN` | Frontend URL for CORS | Yes |
| `SMTP_HOST` | SMTP server host | No |
| `SMTP_PORT` | SMTP server port | No |
| `SMTP_USER` | SMTP username | No |
| `SMTP_PASS` | SMTP password | No |
| `EMAIL_FROM` | Sender email address | No |

## Security Features

- JWT in httpOnly, secure, sameSite=strict cookies
- Access tokens: 15min, Refresh tokens: 7 days (rotated)
- bcrypt password hashing (cost 12)
- Rate limiting per endpoint type
- Helmet security headers
- CORS configured
- Input validation with Zod
- XSS protection (DOMPurify ready)
- SQL injection prevention (Prisma)

## Performance

- TanStack Query caching (5min stale, 30min GC)
- Code splitting with Vite
- Lazy-loaded routes
- Optimized images (WebP, lazy loading)
- Compressed responses (gzip)
- Database indexes on query fields
- Server metrics collected every 5min

## Accessibility

- Semantic HTML5
- ARIA labels and roles
- Keyboard navigation
- Focus indicators
- Color contrast (WCAG AA)
- Reduced motion support
- Alt text for images

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests: `npm run lint && npm run typecheck`
5. Submit PR

## License

MIT License - see LICENSE file for details.