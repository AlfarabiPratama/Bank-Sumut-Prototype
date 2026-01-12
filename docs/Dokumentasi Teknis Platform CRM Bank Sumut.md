# Dokumentasi Teknis: Platform CRM Bank Sumut

> [!IMPORTANT]
> **Document Type: Technical Vision Document**  
> Dokumen ini menjelaskan **target arsitektur dan fitur lengkap** platform CRM Bank Sumut. Untuk status implementasi aktual, lihat [CURRENT_STATE.md](./CURRENT_STATE.md). Untuk roadmap pengembangan, lihat [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md).

---

# Pendahuluan

## 1.1. Latar Belakang Proyek

Proyek ini adalah **Proof of Concept (PoC) Platform CRM Analitis** untuk Bank Sumut yang dirancang untuk mendemonstrasikan kapabilitas Customer Relationship Management terintegrasi. Platform ini dibangun sebagai fondasi untuk transformasi digital Bank Sumut dalam menghadapi persaingan dari bank-bank digital inovatif seperti Livin' by Mandiri dan BRImo.

Berbeda dengan implementasi CRM tradisional yang hanya berfokus pada satu aspek operasional, platform ini mengintegrasikan **tiga pilar operasional bank** (Marketing, Sales, dan Service) dalam satu arsitektur terpadu dengan **Customer 360 View** sebagai fondasinya.

## 1.2. Tujuan Proyek

Platform CRM Bank Sumut dirancang untuk mencapai empat tujuan utama:

1. **Customer 360 Lite** — Pandangan nasabah terpadu dengan profil, timeline, dan alerts ✅ *Implemented*
2. **Case/Complaint Management End-to-End** — Penanganan keluhan dengan SLA dan guardrail final response ⏳ *Planned Phase 4*
3. **Consent-aware Marketing** — Campaign dengan persetujuan nasabah dan eligibility reason ✅ *Partially Implemented*
4. **Audit Trail** — Jejak audit untuk aksi penting sesuai regulasi ✅ *Implemented (UI Level)*

---



# Panduan Pengguna: Apa yang Bisa Dilakukan di Platform Ini?

Bagian ini menjelaskan fitur-fitur platform dalam bahasa yang mudah dipahami, termasuk apa yang bisa diakses oleh setiap peran (role) pengguna.

---

## Sekilas Tentang Platform

Platform CRM Bank Sumut adalah **satu aplikasi terpadu** yang membantu berbagai tim di bank untuk:

- 🔍 **Mengenal nasabah lebih dekat** — Lihat profil lengkap, riwayat interaksi, dan preferensi nasabah dalam satu layar
- 📋 **Menangani keluhan dengan baik** — Catat, lacak, dan selesaikan keluhan nasabah dengan standar waktu (SLA) yang jelas
- 📊 **Memahami nilai nasabah** — Ketahui siapa nasabah terbaik dan siapa yang perlu perhatian khusus
- 📢 **Memasarkan produk dengan tepat** — Kirim penawaran hanya ke nasabah yang berhak dan setuju menerima
- 📝 **Mencatat aktivitas sales** — Lacak progress penjualan dari awal sampai closing

---

## Fitur Berdasarkan Peran Pengguna

### 👔 Direktur (DIRECTOR)

**Fokus utama:** Melihat gambaran besar kinerja bank

| Fitur | Penjelasan |
|-------|------------|
| **Dashboard Ringkasan** | Lihat statistik keluhan, jumlah nasabah, dan performa tim dalam angka agregat |
| **Tren SLA** | Pantau apakah keluhan diselesaikan tepat waktu |
| **Distribusi Nilai Nasabah** | Lihat berapa banyak nasabah Champion, Loyal, At Risk, dll. |

**Yang TIDAK bisa dilakukan:**
- ❌ Melihat detail data nasabah perorangan (untuk privasi)
- ❌ Mengubah data apapun

---

### 👩‍💼 Supervisor Layanan (SUPERVISOR)

**Fokus utama:** Mengawasi tim dan memastikan keluhan tertangani

| Fitur | Penjelasan |
|-------|------------|
| **Antrian Keluhan** | Lihat semua keluhan yang masuk ke cabang |
| **Assign/Escalate** | Tugaskan keluhan ke agent atau eskalasi ke level lebih tinggi |
| **Monitor SLA** | Pantau mana keluhan yang hampir melewati batas waktu |
| **Profil Nasabah** | Lihat ringkasan nasabah (data sensitif disamarkan) |

**Contoh penggunaan sehari-hari:**
1. Pagi hari, buka Dashboard untuk lihat berapa keluhan baru
2. Assign keluhan ke agent yang sedang tidak sibuk
3. Pantau keluhan yang SLA-nya hampir habis, escalate jika perlu

---

### 👨‍💻 Agent/CS (AGENT)

**Fokus utama:** Melayani nasabah dan menyelesaikan keluhan

| Fitur | Penjelasan |
|-------|------------|
| **Cari Nasabah** | Cari dengan nama, CIF, atau nomor HP |
| **Customer 360** | Lihat profil lengkap: identitas, riwayat interaksi, status consent |
| **Buat Keluhan** | Catat keluhan baru dengan kategori dan prioritas |
| **Update & Tutup Keluhan** | Tambah catatan, berikan tanggapan akhir, tutup keluhan |

**Contoh alur kerja:**
1. Nasabah datang dengan keluhan → Cari nama nasabah
2. Klik profil → Lihat riwayat apakah pernah ada keluhan serupa
3. Buat keluhan baru → Sistem otomatis hitung deadline (SLA)
4. Setelah selesai investigasi → Isi tanggapan akhir → Tutup keluhan

---

### 💼 Relationship Manager (RM)

**Fokus utama:** Merawat hubungan dengan nasabah portofolio dan closing penjualan

| Fitur | Penjelasan |
|-------|------------|
| **Portfolio Saya** | Hanya lihat nasabah yang ditugaskan ke Anda |
| **Lead Board** | Lihat dan kelola prospek dalam bentuk kanban |
| **Catat Aktivitas** | Log aktivitas: Telepon, Visit, Meeting, Email |
| **Saran Aksi (NBA)** | Sistem memberikan rekomendasi: siapa yang perlu dihubungi |

**Contoh alur kerja:**
1. Buka Lead Board → Lihat prospek status "NEW"
2. Telepon nasabah → Catat aktivitas "CALL"
3. Jika tertarik → Pindah status ke "CONTACTED" → "QUALIFIED" → "PROPOSAL"
4. Closing berhasil → Tandai "WON"

