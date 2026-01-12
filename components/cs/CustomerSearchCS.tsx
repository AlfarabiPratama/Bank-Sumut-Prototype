import React, { useState, useMemo } from 'react';
import { Search, User as UserIcon, Phone, Mail, Clock, ChevronRight, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { User } from '../../types';

interface CustomerSearchCSProps {
  customers: User[];
  onSelectCustomer: (customer: User) => void;
  recentCustomers?: User[];
  className?: string;
}

/**
 * Customer Quick Card for recent/search results
 */
const CustomerQuickCard: React.FC<{
  customer: User;
  onClick: () => void;
}> = ({ customer, onClick }) => {
  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md hover:border-indigo-300 cursor-pointer transition"
      onClick={onClick}
    >
      <img 
        src={customer.avatar} 
        alt={customer.name}
        className="w-12 h-12 rounded-full border-2 border-gray-200"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-800 truncate">{customer.name}</h4>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Phone size={12} />
            {customer.phone || 'N/A'}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            customer.segment === 'Champions' ? 'bg-emerald-100 text-emerald-700' :
            customer.segment === 'Loyal' ? 'bg-green-100 text-green-700' :
            customer.segment === 'At Risk' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {customer.segment}
          </span>
          {customer.accountStatus === 'Premium' && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              👑 Premium
            </span>
          )}
        </div>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </div>
  );
};

/**
 * Customer Detail Preview (CS-optimized with contact-first approach)
 */
