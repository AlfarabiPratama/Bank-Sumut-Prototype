import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, HelpCircle } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

export interface HeroKPIProps {
  icon: LucideIcon;
  iconColor?: string;
  label: string;
  value: string | number;
  subtitle?: string;
  change?: number; // percentage
  changeLabel?: string;
  target?: number;
  targetLabel?: string;
  status?: 'success' | 'warning' | 'danger' | 'default';
  breakdown?: {
    label: string;
    value: number | string;
    color?: string;
  }[];
  onClick?: () => void;
  tooltip?: string; // NEW: Tooltip for explaining the KPI
}

const HeroKPI: React.FC<HeroKPIProps> = ({
  icon: Icon,
  iconColor = 'blue',
  label,
  value,
  subtitle,
  change,
  changeLabel,
  target,
  targetLabel,
  status = 'default',
  breakdown,
  onClick,
  tooltip
}) => {
  const isPositive = change ? change > 0 : null;
  const targetProgress = target && typeof value === 'number' ? (value / target) * 100 : null;
  
  // Color schemes
  const colorClasses = {
    success: 'bg-green-50 border-green-200',
    warning: 'bg-orange-50 border-orange-200',
    danger: 'bg-red-50 border-red-200',
    default: 'bg-white border-gray-200'
  };
  
  const iconColors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };
  
  return (
    <div 
      className={`rounded-xl p-6 border-2 shadow-sm transition-all ${colorClasses[status]} ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${iconColors[iconColor as keyof typeof iconColors] || iconColors.blue} flex items-center justify-center shrink-0`}>
          <Icon size={24} />
        </div>
        
        {target !== undefined && targetLabel && (
          <div className="text-right">
            <p className="text-xs text-gray-500">{targetLabel}</p>
            <p className="text-sm font-bold text-gray-700">
              {typeof target === 'number' ? target.toLocaleString() : target}
            </p>
          </div>
        )}
      </div>
      
      {/* Label with Tooltip */}
      <div className="flex items-center gap-1.5 mb-1">
        <h4 className="text-sm font-medium text-gray-600">{label}</h4>
        {tooltip && (
          <Tooltip content={tooltip} position="top">
            <HelpCircle size={14} className="text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
          </Tooltip>
        )}
      </div>
      
      {/* Value */}
      <div className="mb-3">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      
      {/* Change Indicator */}
      {change !== undefined && (
        <div className="flex items-center gap-2 mb-3">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
            {isPositive ? (
              <TrendingUp size={14} className="text-green-600" />
            ) : (
              <TrendingDown size={14} className="text-red-600" />
            )}
            <span className={`text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(change).toFixed(1)}%
            </span>
          </div>
          {changeLabel && (
            <span className="text-xs text-gray-500">{changeLabel}</span>
          )}
        </div>
      )}
      
      {/* Progress Bar (for target) */}
      {targetProgress !== null && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Progress to Target</span>
            <span className="font-medium">{targetProgress.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${
                targetProgress >= 100 ? 'bg-green-500' :
                targetProgress >= 70 ? 'bg-blue-500' :
                targetProgress >= 50 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(targetProgress, 100)}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Breakdown Stats */}
      {breakdown && breakdown.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-2">
            {breakdown.map((item, idx) => (
              <div key={idx} className="text-center">
                <p 
                  className="text-lg font-bold"
                  style={{ color: item.color || '#374151' }}
                >
                  {item.value}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroKPI;