---

### 📢 Marketing (MARKETING)

**Fokus utama:** Membuat dan mengelola kampanye pemasaran

| Fitur | Penjelasan |
|-------|------------|
| **Buat Segment** | Kelompokkan nasabah berdasarkan kriteria (contoh: segment Priority) |
| **Buat Campaign** | Buat kampanye Email, SMS, atau WhatsApp |
| **Cek Eligibility** | Sistem otomatis cek siapa yang boleh dikirim kampanye |
| **Lihat Hasil** | Pantau status kampanye: Draft, Approved, Executed |

**Aturan penting:**
- ⚠️ Nasabah yang **belum setuju (consent WITHDRAWN)** → Tidak boleh dikirim kampanye
- ⚠️ Nasabah yang **punya keluhan aktif** → Tidak boleh dikirim kampanye
- ⚠️ Marketing **tidak bisa mengubah status consent** (untuk mencegah konflik kepentingan)

---

### 🔒 Compliance (COMPLIANCE)

**Fokus utama:** Memastikan semua aktivitas sesuai aturan

| Fitur | Penjelasan |
|-------|------------|
| **Audit Log Viewer** | Lihat semua jejak aktivitas: siapa melakukan apa, kapan |
| **Filter & Search** | Cari berdasarkan jenis event, user, atau tanggal |
| **Export Data** | Download audit log untuk keperluan laporan |

**Yang bisa dipantau:**
- Siapa saja yang mengakses profil nasabah?
- Kapan dan oleh siapa keluhan ditutup?
- Apakah ada perubahan consent yang mencurigakan?

---

### ⚙️ Admin Sistem (ADMIN)

**Fokus utama:** Konfigurasi sistem dan pengaturan

| Fitur | Penjelasan |
|-------|------------|
| **Kelola Role** | Atur siapa punya akses apa |
| **Konfigurasi SLA** | Atur batas waktu penyelesaian per kategori keluhan |
| **Kelola Kategori** | Tambah atau edit kategori keluhan |

---

## Memahami Nilai Nasabah: Apa itu RFM?

RFM adalah cara sederhana untuk menilai "seberapa berharga" seorang nasabah berdasarkan tiga hal:

| Huruf | Singkatan dari | Artinya |
|-------|----------------|---------|
| **R** | Recency | Kapan terakhir kali nasabah ini bertransaksi? |
| **F** | Frequency | Seberapa sering nasabah ini bertransaksi? |
| **M** | Monetary | Berapa nilai uang yang dikelola nasabah ini? |

### Kenapa RFM Penting?

Dengan mengetahui skor RFM, bank bisa:
- 🎯 **Fokus pada nasabah yang tepat** — Tidak semua nasabah perlu perlakuan sama
- 💰 **Alokasi resources lebih efisien** — Prioritaskan yang bernilai tinggi
- ⚠️ **Deteksi dini nasabah berisiko** — Cegah sebelum nasabah pergi

### Kategori Nasabah Berdasarkan RFM

| Kategori | Penjelasan Singkat | Apa yang Harus Dilakukan? |
|----------|-------------------|---------------------------|
| 💎 **Champion** | Nasabah terbaik: sering transaksi, nilai besar, baru-baru ini aktif | Pertahankan! Beri reward eksklusif |
| 💰 **Loyal** | Nasabah setia dengan aktivitas rutin | Tawarkan produk tambahan (cross-sell) |
| 📈 **Potential** | Baru aktif, belum sering transaksi | Dorong agar lebih sering menggunakan layanan |
| ⚠️ **At Risk** | Dulu aktif, sekarang mulai menurun | Segera hubungi! Tanyakan apa masalahnya |
| 😴 **Hibernating** | Sudah lama tidak aktif | Kirim penawaran re-aktivasi |
| 🔻 **Lost** | Hampir tidak ada aktivitas | Coba kontak dengan biaya rendah |

---

## Alur Kerja Umum

### Alur Penanganan Keluhan

```
Nasabah Datang dengan Keluhan
          ↓
    Agent Cari Nasabah
          ↓
    Lihat Profil 360°
          ↓
    Buat Keluhan Baru
    (Kategori + Prioritas)
          ↓
    Sistem Hitung SLA Otomatis
          ↓
    Supervisor Assign ke Agent
          ↓
    Agent Investigasi & Update
          ↓
    Agent Isi Tanggapan Akhir
          ↓
    Agent Tutup Keluhan
          ↓
    Sistem Catat ke Audit Log
```

### Alur Kampanye Marketing

```
Marketing Buat Segment
(Contoh: Nasabah Priority)
          ↓
Marketing Buat Campaign
          ↓
Sistem Cek Eligibility:
├── Consent OK? 
├── Tidak ada keluhan aktif?
└── Cocok dengan segment?
          ↓
    Tampilkan Eligible List
    + Alasan bagi yang tidak eligible
          ↓
    Marketing Execute Campaign
          ↓
    Sistem Catat ke Audit Log
```

---

## Keamanan & Privasi

### Perlindungan Data Nasabah

Platform ini dirancang dengan prinsip **keamanan berlapis**:

| Lapisan | Penjelasan |
|---------|------------|
| **Akses Berdasarkan Peran** | Setiap role hanya bisa akses fitur yang relevan |
| **Scope Cabang/Portfolio** | Supervisor cabang A tidak bisa lihat data cabang B |
| **Data Masking** | Data sensitif (NIK, HP, Email) disamarkan untuk role tertentu |
| **Audit Trail** | Semua akses tercatat: siapa, kapan, apa yang dilihat |

### Data Yang Disamarkan

| Data | Tampilan Asli | Tampilan Disamarkan |
|------|---------------|---------------------|
| NIK | 1271012345670001 | ●●●●●●●●●●●●0001 |
| No HP | 081234567890 | ●●●●●●●●890 |
| Email | budi@email.com | b***@email.com |
| No Rekening | 1234567890 | ●●●●●●7890 |

---

## FAQ (Pertanyaan Umum)

### Kenapa saya tidak bisa melihat data nasabah tertentu?
Kemungkinan nasabah tersebut tidak dalam scope Anda (beda cabang atau bukan portfolio Anda).

### Kenapa saya tidak bisa menutup keluhan?
Keluhan **harus diisi tanggapan akhir** sebelum bisa ditutup. Ini adalah aturan wajib untuk memastikan nasabah mendapat jawaban.

