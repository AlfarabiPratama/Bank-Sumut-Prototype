# SULTAN - Bank Sumut Gen-Z CRM Ecosystem
**Sistem Uang & Layanan Tabungan Andalan (Proof of Concept)**

![Status](https://img.shields.it/badge/Status-Proof%20of%20Concept-blue)
![Tech](https://img.shields.it/badge/Tech-React%20%7C%20TypeScript%20%7C%20Tailwind-orange)
![CRM](https://img.shields.it/badge/Logic-RFM%20Model-green)

## 📌 Latar Belakang Proyek
Proyek ini adalah simulasi ekosistem **Hybrid CRM (Customer Relationship Management)** yang dirancang khusus untuk Bank Sumut (BPD). Tujuannya adalah menjembatani kesenjangan antara layanan perbankan tradisional dengan ekspektasi digital nasabah Generasi Z melalui pendekatan gamifikasi dan analitik data.

Sistem terdiri dari dua antarmuka terintegrasi:
1.  **Mobile App (Sisi Nasabah):** Antarmuka perbankan modern, gamified, dan personal.
2.  **Admin Dashboard (Sisi Manajemen):** Control tower untuk analisis RFM, segmentasi otomatis, dan strategi marketing berbasis AI.

---

## 🚀 Perkembangan Fitur (Progress Report)

Berikut adalah status pengembangan fitur yang telah diselesaikan hingga versi saat ini:

### 1. Fitur Mobile App (Gen-Z Interface)
*   ✅ **UI/UX Modern:** Desain *Glassmorphism* dengan aksen warna Bank Sumut (Blue & Orange).
*   ✅ **Gamifikasi Loyalty:** Sistem Level (Menuju Sultan), XP Bar, dan Badges (Lencana) berdasarkan aktivitas transaksi.
*   ✅ **Dompet Impian (Dream Savers):**
    *   *Create Goal:* Nasabah dapat membuat target tabungan (misal: Beli iPhone, Konser).
    *   *Visual Progress:* Progress bar visual untuk memotivasi menabung.
    *   *Top Up Impian:* Simulasi pemindahan saldo utama ke pos tabungan impian.
*   ✅ **Simulasi Transaksi:** Tampilan riwayat transaksi yang dikategorikan (F&B, Transport, dll).
*   ✅ **Aset & Branding:** Perbaikan logo Bank Sumut (SVG) dan visualisasi kartu debit digital.

### 2. Fitur Admin Dashboard (CRM Engine)
*   ✅ **RFM Analysis Engine:** Algoritma otomatis yang menilai nasabah berdasarkan *Recency, Frequency, & Monetary*.
*   ✅ **Segmentasi Otomatis:** Pengelompokan nasabah menjadi 5 segmen:
    *   *Sultan Sejati (Champions)*
    *   *Kawan Setia (Loyal)*
    *   *Calon Sultan (Potential)*
    *   *Hampir Lupa (At Risk)*
    *   *Tidur Panjang (Hibernating)*
*   ✅ **Konfigurasi Dinamis:** Admin dapat mengubah bobot (weighting) RFM secara real-time.
*   ✅ **AI Campaign Strategist:** Integrasi **Google Gemini API** untuk membuat strategi promo otomatis berdasarkan segmen.
*   ✅ **Financial Goal Tracking:** Admin dapat melihat detail "Dompet Impian" nasabah untuk keperluan *cross-selling* produk.

---

## 🧠 Validasi Logika CRM
Sistem ini dibangun di atas kerangka kerja CRM standar industri:

| Tahapan CRM | Implementasi di SULTAN App |
| :--- | :--- |
| **1. Acquisition** | Pencatatan data transaksi real-time dan preferensi user via "Dompet Impian". |
| **2. Analysis** | Penggunaan Model RFM untuk menentukan Customer Value (CLV). |
| **3. Action** | Trigger promo personal (misal: Promo gadget untuk nasabah yang menabung buat iPhone). |
| **4. Retention** | Gamifikasi (Level & Badge) menciptakan *psychological switching cost*. |

---

## 🛠 Teknologi yang Digunakan

*   **Frontend Framework:** React.js 18
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Visualization:** Recharts (untuk grafik analitik)
*   **Icons:** Lucide React
*   **AI Integration:** Google Gemini SDK (`@google/genai`)
*   **Data Simulation:** Local State Management (untuk PoC interaktif)

---

## 📂 Struktur Proyek

```bash
/components
  /mobile
    - MobileApp.tsx       # Interface Nasabah Utama
  /admin
    - AdminDashboard.tsx  # Dashboard CRM Pegawai Bank
/services
    - geminiService.ts    # Integrasi AI
/types.ts                 # Definisi Tipe Data (User, RFM, Transaction)
/constants.ts             # Mock Data untuk simulasi
```

## 🎯 Next Steps (Rencana Pengembangan)
1.  Integrasi Backend (Node.js/Go) untuk persistensi data nyata.
2.  Notifikasi Push (Firebase) yang terhubung dengan trigger CRM.
3.  Modul "Financial Health Check" yang lebih mendalam.

---

**Dibuat untuk keperluan Laporan Inovasi Digital Bank Pembangunan Daerah.**
