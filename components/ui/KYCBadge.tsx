import React from 'react';
import { Shield, ShieldCheck, ShieldAlert, ShieldX, Clock, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import type { User, KYCStatus } from '../../types';

interface KYCBadgeProps {
  user: User;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Calculate days until KYC expiry
 */
const getDaysUntilExpiry = (expiresAt: string): number => {
  const expiry = new Date(expiresAt);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * KYCBadge Component
 * 
 * Displays KYC (Know Your Customer) verification status.
 * Aligned with OJK POJK No. 11/2022 requirements.
 */
export const KYCBadge: React.FC<KYCBadgeProps> = ({
  user,
  showDetails = false,
  size = 'md',
  className = ''
}) => {
  const kyc = user.kycStatus;
  
  // Default to unverified if no KYC data
  if (!kyc) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full font-medium text-xs px-2 py-0.5 bg-gray-100 text-gray-600 ${className}`}>
        <Shield size={12} />
        Unverified
      </span>
    );
  }
  
  const daysUntilExpiry = getDaysUntilExpiry(kyc.expiresAt);
  const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  const isExpired = kyc.level === 'EXPIRED' || daysUntilExpiry <= 0;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16
  };
  
  // Level colors and icons
  const levelConfig: Record<string, { color: string; bgColor: string; icon: React.ReactNode; label: string }> = {
    'ENHANCED': { 
      color: 'text-green-700', 
      bgColor: 'bg-green-100', 
      icon: <ShieldCheck size={iconSize[size]} />,
      label: 'Enhanced KYC'
    },
    'STANDARD': { 
      color: 'text-blue-700', 
      bgColor: 'bg-blue-100', 
      icon: <Shield size={iconSize[size]} />,
      label: 'Standard KYC'
    },
    'BASIC': { 
      color: 'text-yellow-700', 
      bgColor: 'bg-yellow-100', 
      icon: <ShieldAlert size={iconSize[size]} />,
      label: 'Basic KYC'
    },
    'EXPIRED': { 
      color: 'text-red-700', 
      bgColor: 'bg-red-100', 
      icon: <ShieldX size={iconSize[size]} />,
      label: 'KYC Expired'
    }
  };
  
  const config = isExpired ? levelConfig['EXPIRED'] : levelConfig[kyc.level];
  
  if (!showDetails) {
    // Simple badge with expiry warning
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${config.bgColor} ${config.color}`}>
          {config.icon}
          {config.label}
        </span>
        {isExpiringSoon && !isExpired && (
          <span className="inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-full" title={`Expires in ${daysUntilExpiry} days`}>
            <Clock size={10} />
            {daysUntilExpiry}d
          </span>
        )}
      </div>
    );
  }

  // Detailed KYC card
  return (
    <div className={`p-4 rounded-lg border ${isExpired ? 'bg-red-50 border-red-200' : isExpiringSoon ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
            {config.icon}
          </div>
          <div>
            <span className={`font-semibold ${config.color}`}>{config.label}</span>
            <p className="text-xs text-gray-500">OJK POJK No. 11/2022</p>
          </div>
        </div>
        
        {/* Risk Level Badge */}
        <span className={`text-xs px-2 py-1 rounded font-medium ${
          kyc.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
          kyc.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
          'bg-green-100 text-green-700'
        }`}>
          Risk: {kyc.riskLevel}
        </span>
      </div>
      
      {/* Expiry Warning */}
      {isExpired && (
        <div className="mb-3 p-2 bg-red-100 rounded-lg flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-600" />
          <span className="text-sm font-medium text-red-700">KYC has expired! Customer must re-verify.</span>
        </div>
      )}
      
      {isExpiringSoon && !isExpired && (
        <div className="mb-3 p-2 bg-orange-100 rounded-lg flex items-center gap-2">
          <Clock size={16} className="text-orange-600" />
          <span className="text-sm font-medium text-orange-700">KYC expires in {daysUntilExpiry} days</span>
        </div>
      )}
      
      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Verification Method</p>
          <p className="font-medium text-gray-700">{kyc.verificationMethod.replace('_', ' ')}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Last Verified</p>
          <p className="font-medium text-gray-700">
            {new Date(kyc.verifiedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Expires On</p>
          <p className={`font-medium ${isExpired || isExpiringSoon ? 'text-red-600' : 'text-gray-700'}`}>
            {new Date(kyc.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">Documents</p>
          <p className="font-medium text-gray-700 flex items-center gap-1">
            <FileText size={14} />
            {kyc.documents?.length || 0} uploaded
          </p>
        </div>
      </div>
      
      {/* AML Flags */}
      {kyc.amlFlags && kyc.amlFlags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-red-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <AlertTriangle size={12} />
            AML Alerts ({kyc.amlFlags.length})
          </p>
          {kyc.amlFlags.map((flag, i) => (
            <div key={i} className="p-2 bg-red-50 rounded text-xs mb-1 flex items-center justify-between">
              <span className="text-red-700">{flag.type.replace(/_/g, ' ')}</span>
              <span className={`px-1.5 py-0.5 rounded ${
                flag.status === 'CLEARED' ? 'bg-green-100 text-green-700' :
                flag.status === 'ESCALATED' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>{flag.status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * KYC Status Indicator - Minimal version for tables/lists
 */
export const KYCIndicator: React.FC<{ user: User }> = ({ user }) => {
  const kyc = user.kycStatus;
  
  if (!kyc) {
    return <span className="inline-block w-2 h-2 rounded-full bg-gray-400" title="KYC not verified" />;
  }
  
  const daysUntilExpiry = getDaysUntilExpiry(kyc.expiresAt);
  const isExpired = kyc.level === 'EXPIRED' || daysUntilExpiry <= 0;
  const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  
  return (
    <span 
      className={`inline-block w-2 h-2 rounded-full ${
        isExpired ? 'bg-red-500' :
        isExpiringSoon ? 'bg-orange-500' :
        kyc.level === 'ENHANCED' ? 'bg-green-500' :
        kyc.level === 'STANDARD' ? 'bg-blue-500' :
        'bg-yellow-500'
      }`}
      title={`${kyc.level} KYC - ${isExpired ? 'Expired' : isExpiringSoon ? `Expires in ${daysUntilExpiry} days` : 'Valid'}`}
    />
  );
};

/**
 * KYC Summary Stats - For compliance dashboard
 */
export const KYCSummary: React.FC<{
  customers: User[];
  className?: string;
}> = ({ customers, className = '' }) => {
  const enhanced = customers.filter(c => c.kycStatus?.level === 'ENHANCED').length;
  const standard = customers.filter(c => c.kycStatus?.level === 'STANDARD').length;
  const basic = customers.filter(c => c.kycStatus?.level === 'BASIC').length;
  const expired = customers.filter(c => {
    if (!c.kycStatus) return true;
    if (c.kycStatus.level === 'EXPIRED') return true;
    return getDaysUntilExpiry(c.kycStatus.expiresAt) <= 0;
  }).length;
  const expiringSoon = customers.filter(c => {
    if (!c.kycStatus) return false;
    const days = getDaysUntilExpiry(c.kycStatus.expiresAt);
    return days > 0 && days <= 30;
  }).length;

  return (
    <div className={`grid grid-cols-5 gap-3 ${className}`}>
      <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
        <p className="text-xl font-bold text-green-700">{enhanced}</p>
        <p className="text-[10px] text-green-600 uppercase">Enhanced</p>
      </div>
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
        <p className="text-xl font-bold text-blue-700">{standard}</p>
        <p className="text-[10px] text-blue-600 uppercase">Standard</p>
      </div>
      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
        <p className="text-xl font-bold text-yellow-700">{basic}</p>
        <p className="text-[10px] text-yellow-600 uppercase">Basic</p>
      </div>
      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200 text-center">
        <p className="text-xl font-bold text-orange-700">{expiringSoon}</p>
        <p className="text-[10px] text-orange-600 uppercase">Expiring</p>
      </div>
      <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
        <p className="text-xl font-bold text-red-700">{expired}</p>
        <p className="text-[10px] text-red-600 uppercase">Expired</p>
      </div>
    </div>
  );
};

/**
 * KYC Alert Panel - Shows customers needing attention
 */
export const KYCAlertPanel: React.FC<{
  customers: User[];
  onCustomerClick?: (customer: User) => void;
  className?: string;
}> = ({ customers, onCustomerClick, className = '' }) => {
  const alertCustomers = customers.filter(c => {
    if (!c.kycStatus) return true;
    if (c.kycStatus.level === 'EXPIRED') return true;
    if (getDaysUntilExpiry(c.kycStatus.expiresAt) <= 30) return true;
    if (c.kycStatus.amlFlags && c.kycStatus.amlFlags.some(f => f.status === 'PENDING_REVIEW')) return true;
    return false;
  }).slice(0, 5); // Show max 5

  if (alertCustomers.length === 0) {
    return (
      <div className={`p-4 bg-green-50 rounded-lg border border-green-200 ${className}`}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-green-600" size={20} />
          <span className="text-green-700 font-medium">All KYC verifications are up to date</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 bg-red-50 rounded-lg border border-red-200 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="text-red-600" size={20} />
        <span className="text-red-700 font-bold">{alertCustomers.length} customers need KYC attention</span>
      </div>
      <div className="space-y-2">
        {alertCustomers.map(customer => (
          <div 
            key={customer.id}
            className="p-2 bg-white rounded border border-red-100 flex items-center justify-between cursor-pointer hover:bg-red-50"
            onClick={() => onCustomerClick?.(customer)}
          >
            <div className="flex items-center gap-2">
              <img src={customer.avatar} alt={customer.name} className="w-8 h-8 rounded-full" />
              <div>
                <p className="text-sm font-medium text-gray-800">{customer.name}</p>
                <p className="text-xs text-gray-500">{customer.kycStatus?.level || 'Unverified'}</p>
              </div>
            </div>
            <span className="text-xs text-red-600 font-medium">
              {!customer.kycStatus ? 'No KYC' :
               customer.kycStatus.level === 'EXPIRED' ? 'Expired' :
               getDaysUntilExpiry(customer.kycStatus.expiresAt) <= 0 ? 'Expired' :
               `${getDaysUntilExpiry(customer.kycStatus.expiresAt)}d left`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KYCBadge;
