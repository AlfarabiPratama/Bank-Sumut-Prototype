import React, { useState } from 'react';
import MobileApp from './components/mobile/MobileApp';
import AdminDashboard from './components/admin/AdminDashboard';
import { MOCK_USER } from './constants';
import { Smartphone, Monitor } from 'lucide-react';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'mobile' | 'admin'>('mobile');

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* View Switcher (For Demo Purposes) */}
      <div className="fixed bottom-6 right-6 z-[100] bg-white p-2 rounded-full shadow-2xl border border-gray-200 flex gap-2">
        <button
          onClick={() => setViewMode('mobile')}
          className={`p-3 rounded-full transition ${viewMode === 'mobile' ? 'bg-sumut-green text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
          title="Switch to Mobile View"
        >
          <Smartphone size={24} />
        </button>
        <button
          onClick={() => setViewMode('admin')}
          className={`p-3 rounded-full transition ${viewMode === 'admin' ? 'bg-indigo-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
          title="Switch to Admin Dashboard"
        >
          <Monitor size={24} />
        </button>
      </div>

      {viewMode === 'mobile' ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
           <div className="z-10 animate-in zoom-in duration-500">
              <MobileApp user={MOCK_USER} />
              <p className="text-white text-center mt-6 text-sm opacity-80 font-medium">SULTAN App Preview<br/>(Gen Z Interface)</p>
           </div>
        </div>
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
};

export default App;
