import React, { useState, useMemo } from 'react';
import { Search, BookOpen, ChevronDown, ChevronUp, Copy, Send, ThumbsUp, Eye, AlertCircle } from 'lucide-react';
import type { KnowledgeArticle } from '../../types';

interface KnowledgeBaseProps {
  className?: string;
}

/**
 * Default knowledge base articles for common banking issues
 */
export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-001',
    title: 'Reset Password Mobile Banking',
    icon: '🔐',
    category: 'PASSWORD',
    steps: [
      'Buka aplikasi Mobile Banking Bank Sumut',
      'Klik tombol "Lupa Password" di halaman login',
      'Masukkan nomor rekening dan tanggal lahir nasabah',
      'Verifikasi dengan OTP yang dikirim ke nomor HP terdaftar',
      'Buat password baru (min. 8 karakter, kombinasi huruf & angka)',
      'Nasabah dapat login kembali dengan password baru'
    ],
    escalationPath: 'Jika OTP tidak terkirim setelah 3x percobaan, eskalasi ke Supervisor untuk reset manual',
    relatedIssues: ['OTP tidak diterima', 'Nomor HP berubah', 'Akun terkunci'],
    views: 1234,
    helpfulness: 95
  },
  {
    id: 'kb-002',
    title: 'Kartu ATM Terblokir (Salah PIN 3x)',
    icon: '💳',
    category: 'CARD',
    steps: [
      'Konfirmasi dengan nasabah bahwa kartu terblokir karena salah PIN 3x',
      'Minta nasabah datang ke cabang terdekat dengan membawa KTP asli',
      'Di cabang: reset PIN melalui CS dengan verifikasi identitas',
      'Nasabah diminta membuat PIN baru 6 digit',
      'Kartu dapat langsung digunakan setelah reset'
    ],
    escalationPath: 'Untuk kartu Priority/Premium, dapat request reset melalui video call dengan Supervisor',
    relatedIssues: ['PIN terblokir', 'Lupa PIN ATM'],
    views: 892,
    helpfulness: 88
  },
  {
    id: 'kb-003',
    title: 'Kartu ATM Hilang/Dicuri',
    icon: '🚫',
    category: 'CARD',
    steps: [
      'SEGERA blokir kartu melalui sistem (Aksi > Blokir Kartu)',
      'Konfirmasi nama lengkap, tanggal lahir, dan nomor rekening nasabah',
      'Catat tanggal dan perkiraan lokasi kehilangan',
      'Informasikan nasabah untuk membuat laporan kehilangan di kepolisian (jika dicuri)',
      'Arahkan nasabah ke cabang terdekat dengan membawa KTP + Surat Kehilangan (jika ada)',
      'Biaya penggantian kartu: Rp 10.000 (ATM reguler) / Rp 25.000 (ATM chip)'
    ],
    escalationPath: 'Jika ada transaksi mencurigakan setelah kehilangan, eskalasi ke Tim Fraud Prevention',
    relatedIssues: ['Transaksi tidak dikenal', 'Saldo berkurang'],
    views: 654,
    helpfulness: 92
  },
  {
    id: 'kb-004',
    title: 'Transfer Gagal tapi Saldo Terpotong',
    icon: '💸',
    category: 'TRANSFER',
    steps: [
      'Minta nasabah untuk menunggu 1-2 jam (pending clearing)',
      'Cek status transaksi di sistem dengan nomor referensi',
      'Jika status PENDING: informasikan akan otomatis reversal dalam 1x24 jam',
      'Jika status SUCCESS di sistem tapi belum masuk tujuan: cek dengan bank penerima',
      'Jika status FAILED dengan saldo terpotong: proses reversal manual (SLA 3 hari kerja)',
      'Berikan nomor tiket/referensi ke nasabah untuk tracking'
    ],
    escalationPath: 'Untuk nominal >Rp 50 juta, eskalasi ke Supervisor untuk percepatan proses',
    relatedIssues: ['Double debit', 'Transaksi gantung', 'Saldo tidak sesuai'],
    views: 1567,
    helpfulness: 85
  },
  {
    id: 'kb-005',
    title: 'OTP Tidak Masuk ke HP',
    icon: '📱',
    category: 'MOBILE_BANKING',
    steps: [
      'Pastikan nomor HP yang terdaftar masih aktif dan sinyal stabil',
      'Minta nasabah cek folder SMS spam/blocked',
      'Tunggu 2-3 menit, lalu request ulang OTP',
      'Jika tetap tidak masuk: verifikasi nomor HP di sistem (mungkin salah input)',
      'Jika nomor HP sudah benar: cek status layanan SMS gateway (mungkin gangguan)',
      'Alternatif: gunakan fitur "OTP via WhatsApp" jika tersedia'
    ],
    escalationPath: 'Jika SMS gateway down, informasikan estimasi waktu recovery dari Tim IT',
    relatedIssues: ['Nomor HP berubah', 'Verifikasi gagal'],
    views: 2103,
    helpfulness: 78
  },
  {
    id: 'kb-006',
    title: 'Update Nomor HP Terdaftar',
    icon: '📞',
    category: 'ACCOUNT',
    steps: [
      'Nasabah WAJIB datang ke cabang (tidak bisa via telepon/online)',
      'Dokumen yang diperlukan: KTP asli + Buku Tabungan',
      'CS cabang akan verifikasi identitas dan update data',
      'Setelah update, nasabah perlu aktivasi ulang Mobile Banking',
      'OTP akan dikirim ke nomor HP baru'
    ],
    escalationPath: 'Untuk nasabah Priority, dapat request kunjungan RM untuk update data di tempat',
    relatedIssues: ['Ganti email', 'Update data KTP'],
    views: 876,
    helpfulness: 90
  },
  {
    id: 'kb-007',
    title: 'Keluhan Biaya Admin Bulanan',
    icon: '💰',
    category: 'OTHER',
    steps: [
      'Jelaskan struktur biaya admin sesuai jenis rekening nasabah',
      'Tabungan Reguler: Rp 5.000/bulan',
      'Tabungan Simpeda: Rp 2.500/bulan (khusus PNS Pemda)',
      'Tabungan Martabe: FREE admin (saldo min. Rp 10 juta)',
      'Jika nasabah keberatan: tawarkan upgrade ke rekening dengan benefit lebih'
    ],
    relatedIssues: ['Potongan tidak jelas', 'Mutasi rekening'],
    views: 432,
    helpfulness: 72
  },
  {
    id: 'kb-008',
    title: 'Buka Rekening Baru - Persyaratan',
    icon: '📝',
    category: 'ACCOUNT',
    steps: [
      'Persyaratan Umum:',
      '• KTP asli + fotocopy',
      '• NPWP (untuk setoran awal >Rp 50 juta)',
      '• Setoran awal minimum sesuai jenis rekening',
      'Setoran Awal:',
      '• Tabungan Reguler: Rp 50.000',
      '• Tabungan Martabe: Rp 100.000',
      '• Deposito: min. Rp 1.000.000',
      'Nasabah dapat datang ke cabang terdekat pada jam kerja (08.00-15.00)'
    ],
    relatedIssues: ['Buka rekening online', 'Rekening anak'],
    views: 1245,
    helpfulness: 94
  }
];

