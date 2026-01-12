import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff, ServerCrash } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  variant?: 'default' | 'network' | 'server';
  className?: string;
}

const variantConfig = {
  default: {
    icon: <AlertTriangle size={48} strokeWidth={1.5} />,
    title: 'Terjadi Kesalahan',
    message: 'Maaf, terjadi kesalahan saat memuat data. Silakan coba lagi.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50',
  },
  network: {
    icon: <WifiOff size={48} strokeWidth={1.5} />,
    title: 'Koneksi Terputus',
    message: 'Periksa koneksi internet Anda dan coba lagi.',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  server: {
    icon: <ServerCrash size={48} strokeWidth={1.5} />,
    title: 'Server Error',
    message: 'Server sedang mengalami gangguan. Silakan coba beberapa saat lagi.',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
};

export function ErrorState({
  title,
  message,
  onRetry,
  retryLabel = 'Coba Lagi',
  variant = 'default',
  className = '',
}: ErrorStateProps) {
  const config = variantConfig[variant];

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className={`${config.color} mb-4 p-4 rounded-full ${config.bgColor}`}>
        {config.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title || config.title}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        {message || config.message}
      </p>
      {onRetry && (
        <Button 
          variant="secondary" 
          onClick={onRetry}
          leftIcon={<RefreshCw size={16} />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
