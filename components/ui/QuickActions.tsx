import React, { useState } from 'react';
import { 
  Zap, 
  Plus, 
  UserPlus, 
  Ticket, 
  FileBarChart,
  X,
  Megaphone
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  color: string;
}

interface QuickActionsProps {
  onCreateCampaign?: () => void;
  onAddCustomer?: () => void;
  onNewTicket?: () => void;
  onGenerateReport?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateCampaign,
  onAddCustomer,
  onNewTicket,
  onGenerateReport,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions: QuickAction[] = [
    {
      id: 'campaign',
      label: 'Create Campaign',
      icon: <Megaphone size={18} />,
      onClick: onCreateCampaign,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      id: 'customer',
      label: 'Add Customer',
      icon: <UserPlus size={18} />,
      onClick: onAddCustomer,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      id: 'ticket',
      label: 'New Ticket',
      icon: <Ticket size={18} />,
      onClick: onNewTicket,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      id: 'report',
      label: 'Generate Report',
      icon: <FileBarChart size={18} />,
      onClick: onGenerateReport,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-2 mb-2">
          {actions.map((action, index) => (
            <button
              key={action.id}
              onClick={() => {
                action.onClick?.();
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-white shadow-lg ${action.color} transition-all transform hover:scale-105`}
              style={{
                animation: `slideIn 0.2s ease-out ${index * 0.05}s both`,
              }}
            >
              {action.icon}
              <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-110 ${
          isOpen 
            ? 'bg-gray-700 rotate-45' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600'
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Zap size={24} className="text-white" />
        )}
      </button>

      {/* Tooltip when closed */}
      {!isOpen && (
        <div className="absolute -top-1 -left-2 px-2 py-0.5 bg-gray-900 text-white text-xs rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          Quick Actions
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default QuickActions;
