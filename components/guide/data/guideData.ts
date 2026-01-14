import { FeatureData } from '../GuideCard';
import { UserRole } from '../../../contexts/RoleContext';

// Guide data interface
export interface RoleGuideData {
  role: UserRole;
  title: string;
  description: string;
  icon: string;
  categories: {
    id: string;
    title: string;
    icon: string;
    features: FeatureData[];
  }[];
  quickTips?: string[];
}

// DIRECTOR Guide
export const directorGuide: RoleGuideData = {
  role: 'DIRECTOR',
  title: 'Direktur',
  description: 'Sebagai Direktur, Anda memiliki akses ke dashboard eksekutif untuk melihat gambaran besar kinerja bank. Fokus utama: monitoring strategis dan pengambilan keputusan.',
  icon: '👔',
  categories: [
    {
      id: 'analytics',
      title: 'Dashboard & Analitik',
      icon: '📊',
      features: [
        {
          id: 'dir_executive',
          title: 'Dashboard Eksekutif',
          description: 'Ringkasan KPI bisnis, pendapatan, jumlah nasabah, dan performa tim dalam satu pandangan.',
          icon: '📈',
          tab: 'dir_executive',
          isPopular: true,
          steps: [
            'Lihat metrics utama di bagian atas (Revenue, Customer Count, Deals)',
            'Pantau Business Health Scorecard untuk kesehatan operasional',
            'Klik segment chart untuk lihat distribusi nasabah',
            'Gunakan Quick Actions untuk navigasi cepat'
          ],
          permissions: [
            'Melihat statistik agregat seluruh cabang',
            'Memantau trend bulanan dan tahunan',
            'Mengakses insight AI-powered'
          ],
          limitations: [
            'Tidak dapat melihat detail data nasabah perorangan',
            'Data sensitif (NIK, rekening) disamarkan'
          ],
          tips: [
            'Periksa dashboard di pagi hari untuk overview harian',
            'Focus pada trend, bukan angka individual'
          ]
        },
        {
          id: 'dir_performance',
          title: 'Analisis Performa',
          description: 'Perbandingan performa tim, papan peringkat RM, dan analisis per cabang.',
          icon: '🏆',
          tab: 'dir_performance',
          steps: [
            'Lihat Top Performers di bagian podium',
            'Sort table berdasarkan Revenue, Target, atau Win Rate',
            'Filter berdasarkan cabang untuk analisis spesifik'
          ],
          permissions: [
            'Melihat leaderboard performa seluruh RM',
            'Membandingkan performa antar cabang',
            'Mengakses tren pertumbuhan tim'
          ]
        },
        {
          id: 'dir_insights',
          title: 'Insight Bisnis',
          description: 'Rekomendasi strategis berbasis AI dan analisis tren pasar.',
          icon: '💡',
          tab: 'dir_insights',
          isNew: true,
          steps: [
            'Review rekomendasi dengan prioritas TINGGI terlebih dahulu',
            'Lihat dampak revenue potensial untuk setiap rekomendasi',
            'Pantau market trends untuk peluang bisnis'
          ],
          permissions: [
            'Melihat rekomendasi strategis AI',
            'Mengakses analisis tren pasar'
          ],
          tips: [
            'Rekomendasi dengan effort "Rendah" dan impact tinggi adalah quick wins',
            'Gunakan insight untuk briefing tim leadership'
          ]
        }
      ]
    }
  ],
  quickTips: [
    'Dashboard Eksekutif memberikan overview singkat - ideal untuk morning briefing',
    'Gunakan Insight Bisnis untuk ide strategic initiative',
    'Data selalu agregat untuk menjaga privasi nasabah'
  ]
};

