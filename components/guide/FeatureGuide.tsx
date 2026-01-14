import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Lightbulb, ArrowRight } from 'lucide-react';
import GuideCard from './GuideCard';
import GuideCategory from './GuideCategory';
import { getGuideByRole, RoleGuideData } from './data/guideData';
import { UserRole } from '../../contexts/RoleContext';

interface FeatureGuideProps {
  role: UserRole;
  onNavigate: (tab: string) => void;
}

const FeatureGuide: React.FC<FeatureGuideProps> = ({ role, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const guideData: RoleGuideData = useMemo(() => getGuideByRole(role), [role]);
  
  // Filter features based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return guideData.categories;
    
    const query = searchQuery.toLowerCase();
    return guideData.categories
      .map(category => ({
        ...category,
        features: category.features.filter(feature => 
          feature.title.toLowerCase().includes(query) ||
          feature.description.toLowerCase().includes(query) ||
          (feature.steps && feature.steps.some(step => step.toLowerCase().includes(query)))
        )
      }))
      .filter(category => category.features.length > 0);
  }, [guideData, searchQuery]);
  
  const totalFeatures = guideData.categories.reduce(
    (sum, cat) => sum + cat.features.length, 0
  );
  
  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="text-4xl">{guideData.icon}</div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BookOpen size={24} />
                Panduan Fitur: {guideData.title}
              </h1>
              <p className="mt-2 text-blue-100 leading-relaxed">
                {guideData.description}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {totalFeatures} Fitur Tersedia
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {guideData.categories.length} Kategori
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Tips */}
        {guideData.quickTips && guideData.quickTips.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <h3 className="font-bold text-yellow-800 flex items-center gap-2 mb-3">
              <Lightbulb size={18} className="text-yellow-600" />
              💡 Tips Cepat untuk {guideData.title}
            </h3>
            <ul className="space-y-1.5">
              {guideData.quickTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-yellow-800">
                  <span className="text-yellow-500 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Cari fitur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* No Results */}
        {searchQuery && filteredCategories.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <p className="text-gray-500">
              Tidak ditemukan fitur untuk "{searchQuery}"
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              Reset pencarian
            </button>
          </div>
        )}
        
        {/* Categories */}
        <div className="space-y-4">
          {filteredCategories.map(category => (
            <GuideCategory 
              key={category.id}
              title={category.title}
              icon={category.icon}
              count={category.features.length}
              defaultOpen={!searchQuery} // Open all if searching
            >
              {category.features.map(feature => (
                <GuideCard 
                  key={feature.id}
                  feature={feature}
                  onNavigate={onNavigate}
                />
              ))}
            </GuideCategory>
          ))}
        </div>
        
        {/* Footer */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
          <h3 className="font-bold text-gray-900 mb-2">
            Butuh Bantuan Lebih Lanjut?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Hubungi Supervisor atau Admin jika ada pertanyaan mengenai fitur yang tidak dijelaskan di panduan ini.
          </p>
          <div className="flex justify-center gap-3">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 transition">
              📧 Hubungi Support
            </button>
            <button 
              onClick={() => onNavigate('settings')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition"
            >
              ⚙️ Pengaturan
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureGuide;
