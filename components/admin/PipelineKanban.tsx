import React, { useState, useMemo } from 'react';
import { Clock, AlertTriangle, User, ChevronRight, ChevronLeft, TrendingUp, AlertCircle, CheckCircle2, FileText, List, LayoutGrid, Search, Filter, Plus, MoreHorizontal, ArrowUpDown } from 'lucide-react';

interface LoanApplication {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  productType: string;
  amount: number;
  stage: string;
  assignedRM: string;
  createdDate: string;
  lastUpdated: string;
  daysInStage: number;
  nextAction?: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
}

interface PipelineKanbanProps {
  applications: LoanApplication[];
  onCardClick?: (app: LoanApplication) => void;
}

const STAGES = [
  { key: 'new_lead', label: 'New Lead', color: 'blue' },
  { key: 'contacted', label: 'Contacted', color: 'cyan' },
  { key: 'doc_collection', label: 'Dokumen', color: 'purple' },
  { key: 'credit_scoring', label: 'Scoring', color: 'orange' },
  { key: 'approval', label: 'Approval', color: 'yellow' },
  { key: 'disbursement', label: 'Disbursed', color: 'green' },
  { key: 'active', label: 'Active', color: 'emerald' },
  { key: 'rejected', label: 'Rejected', color: 'red' },
];