// SUPERVISOR Guide
export const supervisorGuide: RoleGuideData = {
  role: 'SUPERVISOR',
  title: 'Supervisor',
  description: 'Sebagai Supervisor, Anda mengawasi tim layanan dan memastikan keluhan nasabah tertangani dengan baik. Fokus utama: monitoring tim dan eskalasi masalah.',
  icon: '👩‍💼',
  categories: [
    {
      id: 'team',
      title: 'Manajemen Tim',
      icon: '👥',
      features: [
        {
          id: 'sup_overview',
          title: 'Gambaran Tim',
          description: 'Status real-time anggota tim: siapa yang online, sibuk, istirahat, atau offline.',
          icon: '👥',
          tab: 'sup_overview',
          isPopular: true,
          steps: [
            'Lihat status tim di bagian atas (Online, Istirahat, Offline)',
            'Periksa Priority Alerts untuk masalah kritis',
            'Klik kartu member untuk detail aktivitas',
            'Gunakan tombol Chat/Lihat untuk interaksi'
          ],
          permissions: [
            'Melihat status real-time semua anggota tim',
            'Memantau tugas aktif dan metrik kinerja',
            'Mengakses activity timeline'
          ],
          tips: [
            'Perhatikan member dengan alert "SLA berisiko"',
            'Redistribute tugas jika ada member overwhelmed'
          ]
        },
        {
          id: 'sup_escalations',
          title: 'Antrian Eskalasi',
          description: 'Masalah kritis yang memerlukan intervensi supervisor: keluhan VIP, SLA terlambat, dll.',
          icon: '🚨',
          tab: 'sup_escalations',
          isPopular: true,
          steps: [
            'Filter berdasarkan prioritas (Kritis, Tinggi, Sedang)',
            'Baca detail customer dan alasan eskalasi',
            'Klik "Ambil Alih" untuk handle langsung',
            'Gunakan "Alihkan" untuk assign ke agent lain',
            'Isi catatan resolusi sebelum menutup'
          ],
          permissions: [
            'Mengambil alih eskalasi',
            'Realokasi tugas ke agent lain',
            'Eskalasi lebih lanjut ke Direktur',
            'Menutup eskalasi dengan catatan'
          ],
          tips: [
            'Prioritaskan eskalasi KRITIS - ada timer berjalan',
            'Lihat dampak revenue untuk prioritas keputusan',
            'VIP issues selalu highest priority'
          ]
        }
      ]
    },
    {
      id: 'data',
      title: 'Akses Data',
      icon: '📊',
      features: [
        {
          id: 'dashboard',
          title: 'Dashboard RFM',
          description: 'Analisis segmentasi nasabah berdasarkan perilaku (RFM Analysis).',
          icon: '📊',
          tab: 'dashboard',
          steps: [
            'Lihat distribusi segment di chart',
            'Klik segment untuk filter daftar nasabah'
          ],
          permissions: [
            'Melihat dashboard segmentasi (scope cabang)'
          ]
        },
        {
          id: 'customers',
          title: 'Daftar Nasabah',
          description: 'Daftar nasabah dengan profil dan riwayat interaksi.',
          icon: '👤',
          tab: 'customers',
          steps: [
            'Gunakan search untuk cari nasabah',
            'Klik row untuk lihat Customer 360',
            'Filter berdasarkan segment atau status'
          ],
          permissions: [
            'Melihat daftar nasabah (scope cabang)',
            'Mengakses profil Customer 360'
          ],
          limitations: [
            'Data terbatas pada cabang Anda',
            'Data sensitif mungkin disamarkan'
          ]
        }
      ]
    }
  ],
  quickTips: [
    'Cek Antrian Eskalasi setiap pagi dan setelah makan siang',
    'Pantau member dengan SLA alert sebelum terlambat',
    'Redistribute workload secara proaktif'
  ]
};

// CS/AGENT Guide
export const csGuide: RoleGuideData = {
  role: 'CS',
  title: 'Customer Service',
  description: 'Sebagai CS Agent, Anda adalah garis depan layanan nasabah. Fokus utama: menangani keluhan dan memberikan pengalaman terbaik.',
  icon: '👨‍💻',
  categories: [
    {
      id: 'service',
      title: 'Layanan Nasabah',
      icon: '🎧',
      features: [
        {
          id: 'tickets',
          title: 'Tiket & Keluhan',
          description: 'Antrian tiket masuk, keluhan aktif, dan eskalasi yang perlu ditangani.',
          icon: '📋',
          tab: 'tickets',
          isPopular: true,
          steps: [
            'Lihat antrian tiket di tab utama',
            'Klik tiket untuk lihat detail dan riwayat',
            'Update status: Open → In Progress → Resolved',
            'Isi final response sebelum menutup tiket',
            'Eskalasi ke Supervisor jika diperlukan'
          ],
          permissions: [
            'Membuat tiket baru dari keluhan nasabah',
            'Update status dan catatan tiket',
            'Memberikan final response',
            'Menutup tiket setelah resolved'
          ],
          tips: [
            'Selalu isi final response yang jelas dan lengkap',
            'Cek Knowledge Base untuk jawaban standar',
            'Eskalasi proaktif jika SLA hampir habis'
          ]
        },
        {
          id: 'kb',
          title: 'Knowledge Base',
          description: 'Kumpulan artikel bantuan, FAQ, dan panduan penyelesaian masalah.',
          icon: '📚',
          tab: 'kb',
          steps: [
            'Gunakan search untuk cari artikel relevan',
            'Filter berdasarkan kategori masalah',
            'Copy template jawaban untuk response cepat'
          ],
          permissions: [
            'Membaca semua artikel Knowledge Base',
            'Menggunakan template jawaban'
          ],
          tips: [
            'Bookmark artikel yang sering digunakan',
            'Laporkan artikel yang outdated ke Supervisor'
          ]
        }
      ]
    },
    {
      id: 'performance',
      title: 'Performa Saya',
      icon: '📈',
      features: [
        {
          id: 'performance',
          title: 'Metrik Personal',
          description: 'Statistik performa Anda: tiket diselesaikan, CSAT score, response time.',
          icon: '📊',
          tab: 'performance',
          steps: [
            'Lihat ringkasan harian di bagian atas',
            'Pantau trend CSAT mingguan',
            'Bandingkan dengan target tim'
          ],
          permissions: [
            'Melihat metrik performa personal'
          ],
          tips: [
            'Target CSAT di atas 85% untuk rating excellent',
            'Response time cepat = customer satisfaction tinggi'
          ]
        }
      ]
    }
  ],
  quickTips: [
    'Prioritaskan tiket dengan SLA hampir habis',
    'Selalu sapa dengan ramah dan profesional',
    'Gunakan Knowledge Base untuk jawaban konsisten',
    'Jangan tutup tiket tanpa final response'
  ]
};

