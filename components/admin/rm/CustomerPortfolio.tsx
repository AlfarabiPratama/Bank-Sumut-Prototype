import React, { useState } from 'react';
import { Search, Filter, LayoutGrid, List, Phone, MessageSquare, Mail, Eye, MoreHorizontal, ChevronDown } from 'lucide-react';
import { MOCK_RM_CUSTOMERS } from './mockData';

const CustomerPortfolio = () => {
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [filterSegment, setFilterSegment] = useState('ALL');
  
  const filteredCustomers = filterSegment === 'ALL' 
    ? MOCK_RM_CUSTOMERS 
    : MOCK_RM_CUSTOMERS.filter(c => c.segment === filterSegment);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari nama, rekening..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200">
            <Filter size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <select 
            value={filterSegment}
            onChange={(e) => setFilterSegment(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Semua Segment</option>
            <option value="Champions">Champions</option>
            <option value="Loyal Customers">Loyal Customers</option>
            <option value="Potential Loyalists">Potential Loyalists</option>
            <option value="At Risk">At Risk</option>
          </select>

          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button 
              onClick={() => setViewMode('GRID')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'GRID' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('LIST')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'LIST' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'GRID' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-4">
          {filteredCustomers.map(customer => (
            <div key={customer.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {customer.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{customer.name}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        ID: {customer.accountNumber} <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">{customer.riskProfile} Risk</span>
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-medium">Total AUM</span>
                    <span className="font-bold text-gray-900">{formatCurrency(customer.balance)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Segment</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                      ${customer.segment === 'Champions' ? 'bg-amber-100 text-amber-700' : 
                        customer.segment === 'At Risk' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {customer.segment}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Produk</span>
                    <div className="flex gap-1">
                      {customer.products.slice(0, 2).map(p => (
                        <span key={p} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] border border-blue-100">{p}</span>
                      ))}
                      {customer.products.length > 2 && <span className="text-xs text-gray-400">+{customer.products.length - 2}</span>}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200">
                    <Phone size={16} /> Call
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100">
                    <MessageSquare size={16} /> Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'LIST' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Nasabah</th>
                <th className="px-6 py-4 text-left font-semibold">Segment</th>
                <th className="px-6 py-4 text-right font-semibold">Balance (AUM)</th>
                <th className="px-6 py-4 text-left font-semibold">Last Contact</th>
                <th className="px-6 py-4 text-center font-semibold">Risk Profile</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {customer.name.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.accountNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${customer.segment === 'Champions' ? 'bg-amber-100 text-amber-700' : 
                        customer.segment === 'At Risk' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {customer.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium font-mono text-gray-700">
                    {formatCurrency(customer.balance)}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(customer.lastContact).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      customer.riskProfile === 'High' ? 'text-red-600 bg-red-50' : 
                      customer.riskProfile === 'Medium' ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50'
                    }`}>
                      {customer.riskProfile}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                       <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Phone size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                        <MessageSquare size={16} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerPortfolio;