### Kenapa nasabah tidak muncul di eligibility campaign?
Ada 3 kemungkinan:
1. Consent marketing nasabah = WITHDRAWN (tidak setuju)
2. Nasabah punya keluhan aktif yang belum selesai
3. Nasabah tidak cocok dengan kriteria segment

### Apa bedanya Segment dan Campaign?
- **Segment** = Kriteria untuk mengelompokkan nasabah (siapa targetnya)
- **Campaign** = Aktivitas pemasaran yang dikirim ke segment (apa pesannya)

### Bagaimana cara mengganti role untuk demo?
Gunakan **Role Switcher** di pojok kanan atas aplikasi. Ini hanya untuk demo, di production akan pakai login sungguhan.

---

# Detail Role dan Dasar Kebijakan Akses

Bagian ini menjelaskan secara detail pembagian peran (role) dalam platform CRM Bank Sumut beserta justifikasi berdasarkan standar keamanan dan regulasi yang berlaku.

## Prinsip Keamanan Akses

Platform CRM Bank Sumut mengimplementasikan prinsip keamanan berlapis sesuai dengan standar internasional dan regulasi nasional:

| Prinsip | Penjelasan | Referensi |
|---------|------------|-----------|
| **Deny-by-Default** | Semua akses ditolak kecuali diberikan izin secara eksplisit | OWASP Top 10 - A01:2021 Broken Access Control |
| **Least Privilege** | User hanya diberi akses minimum yang diperlukan untuk pekerjaannya | NIST SP 800-53, OWASP ASVS |
| **Server-side Enforcement** | Validasi akses dilakukan di backend, bukan hanya di UI | OWASP Cheat Sheet - Access Control |
| **Audit Trail** | Setiap akses ke data sensitif tercatat untuk kepatuhan | UU PDP No. 27/2022 Pasal 35 |
| **Consent Gating** | Aktivitas marketing hanya untuk nasabah yang memberikan persetujuan | UU PDP No. 27/2022 Pasal 20-24 |

> **Referensi OWASP**: "Broken Access Control" adalah kerentanan nomor 1 dalam OWASP Top 10 (2021). Pelanggaran prinsip deny-by-default dan least privilege menjadi penyebab umum masalah access control.

---

## Matriks Permission Detail per Role

### 👔 DIRECTOR (Direktur/Eksekutif)

| Aksi | Permission | Justifikasi |
|------|------------|-------------|
| View Dashboard Agregat | ✅ R | Kebutuhan monitoring kinerja |
| Lihat Detail Nasabah | ❌ | Meminimalkan risiko, tidak ada kebutuhan operasional |
| Export Data Agregat (tanpa PII) | ⚠️ X (opsional) | Dengan kontrol ketat |

**Dasar Kebijakan:**
- Akses detail perorangan dibatasi sesuai prinsip **need-to-know** (NIST SP 800-53)
- Mencegah **Privilege Escalation** dengan tidak memberikan akses data sensitif

---

### 👩‍💼 SUPERVISOR (Supervisor Layanan)

| Aksi | Permission | Justifikasi |
|------|------------|-------------|
| Search Customer (scoped) | ✅ R | Verifikasi dan eskalasi |
| View Customer 360 (ringkas) | ✅ R | Konteks untuk keputusan |
| Create/Update Case | ✅ C/U | Override jika diperlukan |
| Assign/Escalate Case | ✅ A | Fungsi utama supervisor |
| Close Case | ✅ U | Dengan guardrail final response |
| Export daftar case (scoped) | ⚠️ X | Untuk reporting internal |

**Dasar Kebijakan:**
- **OJK POJK 6/2022** tentang Perlindungan Konsumen: "Pelaku Usaha Jasa Keuangan wajib menyediakan mekanisme layanan pengaduan" — supervisor memastikan hal ini berjalan
- Scope dibatasi per cabang untuk **data minimization** (UU PDP Pasal 16)

---

### 👨‍💻 AGENT/CS (Customer Service)

| Aksi | Permission | Justifikasi |
|------|------------|-------------|
| Search Customer (scoped) | ✅ R | Fungsi utama layanan |
| View Customer 360 | ✅ R | Konteks penanganan |
| Create Case | ✅ C | Dokumentasi keluhan |
| Update Case (yang ditugaskan) | ✅ U | Penyelesaian keluhan |
| Final Response | ✅ U | Wajib sebelum close |
| Close Case | ✅ U | Dengan guardrail |
| Export Data Nasabah | ❌ | Default: tidak diizinkan |
| Change Consent | ⚠️ U | Berdasarkan request nasabah |

**Dasar Kebijakan:**
- **UU PDP Pasal 24**: Subjek data berhak menarik persetujuan — Agent dapat memproses permintaan ini
- **OJK POJK 18/2018**: Mekanisme pengaduan wajib tersedia dan terdokumentasi
- Data sensitif di-masking sesuai **OWASP recommendation** untuk mencegah unauthorized disclosure

---

### 💼 RM (Relationship Manager)

| Aksi | Permission | Justifikasi |
|------|------------|-------------|
| Lihat Customer Portfolio | ✅ R | Hanya nasabah yang di-assign |
| View Customer 360 (ringkas) | ✅ R | Konteks penjualan |
| Create/Update Lead & Activity | ✅ C/U | Fungsi utama sales |
| Create Task Follow-up | ✅ C | Perencanaan kerja |
| Akses Case | ⚠️ R terbatas | Hanya status ringkas |
| Export | ❌ | Default: tidak diizinkan |

**Dasar Kebijakan:**
- **Portfolio Scope** membatasi akses hanya ke nasabah yang di-assign, sesuai prinsip **data minimization**
- Salesforce Financial Services Cloud merekomendasikan "centralised view" untuk RM, namun dibatasi konteks portofolio

---

### 📢 MARKETING

| Aksi | Permission | Justifikasi |
|------|------------|-------------|
| Buat/Ubah Segment Rules | ✅ C/U | Fungsi utama |
| Buat Campaign Draft | ✅ C | Fungsi utama |
| Submit Campaign untuk Approval | ✅ U | Workflow |
| Execute Campaign | ✅ U | Jika APPROVED + consent gating lulus |
| View Campaign Report | ✅ R | Monitoring |
| Akses Profil Nasabah Detail | ❌ | Hanya agregat + field non-sensitif |
| **Ubah Consent** | ❌ **DILARANG** | **Conflict of interest** |

**Dasar Kebijakan:**
- **UU PDP Pasal 21**: Pengendali data hanya memproses data sesuai tujuan yang disetujui
- **Conflict of Interest**: Marketing tidak boleh mengubah consent karena kepentingan langsung → mencegah pelanggaran UU PDP
- **Consent Gating**: Nasabah dengan consent WITHDRAWN → otomatis INELIGIBLE dengan alasan tersimpan