// RM Guide
export const rmGuide: RoleGuideData = {
  role: 'RM',
  title: 'Relationship Manager',
  description: 'Sebagai RM, Anda merawat hubungan dengan nasabah portofolio dan mengelola pipeline penjualan. Fokus utama: akuisisi dan cross-sell.',
  icon: '💼',
  categories: [
    {
      id: 'sales',
      title: 'Sales & Pipeline',
      icon: '💰',
      features: [
        {
          id: 'rm_performance',
          title: 'Dashboard RM',
          description: 'Overview target, pipeline, dan performa penjualan Anda.',
          icon: '🎯',
          tab: 'rm_performance',
          isPopular: true,
          steps: [
            'Lihat progress target bulanan di bagian atas',
            'Pantau pipeline value dan deal status',
            'Review hot leads untuk follow-up'
          ],
          permissions: [
            'Melihat dashboard sales personal',
            'Mengakses pipeline summary'
          ],
          tips: [
            'Focus pada deals dengan probability tinggi menjelang akhir bulan',
            'Pantau NBA (Next Best Action) untuk peluang cross-sell'
          ]
        },
        {
          id: 'rm_leads',
          title: 'Lead Board',
          description: 'Kanban board untuk mengelola prospek dari New sampai Won/Lost.',
          icon: '📌',
          tab: 'rm_leads',
          isPopular: true,
          steps: [
            'Lihat leads dalam format Kanban',
            'Drag-drop untuk update stage: New → Contacted → Qualified → Proposal → Won',
            'Klik lead untuk detail dan history',
            'Tambah aktivitas setiap interaksi'
          ],
          permissions: [
            'Membuat lead baru',
            'Update stage dan status lead',
            'Mencatat aktivitas (call, visit, email)'
          ],
          tips: [
            'Update stage segera setelah interaksi',
            'Leads di stage "CONTACTED" lebih dari 7 hari perlu follow-up'
          ]
        },
        {
          id: 'rm_pipeline',
          title: 'Pipeline Kredit',
          description: 'Status pengajuan kredit nasabah: KPR, KUR, Kredit Multiguna.',
          icon: '📑',
          tab: 'rm_pipeline',
          steps: [
            'Lihat progress semua pengajuan kredit',
            'Filter berdasarkan jenis produk',
            'Pantau bottleneck di stage approval'
          ],
          permissions: [
            'Melihat status pengajuan kredit portofolio',
            'Tracking progress approval'
          ]
        }
      ]
    },
    {
      id: 'customers',
      title: 'Nasabah',
      icon: '👥',
      features: [
        {
          id: 'rm_portfolio',
          title: 'Portfolio Saya',
          description: 'Daftar nasabah yang di-assign ke Anda dengan profil lengkap.',
          icon: '👤',
          tab: 'rm_portfolio',
          steps: [
            'Lihat daftar nasabah portofolio Anda',
            'Sort berdasarkan AUM, segment, atau last contact',
            'Klik untuk lihat Customer 360'
          ],
          permissions: [
            'Melihat detail nasabah yang di-assign',
            'Mengakses Customer 360 View',
            'Mencatat aktivitas interaksi'
          ],
          limitations: [
            'Hanya nasabah yang di-assign ke Anda',
            'Tidak dapat melihat nasabah RM lain'
          ],
          tips: [
            'Contact regularly nasabah Champions',
            'Perhatikan nasabah At Risk untuk retensi'
          ]
        },
        {
          id: 'rm_activity',
          title: 'Log Aktivitas',
          description: 'Riwayat semua interaksi dengan nasabah: call, visit, meeting, email.',
          icon: '📝',
          tab: 'rm_activity',
          steps: [
            'Lihat timeline aktivitas terbaru',
            'Filter berdasarkan tipe aktivitas',
            'Klik untuk detail notes'
          ],
          permissions: [
            'Melihat log aktivitas sendiri',
            'Menambah catatan baru'
          ]
        }
      ]
    }
  ],
  quickTips: [
    'Update Lead Board setelah setiap interaksi',
    'Focus pada Hot Leads (probability > 70%)',
    'Gunakan NBA untuk personalized recommendation',
    'Contact Champions minimal 1x/bulan'
  ]
};

