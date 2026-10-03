import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { animate, stagger } from 'animejs';
import { certificatesApi } from '../../services/api';
import { Card, CardContent, Button, Input, Select, Modal } from '../../components/ui';
import { Award, Eye, ExternalLink, Search, Tag, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { formatDate } from '../../utils';
import { Certificate } from '../../types';
import { useDocumentTitle } from '../../hooks';

export const sabbilCertificates: Certificate[] = [

  {
    id: 'cert-1',
    name: 'Introduction to Cybersecurity',
    provider: 'Cisco Networking Academy',
    issueDate: '2026-09-08',
    expiryDate: undefined,
    credentialId: 'CISCO-CYBER-2026-09',
    verificationUrl: 'https://www.netacad.com/',
    imageUrl: '/images/certificates/cisco_cybersecurity.png',
    createdAt: '2026-09-08',
    updatedAt: '2026-09-08'
  },
  {
    id: 'cert-2',
    name: 'Endpoint Security',
    provider: 'Cisco Networking Academy',
    issueDate: '2026-09-04',
    expiryDate: undefined,
    credentialId: 'CISCO-ENDPOINT-2026-09',
    verificationUrl: 'https://www.netacad.com/',
    imageUrl: '/images/certificates/cisco_endpoint.png',
    createdAt: '2026-09-04',
    updatedAt: '2026-09-04'
  },
  {
    id: 'cert-3',
    name: 'Fundamental of Optic Installation & Activation Technician',
    provider: 'KOMDIGI - Digital Talent Scholarship 2026',
    issueDate: '2026-09-03',
    expiryDate: undefined,
    credentialId: '212131071110-9/DTA/BLSDM.Komdigi/2026',
    verificationUrl: 'https://sdmdigital.id',
    imageUrl: '/images/certificates/komdigi_fiber_optic.png',
    createdAt: '2026-09-03',
    updatedAt: '2026-09-03'
  },
  {
    id: 'cert-4',
    name: 'Pengantar Mindset Digital 1 : Mengubah Masa Depan Anda Dengan Pola Pikir Digital',
    provider: 'KOMDIGI - Digital Talent Scholarship 2026',
    issueDate: '2026-08-10',
    expiryDate: undefined,
    credentialId: '2299815850-27641/MS/BLSDM.Komdigi/2026',
    verificationUrl: 'https://sdmdigital.id',
    imageUrl: '/images/certificates/komdigi_mindset.png',
    createdAt: '2026-08-10',
    updatedAt: '2026-08-10'
  },
  {
    id: 'cert-5',
    name: 'Python Curriculum & Data Structures',
    provider: 'Mimo',
    issueDate: '2023-04-17',
    expiryDate: undefined,
    credentialId: 'MIMO-PYTHON-2023',
    verificationUrl: 'https://mimo.org',
    imageUrl: '/images/certificates/mimo_python.jpg',
    createdAt: '2023-04-17',
    updatedAt: '2023-04-17'
  },
  {
    id: 'cert-6',
    name: 'SQL Curriculum & Relational Database',
    provider: 'Mimo',
    issueDate: '2023-04-13',
    expiryDate: undefined,
    credentialId: 'MIMO-SQL-2023',
    verificationUrl: 'https://mimo.org',
    imageUrl: '/images/certificates/mimo_sql.jpg',
    createdAt: '2023-04-13',
    updatedAt: '2023-04-13'
  },
  {
    id: 'cert-7',
    name: 'HTML Curriculum & Web Development',
    provider: 'Mimo',
    issueDate: '2023-04-12',
    expiryDate: undefined,
    credentialId: 'MIMO-HTML-2023',
    verificationUrl: 'https://mimo.org',
    imageUrl: '/images/certificates/mimo_html.jpg',
    createdAt: '2023-04-12',
    updatedAt: '2023-04-12'
  },
];

export function Certificates() {
  useDocumentTitle('Industry Certifications & Credentials');
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState('');

  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const { data } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      try {
        const res = await certificatesApi.getAll();
        return (res?.data && res.data.length > 0) ? res : { data: sabbilCertificates };
      } catch {
        return { data: sabbilCertificates };
      }
    },
    placeholderData: { data: sabbilCertificates, total: sabbilCertificates.length, page: 1, limit: 20, totalPages: 1 },
  });

  const certificates: Certificate[] = useMemo(() => {
    return (data?.data && data.data.length > 0) ? (data.data as Certificate[]) : sabbilCertificates;
  }, [data]);

  const allProviders: string[] = useMemo(() => {
    return [...new Set(certificates.map((c: Certificate) => c.provider))].sort();
  }, [certificates]);

  const filtered: Certificate[] = useMemo(() => {
    const searchLower = search.toLowerCase().trim();
    return certificates.filter((cert: Certificate) => {
      const matchesSearch = !searchLower ||
        cert.name.toLowerCase().includes(searchLower) ||
        (cert.credentialId && cert.credentialId.toLowerCase().includes(searchLower));
      const matchesProvider = !providerFilter || cert.provider === providerFilter;
      return matchesSearch && matchesProvider;
    });
  }, [certificates, search, providerFilter]);

  // Anime.js staggered entrance for certificates
  useEffect(() => {
    animate('.cert-grid-card', {
      opacity: [0, 1],
      translateY: [18, 0],
      delay: stagger(45, { start: 40 }),
      duration: 400,
      ease: 'outCubic',
    });
  }, [search, providerFilter, filtered.length]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in pb-16">
      <div className="border-b border-dark-800/80 pb-6">
        <h1 className="text-3xl font-bold text-dark-100 tracking-tight font-sans">Certificates</h1>
        <p className="text-dark-400 text-sm mt-1">Verified technical credentials, Cisco networking, and government IT certifications</p>
      </div>

      <div className="p-4 rounded-xl bg-dark-900/40 border border-dark-800 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <Input
          placeholder="Cari nama sertifikasi atau nomor credential ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          className="flex-1 max-w-md"
        />
        <Select
          placeholder="Filter berdasarkan penerbit / provider"
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value)}
          options={[
            { value: '', label: 'Semua Provider' },
            ...allProviders.map(p => ({ value: p, label: p })),
          ]}
          className="w-full sm:w-64"
        />
        {(search || providerFilter) && (
          <button
            onClick={() => {
              setSearch('');
              setProviderFilter('');
            }}
            className="px-3 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-dark-300 hover:text-white border border-dark-750 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto"
            title="Reset semua filter sertifikat"
          >
            <X className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Award className="h-12 w-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-400">Tidak ada sertifikat yang cocok dengan kriteria pencarian.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {filtered.map((cert) => (
            <Card key={cert.id} role="listitem" className="cert-grid-card card-hover overflow-hidden flex flex-col border border-dark-800/90 bg-dark-900/60 hover:border-amber-500/50 hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.18)] transition-all duration-300 group">
              {/* Preview Thumbnail */}
              {cert.imageUrl ? (
                <div 
                  role="button"
                  tabIndex={0}
                  aria-label={`Lihat pratinjau sertifikat: ${cert.name}`}
                  className="w-full h-48 bg-dark-950 overflow-hidden cursor-pointer relative border-b border-dark-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  onClick={() => setSelectedCert(cert)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedCert(cert);
                    }
                  }}
                >
                  <img 
                    src={cert.imageUrl} 
                    alt={cert.name} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Credential
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-36 bg-dark-900/40 flex items-center justify-center border-b border-dark-800">
                  <Award className="h-12 w-12 text-dark-600" />
                </div>
              )}

              <CardContent className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    role="button"
                    tabIndex={0}
                    className="font-semibold text-dark-100 mb-1.5 line-clamp-2 text-sm sm:text-base leading-snug group-hover:text-amber-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:text-amber-400"
                    onClick={() => setSelectedCert(cert)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedCert(cert);
                      }
                    }}
                  >
                    {cert.name}
                  </h3>
                  <p className="text-dark-400 text-xs mb-3 flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                    <span className="truncate">{cert.provider}</span>
                  </p>
                  <div className="flex flex-col gap-1 text-xs text-dark-400 mb-4 bg-dark-950/60 p-2.5 rounded-lg border border-dark-800 font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-dark-500 text-2xs">ID:</span>
                      <span className="text-dark-200 truncate ml-2 text-2xs">{cert.credentialId || 'Verified'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-dark-500 text-2xs">Issued:</span>
                      <span className="text-dark-200 text-2xs">{formatDate(cert.issueDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-dark-800/80">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCert(cert)} className="flex-1 text-xs text-dark-300 hover:text-white">
                    <Eye className="h-3.5 w-3.5 mr-1 text-amber-400" />
                    Preview
                  </Button>
                  {cert.verificationUrl && (
                    <a 
                      href={cert.verificationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs flex-1 justify-center py-1.5 flex items-center" 
                      aria-label={`Verifikasi kredensial ${cert.name}`}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Verify
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Detail Certificate */}
      <Modal isOpen={!!selectedCert} onClose={() => setSelectedCert(null)} title={selectedCert?.name} size="xl">
        {selectedCert && (
          <div className="space-y-4">
            {selectedCert.imageUrl && (
              <div className="w-full rounded-xl overflow-hidden border border-dark-700 bg-dark-950 shadow-2xl flex items-center justify-center p-2">
                <img 
                  src={selectedCert.imageUrl} 
                  alt={selectedCert.name} 
                  className="max-w-full max-h-[72vh] object-contain mx-auto rounded-lg" 
                  style={{ imageRendering: 'auto' }}
                />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-dark-900/60 p-4 rounded-xl border border-dark-800">
              <div>
                <p className="text-2xs text-dark-500 uppercase tracking-wider font-mono">Provider / Penerbit</p>
                <p className="font-medium text-dark-100 mt-0.5">{selectedCert.provider}</p>
              </div>
              <div>
                <p className="text-2xs text-dark-500 uppercase tracking-wider font-mono">Credential ID / No. Sertifikat</p>
                <p className="font-mono text-xs font-medium text-amber-400 mt-0.5 break-all">{selectedCert.credentialId || 'N/A'}</p>
              </div>
              <div>
                <p className="text-2xs text-dark-500 uppercase tracking-wider font-mono">Tanggal Terbit</p>
                <p className="font-medium text-dark-100 mt-0.5">{formatDate(selectedCert.issueDate)}</p>
              </div>
              <div>
                <p className="text-2xs text-dark-500 uppercase tracking-wider font-mono">Validitas</p>
                <p className="font-medium text-amber-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" /> Lifetime Credential
                </p>
              </div>
            </div>
            {selectedCert.verificationUrl && (
              <a 
                href={selectedCert.verificationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center py-2.5 text-xs font-medium flex items-center" 
                aria-label={`Verifikasi online kredensial ${selectedCert.name} di situs resmi`}
              >
                <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                Validasi / Kunjungi Situs Resmi Penerbit
              </a>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Certificates;