> ⚠️ **Penting**: Sistem wajib mencatat audit event `CHANGE_CONSENT` setiap kali ada perubahan status persetujuan.

---

### 🔒 COMPLIANCE/RISK

| Aksi | Permission | Justifikasi |
|------|------------|-------------|
| View Audit Logs (full) | ✅ R | Fungsi utama kepatuhan |
| View Consent Report | ✅ R | Monitoring kepatuhan UU PDP |
| View Profile Detail | ⚠️ R terbatas | Break-glass + audit + alasan |
| Export Audit & Laporan Kepatuhan | ✅ X | Untuk regulasi |
| Ubah Data Nasabah | ❌ | Default: tidak diizinkan |

**Dasar Kebijakan:**
- **UU PDP Pasal 35**: Pengendali data wajib melakukan pencatatan aktivitas pengolahan data
- Akses detail menggunakan **break-glass procedure** dengan approval dan audit
- Ekspor untuk keperluan pelaporan ke **OJK** dan pemenuhan **UU PDP**

---

### ⚙️ ADMIN (Admin IT/System)

| Aksi | Permission | Justifikasi |
|------|------------|-------------|
| Kelola Role, Scope, Policy | ✅ M | Konfigurasi sistem |
| Konfigurasi Workflow, SLA Rules | ✅ M | Konfigurasi bisnis |
| Monitoring Integrasi, Retry Job | ✅ M | Operasional teknis |
| View Data Nasabah | ⚠️ R sangat terbatas | Hanya troubleshooting + wajib audit |

**Dasar Kebijakan:**
- **Separation of Duties**: Admin mengkonfigurasi sistem tapi tidak mengakses data operasional
- Akses data hanya untuk troubleshooting dengan **audit trail** lengkap

---

## Guardrails (Aturan Wajib Sistem)

| Guardrail | Penjelasan | Dasar Regulasi |
|-----------|------------|----------------|
| **Data Masking** | NIK, rekening, kontak di-mask untuk role non-privileged | UU PDP Pasal 16 (Data Minimization) |
| **Close Case Guardrail** | Case tidak bisa CLOSED jika `final_response` kosong | OJK POJK 18/2018 (Penanganan Pengaduan) |
| **Consent Gating** | Campaign tidak dikirim ke nasabah dengan consent WITHDRAWN | UU PDP Pasal 24 (Hak Tarik Persetujuan) |
| **Ineligible Reason** | Sistem menyimpan alasan jika nasabah tidak eligible | UU PDP Pasal 35 (Pencatatan) |
| **Audit Log Wajib** | Aksi penting tercatat: VIEW, CREATE, UPDATE, EXPORT | OJK, UU PDP, SOX-like compliance |

---

## Sensitivity Tier (Tingkat Kerahsiaan Data)

| Tier | Contoh Data | Akses |
|------|-------------|-------|
| **Tier-1** (Umum) | Nama, segment, status | Semua role dengan scope |
| **Tier-2** (Sensitif) | CIF, NIK (masked), kontak (masked) | Agent, RM, Supervisor |
| **Tier-3** (Sangat Sensitif) | Catatan FRAUD/SCAM, detail investigasi | Supervisor + Compliance + audit |

---

## Referensi Regulasi dan Standar

| Sumber | Relevansi |
|--------|-----------|
| **OWASP Top 10 (2021)** | A01: Broken Access Control - prinsip keamanan akses |
| **OWASP ASVS** | Application Security Verification Standard |
| **UU PDP No. 27/2022** | Perlindungan Data Pribadi Indonesia |
| **OJK POJK 6/2022** | Perlindungan Konsumen Sektor Jasa Keuangan |
| **OJK POJK 18/2018** | Layanan Pengaduan Konsumen |
| **NIST SP 800-53** | Security and Privacy Controls |
| **ISO 27001** | Information Security Management |

---

# Arsitektur Teknis

## 2.1. Keputusan Arsitektur: Frontend-Only dengan Mock Data

### Rasionalisasi Pendekatan

Untuk fase PoC, proyek ini mengadopsi arsitektur **Frontend-Only** tanpa backend sungguhan. Keputusan ini diambil berdasarkan pertimbangan berikut:

| Aspek | Pendekatan Frontend-Only | Pendekatan Full-Stack |
|-------|--------------------------|----------------------|
| **Waktu Pengembangan** | 2-4 minggu | 8-12 minggu |
| **Kompleksitas Infrastruktur** | Minimal (static hosting) | Tinggi (database, API, auth) |
| **Fokus Demo** | UX dan business logic | Technical infrastructure |
| **Iterasi Desain** | Cepat | Lambat |
| **Risiko Teknis** | Rendah | Tinggi |

### Implikasi Arsitektur

* **State Management**: Menggunakan Zustand sebagai in-memory store yang mensimulasikan behavior database
* **Data Persistence**: Seed data di-load saat aplikasi start, perubahan hilang saat refresh
* **Authentication**: Simulasi dengan role switcher tanpa real authentication flow
* **API Simulation**: Semua operasi CRUD dilakukan langsung di frontend store

> **Catatan untuk Production**: Arsitektur ini mudah di-migrate ke full-stack dengan mengganti store operations menjadi API calls. Interface dan business logic tetap sama.

## 2.2. Technology Stack

### 2.2.1. Framework Utama: React + TypeScript + Vite

| Teknologi | Versi | Alasan Pemilihan |
|-----------|-------|------------------|
| **React** | 19.2 | Component-based architecture, ekosistem mature, familiar untuk banyak developer |
| **TypeScript** | 5.9 | Type safety untuk mencegah runtime errors, better DX dengan autocomplete |
| **Vite** | 7.2 | Build time sangat cepat, HMR instant, modern ESM-first approach |

### Mengapa React + Vite vs Alternatif Lain?

| Framework | Kelebihan | Kekurangan | Keputusan |
|-----------|-----------|------------|-----------|
| **React + Vite** | Fast build, mature ecosystem, banyak talent | Tidak opinionated | ✅ **DIPILIH** |
| Next.js | SSR, file-based routing | Overkill untuk SPA, kompleksitas lebih tinggi | ❌ Tidak perlu SSR |
| Angular | Enterprise-grade, batteries-included | Learning curve tinggi, verbose | ❌ Tim lebih familiar React |
| Vue.js | Simple, reactive | Ekosistem lebih kecil | ❌ Talent pool lebih kecil |
| Svelte | Performance terbaik | Ekosistem belum mature | ❌ Risiko maintenance |