// MARKETING Guide
export const marketingGuide: RoleGuideData = {
  role: 'MARKETING',
  title: 'Marketing',
  description: 'Sebagai Marketing, Anda membuat dan mengelola kampanye pemasaran. Fokus utama: targeted marketing dengan consent compliance.',
  icon: '📢',
  categories: [
    {
      id: 'campaigns',
      title: 'Kampanye',
      icon: '📣',
      features: [
        {
          id: 'mkt_overview',
          title: 'Overview Marketing',
          description: 'Ringkasan kampanye aktif, performa, dan key metrics.',
          icon: '📊',
          tab: 'mkt_overview',
          isPopular: true,
          steps: [
            'Lihat ringkasan campaign performance',
            'Pantau active campaigns dan status',
            'Review conversion metrics'
          ],
          permissions: [
            'Melihat dashboard marketing',
            'Mengakses analytics kampanye'
          ]
        },
        {
          id: 'mkt_campaigns',
          title: 'Kelola Kampanye',
          description: 'Buat, edit, dan monitor kampanye pemasaran (Email, SMS, WhatsApp).',
          icon: '✉️',
          tab: 'mkt_campaigns',
          isPopular: true,
          steps: [
            'Klik "Buat Kampanye" untuk campaign baru',
            'Pilih segment target',
            'Sistem otomatis filter nasabah ELIGIBLE',
            'Review daftar dengan alasan ineligible',
            'Submit untuk approval → Execute'
          ],
          permissions: [
            'Membuat draft kampanye baru',
            'Mengedit kampanye (sebelum approved)',
            'Melihat eligibility list',
            'Execute kampanye yang approved'
          ],
          limitations: [
            'Tidak dapat mengubah consent nasabah',
            'Nasabah dengan consent WITHDRAWN otomatis ineligible'
          ],
          tips: [
            'Cek eligibility count sebelum finalize target',
            'Personalize pesan berdasarkan segment'
          ]
        }
      ]
    },
    {
      id: 'targeting',
      title: 'Targeting',
      icon: '🎯',
      features: [
        {
          id: 'mkt_segments',
          title: 'Segmen Nasabah',
          description: 'Kelola pengelompokan nasabah berdasarkan kriteria (RFM, produk, demografi).',
          icon: '👥',
          tab: 'mkt_segments',
          steps: [
            'Lihat segment yang tersedia',
            'Buat segment baru dengan rules',
            'Preview jumlah nasabah per segment'
          ],
          permissions: [
            'Melihat semua segment',
            'Membuat segment rules baru',
            'Mengedit segment criteria'
          ]
        },
        {
          id: 'mkt_content',
          title: 'Konten & Template',
          description: 'Kelola template pesan untuk kampanye.',
          icon: '📝',
          tab: 'mkt_content',
          steps: [
            'Browse template yang tersedia',
            'Buat template baru',
            'Gunakan personalization variables'
          ],
          permissions: [
            'Membuat dan mengedit template'
          ]
        }
      ]
    }
  ],
  quickTips: [
    'Selalu cek jumlah ELIGIBLE sebelum campaign',
    'Nasabah dengan keluhan aktif = ineligible',
    'Personalize pesan untuk conversion lebih tinggi',
    'A/B test subject line untuk email campaigns'
  ]
};