const CustomerDetailPreview: React.FC<{
  customer: User;
  onViewFull: () => void;
  onCall: () => void;
  onEmail: () => void;
}> = ({ customer, onViewFull, onCall, onEmail }) => {
  return (
    <div className="bg-white rounded-xl border-2 border-indigo-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4">
        <div className="flex items-center gap-3">
          <img 
            src={customer.avatar}
            alt={customer.name}
            className="w-16 h-16 rounded-full border-3 border-white shadow-lg"
          />
          <div>
            <h3 className="text-xl font-bold">{customer.name}</h3>
            <p className="text-white/80 text-sm">ID: {customer.id}</p>
            <div className="flex gap-2 mt-1">
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{customer.segment}</span>
              {customer.accountStatus && (
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{customer.accountStatus}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Contact */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">📱 Hubungi Nasabah</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onCall}
            className="flex items-center justify-center gap-2 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
          >
            <Phone size={18} />
            <div className="text-left">
              <p className="font-medium">Telepon</p>
              <p className="text-xs text-white/80">{customer.phone || 'N/A'}</p>
            </div>
          </button>
          <button
            onClick={onEmail}
            className="flex items-center justify-center gap-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            <Mail size={18} />
            <div className="text-left">
              <p className="font-medium">Email</p>
              <p className="text-xs text-white/80 truncate">{customer.email?.split('@')[0]}@...</p>
            </div>
          </button>
        </div>
      </div>
      
      {/* Quick Info */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Usia</span>
          <span className="font-medium text-gray-800">{customer.age || 'N/A'} tahun</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Saldo</span>
          <span className="font-medium text-green-600">
            Rp {customer.balance.toLocaleString('id-ID')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Jumlah Transaksi</span>
          <span className="font-medium text-gray-800">{customer.transactions.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Status KYC</span>
          <span className={`flex items-center gap-1 font-medium ${
            customer.kycStatus?.level === 'ENHANCED' ? 'text-green-600' :
            customer.kycStatus?.level === 'EXPIRED' ? 'text-red-600' :
            'text-blue-600'
          }`}>
            {customer.kycStatus?.level === 'ENHANCED' && <CheckCircle2 size={14} />}
            {customer.kycStatus?.level === 'EXPIRED' && <AlertTriangle size={14} />}
            {customer.kycStatus?.level || 'BASIC'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Marketing Consent</span>
          <span className={`font-medium ${customer.marketingConsent?.optIn ? 'text-green-600' : 'text-red-600'}`}>
            {customer.marketingConsent?.optIn !== false ? '✓ Opt-in' : '✗ Opt-out'}
          </span>
        </div>
      </div>
      
      {/* Actions */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onViewFull}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
        >
          <UserIcon size={18} />
          Lihat Profil Lengkap
        </button>
      </div>
    </div>
  );
};

/**
 * Customer Search Component (CS-Optimized)
 */
export const CustomerSearchCS: React.FC<CustomerSearchCSProps> = ({
  customers,
  onSelectCustomer,
  recentCustomers = [],
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'NAME' | 'PHONE' | 'ACCOUNT'>('NAME');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  
  // Filter customers based on search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    
    return customers.filter(c => {
      if (searchType === 'NAME') {
        return c.name.toLowerCase().includes(query);
      } else if (searchType === 'PHONE') {
        return c.phone?.toLowerCase().includes(query);
      } else if (searchType === 'ACCOUNT') {
        return c.id.toLowerCase().includes(query);
      }
      return false;
    }).slice(0, 10); // Limit to 10 results
  }, [customers, searchQuery, searchType]);
  
  const handleSelectCustomer = (customer: User) => {
    setSelectedCustomer(customer);
  };
  
  const handleViewFull = () => {
    if (selectedCustomer) {
      onSelectCustomer(selectedCustomer);
    }
  };
  
  const handleCall = () => {
    if (selectedCustomer) {
      alert(`📞 Menelepon ${selectedCustomer.name} di ${selectedCustomer.phone}`);
    }
  };
  
  const handleEmail = () => {
    if (selectedCustomer) {
      alert(`📧 Membuka email untuk ${selectedCustomer.email}`);
    }
  };
  
  const placeholders = {
    NAME: 'Ketik nama nasabah...',
    PHONE: '08123456789',
    ACCOUNT: 'Nomor rekening atau ID...'
  };
  
  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-4 rounded-t-xl">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
          <Search size={24} />
          Cari Nasabah
        </h2>
        <p className="text-white/80 text-sm mb-4">Cari berdasarkan nama, nomor telepon, atau nomor rekening</p>
        
        {/* Search Type Toggle */}
        <div className="flex gap-1 bg-white/10 rounded-lg p-1 mb-3">
          {[
            { key: 'NAME', label: '👤 Nama', icon: UserIcon },
            { key: 'PHONE', label: '📱 Telepon', icon: Phone },
            { key: 'ACCOUNT', label: '🏦 Rekening', icon: Shield }
          ].map(option => (
            <button
              key={option.key}
              onClick={() => setSearchType(option.key as any)}
              className={`flex-1 px-3 py-2 text-sm rounded-md transition ${
                searchType === option.key 
                  ? 'bg-white text-cyan-600 font-medium' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-200" />
          <input
            type="text"
            placeholder={placeholders[searchType]}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-white/30 focus:border-transparent text-lg"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Selected Customer Preview */}
        {selectedCustomer && (
          <div className="mb-4">
            <CustomerDetailPreview
              customer={selectedCustomer}
              onViewFull={handleViewFull}
              onCall={handleCall}
              onEmail={handleEmail}
            />
          </div>
        )}
        
        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              🔍 Hasil Pencarian ({searchResults.length})
            </h3>
            <div className="space-y-2">
              {searchResults.map(customer => (
                <CustomerQuickCard
                  key={customer.id}
                  customer={customer}
                  onClick={() => handleSelectCustomer(customer)}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* No Results */}
        {searchQuery && searchResults.length === 0 && (
          <div className="text-center py-8">
            <Search size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Tidak ditemukan nasabah dengan "{searchQuery}"</p>
            <p className="text-gray-400 text-sm mt-1">Coba kata kunci lain atau ganti jenis pencarian</p>
          </div>
        )}
        
        {/* Recent Customers */}
        {!searchQuery && !selectedCustomer && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <Clock size={16} />
              Terakhir Dilihat
            </h3>
            {recentCustomers.length > 0 ? (
              <div className="space-y-2">
                {recentCustomers.map(customer => (
                  <CustomerQuickCard
                    key={customer.id}
                    customer={customer}
                    onClick={() => handleSelectCustomer(customer)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <UserIcon size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Belum ada riwayat pencarian</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSearchCS;
