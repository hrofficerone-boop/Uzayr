
import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Clock, 
  User, 
  FileText, 
  Building2, 
  CalendarClock, 
  Calculator,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { AuditEntry } from '../types';

interface AuditLogProps {
  logs: AuditEntry[];
}

const AuditLog: React.FC<AuditLogProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredLogs = logs
    .filter(log => filterCategory === 'ALL' || log.category === filterCategory)
    .filter(log => 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PAYROLL': return <Calculator className="w-4 h-4" />;
      case 'ENTITY': return <Building2 className="w-4 h-4" />;
      case 'LEAVE': return <CalendarClock className="w-4 h-4" />;
      case 'WORKFORCE': return <User className="w-4 h-4" />;
      default: return <ShieldCheck className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'PAYROLL': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'ENTITY': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'LEAVE': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'WORKFORCE': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">System Audit Ledger</h3>
          <p className="text-sm text-slate-500 font-medium">Full immutable record of all administrative and payroll actions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Compliance Integrity: Verified
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Filters Header */}
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/30">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by action, user, or detail..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['ALL', 'PAYROLL', 'ENTITY', 'LEAVE', 'WORKFORCE'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  filterCategory === cat 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[20%]">Timestamp</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[15%]">Category</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[20%]">Action Protocol</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[30%]">Impact Detail</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[15%] text-right">User Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-300" />
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">{new Date(log.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getCategoryColor(log.category)}`}>
                      {getCategoryIcon(log.category)}
                      {log.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-800 tracking-tight">
                    {log.action}
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">{log.details}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-xs font-bold text-slate-700">{log.user}</span>
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-[10px] font-black text-indigo-600">
                        {log.user.charAt(0)}
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No matching audit records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLog;