### 2.2.2. State Management: Zustand

| Library | Kelebihan | Kekurangan | Keputusan |
|---------|-----------|------------|-----------|
| **Zustand** | Minimal, no boilerplate, TypeScript native | Kurang opinionated | ✅ **DIPILIH** |
| Redux Toolkit | Standardized, DevTools | Boilerplate lebih banyak | ❌ Overkill untuk PoC |
| Jotai/Recoil | Atomic state | Pattern berbeda | ❌ Learning curve |
| React Query | Server state focus | Butuh backend | ❌ Tidak ada backend |

**Alasan Pemilihan Zustand:**
1. **Zero boilerplate** — Definisi store sangat ringkas
2. **TypeScript first** — Full type inference
3. **No providers** — Tidak perlu wrap aplikasi dengan Context
4. **Familiar patterns** — Mirip dengan useState, mudah dipelajari

### 2.2.3. Routing: React Router DOM v7

React Router dipilih karena:
* De-facto standard untuk routing React
* Dukungan nested routes untuk layout kompleks
* URL-based state untuk deep linking

### 2.2.4. UI: Vanilla CSS dengan Lucide Icons

| Pendekatan | Kelebihan | Kekurangan | Keputusan |
|------------|-----------|------------|-----------|
| **Vanilla CSS** | Full control, no dependency | Lebih banyak code | ✅ **DIPILIH** |
| TailwindCSS | Rapid prototyping | Utility classes verbose | ❌ Bisa ditambah nanti |
| Styled Components | Co-located styles | Runtime overhead | ❌ Complexity |
| CSS Modules | Scoped styles | More files | ❌ Overhead |

**Alasan Pemilihan Vanilla CSS:**
1. **Zero learning curve** — Semua developer tahu CSS
2. **No build complexity** — Tidak ada PostCSS, Tailwind config
3. **Bank enterprise vibe** — Custom styling lebih mudah untuk branding
4. **Performance** — No runtime CSS-in-JS overhead

### 2.2.5. Utility Libraries

| Library | Fungsi | Alasan |
|---------|--------|--------|
| **date-fns** | Date manipulation | Modular, tree-shakeable, immutable |
| **uuid** | ID generation | Standard UUID v4 untuk entity IDs |
| **lucide-react** | Icons | Modern, consistent, MIT license |
| **clsx** | Conditional classnames | Minimal utility untuk dynamic classes |

### 2.2.6. Testing: Vitest + Testing Library

| Tool | Fungsi |
|------|--------|
| **Vitest** | Test runner, Jest-compatible API, native Vite integration |
| **@testing-library/react** | React component testing dengan user-centric approach |
| **jsdom** | DOM simulation untuk testing environment |

---

# Arsitektur Aplikasi

## 3.1. Struktur Folder

Proyek menggunakan **feature-based structure** yang memudahkan navigasi dan maintenance:

```
src/
├── components/          # Reusable UI components
│   └── dashboards/      # Role-specific dashboard components
├── data/
│   └── seed.ts          # Mock data untuk demo
├── lib/                 # Business logic modules
│   ├── rfm.ts           # RFM Analysis engine
│   ├── nba.ts           # Next Best Action rules
│   ├── policy.ts        # RBAC & policy enforcement
│   ├── mask.ts          # Data masking utilities
│   ├── sla.ts           # SLA calculation
│   ├── audit.ts         # Audit log utilities
│   ├── leadScoring.ts   # Lead scoring engine
│   └── recovery.ts      # Service recovery automation
├── pages/               # Route components
├── store/
│   └── useAppStore.ts   # Global Zustand store
├── styles/              # CSS modules per component
├── types/
│   └── index.ts         # TypeScript definitions
└── test/                # Test utilities
```