// COMPLIANCE Guide
export const complianceGuide: RoleGuideData = {
  role: 'VIEWER',
  title: 'Compliance',
  description: 'Sebagai Compliance, Anda memastikan semua aktivitas sesuai regulasi. Fokus utama: audit trail dan consent monitoring.',
  icon: '🔒',
  categories: [
    {
      id: 'audit',
      title: 'Audit & Monitoring',
      icon: '📋',
      features: [
        {
          id: 'audit_log',
          title: 'Audit Log Viewer',
          description: 'Lihat jejak semua aktivitas: siapa, kapan, apa yang dilakukan.',
          icon: '📜',
          isPopular: true,
          steps: [
            'Filter berdasarkan tanggal, user, atau event type',
            'Cari aktivitas spesifik dengan search',
            'Export log untuk keperluan laporan'
          ],
          permissions: [
            'Melihat semua audit log',
            'Filter dan search log',
            'Export ke JSON/CSV'
          ],
          tips: [
            'Gunakan filter date range untuk investigasi spesifik',
            'Pantau event CHANGE_CONSENT secara berkala'
          ]
        },
        {
          id: 'consent_report',
          title: 'Laporan Consent',
          description: 'Status persetujuan marketing nasabah sesuai UU PDP.',
          icon: '✅',
          steps: [
            'Lihat ringkasan consent GRANTED vs WITHDRAWN',
            'Drill-down ke perubahan consent terbaru',
            'Export untuk pelaporan OJK'
          ],
          permissions: [
            'Melihat statistik consent',
            'Export laporan kepatuhan'
          ]
        }
      ]
    }
  ],
  quickTips: [
    'Review audit log mingguan untuk anomali',
    'Perhatikan perubahan consent yang tidak wajar',
    'Simpan export log untuk dokumentasi audit'
  ]
};

// ADMIN Guide  
export const adminGuide: RoleGuideData = {
  role: 'ADMIN',
  title: 'Administrator',
  description: 'Sebagai Admin, Anda mengkonfigurasi sistem dan mengelola pengaturan. Fokus utama: maintenance dan konfigurasi.',
  icon: '⚙️',
  categories: [
    {
      id: 'analytics',
      title: 'Analytics',
      icon: '📊',
      features: [
        {
          id: 'dashboard',
          title: 'Dashboard RFM',
          description: 'Analisis lengkap segmentasi nasabah dengan akses penuh.',
          icon: '📈',
          tab: 'dashboard',
          isPopular: true,
          steps: [
            'Lihat distribusi segment keseluruhan',
            'Analyze trend bulanan',
            'Drill-down per cabang'
          ],
          permissions: [
            'Akses penuh ke semua data analitik',
            'Melihat data seluruh cabang'
          ]
        },
        {
          id: 'customers',
          title: 'Daftar Nasabah',
          description: 'Akses penuh ke database nasabah.',
          icon: '👤',
          tab: 'customers',
          permissions: [
            'Melihat semua data nasabah',
            'Akses data tanpa masking (untuk troubleshooting)'
          ]
        }
      ]
    },
    {
      id: 'config',
      title: 'Konfigurasi',
      icon: '⚙️',
      features: [
        {
          id: 'settings',
          title: 'Konfigurasi RFM',
          description: 'Atur threshold dan bobot untuk segmentasi RFM.',
          icon: '🔧',
          tab: 'settings',
          isPopular: true,
          steps: [
            'Atur threshold untuk Recency, Frequency, Monetary',
            'Adjust bobot sesuai prioritas bisnis',
            'Preview dampak perubahan sebelum save'
          ],
          permissions: [
            'Mengubah konfigurasi RFM',
            'Mengedit SLA rules',
            'Konfigurasi sistem lainnya'
          ],
          tips: [
            'Test konfigurasi di staging sebelum production',
            'Dokumentasikan setiap perubahan konfigurasi'
          ]
        }
      ]
    }
  ],
  quickTips: [
    'Backup konfigurasi sebelum perubahan besar',
    'Test perubahan di environment staging',
    'Dokumentasikan semua perubahan untuk audit'
  ]
};

// Get guide by role
export const getGuideByRole = (role: UserRole): RoleGuideData => {
  switch (role) {
    case 'DIRECTOR': return directorGuide;
    case 'SUPERVISOR': return supervisorGuide;
    case 'CS': return csGuide;
    case 'RM': return rmGuide;
    case 'MARKETING': return marketingGuide;
    case 'VIEWER': return complianceGuide;
    case 'ADMIN': return adminGuide;
    default: return adminGuide;
  }
};
