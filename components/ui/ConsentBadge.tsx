import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Mail, MessageSquare, Bell, Phone } from 'lucide-react';
import type { User } from '../../types';

interface ConsentBadgeProps {
  user: User;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * ConsentBadge Component
 * 
 * Displays marketing consent status for a customer.
 * Aligned with UU PDP (Undang-Undang Perlindungan Data Pribadi) requirements.
 */
export const ConsentBadge: React.FC<ConsentBadgeProps> = ({
  user,
  showDetails = false,
  size = 'md',
  className = ''
}) => {
  const consent = user.marketingConsent;
  const isOptedIn = consent?.optIn ?? false;
  const channels = consent?.channels || [];
  const lastUpdated = consent?.lastUpdated;

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

  if (!showDetails) {
    // Simple badge
    return (
      <span 
        className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]} ${
          isOptedIn 
            ? 'bg-green-100 text-green-700' 
            : 'bg-orange-100 text-orange-700'
        } ${className}`}
      >
        {isOptedIn ? (
          <>
            <CheckCircle size={iconSize[size]} />
            Eligible
          </>
        ) : (
          <>
            <XCircle size={iconSize[size]} />
            No Consent
          </>
        )}
      </span>
    );
  }

  // Detailed consent card
  return (
    <div className={`p-4 rounded-lg border ${
      isOptedIn 
        ? 'bg-green-50 border-green-200' 
        : 'bg-orange-50 border-orange-200'
    } ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isOptedIn ? (
            <CheckCircle className="text-green-600" size={20} />
          ) : (
            <AlertCircle className="text-orange-600" size={20} />
          )}
          <span className={`font-semibold ${isOptedIn ? 'text-green-800' : 'text-orange-800'}`}>
            {isOptedIn ? 'Marketing Consent Granted' : 'Marketing Consent Required'}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${
          isOptedIn 
            ? 'bg-green-100 text-green-700' 
            : 'bg-orange-100 text-orange-700'
        }`}>
          {isOptedIn ? 'ELIGIBLE' : 'INELIGIBLE'}
        </span>
      </div>

      {isOptedIn && channels.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-2">Approved Channels:</p>
          <div className="flex flex-wrap gap-2">
            {channels.includes('email') && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white rounded border border-gray-200 text-gray-600">
                <Mail size={12} /> Email
              </span>
            )}
            {channels.includes('sms') && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white rounded border border-gray-200 text-gray-600">
                <MessageSquare size={12} /> SMS
              </span>
            )}
            {channels.includes('push') && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white rounded border border-gray-200 text-gray-600">
                <Bell size={12} /> Push
              </span>
            )}
            {channels.includes('whatsapp') && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-white rounded border border-gray-200 text-gray-600">
                <Phone size={12} /> WhatsApp
              </span>
            )}
          </div>
        </div>
      )}

      {!isOptedIn && (
        <p className="text-sm text-orange-700 mb-3">
          ⚠️ Nasabah belum memberikan persetujuan marketing sesuai UU PDP. 
          Tidak dapat dimasukkan ke campaign.
        </p>
      )}

      {lastUpdated && (
        <p className="text-xs text-gray-400">
          Last updated: {new Date(lastUpdated).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      )}
    </div>
  );
};

/**
 * ConsentStatus Indicator - Minimal version for tables/lists
 */
export const ConsentIndicator: React.FC<{ user: User }> = ({ user }) => {
  const isOptedIn = user.marketingConsent?.optIn ?? false;
  
  return (
    <span 
      className={`inline-block w-2 h-2 rounded-full ${isOptedIn ? 'bg-green-500' : 'bg-orange-500'}`}
      title={isOptedIn ? 'Marketing consent granted' : 'No marketing consent'}
    />
  );
};

/**
 * ConsentGate Component
 * 
 * Wraps content and only shows it if user has marketing consent.
 * Shows a consent required message otherwise.
 */
export const ConsentGate: React.FC<{
  user: User;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ user, children, fallback }) => {
  const isOptedIn = user.marketingConsent?.optIn ?? false;

  if (isOptedIn) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
      <XCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
      <p className="text-sm font-medium text-orange-700">Consent Required</p>
      <p className="text-xs text-orange-600 mt-1">
        Customer must provide marketing consent (UU PDP) before this action.
      </p>
    </div>
  );
};

/**
 * Consent Summary Stats - For marketing dashboard
 */
export const ConsentSummary: React.FC<{
  customers: User[];
  className?: string;
}> = ({ customers, className = '' }) => {
  const eligible = customers.filter(c => c.marketingConsent?.optIn).length;
  const ineligible = customers.length - eligible;
  const eligiblePercent = customers.length > 0 
    ? Math.round((eligible / customers.length) * 100) 
    : 0;

  return (
    <div className={`grid grid-cols-3 gap-4 ${className}`}>
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-2xl font-bold text-green-700">{eligible}</p>
        <p className="text-xs text-green-600">Eligible for Marketing</p>
      </div>
      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
        <p className="text-2xl font-bold text-orange-700">{ineligible}</p>
        <p className="text-xs text-orange-600">Consent Required</p>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-2xl font-bold text-gray-700">{eligiblePercent}%</p>
        <p className="text-xs text-gray-600">Consent Rate</p>
      </div>
    </div>
  );
};

export default ConsentBadge;
