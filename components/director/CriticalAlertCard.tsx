import React from 'react';
import { AlertTriangle, XCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { CriticalAlert } from '../../services/mockExecutiveData';

interface CriticalAlertCardProps {
  alert: CriticalAlert;
  onAction?: (alert: CriticalAlert) => void;
  onDismiss?: (alertId: string) => void;
}

const CriticalAlertCard: React.FC<CriticalAlertCardProps> = ({
  alert,
  onAction,
  onDismiss
}) => {
  const severityConfig = {
    HIGH: {
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      badgeColor: 'bg-red-600 text-white'
    },
    MEDIUM: {
      icon: AlertCircle,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      badgeColor: 'bg-orange-600 text-white'
    },
    LOW: {
      icon: AlertCircle,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      badgeColor: 'bg-blue-600 text-white'
    }
  };
  
  const config = severityConfig[alert.severity];
  const Icon = config.icon;
  
  return (
    <div className={`rounded-xl p-5 border-2 ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center shrink-0`}>
          <Icon size={20} className={config.iconColor} />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h5 className="font-bold text-gray-900">{alert.title}</h5>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.badgeColor}`}>
                  {alert.severity}
                </span>
              </div>
              <p className="text-sm text-gray-600">{alert.description}</p>
            </div>
            
            {/* Dismiss button */}
            {onDismiss && (
              <button
                onClick={() => onDismiss(alert.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Dismiss alert"
              >
                <XCircle size={18} />
              </button>
            )}
          </div>
          
          {/* Metrics */}
          {alert.metrics && alert.metrics.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-3">
              {alert.metrics.map((metric, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{metric.label}:</span>
                  <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Action button */}
          {onAction && alert.actionLabel && (
            <button
              onClick={() => onAction(alert)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                alert.severity === 'HIGH' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : alert.severity === 'MEDIUM'
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {alert.actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CriticalAlertCard;
