import React from 'react';
import { FileQuestion, Search, Users, BarChart3, Bell, Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'search' | 'customers' | 'chart' | 'notifications';
  className?: string;
}

const defaultIcons = {
  default: <Inbox size={48} strokeWidth={1.5} />,
  search: <Search size={48} strokeWidth={1.5} />,
  customers: <Users size={48} strokeWidth={1.5} />,
  chart: <BarChart3 size={48} strokeWidth={1.5} />,
  notifications: <Bell size={48} strokeWidth={1.5} />,
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  className = '',
}: EmptyStateProps) {
  const displayIcon = icon || defaultIcons[variant];

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="text-gray-300 mb-4">
        {displayIcon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
