import React, { useState, useMemo, useEffect } from 'react';
import { 
  Headphones,
  BarChart3,
  Ticket,
  Clock,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  Users,
  Timer,
  TrendingUp,
  MessageSquare,
  Search
} from 'lucide-react';
import { User } from '../../../types';

interface ServiceCloudProps {
  customers: User[];
  onSelectCustomer?: (customer: User) => void;
  activeSubTab?: string;
}

// Map parent sub-tabs to internal tab values
const SUB_TAB_MAP: Record<string, ServiceTab> = {
  'Tickets': 'tickets',
  'SLA': 'sla',
  'Knowledge Base': 'knowledge',
};

type ServiceTab = 'overview' | 'tickets' | 'sla' | 'knowledge';

interface Ticket {
  id: string;
  customer: string;
  issue: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'escalated';
  assignee: string;
  createdAt: Date;
  slaHours: number;
}

const ServiceCloud: React.FC<ServiceCloudProps> = ({ customers, onSelectCustomer, activeSubTab }) => {
  const [activeTab, setActiveTab] = useState<ServiceTab>('overview');

  // Sync internal tab state with parent sub-tab
  useEffect(() => {
    if (activeSubTab && SUB_TAB_MAP[activeSubTab]) {
      setActiveTab(SUB_TAB_MAP[activeSubTab]);
    } else if (!activeSubTab) {
      setActiveTab('overview');
    }
  }, [activeSubTab]);

  // Mock tickets data
  const tickets: Ticket[] = [
    { id: 'TK001', customer: 'Ahmad Harahap', issue: 'ATM Card Blocked', category: 'Card', priority: 'high', status: 'open', assignee: 'Dedi S.', createdAt: new Date(Date.now() - 1000*60*30), slaHours: 4 },
    { id: 'TK002', customer: 'Siti Aminah', issue: 'Transfer Failed', category: 'Transaction', priority: 'urgent', status: 'in-progress', assignee: 'Maya L.', createdAt: new Date(Date.now() - 1000*60*120), slaHours: 2 },
    { id: 'TK003', customer: 'Budi Nasution', issue: 'Mobile App Error', category: 'Technical', priority: 'medium', status: 'open', assignee: 'Ahmad S.', createdAt: new Date(Date.now() - 1000*60*60), slaHours: 4 },
    { id: 'TK004', customer: 'Rian Siregar', issue: 'Wrong Debit Amount', category: 'Transaction', priority: 'high', status: 'escalated', assignee: 'Siti H.', createdAt: new Date(Date.now() - 1000*60*180), slaHours: 2 },
    { id: 'TK005', customer: 'Diana Lubis', issue: 'Password Reset', category: 'Account', priority: 'low', status: 'resolved', assignee: 'Budi N.', createdAt: new Date(Date.now() - 1000*60*240), slaHours: 8 },
  ];

  const ticketStats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    escalated: tickets.filter(t => t.status === 'escalated').length,
  }), [tickets]);

  const agentPerformance = [
    { name: 'Dedi Simanjuntak', resolved: 45, avgTime: 1.2, csat: 4.8 },
    { name: 'Maya Lubis', resolved: 38, avgTime: 1.5, csat: 4.6 },
    { name: 'Ahmad Siregar', resolved: 32, avgTime: 1.8, csat: 4.5 },
    { name: 'Siti Harahap', resolved: 28, avgTime: 2.0, csat: 4.3 },
  ];

  const knowledgeArticles = [
    { id: 'KB001', title: 'Cara Reset Password Mobile Banking', category: 'Account', views: 1250 },
    { id: 'KB002', title: 'Prosedur Blokir Kartu ATM', category: 'Card', views: 890 },
    { id: 'KB003', title: 'FAQ Transfer Antar Bank', category: 'Transaction', views: 756 },
    { id: 'KB004', title: 'Panduan Aktivasi Notifikasi', category: 'Technical', views: 543 },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'sla', label: 'SLA Monitor', icon: Clock },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
  ];

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600',
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-blue-100 text-blue-600',
      'in-progress': 'bg-yellow-100 text-yellow-600',
      resolved: 'bg-green-100 text-green-600',
      escalated: 'bg-red-100 text-red-600',
    };
    return colors[status] || colors.open;
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Headphones size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Service</h2>
              <p className="text-xs text-gray-500">Cloud</p>
            </div>
          </div>
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as ServiceTab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${activeTab === tab.id ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Icon size={18} />{tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="mt-4 mx-4 p-4 bg-blue-50 rounded-xl">
          <h3 className="text-xs font-semibold text-blue-800 uppercase mb-3">Open Tickets</h3>
          <p className="text-2xl font-bold text-gray-900">{ticketStats.open + ticketStats.inProgress}</p>
          <div className="mt-2 flex items-center gap-2">
            {ticketStats.escalated > 0 && (
              <span className="text-xs text-red-600 font-medium">{ticketStats.escalated} escalated</span>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Service Overview</h1></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Ticket size={20} className="text-blue-600" />
                  </div>
                  <div><p className="text-sm text-gray-500">Open Tickets</p><p className="text-xl font-bold">{ticketStats.open}</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Timer size={20} className="text-yellow-600" />
                  </div>
                  <div><p className="text-sm text-gray-500">In Progress</p><p className="text-xl font-bold">{ticketStats.inProgress}</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-green-600" />
                  </div>
                  <div><p className="text-sm text-gray-500">Resolved Today</p><p className="text-xl font-bold">{ticketStats.resolved}</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <AlertTriangle size={20} className="text-red-600" />
                  </div>
                  <div><p className="text-sm text-gray-500">Escalated</p><p className="text-xl font-bold">{ticketStats.escalated}</p></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Tickets</h3>
                <div className="space-y-3">
                  {tickets.slice(0, 4).map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{ticket.issue}</p>
                        <p className="text-xs text-gray-500">{ticket.customer}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Agent Performance</h3>
                <div className="space-y-3">
                  {agentPerformance.map((agent) => (
                    <div key={agent.name} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-medium text-blue-600 text-sm">
                        {agent.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{agent.name}</p>
                        <p className="text-xs text-gray-500">{agent.resolved} resolved • {agent.avgTime}h avg</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">⭐ {agent.csat}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div><h1 className="text-2xl font-bold text-gray-900">Ticket Center</h1></div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600">
                + New Ticket
              </button>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b"><tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Issue</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold">Priority</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold">Assignee</th>
                </tr></thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-mono text-sm">{ticket.id}</td>
                      <td className="py-4 px-4 font-medium">{ticket.customer}</td>
                      <td className="py-4 px-4 text-gray-600">{ticket.issue}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">{ticket.assignee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'sla' && (
          <div className="space-y-6">
            <div><h1 className="text-2xl font-bold text-gray-900">SLA Monitor</h1></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-sm text-gray-500">SLA Compliance</p>
                <p className="text-3xl font-bold text-green-600">94.5%</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-sm text-gray-500">Avg Resolution Time</p>
                <p className="text-3xl font-bold">1.8h</p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-sm text-gray-500">At Risk (SLA)</p>
                <p className="text-3xl font-bold text-orange-600">3</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div><h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1></div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium">+ Add Article</button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search articles..." className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {knowledgeArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-medium">{article.category}</span>
                      <h3 className="font-medium text-gray-900 mt-2">{article.title}</h3>
                    </div>
                    <span className="text-sm text-gray-500">{article.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCloud;
