import React from 'react';
import { RFMSegment } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'champions' | 'loyal' | 'potential' | 'at-risk' | 'hibernating';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  // RFM Segment specific
  champions: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  loyal: 'bg-green-50 text-green-700 border-green-200',
  potential: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'at-risk': 'bg-orange-50 text-orange-700 border-orange-200',
  hibernating: 'bg-red-50 text-red-700 border-red-200',
};

const dotColors = {
  default: 'bg-gray-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  champions: 'bg-emerald-500',
  loyal: 'bg-green-500',
  potential: 'bg-yellow-500',
  'at-risk': 'bg-orange-500',
  hibernating: 'bg-red-500',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full border';

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}

// Helper function to get badge variant from RFM segment
export function getSegmentVariant(segment: RFMSegment): BadgeProps['variant'] {
  const segmentMap: Record<RFMSegment, BadgeProps['variant']> = {
    [RFMSegment.CHAMPIONS]: 'champions',
    [RFMSegment.LOYAL]: 'loyal',
    [RFMSegment.POTENTIAL]: 'potential',
    [RFMSegment.AT_RISK]: 'at-risk',
    [RFMSegment.HIBERNATING]: 'hibernating',
  };
  return segmentMap[segment] || 'default';
}

export default Badge;
