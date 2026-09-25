import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { galleryApi } from '../../services/api';
import { Card, Input, Select, Button, Modal } from '../../components/ui';
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { GalleryItem } from '../../types';

const categories = ['Linux', 'Networking', 'Projects', 'Homelab', 'Screenshots', 'Misc'];

const realGalleryImages: GalleryItem[] = [
  { 
    id: 'gal-1', 
    title: 'Wednesday Desktop Setup & Overview', 
    description: 'Tampilan multi-window workflow Debian 13 KDE Plasma dengan tema anime Wednesday, Neofetch, System Monitor, Antigravity IDE, dan Dolphin File Manager.', 
    category: 'Linux', 
    imageUrl: '/images/gallery/desktop_overview_wednesday.png', 
    thumbnailUrl: '/images/gallery/desktop_overview_wednesday.png', 
    tags: ['linux', 'kde plasma', 'desktop', 'debian 13', 'wednesday'], 
    createdAt: '2026-09-09', 
    updatedAt: '2026-09-09' 
  },
  { 
    id: 'gal-2', 
    title: 'Topologi Cisco OSPF Multi-Router', 
    description: 'Desain dan konfigurasi routing dinamis protokol OSPF (Open Shortest Path First) menghubungkan beberapa subnet router dan switch di Cisco Packet Tracer.', 
    category: 'Networking', 
    imageUrl: '/images/gallery/cisco_ospf_topology.png', 
    thumbnailUrl: '/images/gallery/cisco_ospf_topology.png', 
    tags: ['networking', 'cisco', 'packet tracer', 'ospf', 'routing'], 
    createdAt: '2026-09-09', 
    updatedAt: '2026-09-09' 
  },
  { 
    id: 'gal-3', 
    title: 'Topologi VLAN & Static Routing', 
    description: 'Arsitektur jaringan inter-VLAN routing terdistribusi dan konfigurasi static routing hierarkis dengan switch & PC client di Cisco Packet Tracer.', 
    category: 'Networking', 
    imageUrl: '/images/gallery/cisco_vlan_static_routing.png', 
    thumbnailUrl: '/images/gallery/cisco_vlan_static_routing.png', 
    tags: ['networking', 'vlan', 'static routing', 'cisco', 'topology'], 
    createdAt: '2026-09-09', 
    updatedAt: '2026-09-09' 
  },
  { 
    id: 'gal-4', 
    title: 'XenLogic Operator Profile (Arknights: Endfield)', 
    description: 'Kartu profil identitas game XenLogic#1435, Level Otoritas 60, eksplorasi Reruntuhan di Dalam Miasma.', 
    category: 'Misc', 
    imageUrl: '/images/gallery/xenlogic_operator_profile.jpg', 
    thumbnailUrl: '/images/gallery/xenlogic_operator_profile.jpg', 
    tags: ['gaming', 'profile', 'arknights', 'endfield', 'xenlogic'], 
    createdAt: '2026-09-09', 
    updatedAt: '2026-09-09' 
  },
  { 
    id: 'gal-5', 
    title: 'Arena Breakout — Lahan Pertanian Tactical Loadout', 
    description: 'Setelan perlengkapan tempur taktis di Arena Breakout untuk penyerbuan Lahan Pertanian: Helm SH12, Rompi HLC 55/55, Masker Gas RAL20, Senapan AK74N ganda, Rig BH2, dan Ransel Kemah.', 
    category: 'Misc', 
    imageUrl: '/images/gallery/arena_breakout_loadout.jpg', 
    thumbnailUrl: '/images/gallery/arena_breakout_loadout.jpg', 
    tags: ['gaming', 'arena breakout', 'fps', 'tactical', 'loadout'], 
    createdAt: '2026-09-09', 
    updatedAt: '2026-09-09' 
  },
  { 
    id: 'gal-6', 
    title: 'Arsitektur Cloud AWS VPC-CloudKita (Multi-AZ)', 
    description: 'Desain infrastruktur cloud AWS VPC multi-subnet dengan EC2 WebServer Apache MariaDB di Public Subnet, RDS MySQL Instance terisolasi di Private Subnet DB multi-AZ, serta integrasi AWS S3 Bucket storage.', 
    category: 'Projects', 
    imageUrl: '/images/gallery/aws_vpc_cloudkita_architecture.jpg', 
    thumbnailUrl: '/images/gallery/aws_vpc_cloudkita_architecture.jpg', 
    tags: ['cloud', 'aws', 'vpc', 'ec2', 'rds', 's3', 'architecture'], 
    createdAt: '2026-09-09', 
    updatedAt: '2026-09-09' 
  },
  { 
    id: 'gal-7', 
    title: 'Hardware Homelab — MSI PRO B760M-P DDR4', 
    description: 'Motherboard MSI PRO B760M-P DDR4 soket LGA1700 dengan slot PCIe 4.0 Steel Armor, dual M.2 Lightning Gen 4 NVMe, dan 4x slot DDR4 untuk fondasi server / homelab.', 
    category: 'Homelab', 
    imageUrl: '/images/gallery/msi_pro_b760m_p_motherboard.jpg', 
    thumbnailUrl: '/images/gallery/msi_pro_b760m_p_motherboard.jpg', 
    tags: ['hardware', 'motherboard', 'msi', 'intel', 'homelab', 'b760m'], 
    createdAt: '2026-09-09', 
    updatedAt: '2026-09-09' 
  },
  { 
    id: 'gal-8', 
    title: 'Personal IT Hub Dashboard — Live System Overview', 
    description: 'Antarmuka utama Personal IT Hub dengan metrik performa CPU, RAM, Disk, analitik pengunjung live Cloudflare, serta ringkasan artikel teknis dan status server.', 
    category: 'Projects', 
    imageUrl: '/images/gallery/dashboard_dark_theme.png', 
    thumbnailUrl: '/images/gallery/dashboard_dark_theme.png', 
    tags: ['dashboard', 'frontend', 'react', 'portfolio', 'analytics'], 
    createdAt: '2026-09-09', 
    updatedAt: '2026-09-09' 
  },
  { 
    id: 'gal-9', 
    title: 'Developer Tools — Universal Media & File Downloader', 
    description: 'Antarmuka Developer Tools dengan fitur Universal Downloader yang mendukung bypass CORS proxy, ekstraksi video TikTok/YouTube, dan download manager langsung.', 
    category: 'Projects', 
    imageUrl: '/images/gallery/universal_downloader_tool.png', 
    thumbnailUrl: '/images/gallery/universal_downloader_tool.png', 
    tags: ['tools', 'downloader', 'developer', 'frontend', 'media'], 
    createdAt: '2026-09-10', 
    updatedAt: '2026-09-10' 
  },
];

