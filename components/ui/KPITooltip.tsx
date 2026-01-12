import React, { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';

interface KPITooltipProps {
  definition: string;
  formula?: string;
  period?: string;
  children?: React.ReactNode;
}

/**
 * Tooltip component for KPI cards
 * Shows metric definition, formula, and calculation period on hover
 */
export const KPITooltip: React.FC<KPITooltipProps> = ({ 
  definition, 
  formula, 
  period = '30 hari terakhir',
  children 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative inline-flex items-center">
      {children}
      <button
        type="button"
        className="ml-1.5 p-0.5 text-gray-400 hover:text-sumut-blue transition-colors focus:outline-none focus:ring-2 focus:ring-sumut-blue/30 rounded-full"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        aria-label="Info tentang metrik ini"
      >
        <Info size={14} />
      </button>
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className="absolute z-50 bottom-full left-0 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-150"
          role="tooltip"
        >
          <p className="font-medium text-white/90 mb-1">{definition}</p>
          {formula && (
            <p className="text-white/70 font-mono text-[10px] bg-slate-700 px-2 py-1 rounded mt-1.5">
              {formula}
            </p>
          )}
          <p className="text-white/50 text-[10px] mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            Periode: {period}
          </p>
          {/* Arrow */}
          <div className="absolute top-full left-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-800"></div>
        </div>
      )}
    </div>
  );
};

// Predefined metric definitions for consistency
export const METRIC_DEFINITIONS = {
  retentionRate: {
    definition: 'Persentase nasabah yang tetap aktif bertransaksi dalam periode tertentu',
    formula: '(Nasabah Aktif / Total Nasabah) × 100',
    period: '90 hari terakhir'
  },
  pointVelocity: {
    definition: 'Rata-rata poin yang diperoleh nasabah per hari dari aktivitas transaksi',
    formula: 'Total Poin / Jumlah Hari Aktif',
    period: '30 hari terakhir'
  },
  campaignRoi: {
    definition: 'Return on Investment dari campaign marketing yang dijalankan',
    formula: '(Revenue Campaign - Biaya) / Biaya × 100',
    period: 'Per campaign'
  },
  churnRisk: {
    definition: 'Persentase nasabah yang berpotensi meninggalkan layanan berdasarkan pola RFM',
    formula: 'Nasabah (At Risk + Hibernating) / Total × 100',
    period: 'Real-time'
  },
  engagementScore: {
    definition: 'Skor engagement gabungan dari aktivitas transaksi, login, dan interaksi campaign',
    formula: '(Transaksi × 0.4 + Login × 0.3 + Campaign × 0.3) / Baseline',
    period: '30 hari terakhir'
  },
  rfmScore: {
    definition: 'Skor gabungan dari Recency (terakhir transaksi), Frequency (frekuensi), dan Monetary (nilai)',
    formula: '(R + F + M) / 3, skala 1-5',
    period: 'Window: 90 hari'
  }
};

export default KPITooltip;