## 3.2. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │Dashboard│  │Customer │  │  Cases  │  │Marketing│   ...      │
│  │  Page   │  │   360   │  │  Page   │  │  Page   │            │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘            │
└───────┼────────────┼────────────┼────────────┼──────────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     ZUSTAND STORE (useAppStore)                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ State: currentUser, customers, cases, campaigns, ...     │  │
│  │ Actions: createCase, updateLead, addAuditLog, ...        │  │
│  │ Getters: getCustomerById, getRFMByCustomer, ...          │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
┌───────────────┐    ┌──────────────────┐    ┌───────────────┐
│  BUSINESS     │    │     POLICY       │    │     UTILS     │
│  LOGIC LAYER  │    │     LAYER        │    │               │
│ ┌───────────┐ │    │ ┌──────────────┐ │    │ ┌───────────┐ │
│ │  rfm.ts   │ │    │ │  policy.ts   │ │    │ │  mask.ts  │ │
│ │  nba.ts   │ │    │ │  (RBAC)      │ │    │ │  sla.ts   │ │
│ │  scoring  │ │    │ │  (Scope)     │ │    │ │  audit.ts │ │
│ └───────────┘ │    │ └──────────────┘ │    │ └───────────┘ │
└───────────────┘    └──────────────────┘    └───────────────┘
```

## 3.3. Role-Based Access Control (RBAC)

Platform mengimplementasikan **7 roles** dengan scope dan permissions yang berbeda:

| Role | Scope | Permissions Utama |
|------|-------|-------------------|
| **DIRECTOR** | Global (agregat only) | View dashboard, no customer details |
| **SUPERVISOR** | Branch-scoped | View queue, assign/escalate cases, monitor SLA |
| **AGENT** | Branch-scoped | Search customer, create/update case, final response |
| **RM** | Portfolio-scoped | View assigned customers, manage leads, log activities |
| **MARKETING** | Global (masked) | Create segments/campaigns, view eligibility (no consent change) |
| **COMPLIANCE** | Global | View audit logs, export data |
| **ADMIN** | Global | Configure roles, SLA rules, workflows |

### Policy Enforcement

```typescript
// Deny-by-default: semua aksi ditolak kecuali explicitly granted
const PERMISSIONS: Record<Role, Permission[]> = {
  DIRECTOR: ['view_dashboard'],
  SUPERVISOR: ['view_dashboard', 'search_customer', 'view_profile', 'view_cases', 'assign_case', 'escalate_case'],
  AGENT: ['view_dashboard', 'search_customer', 'view_profile', 'view_cases', 'create_case', 'update_case', 'final_response', 'close_case'],
  // ...
};
```

---

# Fitur-Fitur Platform

## 4.1. Customer 360 View

Customer 360 adalah **foundation layer** yang menyatukan semua informasi nasabah dalam satu pandangan terpusat.

### Definisi dan Referensi Industri

| Sumber | Definisi | Relevansi |
|--------|----------|-----------|
| **Salesforce** | "Customer 360 is a complete view of every customer, unifying your company's data across sales, service, marketing, commerce, and IT" | Platform ini mengintegrasikan Marketing, Sales, dan Service dalam satu sistem |
| **Gartner** | "Single Customer View (SCV) is an aggregated, consistent representation of the data known by an organization about its customers" | Implementasi SCV dengan timeline dan profil terpadu |
| **Forrester** | "A 360-degree customer view enables personalization at scale and reduces customer effort" | Memungkinkan RM memberikan layanan personal dengan konteks lengkap |
| **McKinsey** | "Banks with unified customer views achieve 15-20% higher customer satisfaction scores" | Justifikasi ROI untuk implementasi Customer 360 |

> **Mengapa Customer 360 Penting untuk Bank?** Menurut riset Accenture (2023), 91% nasabah lebih cenderung bertransaksi dengan bank yang mengenali dan mengingat preferensi mereka. Customer 360 adalah fondasi untuk mencapai hal ini.

### Komponen Customer 360:

| Komponen | Deskripsi | Status |
|----------|-----------|--------|
| **Profile Summary** | Identitas, segment, consent status | ✅ Implemented |
| **Timeline** | Chronological events (cases, campaigns, activities) | ✅ Implemented |
| **RFM Score** | Behavioral segmentation | ✅ Implemented |
| **Alerts** | Open case, consent withdrawn, SLA overdue | ✅ Implemented |
| **NBA Panel** | Next Best Action recommendations | ✅ Implemented |

### Data Masking

Data sensitif di-mask berdasarkan role:

| Field | DIRECTOR | SUPERVISOR | AGENT | RM | MARKETING |
|-------|----------|------------|-------|-----|-----------|
| NIK | ●●●●●●●●●●●●1234 | ●●●●●●●●●●●●1234 | Full | Full | ●●●●●●●●●●●●1234 |
| Phone | ●●●●●●●●001 | ●●●●●●●●001 | Full | Full | ●●●●●●●●001 |
| Email | a***@email.com | a***@email.com | Full | Full | a***@email.com |

## 4.2. Case Management

Penanganan keluhan end-to-end dengan:

* **SLA Calculation** — Otomatis berdasarkan kategori dan prioritas
* **Assignment & Escalation** — Workflow supervisor
* **Final Response Guardrail** — Case tidak bisa CLOSED tanpa final response
* **Activity Log** — Riwayat semua update

### Dasar Regulasi Penanganan Pengaduan

| Regulasi | Ketentuan Utama | Implementasi di Platform |
|----------|-----------------|--------------------------|
| **POJK No. 18/POJK.07/2018** | Layanan Pengaduan Konsumen di Sektor Jasa Keuangan | Sistem case management dengan dokumentasi lengkap |
| **POJK No. 6/POJK.07/2022** | Perlindungan Konsumen dan Masyarakat di Sektor Jasa Keuangan | Guardrail final response wajib sebelum close |
| **SE OJK No. 2/SEOJK.07/2014** | Pelayanan dan Penyelesaian Pengaduan Konsumen pada Pelaku Usaha Jasa Keuangan | SLA dengan batas waktu terukur |

> **POJK 18/2018 Pasal 35**: "Pelaku Usaha Jasa Keuangan wajib menyelesaikan Pengaduan paling lama **20 (dua puluh) hari kerja** sejak tanggal penerimaan Pengaduan." Platform ini mengimplementasikan SLA yang lebih ketat untuk memberikan layanan prima.

> **POJK 6/2022 Pasal 36**: "Pelaku Usaha Jasa Keuangan wajib memiliki unit kerja dan/atau fungsi untuk menangani dan menyelesaikan pengaduan yang disampaikan oleh Konsumen." Platform ini menyediakan tools untuk unit kerja tersebut.

### SLA Matrix

| Kategori | Priority LOW | Priority MEDIUM | Priority HIGH | Priority CRITICAL |
|----------|--------------|-----------------|---------------|-------------------|
| TRX_FAIL | 24h / 72h | 12h / 48h | 4h / 24h | 1h / 8h |
| FRAUD_SCAM | 4h / 24h | 2h / 16h | 1h / 8h | 0.5h / 4h |
| CARD_ATM | 24h / 72h | 12h / 48h | 4h / 24h | 2h / 12h |
| ... | ... | ... | ... | ... |

> **Catatan**: Format SLA adalah (First Response Time / Resolution Time). Waktu ini lebih ketat dari ketentuan OJK 20 hari kerja untuk memberikan **competitive advantage** dalam customer experience.

## 4.3. Marketing: Consent-Aware Campaigns

Marketing module mengimplementasikan **consent gating** yang mematuhi UU PDP:

```
Customer → Segment Matching → Consent Check → Eligibility Result
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
           CONSENT = GRANTED               CONSENT = WITHDRAWN
                    │                               │
                    ▼                               ▼
              ✅ ELIGIBLE                  ❌ INELIGIBLE
                                          reason: "CONSENT"
