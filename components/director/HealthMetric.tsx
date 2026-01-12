import React from 'react';
import CircularProgress from '../ui/CircularProgress';

export interface HealthIndicator {
  label: string;
  value: number;
  threshold: number;
  inverse?: boolean; // true if lower is better
  unit?: string;
}

interface HealthMetricProps {
  category: string;
  score: number; // 0-100
  indicators: HealthIndicator[];
}

const HealthMetric: React.FC<HealthMetricProps> = ({
  category,
  score,
  indicators
}) => {
  const getScoreColor = (score: number): 'green' | 'orange' | 'red' => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  };
  
  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Attention';
    return 'Critical';
  };
  
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  
  const getIndicatorStatus = (indicator: HealthIndicator): 'success' | 'warning' | 'danger' => {
    const { value, threshold, inverse } = indicator;
    const isGood = inverse ? value < threshold : value > threshold;
    
    if (isGood) return 'success';
    if (inverse) {
      return value > threshold * 1.5 ? 'danger' : 'warning';
    } else {
      return value < threshold * 0.7 ? 'danger' : 'warning';
    }
  };
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-gray-900">{category}</h4>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          scoreColor === 'green' ? 'bg-green-100 text-green-700' :
          scoreColor === 'orange' ? 'bg-orange-100 text-orange-700' :
          'bg-red-100 text-red-700'
        }`}>
          {scoreLabel}
        </div>
      </div>
      
      {/* Circular Progress */}
      <div className="flex justify-center mb-6">
        <CircularProgress value={score} size={120} color={scoreColor} />
      </div>
      
      {/* Indicators */}
      <div className="space-y-3">
        {indicators.map((indicator, idx) => {
          const status = getIndicatorStatus(indicator);
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{indicator.label}</span>
                <span className={`font-bold ${
                  status === 'success' ? 'text-green-600' :
                  status === 'warning' ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {indicator.value}{indicator.unit || '%'}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    status === 'success' ? 'bg-green-500' :
                    status === 'warning' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, indicator.inverse ? 
                      100 - (indicator.value / indicator.threshold) * 100 :
                      (indicator.value / indicator.threshold) * 100
                    )}%` 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HealthMetric;