const STAGE_COLORS: Record<string, string> = {
  new_lead: 'bg-blue-100 text-blue-700',
  contacted: 'bg-cyan-100 text-cyan-700',
  doc_collection: 'bg-purple-100 text-purple-700',
  credit_scoring: 'bg-orange-100 text-orange-700',
  approval: 'bg-amber-100 text-amber-700',
  disbursement: 'bg-green-100 text-green-700',
  active: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const PipelineKanban: React.FC<PipelineKanbanProps> = ({ applications, onCardClick }) => {
  // State
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'rejected'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'customerName' | 'amount' | 'daysInStage'>('daysInStage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(true);
  
  // Filter states
  const [filterStages, setFilterStages] = useState<string[]>([]);
  const [filterRMs, setFilterRMs] = useState<string[]>([]);
  const [filterProducts, setFilterProducts] = useState<string[]>([]);
  const [filterPriorities, setFilterPriorities] = useState<string[]>([]);
  
  const ITEMS_PER_PAGE = 10;

  // Get unique values for filters
  const uniqueRMs = useMemo(() => [...new Set(applications.map(app => app.assignedRM))], [applications]);
  const uniqueProducts = useMemo(() => [...new Set(applications.map(app => app.productType))], [applications]);

  // Tab-based filtering
  const tabFilteredApps = useMemo(() => {
    switch (activeTab) {
      case 'active': return applications.filter(app => !['active', 'rejected'].includes(app.stage));
      case 'completed': return applications.filter(app => app.stage === 'active');
      case 'rejected': return applications.filter(app => app.stage === 'rejected');
      default: return applications;
    }
  }, [applications, activeTab]);

  // Apply all filters
  const filteredApps = useMemo(() => {
    let result = [...tabFilteredApps];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(app => 
        app.customerName.toLowerCase().includes(query) ||
        app.productType.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query)
      );
    }
    
    if (filterStages.length) result = result.filter(app => filterStages.includes(app.stage));
    if (filterRMs.length) result = result.filter(app => filterRMs.includes(app.assignedRM));
    if (filterProducts.length) result = result.filter(app => filterProducts.includes(app.productType));
    if (filterPriorities.length) result = result.filter(app => filterPriorities.includes(app.priority));
    
    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'amount') comparison = a.amount - b.amount;
      else if (sortBy === 'daysInStage') comparison = a.daysInStage - b.daysInStage;
      else if (sortBy === 'customerName') comparison = a.customerName.localeCompare(b.customerName);
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    return result;
  }, [tabFilteredApps, searchQuery, filterStages, filterRMs, filterProducts, filterPriorities, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
  const paginatedApps = filteredApps.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Stats
  const stats = {
    all: applications.length,
    active: applications.filter(app => !['active', 'rejected'].includes(app.stage)).length,
    completed: applications.filter(app => app.stage === 'active').length,
    rejected: applications.filter(app => app.stage === 'rejected').length,
  };

  // Toggle filter checkbox
  const toggleFilter = (type: 'stage' | 'rm' | 'product' | 'priority', value: string) => {
    const setters = {
      stage: setFilterStages,
      rm: setFilterRMs,
      product: setFilterProducts,
      priority: setFilterPriorities,
    };
    const current = { stage: filterStages, rm: filterRMs, product: filterProducts, priority: filterPriorities }[type];
    
    if (current.includes(value)) {
      setters[type](current.filter(v => v !== value));
    } else {
      setters[type]([...current, value]);
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilterStages([]);
    setFilterRMs([]);
    setFilterProducts([]);
    setFilterPriorities([]);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSort = (column: 'customerName' | 'amount' | 'daysInStage') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header Tabs - Zoho style */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between px-4">
          <div className="flex">
            {[
              { key: 'all', label: 'All Applications', count: stats.all },
              { key: 'active', label: 'In Progress', count: stats.active },
              { key: 'completed', label: 'Completed', count: stats.completed },
              { key: 'rejected', label: 'Rejected', count: stats.rejected },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key as any); setCurrentPage(1); }}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.key 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} <span className="ml-1 text-xs text-gray-400">({tab.count})</span>
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            <Plus size={16} />
            Create Application
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-gray-100 bg-gray-50">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border ${
            showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600'
          }`}
        >
          <Filter size={14} />
          Filter
        </button>
        <button 
          onClick={() => handleSort('daysInStage')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        >
          <ArrowUpDown size={14} />
          Sort
        </button>
        <div className="flex-1" />
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search records"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-64 pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Filters - Zoho style */}
        {showFilters && (
          <div className="w-56 border-r border-gray-200 bg-gray-50 p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-gray-700 uppercase">Filter by</h4>
              {(filterStages.length || filterRMs.length || filterProducts.length || filterPriorities.length) > 0 && (
                <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">Clear</button>
              )}
            </div>
            
            {/* Stages */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Stage</p>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {STAGES.filter(s => s.key !== 'rejected').map(stage => (
                  <label key={stage.key} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-gray-900">
                    <input
                      type="checkbox"
                      checked={filterStages.includes(stage.key)}
                      onChange={() => toggleFilter('stage', stage.key)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {stage.label}
                  </label>
                ))}
              </div>
            </div>

            {/* RM */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Assigned RM</p>
              <div className="space-y-1.5">
                {uniqueRMs.map(rm => (
                  <label key={rm} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-gray-900">
                    <input
                      type="checkbox"
                      checked={filterRMs.includes(rm)}
                      onChange={() => toggleFilter('rm', rm)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {rm}
                  </label>
                ))}
              </div>
            </div>

            {/* Product */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Product Type</p>
              <div className="space-y-1.5">
                {uniqueProducts.map(product => (
                  <label key={product} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-gray-900">
                    <input
                      type="checkbox"
                      checked={filterProducts.includes(product)}
                      onChange={() => toggleFilter('product', product)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {product}
                  </label>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">Priority</p>
              <div className="space-y-1.5">
                {[{ key: 'high', label: '🔴 High' }, { key: 'medium', label: '🟡 Medium' }, { key: 'low', label: '🟢 Low' }].map(p => (
                  <label key={p.key} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer hover:text-gray-900">
                    <input
                      type="checkbox"
                      checked={filterPriorities.includes(p.key)}
                      onChange={() => toggleFilter('priority', p.key)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {p.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-10 px-4 py-2">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300" />
                </th>
                <th 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('customerName')}
                >
                  Customer Name {sortBy === 'customerName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('amount')}
                >
                  Amount {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                <th 
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-gray-700"
                  onClick={() => handleSort('daysInStage')}
                >
                  Days {sortBy === 'daysInStage' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">RM</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Next Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedApps.map(app => (
                <tr 
                  key={app.id} 
                  className={`border-b border-gray-100 hover:bg-blue-50/50 cursor-pointer transition ${
                    app.daysInStage > 7 ? 'bg-red-50/50' : ''
                  }`}
                  onClick={() => onCardClick?.(app)}
                >
                  <td className="px-4 py-2">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300" onClick={e => e.stopPropagation()} />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <img src={app.customerAvatar} alt="" className="w-6 h-6 rounded-full" />
                      <span className="font-medium text-gray-900 text-xs">{app.customerName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">{app.productType}</td>
                  <td className="px-4 py-2 text-xs font-medium text-gray-900">Rp {(app.amount / 1000000).toFixed(0)}jt</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${STAGE_COLORS[app.stage]}`}>
                      {STAGES.find(s => s.key === app.stage)?.label}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`text-xs ${app.daysInStage > 7 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                      {app.daysInStage > 7 && '⚠ '}{app.daysInStage}d
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">{app.assignedRM}</td>
                  <td className="px-4 py-2">
                    {app.priority === 'high' && <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded">HIGH</span>}
                    {app.priority === 'medium' && <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] rounded">MED</span>}
                    {app.priority === 'low' && <span className="px-1.5 py-0.5 bg-gray-400 text-white text-[10px] rounded">LOW</span>}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500 max-w-[150px] truncate">{app.nextAction || '-'}</td>
                </tr>
              ))}
              {paginatedApps.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer - Pagination Zoho style */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
        <span>Total Records: <strong>{filteredApps.length}</strong></span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="px-2">
            {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredApps.length)}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PipelineKanban;