/**
 * Knowledge Base Component for CS Self-Service
 */
export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  
  // Filter articles
  const filteredArticles = useMemo(() => {
    let result = KNOWLEDGE_ARTICLES;
    
    // Category filter
    if (categoryFilter !== 'ALL') {
      result = result.filter(a => a.category === categoryFilter);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.steps.some(s => s.toLowerCase().includes(query)) ||
        a.relatedIssues?.some(i => i.toLowerCase().includes(query))
      );
    }
    
    // Sort by views (most popular first)
    return result.sort((a, b) => b.views - a.views);
  }, [searchQuery, categoryFilter]);
  
  const categories = [
    { key: 'ALL', label: 'Semua', icon: '📚' },
    { key: 'PASSWORD', label: 'Password', icon: '🔐' },
    { key: 'CARD', label: 'Kartu ATM', icon: '💳' },
    { key: 'TRANSFER', label: 'Transfer', icon: '💸' },
    { key: 'MOBILE_BANKING', label: 'M-Banking', icon: '📱' },
    { key: 'ACCOUNT', label: 'Rekening', icon: '🏦' },
    { key: 'OTHER', label: 'Lainnya', icon: '📋' }
  ];
  
  const copySteps = (article: KnowledgeArticle) => {
    const text = `${article.title}\n\n${article.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    alert('✅ Langkah-langkah berhasil di-copy!');
  };
  
  const toggleExpand = (articleId: string) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
  };
  
  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-4 rounded-t-xl">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen size={28} />
          <div>
            <h2 className="text-xl font-bold">Panduan Bantuan</h2>
            <p className="text-white/80 text-sm">Temukan solusi cepat untuk masalah umum nasabah</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-200" />
          <input
            type="text"
            placeholder="Cari solusi... (contoh: reset password, kartu terblokir)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent"
          />
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="flex-shrink-0 p-3 bg-gray-50 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                categoryFilter === cat.key
                  ? 'bg-teal-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Articles List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Tidak ada artikel yang cocok</p>
            <p className="text-gray-400 text-sm">Coba kata kunci lain</p>
          </div>
        ) : (
          filteredArticles.map(article => (
            <div 
              key={article.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              {/* Article Header */}
              <div 
                className="p-4 cursor-pointer"
                onClick={() => toggleExpand(article.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{article.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{article.title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {article.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={12} />
                        {article.helpfulness}% helpful
                      </span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition">
                    {expandedArticle === article.id ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Expanded Content */}
              {expandedArticle === article.id && (
                <div className="border-t border-gray-100">
                  {/* Steps */}
                  <div className="p-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-700 mb-3">📋 Langkah Penyelesaian:</h4>
                    <ol className="space-y-2">
                      {article.steps.map((step, index) => (
                        <li key={index} className="flex gap-2 text-sm text-gray-700">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  {/* Escalation Path */}
                  {article.escalationPath && (
                    <div className="p-4 bg-amber-50 border-t border-amber-100">
                      <div className="flex items-start gap-2">
                        <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-amber-700 text-sm">⚠️ Eskalasi</h4>
                          <p className="text-sm text-amber-800">{article.escalationPath}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Related Issues */}
                  {article.relatedIssues && article.relatedIssues.length > 0 && (
                    <div className="p-4 bg-blue-50 border-t border-blue-100">
                      <h4 className="font-semibold text-blue-700 text-sm mb-2">🔗 Masalah Terkait:</h4>
                      <div className="flex flex-wrap gap-1">
                        {article.relatedIssues.map((issue, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full cursor-pointer hover:bg-blue-200 transition"
                            onClick={() => setSearchQuery(issue)}
                          >
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="p-4 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => copySteps(article)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                      <Copy size={16} />
                      Copy Langkah
                    </button>
                    <button
                      onClick={() => alert(`📧 Template email dikirim ke nasabah`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition"
                    >
                      <Send size={16} />
                      Kirim ke Nasabah
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
