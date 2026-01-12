import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  Zap, 
  FileText,
  BarChart3,
  TrendingUp,
  Megaphone,
  Mail,
  Smartphone,
  Gift,
  PieChart,
  UserCheck
} from 'lucide-react';
import { User, Campaign, RFMSegment } from '../../../types';

interface MarketingCloudProps {
  customers: User[];
  campaigns: Campaign[];
  onCampaignsChange?: (campaigns: Campaign[]) => void;
  onSelectCustomer?: (customer: User) => void;
  activeSubTab?: string;
  hideSidebar?: boolean; // Hide internal sidebar when embedded in AdminDashboard
}

// Map parent sub-tabs to internal tab values
const SUB_TAB_MAP: Record<string, MarketingTab> = {
  'Campaigns': 'campaigns',
  'Segments': 'segmentation',
  'Consent': 'content', // Consent maps to content/consent preferences
};

type MarketingTab = 'overview' | 'campaigns' | 'segmentation' | 'content';

const MarketingCloud: React.FC<MarketingCloudProps> = ({
  customers,
  campaigns,
  onCampaignsChange,
  onSelectCustomer,
  activeSubTab,
  hideSidebar = false,
}) => {
  const [activeTab, setActiveTab] = useState<MarketingTab>('overview');

  // Sync internal tab state with parent sub-tab
  useEffect(() => {
    if (activeSubTab && SUB_TAB_MAP[activeSubTab]) {
      setActiveTab(SUB_TAB_MAP[activeSubTab]);
    } else if (!activeSubTab) {
      setActiveTab('overview');
    }
  }, [activeSubTab]);

  // Calculate segment stats
  const segmentStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    customers.forEach(c => {
      stats[c.segment] = (stats[c.segment] || 0) + 1;
    });
    return stats;
  }, [customers]);

  const totalCustomers = customers.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
  const totalReach = campaigns.reduce((sum, c) => sum + (c.reach || 0), 0);
  const avgConversion = campaigns.length > 0 
    ? (campaigns.reduce((sum, c) => sum + c.conversion, 0) / campaigns.length).toFixed(1)
    : '0';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'segmentation', label: 'Segmentation', icon: PieChart },
    { id: 'content', label: 'Content Library', icon: FileText },
  ];

  return (
    <div className={`flex ${hideSidebar ? '' : 'h-[calc(100vh-4rem)]'}`}>
      {/* Sidebar - hidden when embedded */}
      {!hideSidebar && (
      <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Megaphone size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Marketing</h2>
              <p className="text-xs text-gray-500">Cloud</p>
            </div>
          </div>

          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as MarketingTab)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${activeTab === tab.id
                      ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-500 -ml-[2px] pl-[14px]'
                      : 'text-gray-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 mx-4 p-4 bg-orange-50 rounded-xl">
          <h3 className="text-xs font-semibold text-orange-800 uppercase tracking-wider mb-3">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Audience</span>
              <span className="font-bold text-gray-900">{totalCustomers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Campaigns</span>
              <span className="font-bold text-orange-600">{activeCampaigns}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Conversion</span>
              <span className="font-bold text-green-600">{avgConversion}%</span>
            </div>
          </div>
        </div>
      </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marketing Overview</h1>
              <p className="text-gray-500 mt-1">Campaign performance and audience insights</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Audience</p>
                    <p className="text-xl font-bold text-gray-900">{totalCustomers.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Megaphone size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Campaigns</p>
                    <p className="text-xl font-bold text-gray-900">{activeCampaigns}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Target size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Reach</p>
                    <p className="text-xl font-bold text-gray-900">{totalReach.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <TrendingUp size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Avg Conversion</p>
                    <p className="text-xl font-bold text-gray-900">{avgConversion}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Segment Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Audience Segments</h3>
                <div className="space-y-3">
                  {Object.entries(segmentStats).map(([segment, count]) => {
                    const percentage = ((count / totalCustomers) * 100).toFixed(1);
                    const colors: Record<string, string> = {
                      [RFMSegment.CHAMPIONS]: 'bg-emerald-500',
                      [RFMSegment.LOYAL]: 'bg-green-500',
                      [RFMSegment.POTENTIAL]: 'bg-yellow-500',
                      [RFMSegment.AT_RISK]: 'bg-orange-500',
                      [RFMSegment.HIBERNATING]: 'bg-red-500',
                    };
                    return (
                      <div key={segment}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{segment}</span>
                          <span className="text-gray-500">{count} ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors[segment] || 'bg-gray-400'} rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Campaigns</h3>
                <div className="space-y-3">
                  {campaigns.slice(0, 5).map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${campaign.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{campaign.title}</p>
                          <p className="text-xs text-gray-500">{campaign.targetSegment.join(', ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">{campaign.conversion}%</p>
                        <p className="text-xs text-gray-500">conversion</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Channel Performance */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Channel Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { channel: 'Push Notification', icon: Smartphone, sent: 12500, opened: 8750, rate: 70 },
                  { channel: 'In-App Message', icon: Gift, sent: 8200, opened: 6560, rate: 80 },
                  { channel: 'Email', icon: Mail, sent: 15000, opened: 4500, rate: 30 },
                  { channel: 'SMS', icon: FileText, sent: 5000, opened: 2500, rate: 50 },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.channel} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon size={18} className="text-gray-600" />
                        <span className="font-medium text-gray-900 text-sm">{item.channel}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Sent</span>
                          <span className="font-medium">{item.sent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Opened</span>
                          <span className="font-medium">{item.opened.toLocaleString()}</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Open Rate</span>
                            <span className="font-bold text-green-600">{item.rate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
                <p className="text-gray-500 mt-1">Manage and track marketing campaigns</p>
              </div>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                <Zap size={18} />
                Create Campaign
              </button>
            </div>

            {/* Campaign List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Campaign</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Target Segment</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Reach</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{campaign.title}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {campaign.targetSegment.map((seg) => (
                            <span key={seg} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                              {seg}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'Active' ? 'bg-green-100 text-green-700' :
                          campaign.status === 'Draft' ? 'bg-gray-100 text-gray-600' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-medium text-gray-900">
                        {(campaign.reach || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-bold text-green-600">{campaign.conversion}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'segmentation' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RFM Segmentation</h1>
              <p className="text-gray-500 mt-1">Analyze customer segments based on Recency, Frequency, Monetary</p>
            </div>

            {/* Segment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { segment: RFMSegment.CHAMPIONS, name: 'Sultan Sejati', color: 'emerald', icon: '👑' },
                { segment: RFMSegment.LOYAL, name: 'Kawan Setia', color: 'green', icon: '💚' },
                { segment: RFMSegment.POTENTIAL, name: 'Calon Sultan', color: 'yellow', icon: '⭐' },
                { segment: RFMSegment.AT_RISK, name: 'Hampir Lupa', color: 'orange', icon: '⚠️' },
                { segment: RFMSegment.HIBERNATING, name: 'Tidur Panjang', color: 'red', icon: '😴' },
              ].map((item) => {
                const count = segmentStats[item.segment] || 0;
                const percentage = totalCustomers > 0 ? ((count / totalCustomers) * 100).toFixed(1) : '0';
                return (
                  <div 
                    key={item.segment}
                    className={`bg-white rounded-xl p-5 border-2 border-${item.color}-200 hover:border-${item.color}-400 transition-colors cursor-pointer`}
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{item.segment}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-gray-900">{count}</span>
                      <span className="text-sm text-gray-500">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Customer List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Customer List</h3>
                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option>All Segments</option>
                    <option>Champions</option>
                    <option>Loyal</option>
                    <option>Potential</option>
                    <option>At Risk</option>
                    <option>Hibernating</option>
                  </select>
                </div>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Segment</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">R</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">F</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 text-sm">M</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.slice(0, 10).map((customer) => (
                    <tr 
                      key={customer.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => onSelectCustomer?.(customer)}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{customer.name}</p>
                            <p className="text-xs text-gray-500">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customer.segment === RFMSegment.CHAMPIONS ? 'bg-emerald-100 text-emerald-700' :
                          customer.segment === RFMSegment.LOYAL ? 'bg-green-100 text-green-700' :
                          customer.segment === RFMSegment.POTENTIAL ? 'bg-yellow-100 text-yellow-700' :
                          customer.segment === RFMSegment.AT_RISK ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {customer.segment}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-mono text-sm">{customer.rfmScore?.recency || '-'}</td>
                      <td className="py-4 px-4 text-center font-mono text-sm">{customer.rfmScore?.frequency || '-'}</td>
                      <td className="py-4 px-4 text-center font-mono text-sm">{customer.rfmScore?.monetary || '-'}</td>
                      <td className="py-4 px-4 text-right font-medium text-gray-900">
                        Rp {customer.balance.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Content Library</h1>
                <p className="text-gray-500 mt-1">Manage promotional content and templates</p>
              </div>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                + Add Content
              </button>
            </div>

            <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Content Library Coming Soon</h3>
              <p className="text-gray-500">Manage promo banners, email templates, and push notification content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingCloud;
