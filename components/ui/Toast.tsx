import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

// Toast Types
type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

// Toast Context
const ToastContext = createContext<ToastContextType | null>(null);

// Toast Provider Component
export function ToastProvider({ 
  children, 
  position = 'top-right' 
}: { 
  children: React.ReactNode; 
  position?: ToastPosition;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message, duration: 3000 });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message, duration: 5000 });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message, duration: 4000 });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message, duration: 3000 });
  }, [addToast]);

  const positionStyles: Record<ToastPosition, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      
      {/* Toast Container */}
      <div className={`fixed ${positionStyles[position]} z-50 flex flex-col gap-2`}>
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Individual Toast Item
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(onClose, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onClose]);

  const typeConfig = {
    success: {
      icon: <CheckCircle2 size={20} />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-500',
      titleColor: 'text-green-800',
    },
    error: {
      icon: <AlertCircle size={20} />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      titleColor: 'text-red-800',
    },
    warning: {
      icon: <AlertTriangle size={20} />,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-500',
      titleColor: 'text-amber-800',
    },
    info: {
      icon: <Info size={20} />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-800',
    },
  };

  const config = typeConfig[toast.type];

  return (
    <div 
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[320px] max-w-md
        ${config.bgColor} ${config.borderColor}
        animate-in slide-in-from-right fade-in duration-300
      `}
    >
      <div className={config.iconColor}>
        {config.icon}
      </div>
      <div className="flex-1">
        <p className={`font-medium ${config.titleColor}`}>
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-sm text-gray-600 mt-1">
            {toast.message}
          </p>
        )}
      </div>
      <button 
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// Hook to use Toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export default ToastProvider;
