import React, { useState } from 'react';
import { Gamepad2, Clock, User, ChevronUp, ChevronDown, X, Power } from 'lucide-react';
import { useDemoContext } from '../contexts/DemoContext';

const MiniDemoPanel: React.FC = () => {
  const { demoState, setSimulatedTime, applyPreset, toggleDemoMode, resetAll } = useDemoContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition"
      >
        <Gamepad2 size={20} />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ${isExpanded ? 'w-72' : 'w-56'}`}>
      {/* Header */}
      <div className={`${demoState.isActive ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gray-400'} text-white p-3 flex items-center justify-between transition-colors`}>
        <div className="flex items-center gap-2">
          <Gamepad2 size={16} />
          <span className="font-bold text-sm">Demo Mode</span>
          {demoState.isActive && (
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/20 rounded transition"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/20 rounded transition"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        {/* ON/OFF Toggle */}
        <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <Power size={14} className={demoState.isActive ? 'text-green-600' : 'text-gray-400'} />
            <span className="text-xs font-medium text-gray-600">Demo Mode</span>
          </div>
          <button
            onClick={toggleDemoMode}
            className={`relative w-11 h-6 rounded-full transition-colors ${demoState.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${demoState.isActive ? 'translate-x-6' : 'translate-x-1'}`}></span>
          </button>
        </div>

        {/* Time Display - only show when active */}
        {demoState.isActive && (
          <>
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-purple-600" />
                <span className="text-xs text-gray-500">Jam</span>
              </div>
              <input
                type="time"
                value={demoState.simulatedTime}
                onChange={(e) => setSimulatedTime(e.target.value)}
                className="text-sm font-bold text-purple-700 bg-transparent border-none focus:outline-none"
              />
            </div>

            {/* Day & Segment */}
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <User size={14} className="text-purple-600" />
                <span className="text-xs text-gray-500">User</span>
              </div>
              <span className={`text-xs font-bold ${
                demoState.simulatedUser.segment === 'Champions' ? 'text-green-600' :
                demoState.simulatedUser.segment === 'At Risk' ? 'text-red-600' :
                'text-blue-600'
              }`}>
                {demoState.simulatedUser.segment}
              </span>
            </div>
          </>
        )}

        {/* Expanded: Quick Presets */}
        {isExpanded && (
          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-gray-100">
            <button
              onClick={() => applyPreset('champions')}
              className={`p-2 rounded text-xs font-medium transition ${
                demoState.selectedPreset === 'champions' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              👑 VIP
            </button>
            <button
              onClick={() => applyPreset('at_risk')}
              className={`p-2 rounded text-xs font-medium transition ${
                demoState.selectedPreset === 'at_risk' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              ⚠️ Risk
            </button>
            <button
              onClick={() => applyPreset('new_customer')}
              className={`p-2 rounded text-xs font-medium transition ${
                demoState.selectedPreset === 'new_customer' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              🆕 New
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniDemoPanel;