export function Gallery() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => galleryApi.getAll(),
    placeholderData: { data: realGalleryImages, total: realGalleryImages.length, page: 1, limit: 20, totalPages: 1 },
  });

  const images = (data?.data && data.data.length > 0) ? data.data : realGalleryImages;
  const filtered = images.filter((img) => {
    const matchesSearch = img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !categoryFilter || img.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openLightbox = (image: GalleryItem, index: number) => {
    setSelectedImage(image);
    setLightboxIndex(index);
  };

  const navigateLightbox = (direction: number) => {
    const newIndex = (lightboxIndex + direction + filtered.length) % filtered.length;
    setLightboxIndex(newIndex);
    setSelectedImage(filtered[newIndex]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in pb-16">
      <div className="border-b border-dark-800/80 pb-6">
        <h1 className="text-3xl font-bold text-dark-100 tracking-tight font-sans">Gallery</h1>
        <p className="text-dark-400 text-sm mt-1">Screenshots, network diagrams, hardware homelab, and project photos</p>
      </div>

      <div className="p-4 rounded-xl bg-dark-900/40 border border-dark-800 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Cari foto, diagram, atau tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          className="flex-1 max-w-md"
        />
        <Select
          placeholder="Semua Kategori"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          options={[
            { value: '', label: 'Semua Kategori' },
            ...categories.map(c => ({ value: c, label: c })),
          ]}
          className="w-full sm:w-56"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-dark-400">
          Tidak ada gambar yang cocok dengan filter pencarian.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((image, index) => (
            <Card
              key={image.id}
              className="card-hover overflow-hidden border border-dark-800 bg-dark-900/60 hover:border-emerald-500/40 transition-all group flex flex-col justify-between"
            >
              <div
                className="relative aspect-video bg-dark-950 overflow-hidden cursor-pointer border-b border-dark-800"
                onClick={() => openLightbox(image, index)}
              >
                <img
                  src={image.thumbnailUrl || image.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-2.5 rounded-full bg-dark-900/90 text-emerald-400 border border-dark-700 shadow-xl">
                    <Eye className="h-5 w-5" />
                  </span>
                </div>
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-2xs font-mono px-2 py-0.5 rounded bg-dark-900/80 text-emerald-400 border border-dark-700/80 backdrop-blur-md">
                    {image.category}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3
                    className="font-semibold text-dark-100 text-sm sm:text-base group-hover:text-emerald-400 transition-colors cursor-pointer line-clamp-1 font-mono"
                    onClick={() => openLightbox(image, index)}
                  >
                    {image.title}
                  </h3>
                  <p className="text-dark-400 text-xs line-clamp-2 mt-1 leading-relaxed">
                    {image.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-2">
                  {image.tags.map((tag) => (
                    <span key={tag} className="text-2xs font-mono px-2 py-0.5 rounded bg-dark-850 text-dark-400 border border-dark-750">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title={selectedImage?.title}
        size="xl"
      >
        {selectedImage && (
          <div className="space-y-4">
            <div className="relative w-full rounded-xl overflow-hidden border border-dark-700 bg-dark-950 flex items-center justify-center p-1">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg"
              />
              <button
                onClick={() => navigateLightbox(-1)}
                className="absolute left-2 p-2 rounded-full bg-dark-900/80 text-dark-200 hover:text-white border border-dark-700 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigateLightbox(1)}
                className="absolute right-2 p-2 rounded-full bg-dark-900/80 text-dark-200 hover:text-white border border-dark-700 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-dark-900/60 border border-dark-800 space-y-2">
              <p className="text-sm text-dark-200 leading-relaxed">
                {selectedImage.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedImage.tags.map((t) => (
                  <span key={t} className="text-2xs font-mono px-2 py-0.5 rounded bg-dark-800 text-emerald-400 border border-dark-700">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Gallery;