import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Rocket, PlayCircle, CheckCircle2 } from 'lucide-react';

// Types
export interface FeatureData {
  id: string;
  title: string;
  description: string;
  icon: string;
  tab?: string;
  steps?: string[];
  permissions?: string[];
  limitations?: string[];
  tips?: string[];
  isNew?: boolean;
  isPopular?: boolean;
  relatedFeatures?: string[];
}

interface GuideCardProps {
  feature: FeatureData;
  onNavigate?: (tab: string) => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ feature, onNavigate }) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleNavigate = () => {
    if (feature.tab && onNavigate) {
      onNavigate(feature.tab);
    }
  };
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{feature.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-gray-900">{feature.title}</h4>
              {feature.isNew && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  BARU
                </span>
              )}
              {feature.isPopular && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                  ⭐ Populer
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          {feature.tab && (
            <button 
              onClick={handleNavigate}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            >
              <Rocket size={14} />
              Coba Fitur Ini
            </button>
          )}
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {expanded ? 'Sembunyikan' : 'Lihat Detail'}
          </button>
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
          {/* Steps */}
          {feature.steps && feature.steps.length > 0 && (
            <div>
              <h5 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <PlayCircle size={16} className="text-blue-500" />
                Cara Menggunakan
              </h5>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-600 pl-1">
                {feature.steps.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>
          )}
          
          {/* Permissions */}
          {feature.permissions && feature.permissions.length > 0 && (
            <div>
              <h5 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                Anda Dapat
              </h5>
              <ul className="space-y-1 text-sm">
                {feature.permissions.map((perm, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-green-700">
                    <span>✓</span> {perm}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Limitations */}
          {feature.limitations && feature.limitations.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <h5 className="text-sm font-bold text-orange-800 mb-2">
                ℹ️ Batasan Role Anda
              </h5>
              <ul className="space-y-1 text-sm">
                {feature.limitations.map((limit, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-orange-700">
                    <span>✗</span> {limit}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Tips */}
          {feature.tips && feature.tips.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h5 className="text-sm font-bold text-blue-800 mb-2">
                💡 Pro Tips
              </h5>
              <ul className="space-y-1 text-sm text-blue-700">
                {feature.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-0.5">•</span> 
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Related Features */}
          {feature.relatedFeatures && feature.relatedFeatures.length > 0 && (
            <div>
              <h5 className="text-sm font-bold text-gray-800 mb-2">
                🔗 Fitur Terkait
              </h5>
              <div className="flex flex-wrap gap-2">
                {feature.relatedFeatures.map((related, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200 cursor-pointer"
                  >
                    {related}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuideCard;
