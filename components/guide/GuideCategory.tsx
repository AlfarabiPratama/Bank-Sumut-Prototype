import React, { useState, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface GuideCategoryProps {
  title: string;
  icon: string;
  children: ReactNode;
  defaultOpen?: boolean;
  count?: number;
}

const GuideCategory: React.FC<GuideCategoryProps> = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = true,
  count 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Category Header */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <h3 className="font-bold text-gray-900">{title}</h3>
          {count !== undefined && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
              {count}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp size={20} className="text-gray-500" />
        ) : (
          <ChevronDown size={20} className="text-gray-500" />
        )}
      </button>
      
      {/* Category Content */}
      {isOpen && (
        <div className="p-4 space-y-3 bg-gray-50/50">
          {children}
        </div>
      )}
    </div>
  );
};

export default GuideCategory;