```

### Eligibility Rules

| Condition | Result | Ineligible Reason |
|-----------|--------|-------------------|
| Consent WITHDRAWN | Ineligible | CONSENT |
| Has active case | Ineligible | CASE_ACTIVE |
| Not matching segment | Ineligible | SEGMENT_MISMATCH |
| All checks pass | Eligible | null |

## 4.4. Sales: Lead & RM Activities

* **Lead Pipeline Kanban** — NEW → CONTACTED → QUALIFIED → PROPOSAL → WON/LOST
* **RM Activity Logging** — CALL, VISIT, EMAIL, MEETING, NOTE
* **Portfolio Scoping** — RM hanya melihat nasabah yang di-assign

## 4.5. Audit Trail

Semua aksi penting dicatat untuk kepatuhan:

| Event | Entity | Details |
|-------|--------|---------|
| SEARCH_CUSTOMER | CUSTOMER | query, results_count |
| VIEW_PROFILE | CUSTOMER | customer_id |
| CREATE_CASE | CASE | case_number, category, priority |
| UPDATE_CASE | CASE | changed_fields |
| ASSIGN_CASE | CASE | assigned_to |
| FINAL_RESPONSE | CASE | response_length |
| CLOSE_CASE | CASE | closed_at |
| CHANGE_CONSENT | CUSTOMER | field, old_value, new_value |
| EXPORT_DATA | SYSTEM | export_type, row_count |

---

# Analisis RFM: Foundation Layer Customer 360

## 5.1. Mengapa RFM Dipilih Sebagai Starting Point?

RFM (Recency, Frequency, Monetary) dipilih sebagai **behavioral analytics engine** utama berdasarkan pertimbangan berikut:

### Landasan Teori dan Referensi Akademis

| Sumber | Kontribusi | Relevansi untuk Bank Sumut |
|--------|------------|---------------------------|
| **Hughes, A.M. (1994)** "Strategic Database Marketing" | Memperkenalkan konsep RFM sebagai metode segmentasi pelanggan berbasis perilaku | Fondasi teori RFM yang masih relevan hingga saat ini |
| **Bult & Wansbeek (1995)** Journal of Marketing Research | Validasi statistik bahwa RFM outperform random targeting | Justifikasi ilmiah untuk penggunaan RFM |
| **Fader, Hardie & Lee (2005)** Marketing Science | Pengembangan model CLV berbasis RFM (BG/NBD model) | Dasar untuk CLV Proxy di platform ini |
| **Khajvand et al. (2011)** Expert Systems with Applications | RFM untuk customer churn prediction di perbankan | Adaptasi RFM khusus untuk konteks bank |
| **Wei, Lin & Wu (2010)** Expert Systems with Applications | Kombinasi RFM dengan data mining untuk segmentasi bank | Validasi penggunaan RFM di industri keuangan |

> **Catatan Akademis**: RFM pertama kali diperkenalkan oleh Arthur Hughes dalam konteks direct marketing (1994), dan telah menjadi standar industri untuk customer segmentation. Penelitian Bult & Wansbeek (1995) membuktikan bahwa model RFM secara statistik signifikan lebih baik dibanding random selection untuk targeting kampanye.

### Referensi Industri

| Sumber | Kutipan/Konsep |
|--------|----------------|
| **Gartner** | "RFM remains a foundational technique for customer value analysis in financial services" |
| **McKinsey & Company** | "Banks using behavioral segmentation (including RFM) see 10-20% increase in cross-sell conversion" |
| **Salesforce Financial Services** | Menggunakan RFM sebagai salah satu input untuk Customer Value Scoring |
| **SAS Institute** | Menyediakan RFM sebagai out-of-the-box analytics untuk customer intelligence |

### 5.1.1. Rasionalisasi Pemilihan RFM

| Kriteria | RFM | Alternatif (ML Clustering) |
|----------|-----|---------------------------|
| **Time to Implement** | 1-2 minggu | 4-8 minggu |
| **Data Requirement** | Minimal (3 field) | Extensive dataset |
| **Explainability** | Tinggi (rule-based) | Rendah (black box) |
| **Business Adoption** | Mudah dipahami | Perlu edukasi |
| **Actionability** | Langsung actionable | Perlu interpretasi |
| **Maintenance** | Threshold adjustment | Model retraining |

> **Mengapa Explainability Penting?** Menurut artikel "Explainable AI in Banking" (Deloitte, 2021), regulator keuangan semakin menekankan transparansi dalam keputusan berbasis data. Model RFM yang rule-based memenuhi persyaratan ini karena setiap keputusan dapat dijelaskan dengan jelas.

### 5.1.2. Posisi RFM dalam Customer 360

```
Customer 360 View (Comprehensive)
│
├── RFM Segmentation Engine ← [FOKUS PROYEK]
│   └── Input: Transaction History
│   └── Output: Behavioral Segments
│
├── Demographic Profile ← [Future]
├── Interaction History ← [Partial]
├── Service Data ← [Implemented via Cases]
├── Digital Behavior ← [Future]
├── Sentiment Analysis ← [Future]
└── Lifecycle Stage ← [Future]
```

## 5.2. Adaptasi RFM untuk Perbankan

### 5.2.1. Definisi Metrik

| Metrik | Definisi Ritel | Adaptasi Bank Sumut |
|--------|----------------|---------------------|
| **Recency** | Hari sejak pembelian terakhir | Hari sejak transaksi/login terakhir |
| **Frequency** | Jumlah pesanan | Jumlah transaksi dalam 12 bulan |
| **Monetary** | Total belanja | Saldo rata-rata / AUM |

### 5.2.2. Threshold Scoring (v1-poc)

Menggunakan **threshold-based scoring** (bukan percentile) karena jumlah data PoC terbatas:

| Score | Recency (days) | Frequency (count) | Monetary (IDR) |
|-------|----------------|-------------------|----------------|
| **5** | ≤ 7 | ≥ 50 | ≥ 100 juta |
| **4** | 8–30 | 30–49 | 50–100 juta |
| **3** | 31–90 | 15–29 | 20–50 juta |
| **2** | 91–180 | 5–14 | 5–20 juta |
| **1** | > 180 | < 5 | < 5 juta |

### 5.2.3. Segment Classification

| Segment | Rule | CLV Proxy | Strategi |
|---------|------|-----------|----------|
| **CHAMPION** | R≥4, F≥4, M≥4 | 💎 Very High | Retain, exclusive rewards |
| **LOYAL** | F≥4 | 💰 High | Cross-sell, upsell |
| **POTENTIAL** | R≥4, F<4 | 📈 Growing | Nurture frequency |
| **AT_RISK** | R≤2, (F≥3 or M≥3) | ⚠️ Declining | Win-back campaign |
| **HIBERNATING** | R≤2, F≤2, M≤2 | 😴 Low | Re-engagement |
| **LOST** | R=1, F=1, M=1 | 🔻 Minimal | Low-cost reach-out |

## 5.3. Implementasi Teknis RFM

### 5.3.1. File Structure

```
src/lib/rfm.ts          # Core RFM engine (263 lines)
├── THRESHOLDS          # Configurable thresholds
├── TYPES               # RFMScore, RFMSegment, CLVProxy
├── getRFMSegment()     # Segment determination logic
├── calculateRFMScore() # Score calculation with sanitization
└── UI Helpers          # getCLVIcon, getSegmentColor, getSegmentLabel
```

### 5.3.2. Key Design Decisions

1. **Threshold-based vs Percentile**
   - Dipilih threshold karena PoC hanya 5 customers
   - Percentile tidak meaningful dengan sample size kecil
   - Threshold lebih mudah dijelaskan ke stakeholder

2. **Ruleset Versioning**
   - Setiap RFM score menyimpan `ruleset_version` dan `window_label`
   - Memudahkan auditability dan debugging

3. **Explainability**
   - Setiap segment memiliki `segment_reason` yang menjelaskan kenapa
   - Transparency untuk user dan compliance

4. **Edge Case Handling**
   - Zero/negative values → treated as 0 → Score 1
   - Missing dates → Skip atau use customer.created_at
   - All timestamps in UTC (ISO 8601)

### 5.3.3. Integration Points

RFM terintegrasi dengan:

| Module | Integration |
|--------|-------------|
| **Customer 360** | RFM badge di profile header |
| **Customer Directory** | Filter by RFM segment |
| **NBA Engine** | RFM segment sebagai input rules |
| **Dashboard** | RFM distribution charts |

## 5.4. Integrasi RFM dengan NBA (Next Best Action)

NBA engine menggunakan RFM segment untuk menentukan rekomendasi:

```typescript
// Rules yang menggunakan RFM:
if (rfmScore.segment === 'AT_RISK' && daysSinceLastContact >= 30) {
  → Recommend: "Hubungi untuk Retention" (HIGH priority)
}

