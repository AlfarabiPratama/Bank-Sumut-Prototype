import React from 'react';
import { MoreHorizontal, Download, Maximize2, RefreshCw } from 'lucide-react';
import { Card } from './Card';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyMessage?: string;
  action?: React.ReactNode;
  showExport?: boolean;
  showFullscreen?: boolean;
  onExport?: () => void;
  onFullscreen?: () => void;
  className?: string;
  height?: string | number;
}

export function ChartCard({
  title,
  subtitle,
  children,
  loading = false,
  error = false,
  onRetry,
  isEmpty = false,
  emptyMessage = 'Tidak ada data untuk ditampilkan',
  action,
  showExport = false,
  showFullscreen = false,
  onExport,
  onFullscreen,
  className = '',
  height = 'auto',
}: ChartCardProps) {
  return (
    <Card variant="default" padding="none" className={className}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {action}
          {showExport && (
            <button 
              onClick={onExport}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export"
            >
              <Download size={16} />
            </button>
          )}
          {showFullscreen && (
            <button 
              onClick={onFullscreen}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Fullscreen"
            >
              <Maximize2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div 
        className="p-5" 
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        {loading ? (
          <ChartSkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <p className="text-gray-500 mb-3">Gagal memuat data</p>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <RefreshCw size={14} />
                Coba Lagi
              </button>
            )}
          </div>
        ) : isEmpty ? (
          <EmptyState
            variant="chart"
            title="Tidak Ada Data"
            description={emptyMessage}
            className="py-4"
          />
        ) : (
          children
        )}
      </div>
    </Card>
  );
}

// Chart Skeleton Component
function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Legend skeleton */}
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-200" />
          <div className="w-16 h-3 rounded bg-gray-200" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-200" />
          <div className="w-16 h-3 rounded bg-gray-200" />
        </div>
      </div>
      
      {/* Chart bars skeleton */}
      <div className="flex items-end gap-3 h-40">
        {[45, 65, 40, 80, 55, 70, 60].map((height, i) => (
          <div 
            key={i} 
            className="flex-1 bg-gray-200 rounded-t"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      
      {/* X-axis labels skeleton */}
      <div className="flex justify-between mt-3">
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((_, i) => (
          <div key={i} className="w-8 h-3 rounded bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

export default ChartCard;
