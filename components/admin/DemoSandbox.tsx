import React, { useState } from 'react';
import { Clock, Calendar, User, Zap, RotateCcw, Play, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useDemoContext } from '../../contexts/DemoContext';
import { RFMSegment } from '../../types';

const DemoSandbox: React.FC = () => {
  const {
    demoState,
    setSimulatedTime,
    setSimulatedDay,
    applyPreset,
    updateCustomUser,
    resetAll,
    resetTime,
    resetUser,
    getActiveTimeSlot,
  } = useDemoContext();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
  
  const presets = [
    { key: 'champions', label: 'Champions', icon: '👑', color: 'bg-green-500' },
    { key: 'at_risk', label: 'At Risk', icon: '⚠️', color: 'bg-red-500' },
    { key: 'new_customer', label: 'New Customer', icon: '🆕', color: 'bg-blue-500' },
    { key: 'custom', label: 'Custom', icon: '⚙️', color: 'bg-gray-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg">
            <Zap size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">🎮 CRM Demo Sandbox</h2>
            <p className="text-purple-100 text-sm">Simulasikan perilaku nasabah dan lihat dampak real-time di Dashboard</p>
          </div>
        </div>
        
        {demoState.isActive && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Demo Mode Active - Perubahan akan tercermin di Admin Dashboard</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Time & Day Controls */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Clock className="text-purple-600" size={20} />
            Simulasi Waktu Akses
          </h3>

          {/* Time Slider */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Jam Simulasi</span>
              <span className="font-bold text-purple-600 text-lg">{demoState.simulatedTime}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1439"
              value={parseInt(demoState.simulatedTime.split(':')[0]) * 60 + parseInt(demoState.simulatedTime.split(':')[1])}
              onChange={(e) => {
                const totalMinutes = parseInt(e.target.value);
                const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
                const mins = (totalMinutes % 60).toString().padStart(2, '0');
                setSimulatedTime(`${hours}:${mins}`);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
            <div className="mt-2 text-center">
              <span className="text-xs px-3 py-1 bg-purple-50 text-purple-700 rounded-full">
                Detected: {getActiveTimeSlot()} ({
                  parseInt(demoState.simulatedTime.split(':')[0]) >= 6 && parseInt(demoState.simulatedTime.split(':')[0]) < 12 ? 'Pagi' :
                  parseInt(demoState.simulatedTime.split(':')[0]) >= 12 && parseInt(demoState.simulatedTime.split(':')[0]) < 17 ? 'Siang' :
                  parseInt(demoState.simulatedTime.split(':')[0]) >= 17 && parseInt(demoState.simulatedTime.split(':')[0]) < 22 ? 'Malam' : 'Dini Hari'
                })
              </span>
            </div>
          </div>

          {/* Day Selector */}
          <div>
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Hari Simulasi
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setSimulatedDay(day)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    demoState.simulatedDay === day 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Reset */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
            <button 
              onClick={resetTime}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
            >
              <RotateCcw size={14} /> Reset Waktu
            </button>
          </div>
        </div>

        {/* RIGHT: Preset & User Controls */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
            <User className="text-purple-600" size={20} />
            Preset Nasabah
          </h3>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {presets.map(preset => (
              <button
                key={preset.key}
                onClick={() => applyPreset(preset.key as any)}
                className={`p-4 rounded-xl border-2 transition flex flex-col items-center gap-2 ${
                  demoState.selectedPreset === preset.key
                    ? 'border-purple-500 bg-purple-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-3xl">{preset.icon}</span>
                <span className={`text-sm font-bold ${demoState.selectedPreset === preset.key ? 'text-purple-700' : 'text-gray-700'}`}>
                  {preset.label}
                </span>
              </button>
            ))}
          </div>

          {/* Current User Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Current Simulated User</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Nama:</span>
                <span className="ml-1 font-bold text-gray-800">{demoState.simulatedUser.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Segmen:</span>
                <span className={`ml-1 font-bold ${
                  demoState.simulatedUser.segment === 'Champions' ? 'text-green-600' :
                  demoState.simulatedUser.segment === 'At Risk' ? 'text-red-600' :
                  demoState.simulatedUser.segment === 'Potential' ? 'text-blue-600' :
                  'text-yellow-600'
                }`}>{demoState.simulatedUser.segment}</span>
              </div>
              <div>
                <span className="text-gray-500">Saldo:</span>
                <span className="ml-1 font-bold text-gray-800">Rp {demoState.simulatedUser.balance.toLocaleString('id-ID')}</span>
              </div>
              <div>
                <span className="text-gray-500">Points:</span>
                <span className="ml-1 font-bold text-gray-800">{demoState.simulatedUser.points.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Advanced Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition"
          >
            <span className="flex items-center gap-2">
              <Settings size={14} />
              Custom Settings
            </span>
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* Advanced Settings */}
          {showAdvanced && (
            <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <label className="text-xs text-gray-500 uppercase">Saldo</label>
                <input
                  type="number"
                  value={demoState.simulatedUser.balance}
                  onChange={(e) => updateCustomUser({ balance: parseInt(e.target.value) || 0 })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">Segment</label>
                <select
                  value={demoState.simulatedUser.segment}
                  onChange={(e) => updateCustomUser({ segment: e.target.value as RFMSegment })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {Object.values(RFMSegment).map(seg => (
                    <option key={seg} value={seg}>{seg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase">Lokasi</label>
                <select
                  value={demoState.simulatedUser.location || 'Medan'}
                  onChange={(e) => updateCustomUser({ location: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="Medan">Medan</option>
                  <option value="Binjai">Binjai</option>
                  <option value="Pematangsiantar">Pematangsiantar</option>
                  <option value="Deli Serdang">Deli Serdang</option>
                </select>
              </div>
            </div>
          )}

          {/* Reset User */}
          <div className="mt-4 flex gap-2">
            <button 
              onClick={resetUser}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
            >
              <RotateCcw size={14} /> Reset User
            </button>
          </div>
        </div>
      </div>

      {/* RESET ALL */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-red-800">🔄 Reset All</h4>
          <p className="text-sm text-red-600">Kembalikan semua setting ke default</p>
        </div>
        <button
          onClick={resetAll}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition flex items-center gap-2"
        >
          <RotateCcw size={16} /> Reset Semua
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-bold text-blue-800 mb-2">📖 Cara Menggunakan</h4>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Set <strong>Jam & Hari</strong> untuk simulasi waktu akses nasabah</li>
          <li>Pilih <strong>Preset</strong> (Champions/At Risk/New) untuk load skenario</li>
          <li>Lihat perubahan di <strong>Admin Dashboard</strong> → data nasabah terupdate</li>
          <li>Coba buat <strong>Campaign</strong> yang target preset tersebut</li>
        </ol>
      </div>
    </div>
  );
};

export default DemoSandbox;