if (rfmScore.segment === 'LOST') {
  → Recommend: "Jalankan Win-Back Campaign" (HIGH priority)
}

if (rfmScore.segment === 'CHAMPION' && hasConsentMarketing) {
  → Recommend: "Tawarkan Produk Premium" (MEDIUM priority)
}
```

---

# Data Seed untuk Demo

## 6.1. Overview Data

| Entity | Count | Purpose |
|--------|-------|---------|
| **Branches** | 44 | Real Bank Sumut network |
| **Users** | 7 | One per role |
| **Customers** | 5 | Representative scenarios |
| **Cases** | 3 | Various statuses |
| **Campaigns** | 2 | Draft and Approved |
| **Leads** | 5 | Various pipeline stages |
| **RFM Scores** | 5 | All segments represented |
| **NBA Recommendations** | 6 | Pre-seeded for demo |

## 6.2. Customer Scenarios

| Customer | Segment | RFM | Consent | Case | Demo Purpose |
|----------|---------|-----|---------|------|--------------|
| **A** | MASS | HIBERNATING | WITHDRAWN | - | Consent gating demo |
| **B** | PRIORITY | CHAMPION | GRANTED | Closed | Eligible campaign, lead |
| **C** | EMERGING | POTENTIAL | GRANTED | Active FRAUD | Case active → ineligible |
| **D** | MASS | POTENTIAL | GRANTED | - | Different branch (Binjai) |
| **E** | PRIVATE | LOYAL | GRANTED | Open | VIP handling |

---

# Testing Strategy

## 7.1. Unit Tests

| Module | Test File | Coverage |
|--------|-----------|----------|
| RFM | rfm.test.ts | Scoring, segmentation, edge cases |
| NBA | nba.test.ts | Rule evaluation, priority ordering |
| Policy | policy.test.ts | RBAC, scope, can() function |
| Masking | mask.test.ts | NIK, phone, email, account masking |
| SLA | sla.test.ts | SLA calculation per category |

## 7.2. Running Tests

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- rfm.test.ts

# Run with coverage
npm run test:coverage
```

---

# Verification: Kesesuaian Implementasi RFM

## 8.1. Checklist Implementasi vs Laporan Strategis

| Requirement dari Laporan | Status | Keterangan |
|--------------------------|--------|------------|
| RFM sebagai behavioral engine | ✅ | `src/lib/rfm.ts` |
| Recency: hari sejak transaksi | ✅ | `recency_days` field |
| Frequency: jumlah transaksi | ✅ | `frequency_count` field |
| Monetary: nilai transaksi | ✅ | `monetary_value` dalam IDR |
| 6 Segments (Champion → Lost) | ✅ | Semua segment ada |
| CLV Proxy | ✅ | Very High → Minimal |
| Explainability | ✅ | `segment_reason` field |
| Integration dengan Marketing | ✅ | Filter di CustomersPage |
| Integration dengan Sales | ✅ | NBA recommendations |
| Integration dengan Service | ✅ | Priority handling |
| Threshold configurable | ✅ | Exported constants |
| Auditability | ✅ | `ruleset_version`, `window_label` |

## 8.2. Gap Analysis

| Fitur dari Laporan | Current Status | Recommendation |
|--------------------|----------------|----------------|
| RFM Dashboard Charts | ❌ Not Implemented | Priority 1 |
| Visual score bars di Customer 360 | ❌ Not Implemented | Priority 3 |
| Segment-specific recommendations panel | ❌ Not Implemented | Priority 4 |
| RFM trend over time | ❌ Out of Scope (PoC) | Phase 2 |
| ML-based clustering | ❌ Out of Scope (PoC) | Phase 2 |

## 8.3. Kesimpulan Kesesuaian

**Implementasi RFM SUDAH SESUAI** dengan Laporan Strategis untuk level PoC:

1. ✅ Core RFM logic lengkap dan well-documented
2. ✅ Semua segment dan CLV proxy sesuai spesifikasi
3. ✅ Integrasi basic dengan Customer 360, Directory, dan NBA
4. ✅ Edge case handling dan input sanitization
5. ✅ Auditability dengan version tracking

**Yang perlu ditambahkan untuk enhancement:**
1. Dashboard visualization (charts, summary cards)
2. Enhanced UI di Customer 360 (progress bars, breakdown)
3. Segment-specific action recommendations
4. More RFM-based NBA rules

---

# Roadmap Pengembangan

## Phase 1: PoC Enhancement (Current)

- [ ] RFM Dashboard Charts
- [ ] Enhanced RFM UI di Customer 360
- [ ] RFM-based Recommendations
- [ ] Complete NBA integration

## Phase 2: Production Ready

- [ ] Backend API integration
- [ ] Real database (PostgreSQL)
- [ ] Authentication (OAuth/SSO)
- [ ] Real-time RFM calculation dari transaction data

## Phase 3: Advanced Analytics

- [ ] ML-based clustering (K-Means)
- [ ] Predictive CLV
- [ ] Churn prediction
- [ ] Real-time behavioral triggers

---

# Referensi

1. Laporan Strategis: Arsitektur Platform CRM Analitis untuk Transformasi Digital Bank Sumut
2. Pedoman CRM Bank Sumut (pedoman crm.md)
3. CRM Framework: Tipe, Modul, dan Komponen (crm itu dibagi menjadi apa dan termasuka apa saja_.md)
4. Implementation Roadmap (implementation-roadmap.md)
5. AGENTS.md - Aturan Kerja AI untuk Repo
