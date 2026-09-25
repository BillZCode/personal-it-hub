import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { PageLoading } from './components/feedback/LoadingStates';

// Public pages
const Dashboard = React.lazy(() => import('./pages/public/Dashboard').then(m => ({ default: m.Dashboard })));
const About = React.lazy(() => import('./pages/public/About').then(m => ({ default: m.About })));
const Projects = React.lazy(() => import('./pages/public/Projects').then(m => ({ default: m.Projects })));
const Certificates = React.lazy(() => import('./pages/public/Certificates').then(m => ({ default: m.Certificates })));
const Notes = React.lazy(() => import('./pages/public/Notes').then(m => ({ default: m.Notes })));
const NoteDetail = React.lazy(() => import('./pages/public/NoteDetail'));
const Tools = React.lazy(() => import('./pages/public/Tools').then(m => ({ default: m.Tools })));
const NetworkTools = React.lazy(() => import('./pages/public/NetworkTools').then(m => ({ default: m.NetworkTools })));
const SystemStatus = React.lazy(() => import('./pages/public/SystemStatus').then(m => ({ default: m.SystemStatus })));
const ServerInfo = React.lazy(() => import('./pages/public/ServerInfo').then(m => ({ default: m.ServerInfo })));
const Statistics = React.lazy(() => import('./pages/public/Statistics').then(m => ({ default: m.Statistics })));
const Guestbook = React.lazy(() => import('./pages/public/Guestbook').then(m => ({ default: m.Guestbook })));
const Personal = React.lazy(() => import('./pages/public/Personal').then(m => ({ default: m.Personal })));
const Gallery = React.lazy(() => import('./pages/public/Gallery').then(m => ({ default: m.Gallery })));
const LinuxSetup = React.lazy(() => import('./pages/public/LinuxSetup').then(m => ({ default: m.LinuxSetup })));
const Changelog = React.lazy(() => import('./pages/public/Changelog').then(m => ({ default: m.Changelog })));
const Contact = React.lazy(() => import('./pages/public/Contact').then(m => ({ default: m.Contact })));
const Chatbot = React.lazy(() => import('./pages/public/Chatbot').then(m => ({ default: m.Chatbot })));
const CyberLab = React.lazy(() => import('./pages/public/CyberLab').then(m => ({ default: m.CyberLab })));

// Private Cloud Drive pages
const DriveLayout = React.lazy(() => import('./layouts/DriveLayout').then(m => ({ default: m.DriveLayout })));
const DriveLogin = React.lazy(() => import('./pages/drive/DriveLogin').then(m => ({ default: m.DriveLogin })));
const MyDrive = React.lazy(() => import('./pages/drive/MyDrive').then(m => ({ default: m.MyDrive })));

// Admin pages
const AdminLogin = React.lazy(() => import('./pages/admin/Login').then(m => ({ default: m.Login })));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProjects = React.lazy(() => import('./pages/admin/Projects').then(m => ({ default: m.AdminProjects })));
const AdminNotes = React.lazy(() => import('./pages/admin/Notes').then(m => ({ default: m.AdminNotes })));
const AdminCertificates = React.lazy(() => import('./pages/admin/Certificates').then(m => ({ default: m.AdminCertificates })));
const AdminGallery = React.lazy(() => import('./pages/admin/Gallery').then(m => ({ default: m.AdminGallery })));
const AdminChangelog = React.lazy(() => import('./pages/admin/Changelog').then(m => ({ default: m.AdminChangelog })));
const AdminGuestbook = React.lazy(() => import('./pages/admin/Guestbook').then(m => ({ default: m.AdminGuestbook })));
const AdminStatistics = React.lazy(() => import('./pages/admin/Statistics').then(m => ({ default: m.AdminStatistics })));

function LoadingFallback() {
  return <PageLoading />;
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="about" element={<About />} />
            <Route path="projects" element={<Projects />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="notes" element={<Notes />} />
            <Route path="notes/:slug" element={<NoteDetail />} />
            <Route path="tools" element={<Tools />} />
            <Route path="network" element={<NetworkTools />} />
            <Route path="status" element={<SystemStatus />} />
            <Route path="server" element={<ServerInfo />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="guestbook" element={<Guestbook />} />
            <Route path="personal" element={<Personal />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="linux-setup" element={<LinuxSetup />} />
            <Route path="changelog" element={<Changelog />} />
            <Route path="contact" element={<Contact />} />
            <Route path="ai" element={<Chatbot />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="cyberlab" element={<CyberLab />} />
          </Route>

          {/* Private Cloud Drive routes */}
          <Route path="/drive/login" element={<DriveLogin />} />
          <Route path="/drive" element={<DriveLayout />}>
            <Route index element={<MyDrive />} />
            <Route path="trash" element={<MyDrive isTrash={true} />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AuthLayout />}>
            <Route index element={<AdminLogin />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="notes" element={<AdminNotes />} />
            <Route path="certificates" element={<AdminCertificates />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="changelog" element={<AdminChangelog />} />
            <Route path="guestbook" element={<AdminGuestbook />} />
            <Route path="statistics" element={<AdminStatistics />} />
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;