import React, { useState, useEffect } from 'react';
import MobileApp from './components/mobile/MobileApp';
import AdminDashboard from './components/admin/AdminDashboard';
import { DemoProvider, useDemoContext } from './contexts/DemoContext';
import { RoleProvider } from './contexts/RoleContext';
import { MOCK_USER, MOCK_CUSTOMERS_LIST, MOCK_CAMPAIGNS } from './constants';
import { User, Transaction, Campaign, DreamSaverActivity, PushNotification } from './types';
import { UserRole } from './types/rbac';

// App Content with RBAC
function AppContent() {
  const [view, setView] = useState<'mobile' | 'admin'>('admin');
  const { demoState } = useDemoContext();
  
  // RBAC State - managed here, role switcher in AdminDashboard sidebar
  const [currentRole, setCurrentRole] = useState<UserRole>('DIRECTOR');
  
  // State management for shared data
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USER);
  const [allCustomers, setAllCustomers] = useState<User[]>(MOCK_CUSTOMERS_LIST);
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [dreamSaverActivities, setDreamSaverActivities] = useState<DreamSaverActivity[]>([]);
  const [notifications, setNotifications] = useState<PushNotification[]>([]);

  // Get only active campaigns for mobile display
  const activeCampaigns = campaigns.filter(c => c.status === 'Active');

  // Handler to send notification from Admin
  const handleSendNotification = (notification: Omit<PushNotification, 'id' | 'sentAt' | 'read'>) => {
    const newNotification: PushNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      sentAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Handler to mark notification as read
  const handleMarkNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  // Handle user update from Mobile
  const handleUserUpdate = (updatedUser: User, activity?: Omit<DreamSaverActivity, 'id' | 'timestamp' | 'userId' | 'userName' | 'userAvatar'>) => {
    setCurrentUser(updatedUser);
    setAllCustomers(prev => 
      prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    
    if (activity) {
      const newActivity: DreamSaverActivity = {
        id: `act-${Date.now()}`,
        userId: updatedUser.id,
        userName: updatedUser.name,
        userAvatar: updatedUser.avatar,
        timestamp: new Date().toISOString(),
        ...activity
      };
      setDreamSaverActivities(prev => [newActivity, ...prev].slice(0, 50));
    }
  };

  // Sync demo state
  useEffect(() => {
    if (demoState.isActive) {
      const simulatedWithTimeSlot: User = {
        ...demoState.simulatedUser,
        activeTimeSlot: demoState.simulatedTime.split(':')[0] >= '06' && demoState.simulatedTime.split(':')[0] < '12' ? '06:00-12:00' :
                        demoState.simulatedTime.split(':')[0] >= '12' && demoState.simulatedTime.split(':')[0] < '17' ? '12:00-17:00' :
                        demoState.simulatedTime.split(':')[0] >= '17' && demoState.simulatedTime.split(':')[0] < '22' ? '17:00-22:00' : '22:00-06:00',
        preferredDays: [demoState.simulatedDay as any],
      };
      setCurrentUser(simulatedWithTimeSlot);
      
      setAllCustomers(prev => {
        const updated = [...prev];
        updated[0] = simulatedWithTimeSlot;
        return updated;
      });
    }
  }, [demoState.isActive, demoState.simulatedUser, demoState.simulatedTime, demoState.simulatedDay]);

  // Handle user switching
  const handleUserSwitch = (userId: string) => {
    const selectedUser = allCustomers.find(u => u.id === userId);
    if (selectedUser) {
      setCurrentUser(selectedUser);
      setAllCustomers(prev => prev.map(u => 
        u.id === userId ? selectedUser : u
      ));
    }
  };

  // Handle transaction
  const handleTransaction = (transaction: Transaction) => {
    const updatedUser: User = {
      ...currentUser,
      transactions: [transaction, ...currentUser.transactions],
      balance: currentUser.balance - transaction.amount
    };

    setCurrentUser(updatedUser);
    setAllCustomers(prev => 
      prev.map(user => 
        user.id === currentUser.id ? updatedUser : user
      )
    );
  };

  // Handle campaign updates
  const handleCampaignsChange = (newCampaigns: Campaign[]) => {
    setCampaigns(newCampaigns);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Simple Header - View Switcher Only */}
      <div className="w-full bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/bank-sumut-logo.svg" alt="Bank Sumut" className="h-8 w-auto" />
          <h1 className="font-bold text-lg text-gray-800">SULTAN <span className="text-sumut-blue text-sm font-normal">RFM CRM</span></h1>
        </div>
        
        <div className="h-6 w-px bg-gray-300 mx-2" />
        
        <button
          onClick={() => setView('admin')}
          className={`px-5 py-2 rounded-lg font-semibold transition text-sm ${
            view === 'admin'
              ? 'bg-gradient-to-r from-sumut-blue to-sumut-darkBlue text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📊 Admin Dashboard
        </button>
        <button
          onClick={() => setView('mobile')}
          className={`px-5 py-2 rounded-lg font-semibold transition text-sm ${
            view === 'mobile'
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📱 Mobile App
        </button>
      </div>

      {/* Demo Mode Indicator */}
      {demoState.isActive && (
        <div className="fixed top-20 left-4 z-50 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Demo: {demoState.simulatedTime} • {demoState.simulatedDay}
        </div>
      )}

      {/* Render Views */}
      {view === 'mobile' && (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
          <MobileApp 
            user={currentUser} 
            onTransaction={handleTransaction}
            activeCampaigns={activeCampaigns}
            onUserSwitch={handleUserSwitch}
            availableUsers={allCustomers.slice(0, 5)}
            onUserUpdate={handleUserUpdate}
            notifications={notifications}
            onMarkNotificationRead={handleMarkNotificationRead}
            simulatedTime={demoState.isActive ? demoState.simulatedTime : undefined}
          />
        </div>
      )}

      {view === 'admin' && (
        <AdminDashboard 
          customers={allCustomers}
          campaigns={campaigns}
          onCampaignsChange={handleCampaignsChange}
          dreamSaverActivities={dreamSaverActivities}
          onSendNotification={handleSendNotification}
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
        />
      )}
    </div>
  );
}

// Main App - wrapped with providers
function App() {
  return (
    <DemoProvider>
      <RoleProvider>
        <AppContent />
      </RoleProvider>
    </DemoProvider>
  );
}

export default App;

