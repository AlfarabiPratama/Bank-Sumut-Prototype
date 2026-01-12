import React from 'react';
import { LucideIcon, TrendingUp, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';

export interface InsightCardProps {
  type: 'forecast' | 'warning' | 'opportunity' | 'success';
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

const InsightCard: React.FC<InsightCardProps> = ({
  type,
  title,
  icon,
  children
}) => {
  const config = {
    forecast: {
      icon: TrendingUp,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      titleColor: 'text-orange-900'
    },
    opportunity: {
      icon: Lightbulb,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      titleColor: 'text-purple-900'
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900'
    }
  };
  
  const typeConfig = config[type];
  const Icon = icon || typeConfig.icon;
  
  return (
    <div className={`rounded-xl p-5 border-2 ${typeConfig.bgColor} ${typeConfig.borderColor}`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg ${typeConfig.iconBg} flex items-center justify-center shrink-0`}>
          <Icon size={20} className={typeConfig.iconColor} />
        </div>
        <h3 className={`font-bold text-lg ${typeConfig.titleColor}`}>{title}</h3>
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

export default InsightCard;
