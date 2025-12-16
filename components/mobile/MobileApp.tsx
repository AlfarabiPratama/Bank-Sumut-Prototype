import React, { useState, useEffect } from 'react';
import { User, DreamSaver } from '../../types';
import { QrCode, Home, Trophy, User as UserIcon, Wallet, Zap, Coffee, ShoppingBag, ArrowUpRight, Bell, Menu, Star, ChevronRight, Target, PieChart, X, ScanLine, CheckCircle2, ArrowLeft, History, LogOut, Plus, Plane, Smartphone, Music, Car } from 'lucide-react';

interface MobileAppProps {
  user: User;
}

const MobileApp: React.FC<MobileAppProps> = ({ user: initialUser }) => {
  // Use local state to simulate data updates (Top Up, Add Goal)
  const [currentUser, setCurrentUser] = useState<User>(initialUser);
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'rewards' | 'profile' | 'dreamSavers'>('home');
  const [isQrOpen, setIsQrOpen] = useState(false);

  useEffect(() => {
      setCurrentUser(initialUser);
  }, [initialUser]);

  return (
    <div className="relative w-full max-w-[380px] h-[800px] bg-gray-50 rounded-[3rem] border-8 border-gray-900 overflow-hidden shadow-2xl flex flex-col font-sans text-slate-800 ring-4 ring-gray-900/50">
      
      {/* Dynamic Island / Notch Simulation */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50"></div>

      {/* Status Bar Area (Dark on blue bg) */}
      <div className="absolute top-0 w-full h-12 z-40 flex justify-between items-center px-6 pt-2 text-xs font-medium text-white/80">
        <span className={activeTab === 'history' || isQrOpen || activeTab === 'dreamSavers' ? "text-slate-800" : ""}>09:41</span>
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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide bg-gray-50">
          {activeTab === 'home' && <HomeView user={currentUser} onOpenDreamSavers={() => setActiveTab('dreamSavers')} />}
          {activeTab === 'history' && <TransactionsView user={currentUser} />}
          {activeTab === 'rewards' && <RewardsView user={currentUser} />}
          {activeTab === 'profile' && <ProfileView user={currentUser} onNavigateTransactions={() => setActiveTab('history')} />}
          {activeTab === 'dreamSavers' && <DreamSaversView user={currentUser} onBack={() => setActiveTab('home')} onUpdateUser={setCurrentUser} />}
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

const HomeView = ({ user, onOpenDreamSavers }: { user: User, onOpenDreamSavers: () => void }) => (
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
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Bank_Sumut.svg" className="w-24 h-auto object-contain" alt="Bank Sumut" />
            </div>
            
            <div className="h-[1px] w-full bg-gray-100 my-4"></div>
            
            <div className="flex justify-between gap-4">
                <QuickAction icon={<ArrowUpRight size={20} />} label="Transfer" color="bg-blue-50 text-sumut-blue" />
                <QuickAction icon={<Wallet size={20} />} label="Top Up" color="bg-orange-50 text-sumut-orange" />
                <QuickAction icon={<Zap size={20} />} label="Tagihan" color="bg-blue-50 text-sumut-blue" />
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
            <button className="bg-sumut-blue/10 text-sumut-blue px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-sumut-blue hover:text-white transition">
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
const DreamSaversView = ({ user, onBack, onUpdateUser }: { user: User, onBack: () => void, onUpdateUser: (u: User) => void }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [topUpModal, setTopUpModal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', category: 'gadget', customCategory: '' });
  const [topUpAmount, setTopUpAmount] = useState('');

  const handleCreate = () => {
     const newId = `ds-${Date.now()}`;
     const images: any = {
        gadget: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=300',
        travel: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=300',
        concert: 'https://images.unsplash.com/photo-1459749411177-2a2f5d915204?auto=format&fit=crop&q=80&w=300',
        vehicle: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300',
        custom: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=300' // Generic goal image
     };

     // Use custom category name if 'custom' is selected, otherwise use the key
     const _categoryName = newGoal.category === 'custom' ? (newGoal.customCategory || 'Impianku') : newGoal.category;

     const goal: DreamSaver = {
         id: newId,
         name: newGoal.name,
         targetAmount: parseInt(newGoal.target.replace(/\D/g,'') || '0'),
         currentAmount: 0,
         image: images[newGoal.category] || images.custom,
         deadline: '2024-12-31'
     };

     onUpdateUser({
         ...user,
         dreamSavers: [...(user.dreamSavers || []), goal]
     });
     setIsAddModalOpen(false);
     setNewGoal({ name: '', target: '', category: 'gadget', customCategory: '' });
  };
  
  const handleTopUp = () => {
    if (!topUpModal) return;
    const amount = parseInt(topUpAmount.replace(/\D/g,'') || '0');
    
    if (amount > user.balance) {
        alert("Saldo utama tidak mencukupi!");
        return;
    }

    const updatedSavers = user.dreamSavers?.map(ds => {
        if (ds.id === topUpModal) {
            return { ...ds, currentAmount: ds.currentAmount + amount };
        }
        return ds;
    });

    onUpdateUser({
        ...user,
        balance: user.balance - amount,
        dreamSavers: updatedSavers
    });
    setTopUpModal(null);
    setTopUpAmount('');
  };

  return (
    <div className="min-h-full bg-white">
        {/* Header - Clean White */}
        <div className="sticky top-0 bg-white z-20 px-6 pt-14 pb-4 flex items-center gap-4 border-b border-transparent">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-800"><ArrowLeft size={24}/></button>
            <h2 className="text-xl font-bold text-slate-800">Dompet Impian</h2>
        </div>

        <div className="pb-24 pt-2">
            {/* Blue Summary Card */}
            <div className="mx-6 bg-[#00AEEF] rounded-3xl p-6 text-white mb-8 relative overflow-hidden shadow-xl shadow-blue-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mt-8 -mr-8"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-sumut-darkBlue/30 rounded-full blur-xl -mb-4 -ml-4"></div>
                
                <div className="relative z-10">
                    <p className="text-sm font-medium opacity-90 mb-1">Total Tabungan Impian</p>
                    <h3 className="text-3xl font-bold mb-4 font-display">
                        Rp {(user.dreamSavers?.reduce((acc, curr) => acc + curr.currentAmount, 0) || 0).toLocaleString('id-ID')}
                    </h3>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10">
                        <Target size={14} />
                        <span>{user.dreamSavers?.length || 0} Impian Aktif</span>
                    </div>
                </div>
            </div>

            {/* List of Savers */}
            <div className="px-6 space-y-5">
                {user.dreamSavers?.map(saver => {
                    const progress = Math.min(100, Math.round((saver.currentAmount / saver.targetAmount) * 100));
                    return (
                        <div key={saver.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
                            <div className="flex gap-4 mb-4">
                                <img src={saver.image} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt={saver.name} />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">{saver.name}</h4>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                                        <span>Terkumpul</span>
                                        <span className="font-bold text-[#00AEEF]">Rp {saver.currentAmount.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-400 rounded-full" style={{width: `${progress}%`}}></div>
                                    </div>
                                    <div className="flex justify-between mt-1.5">
                                        <span className="text-[10px] text-gray-400 font-medium">{progress}%</span>
                                        <span className="text-[10px] text-gray-400">Target: Rp {saver.targetAmount.toLocaleString('id-ID', {notation:'compact'})}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-gray-100">Edit</button>
                                <button onClick={() => setTopUpModal(saver.id)} className="flex-1 py-2.5 text-xs font-bold text-white bg-[#00AEEF] rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-100 transition">Isi Saldo</button>
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
                    <button onClick={handleTopUp} className="w-full bg-[#00AEEF] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition">
                        Pindahkan Saldo
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

const RewardsView = ({ user }: { user: User }) => (
  <div className="space-y-6">
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
                     <p className="text-blue-100 text-xs">200 XP lagi naik level</p>
                 </div>
             </div>
             <div className="w-24">
                  <div className="h-2 w-full bg-blue-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-sumut-orange" style={{ width: `${user.xp}%` }}></div>
                  </div>
             </div>
         </div>
     </div>

     {/* Daily Login Feature */}
     <div className="px-6">
        <h3 className="font-bold text-slate-800 mb-3 text-sm">Absen Harian</h3>
        <div className="flex justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
           {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div key={day} className="flex flex-col items-center gap-2">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${day <= 3 ? 'bg-sumut-blue text-white' : day === 4 ? 'bg-sumut-orange text-white ring-4 ring-orange-100 animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                    {day <= 3 ? <CheckCircle2 size={14} /> : day === 4 ? '+50' : day}
                 </div>
                 <span className={`text-[10px] ${day === 4 ? 'text-sumut-orange font-bold' : 'text-gray-400'}`}>Hari {day}</span>
              </div>
           ))}
        </div>
        <button className="w-full mt-3 bg-sumut-orange text-white text-sm font-bold py-2.5 rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition">
           Klaim Poin Harian
        </button>
     </div>

     <div className="px-6">
         <h3 className="font-bold text-slate-800 mb-4 text-sm">Misi Harian (Daily Streak)</h3>
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
  </div>
);

const ProfileView = ({ user, onNavigateTransactions }: { user: User, onNavigateTransactions: () => void }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
                <MenuRow label="Keluar" textClass="text-red-500" onClick={() => setIsLogoutModalOpen(true)} />
            </div>
        </div>

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

const QuickAction = ({ icon, label, color }: any) => (
  <button className="flex flex-col items-center gap-2 group">
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