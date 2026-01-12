import React, { useState, useEffect } from 'react';
import { User, DreamSaver, Transaction, Campaign, DreamSaverActivity, PushNotification } from '../../types';
import { QrCode, Home, Trophy, User as UserIcon, Wallet, Zap, Coffee, ShoppingBag, ArrowUpRight, Bell, Menu, Star, ChevronRight, Target, PieChart, X, ScanLine, CheckCircle2, ArrowLeft, History, LogOut, Plus, Plane, Smartphone, Music, Car, Send, Gift, Clock, Trash2, ArrowDownLeft, Sparkles, CheckCircle, MoreHorizontal, AlertTriangle } from 'lucide-react';

interface MobileAppProps {
  user: User;
  onTransaction?: (transaction: Transaction) => void;
  onUserSwitch?: (userId: string) => void;
  availableUsers?: User[];
  activeCampaigns?: Campaign[];
  onUserUpdate?: (user: User, activity?: Omit<DreamSaverActivity, 'id' | 'timestamp' | 'userId' | 'userName' | 'userAvatar'>) => void;
  notifications?: PushNotification[];
  onMarkNotificationRead?: (notificationId: string) => void;
  simulatedTime?: string; // From Demo Mode - format "HH:MM"
}

const MobileApp: React.FC<MobileAppProps> = ({ user: initialUser, onTransaction, onUserSwitch, availableUsers, activeCampaigns = [], onUserUpdate, notifications = [], onMarkNotificationRead, simulatedTime }) => {
  // Use local state to simulate data updates (Top Up, Add Goal)
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'rewards' | 'profile' | 'dreamSavers'>('home');
  const [isQrOpen, setIsQrOpen] = useState(false);
  
  // Bill Payment State
  const [showBillModal, setShowBillModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [billForm, setBillForm] = useState({
    provider: '',
    billNumber: '',
    amount: 0,
    category: '' as any,
    subcategory: ''
  });

  // Transfer State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferStep, setTransferStep] = useState<'select' | 'input' | 'confirm' | 'success'>('select');
  const [transferForm, setTransferForm] = useState({
    bankType: 'internal' as 'internal' | 'external',
    bankName: 'Bank Sumut',
    accountNumber: '',
    accountName: '',
    amount: 0,
    description: ''
  });

  // Top Up State
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpStep, setTopUpStep] = useState<'service' | 'provider' | 'amount' | 'confirm' | 'success'>('service');
  const [topUpForm, setTopUpForm] = useState({
    service: '' as 'pulsa' | 'ewallet' | 'pln' | 'game' | '',
    provider: '',
    providerIcon: '',
    phoneNumber: '',
    amount: 0
  });

  useEffect(() => {
      setCurrentUser(initialUser);
  }, [initialUser]);

  // Utility Providers Constant
  const UTILITY_OPTIONS = [
    { name: 'PDAM Tirtanadi', icon: '💧', avgAmount: 125000, category: 'Utilities' as const, subcategory: 'PDAM', provider: 'Tirtanadi' },
    { name: 'BPJS Kesehatan', icon: '🏥', avgAmount: 150000, category: 'Recurring Bills' as const, subcategory: 'BPJS', provider: 'BPJS Kesehatan' },
    { name: 'Telkom Indihome', icon: '📡', avgAmount: 450000, category: 'Utilities' as const, subcategory: 'Telkom', provider: 'Indihome' },
    { name: 'PLN Pascabayar', icon: '💡', avgAmount: 380000, category: 'Utilities' as const, subcategory: 'PLN', provider: 'PLN Pascabayar' },
    { name: 'Indovision', icon: '📺', avgAmount: 220000, category: 'Recurring Bills' as const, subcategory: 'TV Cable', provider: 'Indovision' },
  ];

  // Bill Payment Handler
  const handleBillPayment = () => {
    if (billForm.amount > currentUser.balance) {
      alert('Saldo tidak mencukupi!');
      return;
    }
    
    if (!billForm.billNumber || billForm.billNumber.length < 5) {
      alert('Nomor pelanggan tidak valid!');
      return;
    }

    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      merchant: billForm.provider,
      amount: billForm.amount,
      date: new Date().toISOString().split('T')[0],
      category: billForm.category,
      subcategory: billForm.subcategory,
      provider: billForm.provider,
      isRecurring: true,
      billNumber: billForm.billNumber
    };

    // Call parent callback to update shared state
    onTransaction?.(newTransaction);
    
    // Show success notification
    setShowBillModal(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    
    // Reset form
    setBillForm({
      provider: '', 
      billNumber: '', 
      amount: 0, 
      category: '' as any, 
      subcategory: ''
    });
  };

  // Bank Options for Transfer
  const BANK_OPTIONS = [
    { name: 'Bank Sumut', code: 'SUMUT', icon: '🏦' },
    { name: 'BCA', code: 'BCA', icon: '💙' },
    { name: 'BRI', code: 'BRI', icon: '🔵' },
    { name: 'Mandiri', code: 'MDR', icon: '💛' },
    { name: 'BNI', code: 'BNI', icon: '🧡' },
    { name: 'CIMB Niaga', code: 'CIMB', icon: '🔴' },
  ];

  // Top Up Service Options
  const TOPUP_SERVICES = [
    { id: 'pulsa', name: 'Pulsa', icon: '📱', color: 'bg-blue-500' },
    { id: 'ewallet', name: 'E-Wallet', icon: '💳', color: 'bg-green-500' },
    { id: 'pln', name: 'PLN Token', icon: '⚡', color: 'bg-yellow-500' },
    { id: 'game', name: 'Game', icon: '🎮', color: 'bg-purple-500' },
  ];

  const TOPUP_PROVIDERS: Record<string, { name: string; icon: string }[]> = {
    pulsa: [
      { name: 'Telkomsel', icon: '🔴' },
      { name: 'XL', icon: '💙' },
      { name: 'Indosat', icon: '💛' },
      { name: 'Tri', icon: '🟣' },
      { name: 'Smartfren', icon: '🟠' },
    ],
    ewallet: [
      { name: 'OVO', icon: '💜' },
      { name: 'GoPay', icon: '💚' },
      { name: 'DANA', icon: '💙' },
      { name: 'ShopeePay', icon: '🧡' },
      { name: 'LinkAja', icon: '❤️' },
    ],
    pln: [
      { name: 'PLN Prepaid', icon: '⚡' },
    ],
    game: [
      { name: 'Mobile Legends', icon: '🎮' },
      { name: 'Free Fire', icon: '🔥' },
      { name: 'PUBG Mobile', icon: '🎯' },
      { name: 'Genshin Impact', icon: '⭐' },
    ],
  };

  const TOPUP_AMOUNTS: Record<string, number[]> = {
    pulsa: [10000, 25000, 50000, 100000, 200000, 500000],
    ewallet: [50000, 100000, 200000, 500000, 1000000],
    pln: [20000, 50000, 100000, 200000, 500000, 1000000],
    game: [10000, 25000, 50000, 100000, 200000],
  };

  // Transfer Handler
  const handleTransfer = () => {
    if (transferForm.amount > currentUser.balance) {
      alert('Saldo tidak mencukupi!');
      return;
    }

    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      merchant: `${transferForm.bankName} - ${transferForm.accountName}`,
      amount: transferForm.amount,
      date: new Date().toISOString().split('T')[0],
      category: 'Transfer',
      subcategory: transferForm.bankType === 'internal' ? 'Sesama Bank' : 'Antar Bank',
      provider: transferForm.bankName,
    };

    onTransaction?.(newTransaction);
    setTransferStep('success');
  };

  const resetTransfer = () => {
    setShowTransferModal(false);
    setTransferStep('select');
    setTransferForm({
      bankType: 'internal',
      bankName: 'Bank Sumut',
      accountNumber: '',
      accountName: '',
      amount: 0,
      description: ''
    });
  };

  // Points Update Handler (for Rewards)
  const handlePointsUpdate = (pointsDelta: number, xpDelta: number, redemption?: any) => {
    setCurrentUser(prev => {
      let newXP = prev.xp + xpDelta;
      let newLevel = prev.level;
      
      // Level up logic
      if (newXP >= 100) {
        newLevel = prev.level + 1;
        newXP = newXP - 100;
      }
      
      return {
        ...prev,
        points: Math.max(0, prev.points + pointsDelta),
        xp: newXP,
        level: newLevel,
        dailyLoginStreak: xpDelta > 0 ? (prev.dailyLoginStreak || 0) + 1 : prev.dailyLoginStreak,
        rewardHistory: redemption 
          ? [...(prev.rewardHistory || []), redemption]
          : prev.rewardHistory
      };
    });
  };

  // Top Up Handler
  const handleTopUp = () => {
    if (topUpForm.amount > currentUser.balance) {
      alert('Saldo tidak mencukupi!');
      return;
    }

    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      merchant: `${topUpForm.service.toUpperCase()} - ${topUpForm.provider}`,
      amount: topUpForm.amount,
      date: new Date().toISOString().split('T')[0],
      category: 'Utilities',
      subcategory: topUpForm.service === 'pulsa' ? 'Pulsa' : 
                   topUpForm.service === 'ewallet' ? 'E-Wallet' :
                   topUpForm.service === 'pln' ? 'PLN Token' : 'Game',
      provider: topUpForm.provider,
    };

    onTransaction?.(newTransaction);
    setTopUpStep('success');
  };

  const resetTopUp = () => {
    setShowTopUpModal(false);
    setTopUpStep('service');
    setTopUpForm({
      service: '',
      provider: '',
      providerIcon: '',
      phoneNumber: '',
      amount: 0
    });
  };


  return (
    <div className="relative w-full max-w-[380px] h-[800px] bg-gray-50 rounded-[3rem] border-8 border-gray-900 overflow-hidden shadow-2xl flex flex-col font-sans text-slate-800 ring-4 ring-gray-900/50">
      
      {/* Dynamic Island / Notch Simulation */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50"></div>

      {/* Status Bar Area (Dark on blue bg) */}
      <div className="absolute top-0 w-full h-12 z-40 flex justify-between items-center px-6 pt-2 text-xs font-medium text-white/80">
        <span className={activeTab === 'history' || isQrOpen || activeTab === 'dreamSavers' ? "text-slate-800" : ""}>{simulatedTime || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
        <div className="flex gap-1">
          <div className={`w-4 h-4 rounded-full border ${activeTab === 'history' || isQrOpen || activeTab === 'dreamSavers' ? "bg-slate-800/20 border-slate-800" : "bg-white/20 border-white"}`}></div>
          <div className={`w-4 h-4 rounded-full ${activeTab === 'history' || isQrOpen || activeTab === 'dreamSavers' ? "bg-slate-800" : "bg-white"}`}></div>
        </div>
      </div>

      {/* QRIS Scanner Overlay */}
      {isQrOpen && (
        <div className="absolute inset-0 z-[60] bg-black flex flex-col animate-in fade-in duration-200">
           <div className="flex justify-between items-center p-6 mt-8">
              <button onClick={() => setIsQrOpen(false)} className="text-white p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur">
                 <X size={24} />
              </button>
              <h2 className="text-white font-bold text-lg">Scan QRIS</h2>
              <button className="text-white p-2">
                 <Zap size={24} className="text-white/50" />
              </button>
           </div>
           
           <div className="flex-1 flex flex-col items-center justify-center relative">
              {/* Camera Placeholder */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop')] bg-cover opacity-50"></div>
              
              <div className="relative w-64 h-64 border-2 border-sumut-orange rounded-3xl flex items-center justify-center">
                 <ScanLine size={48} className="text-sumut-orange animate-pulse" />
                 <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-sumut-orange -mt-1 -ml-1"></div>
                 <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-sumut-orange -mt-1 -mr-1"></div>
                 <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-sumut-orange -mb-1 -ml-1"></div>
                 <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-sumut-orange -mb-1 -mr-1"></div>
              </div>
              <p className="text-white mt-8 font-medium relative z-10 bg-black/40 px-4 py-2 rounded-full backdrop-blur">Arahkan kamera ke kode QR</p>
           </div>

           <div className="p-8 bg-black">
              <div className="flex justify-center gap-8">
                 <button className="flex flex-col items-center gap-2 text-white/80">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><Wallet size={20}/></div>
                    <span className="text-xs">Bayar</span>
                 </button>
                 <button className="flex flex-col items-center gap-2 text-white/80">
                     <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><ArrowUpRight size={20}/></div>
                     <span className="text-xs">Transfer</span>
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Success Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} />
            <span className="font-semibold">Transaksi Berhasil!</span>
          </div>
        </div>
      )}

      {/* Push Notification from Admin - Appears as popup */}
      {notifications.filter(n => !n.read).slice(0, 1).map(notif => (
        <div 
          key={notif.id}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[80] w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top duration-500"
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-sumut-deepBlue to-sumut-darkBlue px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-white" />
              <span className="text-xs text-white/90 font-medium">Notifikasi Baru</span>
            </div>
            <button 
              onClick={() => onMarkNotificationRead?.(notif.id)}
              className="text-white/70 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sumut-orange to-yellow-400 flex items-center justify-center text-xl flex-shrink-0">
                {notif.icon || '🎁'}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 text-sm mb-1">{notif.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{notif.message}</p>
                <p className="text-[10px] text-gray-400 mt-2">
                  {new Date(notif.sentAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} • {notif.sentBy}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3">
              <button 
                onClick={() => onMarkNotificationRead?.(notif.id)}
                className="flex-1 py-2.5 bg-sumut-deepBlue text-white text-xs font-bold rounded-xl hover:bg-sumut-darkBlue transition"
              >
                Lihat Promo
              </button>
              <button 
                onClick={() => onMarkNotificationRead?.(notif.id)}
                className="py-2.5 px-4 bg-gray-100 text-gray-600 text-xs font-medium rounded-xl hover:bg-gray-200 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Bill Payment Modal */}
      {showBillModal && (
        <div className="absolute inset-0 z-[65] bg-black/60 backdrop-blur-sm flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Bayar Tagihan</h2>
              <button onClick={() => setShowBillModal(false)} className="p-2 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            {!billForm.provider ? (
              <div>
                <p className="text-sm text-gray-500 mb-4">Pilih Layanan</p>
                <div className="grid grid-cols-2 gap-3">
                  {UTILITY_OPTIONS.map(util => (
                    <button
                      key={util.name}
                      onClick={() => setBillForm({
                        provider: util.name,
                        billNumber: '',
                        amount: util.avgAmount,
                        category: util.category,
                        subcategory: util.subcategory
                      })}
                      className="p-4 bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl border-2 border-gray-100 hover:border-sumut-blue transition"
                    >
                      <div className="text-4xl mb-2">{util.icon}</div>
                      <p className="text-xs font-bold text-slate-800">{util.name}</p>
                      <p className="text-[10px] text-gray-500 mt-1">~Rp {util.avgAmount.toLocaleString('id-ID', {notation: 'compact'})}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500">Layanan Terpilih</p>
                  <p className="font-bold text-lg text-sumut-blue">{billForm.provider}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Nomor Pelanggan</label>
                  <input
                    type="text"
                    placeholder="Masukkan nomor pelanggan"
                    className="w-full p-4 bg-gray-50 rounded-xl mt-2 font-mono"
                    value={billForm.billNumber}
                    onChange={(e) => setBillForm({...billForm, billNumber: e.target.value})}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-xs text-gray-500">Tagihan</p>
                  <p className="text-2xl font-bold text-slate-800">Rp {billForm.amount.toLocaleString('id-ID')}</p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setBillForm({provider: '', billNumber: '', amount: 0, category: '' as any, subcategory: ''})}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl"
                  >
                    Ubah Layanan
                  </button>
                  <button 
                    onClick={handleBillPayment}
                    className="flex-1 py-3 bg-sumut-deepBlue text-white font-bold rounded-xl shadow-lg"
                  >
                    Bayar Sekarang
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TRANSFER MODAL */}
      {showTransferModal && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-sumut-blue to-blue-600 pt-14 pb-6 px-6">
            <div className="flex items-center gap-4">
              <button onClick={resetTransfer} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowLeft size={20} className="text-white" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">Transfer</h2>
                <p className="text-white/70 text-xs">
                  {transferStep === 'select' ? 'Pilih Tujuan' : 
                   transferStep === 'input' ? 'Masukkan Detail' :
                   transferStep === 'confirm' ? 'Konfirmasi' : 'Berhasil'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {transferStep === 'select' && (
              <div className="space-y-4">
                {/* Bank Type Toggle */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                  <button

                    onClick={() => setTransferForm({...transferForm, bankType: 'internal', bankName: 'Bank Sumut'})}
                    className={`flex-1 py-3 rounded-lg font-semibold text-sm transition ${
                      transferForm.bankType === 'internal' ? 'bg-white shadow text-sumut-blue' : 'text-gray-500'
                    }`}
                  >
                    Sesama Bank Sumut
                  </button>
                  <button
                    onClick={() => setTransferForm({...transferForm, bankType: 'external', bankName: ''})}
                    className={`flex-1 py-3 rounded-lg font-semibold text-sm transition ${
                      transferForm.bankType === 'external' ? 'bg-white shadow text-sumut-blue' : 'text-gray-500'
                    }`}
                  >
                    Bank Lain
                  </button>
                </div>

                {/* Bank Selection for External */}
                {transferForm.bankType === 'external' && (
                  <div className="grid grid-cols-3 gap-3">
                    {BANK_OPTIONS.filter(b => b.name !== 'Bank Sumut').map(bank => (
                      <button
                        key={bank.code}
                        onClick={() => setTransferForm({...transferForm, bankName: bank.name})}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition ${
                          transferForm.bankName === bank.name 
                            ? 'border-sumut-blue bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{bank.icon}</span>
                        <span className="text-xs font-medium text-gray-700">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Account Number Input */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 font-medium">Nomor Rekening</label>
                  <input
                    type="text"
                    placeholder="Masukkan nomor rekening"
                    value={transferForm.accountNumber}
                    onChange={(e) => setTransferForm({...transferForm, accountNumber: e.target.value})}
                    className="w-full p-4 bg-gray-50 rounded-xl font-mono text-lg"
                  />
                </div>

                {transferForm.accountNumber.length >= 10 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">BUDI TARIGAN</p>
                      <p className="text-xs text-gray-500">{transferForm.bankName} • {transferForm.accountNumber}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setTransferForm({...transferForm, accountName: 'BUDI TARIGAN'});
                    setTransferStep('input');
                  }}
                  disabled={transferForm.accountNumber.length < 10 || (transferForm.bankType === 'external' && !transferForm.bankName)}
                  className="w-full py-4 bg-sumut-deepBlue text-white font-bold rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Lanjutkan
                </button>
              </div>
            )}

            {transferStep === 'input' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500">Transfer ke</p>
                  <p className="font-bold text-gray-800">{transferForm.accountName}</p>
                  <p className="text-sm text-gray-500">{transferForm.bankName} • {transferForm.accountNumber}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600 font-medium">Nominal Transfer</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={transferForm.amount || ''}
                      onChange={(e) => setTransferForm({...transferForm, amount: parseInt(e.target.value) || 0})}
                      className="w-full p-4 pl-12 bg-gray-50 rounded-xl text-2xl font-bold"
                    />
                  </div>
                  <p className="text-xs text-gray-400">Saldo tersedia: Rp {currentUser.balance.toLocaleString('id-ID')}</p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {[100000, 500000, 1000000, 2000000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setTransferForm({...transferForm, amount: amt})}
                      className="px-4 py-2 bg-blue-50 text-sumut-blue rounded-lg text-sm font-medium"
                    >
                      {(amt/1000)}K
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600 font-medium">Catatan (opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Bayar makan siang"
                    value={transferForm.description}
                    onChange={(e) => setTransferForm({...transferForm, description: e.target.value})}
                    className="w-full p-4 bg-gray-50 rounded-xl"
                  />
                </div>

                <button
                  onClick={() => setTransferStep('confirm')}
                  disabled={transferForm.amount <= 0 || transferForm.amount > currentUser.balance}
                  className="w-full py-4 bg-sumut-deepBlue text-white font-bold rounded-xl disabled:bg-gray-300"
                >
                  Lanjutkan
                </button>
              </div>
            )}

            {transferStep === 'confirm' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Penerima</span>
                    <span className="font-semibold">{transferForm.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank</span>
                    <span className="font-semibold">{transferForm.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">No. Rekening</span>
                    <span className="font-mono">{transferForm.accountNumber}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nominal</span>
                    <span className="text-xl font-bold text-sumut-blue">Rp {transferForm.amount.toLocaleString('id-ID')}</span>
                  </div>
                  {transferForm.description && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Catatan</span>
                      <span>{transferForm.description}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleTransfer}
                  className="w-full py-4 bg-sumut-deepBlue text-white font-bold rounded-xl shadow-lg"
                >
                  Konfirmasi Transfer
                </button>
              </div>
            )}

            {transferStep === 'success' && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Transfer Berhasil!</h3>
                <p className="text-gray-500 mb-6">
                  Rp {transferForm.amount.toLocaleString('id-ID')} telah dikirim ke {transferForm.accountName}
                </p>
                <button
                  onClick={resetTransfer}
                  className="px-8 py-3 bg-sumut-deepBlue text-white font-bold rounded-xl"
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOP UP MODAL */}
      {showTopUpModal && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-sumut-orange to-orange-500 pt-14 pb-6 px-6">
            <div className="flex items-center gap-4">
              <button onClick={resetTopUp} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowLeft size={20} className="text-white" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">Top Up</h2>
                <p className="text-white/70 text-xs">
                  {topUpStep === 'service' ? 'Pilih Layanan' : 
                   topUpStep === 'provider' ? 'Pilih Provider' :
                   topUpStep === 'amount' ? 'Pilih Nominal' :
                   topUpStep === 'confirm' ? 'Konfirmasi' : 'Berhasil'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {topUpStep === 'service' && (
              <div className="grid grid-cols-2 gap-4">
                {TOPUP_SERVICES.map(service => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setTopUpForm({...topUpForm, service: service.id as any});
                      setTopUpStep('provider');
                    }}
                    className="p-6 rounded-xl border-2 border-gray-200 hover:border-sumut-orange flex flex-col items-center gap-3 transition"
                  >
                    <div className={`w-14 h-14 ${service.color} rounded-full flex items-center justify-center text-2xl text-white`}>
                      {service.icon}
                    </div>
                    <span className="font-semibold text-gray-800">{service.name}</span>
                  </button>
                ))}
              </div>
            )}

            {topUpStep === 'provider' && (
              <div className="space-y-4">
                <button onClick={() => setTopUpStep('service')} className="text-sumut-orange text-sm font-medium flex items-center gap-1">
                  <ArrowLeft size={16} /> Ganti Layanan
                </button>
                <div className="grid grid-cols-2 gap-3">
                  {TOPUP_PROVIDERS[topUpForm.service]?.map(provider => (
                    <button
                      key={provider.name}
                      onClick={() => {
                        setTopUpForm({...topUpForm, provider: provider.name, providerIcon: provider.icon});
                        setTopUpStep('amount');
                      }}
                      className="p-4 rounded-xl border-2 border-gray-200 hover:border-sumut-orange flex items-center gap-3 transition"
                    >
                      <span className="text-2xl">{provider.icon}</span>
                      <span className="font-medium text-gray-800 text-sm">{provider.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {topUpStep === 'amount' && (
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">{topUpForm.providerIcon}</span>
                  <div>
                    <p className="font-bold text-gray-800">{topUpForm.provider}</p>
                    <p className="text-xs text-gray-500 capitalize">{topUpForm.service}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600 font-medium">Nomor Tujuan</label>
                  <input
                    type="text"
                    placeholder={topUpForm.service === 'pln' ? 'No. Meter/ID Pel' : 'Nomor HP / ID'}
                    value={topUpForm.phoneNumber}
                    onChange={(e) => setTopUpForm({...topUpForm, phoneNumber: e.target.value})}
                    className="w-full p-4 bg-gray-50 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600 font-medium">Pilih Nominal</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TOPUP_AMOUNTS[topUpForm.service]?.map(amt => (
                      <button
                        key={amt}
                        onClick={() => setTopUpForm({...topUpForm, amount: amt})}
                        className={`p-3 rounded-xl border-2 font-semibold transition ${
                          topUpForm.amount === amt 
                            ? 'border-sumut-orange bg-orange-50 text-sumut-orange' 
                            : 'border-gray-200 text-gray-700'
                        }`}
                      >
                        {amt >= 1000000 ? `${amt/1000000}jt` : `${amt/1000}K`}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setTopUpStep('confirm')}
                  disabled={!topUpForm.phoneNumber || topUpForm.amount <= 0}
                  className="w-full py-4 bg-sumut-deepOrange text-white font-bold rounded-xl disabled:bg-gray-300"
                >
                  Lanjutkan
                </button>
              </div>
            )}

            {topUpStep === 'confirm' && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Layanan</span>
                    <span className="font-semibold capitalize">{topUpForm.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Provider</span>
                    <span className="font-semibold">{topUpForm.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nomor Tujuan</span>
                    <span className="font-mono">{topUpForm.phoneNumber}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Bayar</span>
                    <span className="text-xl font-bold text-sumut-orange">Rp {topUpForm.amount.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button
                  onClick={handleTopUp}
                  className="w-full py-4 bg-sumut-deepOrange text-white font-bold rounded-xl shadow-lg"
                >
                  Bayar Sekarang
                </button>
              </div>
            )}

            {topUpStep === 'success' && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={48} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Top Up Berhasil!</h3>
                <p className="text-gray-500 mb-6">
                  {topUpForm.provider} Rp {topUpForm.amount.toLocaleString('id-ID')}
                </p>
                <button
                  onClick={resetTopUp}
                  className="px-8 py-3 bg-sumut-deepOrange text-white font-bold rounded-xl"
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-gray-50">
          {activeTab === 'home' && (
            <>
              <HomeView user={currentUser} onOpenDreamSavers={() => setActiveTab('dreamSavers')} onOpenBillPayment={() => setShowBillModal(true)} onOpenTransfer={() => setShowTransferModal(true)} onOpenTopUp={() => setShowTopUpModal(true)} onOpenRewards={() => setActiveTab('rewards')} />
              
              {/* Active Promo Banners from CRM - Filtered by User Segment */}
              {(() => {
                // Filter campaigns that target the current user's segment
                const userCampaigns = activeCampaigns.filter(campaign => 
                  campaign.targetSegment.some(seg => 
                    seg === currentUser.segment || (seg as string) === 'all'
                  )
                );
                
                if (userCampaigns.length === 0) return null;
                
                return (
                  <div className="px-6 mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        <Gift size={16} className="text-sumut-orange" />
                        Promo Khusus Untukmu
                      </h3>
                      <span className="text-xs text-gray-400">{userCampaigns.length} promo</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                      {userCampaigns.map((campaign, idx) => (
                        <div 
                          key={campaign.id}
                          className={`flex-shrink-0 w-72 rounded-2xl p-4 shadow-lg border relative overflow-hidden cursor-pointer hover:scale-[1.02] transition ${
                            idx % 3 === 0 ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-purple-600' :
                            idx % 3 === 1 ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white border-orange-500' :
                            'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-600'
                          }`}
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 blur-xl"></div>
                          
                          <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold uppercase backdrop-blur">
                                Promo
                              </span>
                              <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-medium backdrop-blur">
                                {currentUser.segment}
                              </span>
                            </div>
                            <h4 className="font-bold text-lg leading-tight mb-2">{campaign.title}</h4>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs opacity-80">
                                <Zap size={12} />
                                <span>{campaign.reach.toLocaleString()} terkirim</span>
                              </div>
                              <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-bold backdrop-blur transition">
                                Lihat →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </>
          )}
          {activeTab === 'history' && <TransactionsView user={currentUser} />}
          {activeTab === 'rewards' && <RewardsView user={currentUser} onPointsUpdate={handlePointsUpdate} />}
          {activeTab === 'profile' && <ProfileView user={currentUser} onNavigateTransactions={() => setActiveTab('history')} onUserSwitch={onUserSwitch} availableUsers={availableUsers} />}
          {activeTab === 'dreamSavers' && <DreamSaversView user={currentUser} onBack={() => setActiveTab('home')} onUpdateUser={setCurrentUser} onUserUpdate={onUserUpdate} />}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 w-full h-20 bg-white border-t border-gray-200 flex justify-between items-center px-6 z-50 pb-2 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <NavBtn icon={<Home size={24} />} label="Beranda" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
        <NavBtn icon={<History size={24} />} label="Riwayat" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        
        {/* Floating Action Button (QRIS) - Center */}
        <div className="relative -top-6">
          <button 
            onClick={() => setIsQrOpen(true)}
            className="w-16 h-16 bg-sumut-orange rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40 border-4 border-white transform transition active:scale-95 group"
          >
            <QrCode size={32} className="text-white group-hover:scale-110 transition" />
          </button>
        </div>

        <NavBtn icon={<Star size={24} />} label="Rewards" active={activeTab === 'rewards'} onClick={() => setActiveTab('rewards')} />
        <NavBtn icon={<UserIcon size={24} />} label="Profil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </div>
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 min-w-[3rem] ${active ? 'text-sumut-blue' : 'text-gray-400'}`}>
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

// --- Sub Views ---

const HomeView = ({ user, onOpenDreamSavers, onOpenBillPayment, onOpenTransfer, onOpenTopUp, onOpenRewards }: { user: User, onOpenDreamSavers: () => void, onOpenBillPayment: () => void, onOpenTransfer: () => void, onOpenTopUp: () => void, onOpenRewards: () => void }) => (
  <div className="space-y-6">
    {/* Blue Header Section */}
    <div className="bg-gradient-to-b from-sumut-blue to-sumut-darkBlue pb-16 pt-14 px-6 rounded-b-[2.5rem] relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-sumut-orange/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

        <div className="relative z-10 flex justify-between items-center mb-6">
            <div>
                <h2 className="text-white/80 text-sm">Horas,</h2>
                <h1 className="text-2xl font-bold font-display text-white tracking-tight">{user.name.split(' ')[0]} 👋</h1>
                {/* RFM Segment Badge */}
                <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  user.segment === 'Champions' ? 'bg-yellow-400/20 text-yellow-200 border border-yellow-400/30' :
                  user.segment === 'Loyal' ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30' :
                  user.segment === 'Potential' ? 'bg-blue-400/20 text-blue-200 border border-blue-400/30' :
                  user.segment === 'At Risk' ? 'bg-orange-400/20 text-orange-200 border border-orange-400/30' :
                  'bg-gray-400/20 text-gray-200 border border-gray-400/30'
                }`}>
                  <span>{
                    user.segment === 'Champions' ? '👑' :
                    user.segment === 'Loyal' ? '💎' :
                    user.segment === 'Potential' ? '⭐' :
                    user.segment === 'At Risk' ? '⚠️' : '😴'
                  }</span>
                  <span>{
                    user.segment === 'Champions' ? 'Sultan Sejati' :
                    user.segment === 'Loyal' ? 'Kawan Setia' :
                    user.segment === 'Potential' ? 'Calon Sultan' :
                    user.segment === 'At Risk' ? 'Hampir Lupa' : 'Tidur Panjang'
                  }</span>
                </div>
            </div>
            <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-sumut-orange rounded-full border border-sumut-blue"></span>
                </button>
                <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden bg-white">
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>

        {/* Balance Card - Floating */}
        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-blue-900/10 relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Saldo Tabungan</p>
                    <h2 className="text-2xl font-bold font-display text-slate-800 mt-1">
                        Rp {user.balance.toLocaleString('id-ID')}
                    </h2>
                </div>
                {/* Updated Bank Sumut Logo - More reliable SVG Link & Sizing */}
                <img src={`${import.meta.env.BASE_URL}bank-sumut-logo.svg`} className="w-20 h-auto object-contain" alt="Bank Sumut" />
            </div>
            
            <div className="h-[1px] w-full bg-gray-100 my-4"></div>
            
            <div className="flex justify-between gap-4">
                <QuickAction icon={<ArrowUpRight size={20} />} label="Transfer" color="bg-blue-50 text-sumut-blue" onClick={onOpenTransfer} />
                <QuickAction icon={<Wallet size={20} />} label="Top Up" color="bg-orange-50 text-sumut-orange" onClick={onOpenTopUp} />
                <QuickAction icon={<Zap size={20} />} label="Tagihan" color="bg-blue-50 text-sumut-blue" onClick={onOpenBillPayment} />
                <QuickAction icon={<Menu size={20} />} label="Lainnya" color="bg-gray-50 text-gray-600" />
            </div>
        </div>
    </div>

    {/* Horas Rewards Section */}
    <div className="px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sumut-orange to-yellow-400 flex items-center justify-center text-white shadow-md">
                    <Trophy size={20} fill="currentColor" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-sm">Horas Rewards</h3>
                    <div className="flex items-center gap-1">
                        <span className="text-sumut-orange font-bold text-xs">{user.points} Poin</span>
                        <span className="text-gray-400 text-[10px]">•</span>
                        <span className="text-sumut-blue font-bold text-xs">Level {user.level}</span>
                    </div>
                </div>
            </div>
            <button onClick={onOpenRewards} className="bg-sumut-blue/10 text-sumut-blue px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-sumut-blue hover:text-white transition">
                Tukar
            </button>
        </div>
    </div>

    {/* Dompet Impian (Dream Savers) - Horizontal Scroll */}
    <div className="px-6">
        <div className="flex justify-between items-center mb-4">
             <div className="flex items-center gap-2">
                 <Target size={18} className="text-sumut-blue" />
                 <h3 className="font-bold text-slate-800">Dompet Impian</h3>
             </div>
             <button onClick={onOpenDreamSavers} className="text-xs text-sumut-blue font-bold bg-blue-50 px-2 py-1 rounded-lg">+ Tambah</button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
            {user.dreamSavers?.map(saver => {
                const percentage = Math.min(100, Math.round((saver.currentAmount / saver.targetAmount) * 100));
                return (
                <button key={saver.id} onClick={onOpenDreamSavers} className="min-w-[200px] bg-white rounded-xl p-3 border border-gray-100 shadow-sm relative overflow-hidden group text-left">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-sumut-orange/10 rounded-bl-full -mr-4 -mt-4"></div>
                    <div className="flex gap-3 mb-3">
                         <img src={saver.image} className="w-10 h-10 rounded-lg object-cover" alt={saver.name} />
                         <div>
                             <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{saver.name}</h4>
                             <p className="text-[10px] text-gray-500">Target: Rp {saver.targetAmount.toLocaleString('id-ID', {notation: "compact"})}</p>
                         </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-[10px] mb-1 font-medium">
                            <span className="text-sumut-orange">{percentage}%</span>
                            <span className="text-gray-400">Terkumpul</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-sumut-orange transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}></div>
                        </div>
                    </div>
                </button>
            )})}
            {/* Add New Placeholder */}
            <button onClick={onOpenDreamSavers} className="min-w-[50px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 hover:bg-gray-100 transition">
                 <span className="text-2xl text-gray-300">+</span>
            </button>
        </div>
    </div>

    {/* Financial Insight Widget */}
    <div className="px-6">
        <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-sumut-blue rounded-full -mr-10 -mt-10 blur-2xl opacity-50"></div>
             
             <div className="flex justify-between items-start mb-4 relative z-10">
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                        <PieChart size={16} className="text-sumut-orange" />
                        <h3 className="font-bold text-sm">Analisis Pengeluaran</h3>
                    </div>
                    <p className="text-slate-400 text-xs">Bulan ini kamu hemat 12%!</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xl font-bold">Rp 1.2jt</p>
                    <p className="text-[10px] text-slate-400">Total Keluar</p>
                 </div>
             </div>

             <div className="flex gap-2 relative z-10">
                 <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
                    <Coffee size={16} className="mx-auto mb-1 text-yellow-400" />
                    <p className="text-[10px] opacity-80">F&B</p>
                    <p className="text-xs font-bold mt-0.5">45%</p>
                 </div>
                 <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
                    <ShoppingBag size={16} className="mx-auto mb-1 text-purple-400" />
                    <p className="text-[10px] opacity-80">Belanja</p>
                    <p className="text-xs font-bold mt-0.5">30%</p>
                 </div>
                 <div className="flex-1 bg-white/10 rounded-lg p-2 text-center">
                    <Zap size={16} className="mx-auto mb-1 text-blue-400" />
                    <p className="text-[10px] opacity-80">Tagihan</p>
                    <p className="text-xs font-bold mt-0.5">25%</p>
                 </div>
             </div>
        </div>
    </div>

    {/* Featured Promo Banner - Back to Campus */}
    <div className="px-6 mb-4">
      <div className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer hover:scale-[1.02] transition group">
        <img 
          src="/promo-back-to-campus.png" 
          alt="Promo Back to Campus" 
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20 group-hover:to-black/10 transition"></div>
      </div>
    </div>

    {/* Promo & Local Pride */}
    <div className="px-6">
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-lg font-bold font-display text-slate-800">Promo Lokal</h3>
        <span className="text-xs text-sumut-blue font-medium cursor-pointer">Lihat Semua</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
        <PromoCard 
          title="Diskon 50% Ngopi" 
          merchant="Macehat Coffee"
          tag="Anak Kopi"
          image="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=300"
        />
        <PromoCard 
          title="Cashback Belanja" 
          merchant="Sun Plaza"
          tag="Shopping"
          image="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=300"
        />
      </div>
    </div>
  </div>
);

// --- New Dream Savers Full View (Updated to match Screenshot) ---
const DreamSaversView = ({ user, onBack, onUpdateUser, onUserUpdate }: { 
  user: User, 
  onBack: () => void, 
  onUpdateUser: (u: User) => void,
  onUserUpdate?: (user: User, activity?: Omit<DreamSaverActivity, 'id' | 'timestamp' | 'userId' | 'userName' | 'userAvatar'>) => void 
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [topUpModal, setTopUpModal] = useState<string | null>(null);
  const [withdrawModal, setWithdrawModal] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', category: 'gadget', customCategory: '' });
  const [topUpAmount, setTopUpAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleCreate = () => {
     const newId = `ds-${Date.now()}`;
     const images: any = {
        gadget: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=300',
        travel: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=300',
        concert: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=300',
        vehicle: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300',
        education: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=300',
        wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300',
        custom: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=300'
     };

     const goal: DreamSaver = {
         id: newId,
         name: newGoal.name,
         targetAmount: parseInt(newGoal.target.replace(/\D/g,'') || '0'),
         currentAmount: 0,
         image: images[newGoal.category] || images.custom,
         deadline: '2025-12-31'
     };

     const updatedUser = {
         ...user,
         dreamSavers: [...(user.dreamSavers || []), goal]
     };

     onUpdateUser(updatedUser);
     
     // Log activity to Admin Dashboard
     if (onUserUpdate) {
       onUserUpdate(updatedUser, {
         pocketId: newId,
         pocketName: newGoal.name,
         activityType: 'create',
         amount: parseInt(newGoal.target.replace(/\D/g,'') || '0'),
         description: `Membuat dompet impian "${newGoal.name}" dengan target Rp ${parseInt(newGoal.target.replace(/\D/g,'') || '0').toLocaleString('id-ID')}`
       });
     }
     
     setIsAddModalOpen(false);
     setNewGoal({ name: '', target: '', category: 'gadget', customCategory: '' });
  };
  
  const handleTopUp = () => {
    if (!topUpModal) return;
    const pocket = user.dreamSavers?.find(ds => ds.id === topUpModal);
    if (!pocket) return;
    
    const amount = parseInt(topUpAmount.replace(/\D/g,'') || '0');
    
    if (amount > user.balance) {
        alert("Saldo utama tidak mencukupi!");
        return;
    }
    if (amount <= 0) {
        alert("Masukkan nominal yang valid!");
        return;
    }

    const updatedSavers = user.dreamSavers?.map(ds => {
        if (ds.id === topUpModal) {
            return { ...ds, currentAmount: ds.currentAmount + amount };
        }
        return ds;
    });

    const updatedUser = {
        ...user,
        balance: user.balance - amount,
        dreamSavers: updatedSavers
    };

    onUpdateUser(updatedUser);
    
    // Log activity to Admin Dashboard
    if (onUserUpdate) {
      onUserUpdate(updatedUser, {
        pocketId: topUpModal,
        pocketName: pocket.name,
        activityType: 'topup',
        amount: amount,
        description: `Top up Rp ${amount.toLocaleString('id-ID')} ke dompet "${pocket.name}"`
      });
    }
    
    setTopUpModal(null);
    setTopUpAmount('');
  };

  // NEW: Withdraw from pocket to main balance
  const handleWithdraw = () => {
    if (!withdrawModal) return;
    const pocket = user.dreamSavers?.find(ds => ds.id === withdrawModal);
    if (!pocket) return;
    
    const amount = parseInt(withdrawAmount.replace(/\D/g,'') || '0');
    
    if (amount > pocket.currentAmount) {
        alert("Saldo dompet tidak mencukupi!");
        return;
    }
    if (amount <= 0) {
        alert("Masukkan nominal yang valid!");
        return;
    }

    const updatedSavers = user.dreamSavers?.map(ds => {
        if (ds.id === withdrawModal) {
            return { ...ds, currentAmount: ds.currentAmount - amount };
        }
        return ds;
    });

    const updatedUser = {
        ...user,
        balance: user.balance + amount,
        dreamSavers: updatedSavers
    };

    onUpdateUser(updatedUser);
    
    // Log activity to Admin Dashboard
    if (onUserUpdate) {
      const isFullWithdraw = amount === pocket.currentAmount;
      onUserUpdate(updatedUser, {
        pocketId: withdrawModal,
        pocketName: pocket.name,
        activityType: isFullWithdraw && pocket.currentAmount >= pocket.targetAmount ? 'complete' : 'withdraw',
        amount: amount,
        description: isFullWithdraw 
          ? `Mencairkan seluruh dana Rp ${amount.toLocaleString('id-ID')} dari dompet "${pocket.name}"`
          : `Menarik Rp ${amount.toLocaleString('id-ID')} dari dompet "${pocket.name}" ke saldo utama`
      });
    }
    
    setWithdrawModal(null);
    setWithdrawAmount('');
  };

  // NEW: Delete pocket (return funds to main)
  const handleDeletePocket = (pocketId: string) => {
    const pocket = user.dreamSavers?.find(ds => ds.id === pocketId);
    if (!pocket) return;

    const updatedSavers = user.dreamSavers?.filter(ds => ds.id !== pocketId);
    
    const updatedUser = {
        ...user,
        balance: user.balance + pocket.currentAmount,
        dreamSavers: updatedSavers
    };

    onUpdateUser(updatedUser);
    
    // Log activity to Admin Dashboard
    if (onUserUpdate) {
      onUserUpdate(updatedUser, {
        pocketId: pocketId,
        pocketName: pocket.name,
        activityType: 'delete',
        amount: pocket.currentAmount,
        description: `Menghapus dompet "${pocket.name}" dan mengembalikan Rp ${pocket.currentAmount.toLocaleString('id-ID')} ke saldo utama`
      });
    }
    
    setDeleteConfirm(null);
  };

  const totalDreamSavings = user.dreamSavers?.reduce((acc, curr) => acc + curr.currentAmount, 0) || 0;

  return (
    <div className="min-h-full bg-gray-50">
        {/* Header - Bank Jago Style */}
        <div className="sticky top-0 bg-white z-20 px-6 pt-14 pb-4 flex items-center gap-4 shadow-sm">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-800"><ArrowLeft size={24}/></button>
            <h2 className="text-xl font-bold text-slate-800">Dompet Impian</h2>
        </div>

        <div className="pb-24 pt-2 px-4">
            {/* Main Balance Card - Bank Jago Style */}
            <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Wallet size={18} className="text-sumut-blue" />
                        <span className="text-sm font-medium text-gray-600">Saldo Utama</span>
                    </div>
                    <span className="text-xs bg-blue-50 text-sumut-blue px-2 py-1 rounded-full font-medium">Tabungan</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">
                    Rp {user.balance.toLocaleString('id-ID')}
                </h2>
                <p className="text-xs text-gray-500">Tersedia untuk dipindahkan ke dompet impian</p>
            </div>

            {/* Total Dream Savings Summary */}
            <div className="bg-gradient-to-br from-sumut-blue to-sumut-darkBlue rounded-2xl p-5 text-white mb-6 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mt-8 -mr-8"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-sumut-orange/20 rounded-full blur-xl -mb-4 -ml-4"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <Target size={16} className="text-white/80" />
                        <p className="text-sm font-medium opacity-90">Total Tabungan Impian</p>
                    </div>
                    <h3 className="text-3xl font-bold mb-3 font-display">
                        Rp {totalDreamSavings.toLocaleString('id-ID')}
                    </h3>
                    <div className="flex gap-3">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10">
                            <span>📦 {user.dreamSavers?.length || 0} Dompet</span>
                        </div>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center gap-1 bg-sumut-orange px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg"
                        >
                            <Plus size={14} />
                            <span>Buat Baru</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* List of Savers - Bank Jago Style */}
            <div className="space-y-4">
                {user.dreamSavers?.map(saver => {
                    const progress = Math.min(100, Math.round((saver.currentAmount / saver.targetAmount) * 100));
                    const isComplete = progress >= 100;
                    
                    // Calculate days remaining based on deadline
                    const deadline = new Date(saver.deadline);
                    const today = new Date();
                    const daysRemaining = Math.max(0, Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
                    
                    return (
                        <div key={saver.id} className={`bg-white p-4 rounded-2xl shadow-sm relative overflow-hidden ${isComplete ? 'border-2 border-green-300 ring-2 ring-green-50' : 'border border-gray-100'}`}>
                            {/* Celebration Badge for 100% */}
                            {isComplete && (
                                <div className="absolute top-0 right-0 bg-gradient-to-br from-green-400 to-emerald-500 text-white px-4 py-1 text-xs font-bold rounded-bl-xl flex items-center gap-1 animate-pulse">
                                    🎉 TERCAPAI!
                                </div>
                            )}
                            
                            {/* Delete button */}
                            <button 
                                onClick={() => setDeleteConfirm(saver.id)}
                                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                                style={{ display: isComplete ? 'none' : 'block' }}
                            >
                                <Trash2 size={14} />
                            </button>
                            
                            <div className="flex gap-4 mb-4">
                                <img src={saver.image} className={`w-16 h-16 rounded-xl object-cover shadow-sm ${isComplete ? 'ring-2 ring-green-300' : ''}`} alt={saver.name} />
                                <div className="flex-1 min-w-0 pr-6">
                                    <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">{saver.name}</h4>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                        <span>Terkumpul</span>
                                        <span className={`font-bold ${isComplete ? 'text-green-600' : 'text-sumut-blue'}`}>Rp {saver.currentAmount.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className={`w-full h-2 rounded-full overflow-hidden ${isComplete ? 'bg-green-100' : 'bg-gray-100'}`}>
                                        <div className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-green-500' : 'bg-sumut-orange'}`} style={{width: `${progress}%`}}></div>
                                    </div>
                                    <div className="flex justify-between mt-1.5">
                                        <span className={`text-[10px] font-medium ${isComplete ? 'text-green-600' : 'text-gray-400'}`}>{progress}%</span>
                                        <span className="text-[10px] text-gray-400">Target: Rp {saver.targetAmount.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Deadline countdown or Complete message */}
                            {isComplete ? (
                                <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-green-50 rounded-lg border border-green-100">
                                    <CheckCircle size={14} className="text-green-600" />
                                    <span className="text-xs text-green-700 font-medium">Target tercapai! Cairkan dana ke saldo utama.</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-amber-50 rounded-lg border border-amber-100">
                                    <Clock size={14} className="text-amber-600" />
                                    <span className="text-xs text-amber-700 font-medium">Target: {daysRemaining} hari lagi</span>
                                </div>
                            )}
                            
                            {/* Action Buttons - Bank Jago Style */}
                            <div className="grid grid-cols-3 gap-2">
                                <button 
                                    onClick={() => setTopUpModal(saver.id)} 
                                    className="flex flex-col items-center gap-1 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
                                >
                                    <ArrowDownLeft size={18} className="text-sumut-blue" />
                                    <span className="text-[10px] font-medium text-sumut-blue">Isi Saldo</span>
                                </button>
                                <button 
                                    onClick={() => setWithdrawModal(saver.id)} 
                                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition ${
                                        saver.currentAmount > 0 
                                            ? 'bg-orange-50 hover:bg-orange-100' 
                                            : 'bg-gray-50 opacity-50 cursor-not-allowed'
                                    }`}
                                    disabled={saver.currentAmount === 0}
                                >
                                    <ArrowUpRight size={18} className={saver.currentAmount > 0 ? 'text-sumut-orange' : 'text-gray-400'} />
                                    <span className={`text-[10px] font-medium ${saver.currentAmount > 0 ? 'text-sumut-orange' : 'text-gray-400'}`}>Tarik</span>
                                </button>
                                {isComplete ? (
                                    <button 
                                        onClick={() => setWithdrawModal(saver.id)}
                                        className="flex flex-col items-center gap-1 p-3 bg-green-500 rounded-xl hover:bg-green-600 transition text-white"
                                    >
                                        <Sparkles size={18} />
                                        <span className="text-[10px] font-bold">Cairkan</span>
                                    </button>
                                ) : (
                                    <button className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                        <MoreHorizontal size={18} className="text-gray-500" />
                                        <span className="text-[10px] font-medium text-gray-500">Lainnya</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Add Button */}
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="fixed bottom-24 right-6 w-14 h-14 bg-sumut-orange rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-500/30 hover:scale-105 transition z-40"
            >
                <Plus size={28} />
            </button>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
            <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
                <div className="bg-white w-full rounded-t-[2rem] sm:rounded-[2rem] p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-slate-800">Buat Impian Baru</h3>
                        <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X size={20} /></button>
                    </div>
                    <div className="space-y-5">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nama Impian</label>
                            <input 
                                type="text" 
                                placeholder="Contoh: Liburan ke Bali" 
                                className="w-full p-4 bg-gray-50 border-0 rounded-2xl mt-2 text-slate-800 font-medium focus:ring-2 focus:ring-sumut-blue focus:bg-white transition"
                                value={newGoal.name}
                                onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Target Dana (Rp)</label>
                            <input 
                                type="text" 
                                placeholder="10.000.000" 
                                className="w-full p-4 bg-gray-50 border-0 rounded-2xl mt-2 text-slate-800 font-medium focus:ring-2 focus:ring-sumut-blue focus:bg-white transition"
                                value={newGoal.target}
                                onChange={e => setNewGoal({...newGoal, target: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 mb-2 block">Kategori</label>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {['gadget', 'travel', 'concert', 'vehicle', 'custom'].map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setNewGoal({...newGoal, category: cat})}
                                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 min-w-[84px] transition duration-200 ${newGoal.category === cat ? 'border-[#00AEEF] bg-blue-50 text-[#00AEEF]' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                                    >
                                        {cat === 'gadget' && <Smartphone size={24} strokeWidth={1.5}/>}
                                        {cat === 'travel' && <Plane size={24} strokeWidth={1.5}/>}
                                        {cat === 'concert' && <Music size={24} strokeWidth={1.5}/>}
                                        {cat === 'vehicle' && <Car size={24} strokeWidth={1.5}/>}
                                        {cat === 'custom' && <Plus size={24} strokeWidth={1.5}/>}
                                        <span className="text-[10px] font-medium capitalize mt-1">{cat === 'custom' ? 'Lainnya' : cat}</span>
                                    </button>
                                ))}
                            </div>
                            
                            {/* Custom Category Input */}
                            {newGoal.category === 'custom' && (
                                <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                                     <input 
                                        type="text" 
                                        placeholder="Nama Kategori (Contoh: Pendidikan)" 
                                        className="w-full p-4 bg-blue-50/50 border-2 border-blue-100 rounded-2xl text-slate-800 font-medium focus:ring-2 focus:ring-sumut-blue focus:outline-none transition"
                                        value={newGoal.customCategory}
                                        onChange={e => setNewGoal({...newGoal, customCategory: e.target.value})}
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>
                        <button onClick={handleCreate} className="w-full bg-[#00AEEF] text-white font-bold py-4 rounded-2xl mt-4 shadow-xl shadow-blue-200 active:scale-95 transition">
                            Mulai Wujudkan! 🚀
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Top Up Modal remains largely similar but with style tweaks if needed */}
        {topUpModal && (
            <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
                <div className="bg-white w-full rounded-t-[2rem] sm:rounded-[2rem] p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-slate-800">Isi Saldo Impian</h3>
                        <button onClick={() => setTopUpModal(null)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X size={20} /></button>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-2xl mb-6 text-center border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Saldo Utama Kamu</p>
                        <p className="text-xl font-bold text-slate-800">Rp {user.balance.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="mb-6">
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nominal Top Up</label>
                         <input 
                                type="text" 
                                placeholder="0" 
                                className="w-full p-4 bg-gray-50 border-0 rounded-2xl mt-2 focus:ring-2 focus:ring-sumut-blue focus:bg-white text-2xl font-bold text-center text-slate-800 transition"
                                value={topUpAmount}
                                onChange={e => setTopUpAmount(e.target.value)}
                            />
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[50000, 100000, 500000].map(amt => (
                            <button key={amt} onClick={() => setTopUpAmount(amt.toString())} className="py-2 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:border-sumut-blue hover:text-sumut-blue transition">
                                {amt.toLocaleString('id-ID', {notation: "compact"})}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleTopUp} className="w-full bg-sumut-deepBlue text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition">
                        Pindahkan Saldo
                    </button>
                </div>
            </div>
        )}

        {/* Withdraw Modal */}
        {withdrawModal && (
            <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
                <div className="bg-white w-full rounded-t-[2rem] sm:rounded-[2rem] p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl text-slate-800">Tarik ke Saldo Utama</h3>
                        <button onClick={() => setWithdrawModal(null)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200"><X size={20} /></button>
                    </div>
                    
                    {/* Source Pocket Info */}
                    <div className="bg-gradient-to-r from-sumut-blue/10 to-sumut-orange/10 p-4 rounded-2xl mb-4 border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Dari Dompet</p>
                        <p className="font-bold text-slate-800">{user.dreamSavers?.find(ds => ds.id === withdrawModal)?.name}</p>
                        <p className="text-sm text-sumut-blue font-bold mt-1">
                            Saldo: Rp {user.dreamSavers?.find(ds => ds.id === withdrawModal)?.currentAmount.toLocaleString('id-ID')}
                        </p>
                    </div>
                    
                    {/* Arrow */}
                    <div className="flex justify-center my-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <ArrowUpRight size={16} className="text-gray-500" />
                        </div>
                    </div>
                    
                    {/* Destination */}
                    <div className="bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Ke Saldo Utama</p>
                        <p className="text-sm font-bold text-slate-800">Rp {user.balance.toLocaleString('id-ID')}</p>
                    </div>
                    
                    <div className="mb-4">
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Nominal Tarik</label>
                         <input 
                                type="text" 
                                placeholder="0" 
                                className="w-full p-4 bg-gray-50 border-0 rounded-2xl mt-2 focus:ring-2 focus:ring-sumut-orange focus:bg-white text-2xl font-bold text-center text-slate-800 transition"
                                value={withdrawAmount}
                                onChange={e => setWithdrawAmount(e.target.value.replace(/\D/g, ''))}
                            />
                    </div>
                    
                    {/* Quick amounts */}
                    <div className="flex gap-2 mb-6">
                        {[50000, 100000, 'Semua'].map(amt => (
                            <button 
                                key={amt} 
                                onClick={() => {
                                    if (amt === 'Semua') {
                                        const pocket = user.dreamSavers?.find(ds => ds.id === withdrawModal);
                                        setWithdrawAmount(pocket?.currentAmount.toString() || '0');
                                    } else {
                                        setWithdrawAmount(amt.toString());
                                    }
                                }} 
                                className="py-2 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:border-sumut-orange hover:text-sumut-orange transition"
                            >
                                {amt === 'Semua' ? 'Semua' : (amt as number).toLocaleString('id-ID', {notation: "compact"})}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleWithdraw} className="w-full bg-sumut-deepOrange text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-200 active:scale-95 transition">
                        Tarik Dana
                    </button>
                </div>
            </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
            <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-sm rounded-3xl p-6 animate-in zoom-in duration-200 shadow-2xl">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>
                        <h3 className="font-bold text-xl text-slate-800 mb-2">Hapus Dompet Impian?</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Dompet "<span className="font-bold">{user.dreamSavers?.find(ds => ds.id === deleteConfirm)?.name}</span>" akan dihapus.
                        </p>
                        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 mb-6">
                            <p className="text-xs text-amber-700">
                                💰 Saldo <span className="font-bold">Rp {user.dreamSavers?.find(ds => ds.id === deleteConfirm)?.currentAmount.toLocaleString('id-ID')}</span> akan dikembalikan ke saldo utama.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setDeleteConfirm(null)} 
                            className="flex-1 py-3 font-bold text-slate-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={() => handleDeletePocket(deleteConfirm)}
                            className="flex-1 py-3 font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

const RewardsView = ({ user, onPointsUpdate }: { user: User; onPointsUpdate?: (points: number, xp: number, redemption?: any) => void }) => {
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState<string | null>(null);
  const [claimedToday, setClaimedToday] = useState(false);
  const [selectedReward, setSelectedReward] = useState<typeof REWARD_CATALOG[0] | null>(null);

  // Reward catalog
  const REWARD_CATALOG = [
    { id: 'r1', name: 'Voucher GoFood 25K', points: 500, image: '🍔', category: 'Voucher' },
    { id: 'r2', name: 'Cashback 50K Transfer', points: 1000, image: '💸', category: 'Cashback' },
    { id: 'r3', name: 'Free Admin 1 Bulan', points: 750, image: '🎫', category: 'Fee Waiver' },
    { id: 'r4', name: 'Voucher Shopee 50K', points: 1200, image: '🛒', category: 'Voucher' },
    { id: 'r5', name: 'Upgrade ke Premium', points: 2500, image: '👑', category: 'Upgrade' },
    { id: 'r6', name: 'Merchandise Exclusive', points: 5000, image: '🎁', category: 'Merchandise' },
  ];

  const handleClaimDaily = () => {
    if (claimedToday) return;
    
    const dailyPoints = 50;
    const dailyXP = 10;
    
    setClaimedToday(true);
    setShowSuccessModal(`+${dailyPoints} Poin & +${dailyXP} XP`);
    
    if (onPointsUpdate) {
      onPointsUpdate(dailyPoints, dailyXP);
    }
    
    setTimeout(() => setShowSuccessModal(null), 2000);
  };

  const handleRedeem = (reward: typeof REWARD_CATALOG[0]) => {
    if (user.points < reward.points) return;
    
    setSelectedReward(reward);
    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    if (!selectedReward) return;
    
    const redemption = {
      id: `red-${Date.now()}`,
      rewardName: selectedReward.name,
      pointsUsed: selectedReward.points,
      redeemedAt: new Date().toISOString(),
      status: 'claimed' as const
    };
    
    if (onPointsUpdate) {
      onPointsUpdate(-selectedReward.points, 0, redemption);
    }
    
    setShowRedeemModal(false);
    setShowSuccessModal(`${selectedReward.name} berhasil ditukar!`);
    setSelectedReward(null);
    
    setTimeout(() => setShowSuccessModal(null), 2500);
  };

  const currentStreak = user.dailyLoginStreak || 3;

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-sumut-blue pt-14 pb-8 px-6 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mt-10 -mr-10"></div>
        <h1 className="text-2xl font-bold text-white mb-2 relative z-10">Horas Rewards 🎁</h1>
        <p className="text-blue-100 text-sm relative z-10">Kumpulkan poin, jadi Sultan, nikmati hematnya.</p>
        
        <div className="mt-6 bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-sumut-orange font-bold">
              {user.level}
            </div>
            <div>
              <p className="text-white font-bold text-sm">Menuju Sultan</p>
              <p className="text-blue-100 text-xs">{100 - user.xp} XP lagi naik level</p>
            </div>
          </div>
          <div className="w-24">
            <div className="h-2 w-full bg-blue-900/30 rounded-full overflow-hidden">
              <div className="h-full bg-sumut-orange transition-all duration-500" style={{ width: `${user.xp}%` }}></div>
            </div>
          </div>
        </div>
        
        {/* Points Balance */}
        <div className="mt-4 bg-white/20 backdrop-blur rounded-xl p-4 flex items-center justify-between relative z-10">
          <div>
            <p className="text-blue-100 text-xs">Poin Tersedia</p>
            <p className="text-white text-2xl font-bold">{user.points.toLocaleString('id-ID')}</p>
          </div>
          <button 
            onClick={() => setShowRedeemModal(true)}
            className="px-4 py-2 bg-white text-sumut-blue font-bold text-sm rounded-xl hover:bg-blue-50 transition"
          >
            Tukar Poin
          </button>
        </div>
      </div>

      {/* Daily Login Feature */}
      <div className="px-6">
        <h3 className="font-bold text-slate-800 mb-3 text-sm">Absen Harian (Streak: {currentStreak} hari 🔥)</h3>
        <div className="flex justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div key={day} className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                day <= currentStreak ? 'bg-sumut-blue text-white' : 
                day === currentStreak + 1 && !claimedToday ? 'bg-sumut-orange text-white ring-4 ring-orange-100 animate-pulse' : 
                'bg-gray-100 text-gray-400'
              }`}>
                {day <= currentStreak ? <CheckCircle2 size={14} /> : day === currentStreak + 1 ? '+50' : day}
              </div>
              <span className={`text-[10px] ${day === currentStreak + 1 ? 'text-sumut-orange font-bold' : 'text-gray-400'}`}>Hari {day}</span>
            </div>
          ))}
        </div>
        <button 
          onClick={handleClaimDaily}
          disabled={claimedToday}
          className={`w-full mt-3 text-sm font-bold py-2.5 rounded-xl shadow-lg transition ${
            claimedToday 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
              : 'bg-sumut-orange text-white shadow-orange-200 hover:bg-orange-600'
          }`}
        >
          {claimedToday ? '✓ Sudah Klaim Hari Ini' : 'Klaim Poin Harian'}
        </button>
      </div>

      {/* Badges/Missions */}
      <div className="px-6">
        <h3 className="font-bold text-slate-800 mb-4 text-sm">Misi & Lencana</h3>
        <div className="space-y-3">
          {user.badges.map(badge => (
            <div key={badge.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${badge.unlocked ? 'bg-orange-100 text-sumut-orange' : 'bg-gray-100 grayscale opacity-50'}`}>
                {badge.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <h4 className="font-bold text-slate-800 text-sm">{badge.name}</h4>
                  {badge.unlocked && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Selesai</span>}
                </div>
                <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${badge.unlocked ? 'bg-sumut-orange' : 'bg-sumut-blue'}`} 
                    style={{ width: `${Math.min((badge.progress / badge.maxProgress) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redeem Modal / Catalog */}
      {showRedeemModal && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="bg-white w-full max-h-[80vh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-slate-800">Tukar Poin</h3>
              <button onClick={() => { setShowRedeemModal(false); setSelectedReward(null); }} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                <X size={20} />
              </button>
            </div>
            
            <div className="bg-sumut-blue/10 p-4 rounded-xl mb-4 flex justify-between items-center">
              <span className="text-sumut-blue font-medium">Poin Kamu</span>
              <span className="text-sumut-blue text-xl font-bold">{user.points.toLocaleString('id-ID')}</span>
            </div>
            
            {selectedReward ? (
              <div className="text-center py-6">
                <div className="text-6xl mb-4">{selectedReward.image}</div>
                <h4 className="font-bold text-lg text-slate-800 mb-2">{selectedReward.name}</h4>
                <p className="text-sumut-orange font-bold mb-6">{selectedReward.points.toLocaleString('id-ID')} Poin</p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedReward(null)}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button 
                    onClick={confirmRedeem}
                    className="flex-1 py-3 bg-sumut-orange text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600"
                  >
                    Konfirmasi Tukar
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {REWARD_CATALOG.map(reward => (
                  <button 
                    key={reward.id}
                    onClick={() => handleRedeem(reward)}
                    disabled={user.points < reward.points}
                    className={`p-4 rounded-xl border text-left transition ${
                      user.points >= reward.points 
                        ? 'border-gray-100 bg-white hover:border-sumut-orange hover:shadow-md' 
                        : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-3xl mb-2">{reward.image}</div>
                    <p className="font-bold text-sm text-slate-800 mb-1">{reward.name}</p>
                    <p className={`text-xs font-bold ${user.points >= reward.points ? 'text-sumut-orange' : 'text-gray-400'}`}>
                      {reward.points.toLocaleString('id-ID')} Poin
                    </p>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-2 inline-block">{reward.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center pointer-events-none">
          <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl text-center animate-in zoom-in duration-300">
            <div className="text-5xl mb-3">🎉</div>
            <p className="font-bold text-lg text-slate-800">{showSuccessModal}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileView = ({ user, onNavigateTransactions, onUserSwitch, availableUsers }: { 
  user: User, 
  onNavigateTransactions: () => void,
  onUserSwitch?: (userId: string) => void,
  availableUsers?: User[]
}) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);

  return (
    <>
        <div className="pt-14 px-6 space-y-6">
            <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-lg overflow-hidden mb-4">
                    <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                <span className="inline-block mt-1 px-3 py-1 bg-blue-50 text-sumut-blue rounded-full text-xs font-bold border border-blue-100">
                    {user.segment}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 text-xs">Total Poin</p>
                    <p className="text-2xl font-bold text-sumut-orange">{user.points}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 text-xs">Voucher Aktif</p>
                    <p className="text-2xl font-bold text-sumut-blue">3</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                <MenuRow label="Riwayat Transaksi" onClick={onNavigateTransactions} />
                <MenuRow label="Edit Profil" />
                <MenuRow label="Keamanan" />
                <MenuRow label="Pusat Bantuan" />
                {onUserSwitch && availableUsers && (
                  <MenuRow label="🔄 Ganti Akun" textClass="text-blue-600" onClick={() => setShowUserSwitcher(true)} />
                )}
                <MenuRow label="Keluar" textClass="text-red-500" onClick={() => setIsLogoutModalOpen(true)} />
            </div>
        </div>

        {/* User Switcher Modal */}
        {showUserSwitcher && onUserSwitch && availableUsers && (
          <div className="absolute top-0 left-0 w-full h-full z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUserSwitcher(false)}></div>
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative z-10 max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Pilih Akun</h3>
                <button onClick={() => setShowUserSwitcher(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 space-y-2">
                {availableUsers.map((availUser) => (
                  <button
                    key={availUser.id}
                    onClick={() => {
                      onUserSwitch(availUser.id);
                      setShowUserSwitcher(false);
                    }}
                    className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition ${
                      user.id === availUser.id 
                        ? 'bg-blue-50 border-2 border-blue-500' 
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <img src={availUser.avatar} alt={availUser.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm text-gray-900">{availUser.name}</p>
                      <p className="text-xs text-gray-500">{availUser.segment} • Rp {(availUser.balance / 1000000).toFixed(1)}jt</p>
                    </div>
                    {user.id === availUser.id && (
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 size={16} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Logout Modal */}
        {isLogoutModalOpen && (
             <div className="absolute top-0 left-0 w-full h-full z-[100] flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsLogoutModalOpen(false)}></div>
                <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
                     <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
                            <LogOut size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Konfirmasi Keluar</h3>
                        <p className="text-sm text-gray-500 mb-6">Apakah Anda yakin ingin keluar?</p>
                        <div className="flex gap-3 w-full">
                            <button onClick={() => setIsLogoutModalOpen(false)} className="flex-1 py-3 px-4 bg-gray-50 text-slate-700 font-bold rounded-xl text-sm hover:bg-gray-100 transition">Batal</button>
                            <button onClick={() => window.location.reload()} className="flex-1 py-3 px-4 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 shadow-lg shadow-red-200 transition">Ya, Keluar</button>
                        </div>
                     </div>
                </div>
             </div>
        )}
    </>
  );
};

const TransactionsView = ({ user }: { user: User }) => {
  // Helper for date formatting
  const formatDate = (dateString: string) => {
    // Normalize to midnight for accurate day comparison
    const d = new Date(dateString); d.setHours(0,0,0,0);
    const t = new Date(); t.setHours(0,0,0,0);
    
    const diffMs = t.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hari Ini';
    if (diffDays === 1) return 'Kemarin';
    
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
  };

  return (
    <div className="min-h-full">
        {/* Header without Back Button for Tab View */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-6 pt-14 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-slate-800">Riwayat Transaksi</h2>
        </div>
        
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                 <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Oktober 2023</span>
                 <span className="text-xs text-sumut-blue font-medium bg-blue-50 px-2 py-1 rounded-full">Total: Rp 154.000</span>
            </div>
            
            <div className="space-y-4">
                {user.transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between group cursor-pointer bg-white border border-gray-100 hover:border-blue-200 p-3 rounded-xl transition shadow-sm">
                        <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                 t.category === 'F&B' ? 'bg-orange-50 text-orange-500' :
                                 t.category === 'Transport' ? 'bg-blue-50 text-blue-500' :
                                 t.category === 'Entertainment' ? 'bg-purple-50 text-purple-500' :
                                 'bg-gray-50 text-gray-500'
                             }`}>
                                 {t.category === 'F&B' && <Coffee size={20} />}
                                 {t.category === 'Transport' && <Zap size={20} />}
                                 {t.category === 'Entertainment' && <Star size={20} />}
                                 {t.category === 'Shopping' && <ShoppingBag size={20} />}
                             </div>
                             <div>
                                 <h4 className="font-bold text-slate-800 text-sm">{t.merchant}</h4>
                                 <p className="text-xs text-gray-400">{formatDate(t.date)} • {t.category}</p>
                             </div>
                        </div>
                        <span className="font-bold text-slate-800 text-sm">-Rp {t.amount.toLocaleString('id-ID')}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

const QuickAction = ({ icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition group-hover:scale-105 ${color}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium text-gray-600">{label}</span>
  </button>
);

const PromoCard = ({ title, merchant, tag, image }: any) => (
  <div className="min-w-[140px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
    <div className="h-24 bg-gray-200 relative">
        <img src={image} className="w-full h-full object-cover" alt="promo" />
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[10px] px-2 py-0.5 rounded font-bold text-sumut-blue uppercase tracking-wider">{tag}</span>
    </div>
    <div className="p-3">
        <p className="text-[10px] text-gray-500 mb-0.5">{merchant}</p>
        <h4 className="font-bold text-slate-800 text-sm leading-tight">{title}</h4>
    </div>
  </div>
);

const MenuRow = ({ label, textClass = 'text-gray-700', onClick }: any) => (
    <button onClick={onClick} className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition">
        <span className={`text-sm font-medium ${textClass}`}>{label}</span>
        <ChevronRight size={16} className="text-gray-300" />
    </button>
);

export default MobileApp;