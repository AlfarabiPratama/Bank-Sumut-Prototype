import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RFMSegment, User } from '../types';
import { MOCK_USER, MOCK_CUSTOMERS_LIST } from '../constants';

// Demo State Interface
export interface DemoState {
  isActive: boolean;
  simulatedTime: string; // "HH:MM" format
  simulatedDay: string; // "Senin", "Selasa", etc.
  selectedPreset: 'custom' | 'champions' | 'at_risk' | 'new_customer';
  simulatedUser: User;
}

// Preset Configurations
const PRESETS: Record<string, Partial<User>> = {
  champions: {
    name: 'Siti Aminah (Champions)',
    balance: 154000000,
    segment: RFMSegment.CHAMPIONS,
    points: 45000,
    level: 50,
    rfmScore: { recency: 5, frequency: 5, monetary: 5 },
    age: 35,
    accountStatus: 'Premium',
    activeTimeSlot: '20:00-23:00',
    preferredChannel: 'Mobile App',
    location: 'Medan',
    occupation: 'Pengusaha',
    email: 'siti.champions@email.com',
    phone: '081234567890',
  },
  at_risk: {
    name: 'Rian Siregar (At Risk)',
    balance: 500000,
    segment: RFMSegment.AT_RISK,
    points: 200,
    level: 5,
    rfmScore: { recency: 1, frequency: 1, monetary: 2 },
    age: 22,
    accountStatus: 'Dormant',
    activeTimeSlot: undefined,
    preferredChannel: 'ATM',
    location: 'Pematangsiantar',
    occupation: 'Pelajar',
    email: 'rian.atrisk@email.com',
    phone: '085678901234',
  },
  new_customer: {
    name: 'User Baru (New)',
    balance: 1000000,
    segment: RFMSegment.POTENTIAL, // Use POTENTIAL for new users
    points: 50,
    level: 1,
    rfmScore: { recency: 5, frequency: 1, monetary: 1 },
    age: 25,
    accountStatus: 'New',
    activeTimeSlot: '12:00-14:00',
    preferredChannel: 'Mobile App',
    location: 'Binjai',
    occupation: 'Karyawan',
    email: 'newuser@email.com',
    phone: '087654321098',
  },
};

// Context Type
interface DemoContextType {
  demoState: DemoState;
  setSimulatedTime: (time: string) => void;
  setSimulatedDay: (day: string) => void;
  applyPreset: (preset: 'custom' | 'champions' | 'at_risk' | 'new_customer') => void;
  updateCustomUser: (updates: Partial<User>) => void;
  toggleDemoMode: () => void;
  resetAll: () => void;
  resetTime: () => void;
  resetUser: () => void;
  getActiveTimeSlot: () => string;
}

// Initial State
const getInitialState = (): DemoState => ({
  isActive: false,
  simulatedTime: new Date().toTimeString().slice(0, 5),
  simulatedDay: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()],
  selectedPreset: 'custom',
  simulatedUser: { ...MOCK_USER },
});

// Create Context
const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Provider Component
export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [demoState, setDemoState] = useState<DemoState>(getInitialState());

  const setSimulatedTime = (time: string) => {
    setDemoState(prev => ({ ...prev, simulatedTime: time, isActive: true }));
  };

  const setSimulatedDay = (day: string) => {
    setDemoState(prev => ({ ...prev, simulatedDay: day, isActive: true }));
  };

  const applyPreset = (preset: 'custom' | 'champions' | 'at_risk' | 'new_customer') => {
    if (preset === 'custom') {
      setDemoState(prev => ({ ...prev, selectedPreset: 'custom', simulatedUser: { ...MOCK_USER }, isActive: true }));
    } else {
      const presetData = PRESETS[preset];
      setDemoState(prev => ({
        ...prev,
        selectedPreset: preset,
        simulatedUser: { ...MOCK_USER, ...presetData, id: `demo_${preset}` },
        isActive: true,
      }));
    }
  };

  const updateCustomUser = (updates: Partial<User>) => {
    setDemoState(prev => ({
      ...prev,
      simulatedUser: { ...prev.simulatedUser, ...updates },
      selectedPreset: 'custom',
      isActive: true,
    }));
  };

  const toggleDemoMode = () => {
    setDemoState(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const resetAll = () => {
    setDemoState(getInitialState());
  };

  const resetTime = () => {
    setDemoState(prev => ({
      ...prev,
      simulatedTime: new Date().toTimeString().slice(0, 5),
      simulatedDay: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay()],
    }));
  };

  const resetUser = () => {
    setDemoState(prev => ({
      ...prev,
      simulatedUser: { ...MOCK_USER },
      selectedPreset: 'custom',
    }));
  };

  const getActiveTimeSlot = (): string => {
    const hour = parseInt(demoState.simulatedTime.split(':')[0]);
    if (hour >= 6 && hour < 12) return '06:00-12:00';
    if (hour >= 12 && hour < 17) return '12:00-17:00';
    if (hour >= 17 && hour < 22) return '17:00-22:00';
    return '22:00-06:00';
  };

  return (
    <DemoContext.Provider value={{
      demoState,
      setSimulatedTime,
      setSimulatedDay,
      applyPreset,
      updateCustomUser,
      toggleDemoMode,
      resetAll,
      resetTime,
      resetUser,
      getActiveTimeSlot,
    }}>
      {children}
    </DemoContext.Provider>
  );
};

// Hook
export const useDemoContext = (): DemoContextType => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within a DemoProvider');
  }
  return context;
};

export default DemoContext;
