import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'chart';
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  lines = 1,
}: SkeletonProps) {
  const baseStyles = 'bg-gray-200 animate-pulse rounded';

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseStyles} h-4 rounded`}
            style={{
              width: i === lines - 1 && lines > 1 ? '70%' : width || '100%',
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <div
        className={`${baseStyles} rounded-full ${className}`}
        style={{
          width: width || 40,
          height: height || 40,
        }}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" className="mt-2" />
          </div>
        </div>
        <Skeleton variant="text" lines={3} />
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <Skeleton variant="text" width={120} height={20} />
          <Skeleton variant="rectangular" width={80} height={24} />
        </div>
        <div className="flex items-end gap-2 h-40">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className={`${baseStyles} flex-1`}
              style={{ height: `${30 + Math.random() * 70}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // rectangular
  return (
    <div
      className={`${baseStyles} ${className}`}
      style={{
        width: width || '100%',
        height: height || 100,
      }}
    />
  );
}

// Skeleton.Table for table loading
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-gray-200 bg-gray-50">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width={i === 0 ? '30%' : '20%'} height={16} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-4 border-b border-gray-100 last:border-b-0">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width={colIndex === 0 ? '30%' : '20%'} height={14} />
          ))}
        </div>
      ))}
    </div>
  );
}

Skeleton.Table = SkeletonTable;

export default Skeleton;
