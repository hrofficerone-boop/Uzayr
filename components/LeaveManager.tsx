
import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Plus, 
  FileText, 
  Send, 
  X, 
  Info, 
  ShieldAlert, 
  TrendingUp,
  Scale,
  History,
  AlertCircle,
  Users
} from 'lucide-react';
import { LeaveRequest, LeaveType, LeaveStatus, AuditEntry } from '../types';

interface LeaveManagerProps {
  viewAsEss?: boolean;
  essUserId?: string;
  onLog?: (category: AuditEntry['category'], action: string, details: string) => void;
}

const mockLeave: LeaveRequest[] = [
  { id: '1', employeeId: '1', employeeName: 'Sipho Ndlovu', type: LeaveType.ANNUAL, startDate: '2024-06-20', endDate: '2024-06-25', days: 4, status: LeaveStatus.PENDING, reason: 'Family vacation' },
  { id: '2', employeeId: '2', employeeName: 'Sarah Smith', type: LeaveType.SICK, startDate: '2024-06-12', endDate: '2024-06-13', days: 2, status: LeaveStatus.APPROVED, reason: 'Flu' },
];

const BCEA_POLICIES = [
  {
    type: LeaveType.ANNUAL,
    rule: "15 working days per 12-month cycle",
    detail: "Calculated at 1.25 days per month worked. Pro-rata accumulation is mandatory under the BCEA.",
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  {
    type: LeaveType.SICK,
    rule: "30 days per 36-month cycle",
    detail: "During the first 6 months, an employee is entitled to 1 day for every 26 days worked.",
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    type: LeaveType.FAMILY,
    rule: "3 days per 12-month cycle",
    detail: "Eligible after 4 months of employment if working >4 days a week. Covers death of kin or illness of child.",
    color: "text-amber-600",
    bg: "bg-amber-50"
  }
];

const LeaveManager: React.FC<LeaveManagerProps> = ({ viewAsEss, essUserId, onLog }) => {
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeave);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HISTORY' | 'POLICY'>('OVERVIEW');

  const filteredRequests = useMemo(() => {
    return viewAsEss 
      ? requests.filter(r => r.employeeId === essUserId)
      : requests;
  }, [requests, viewAsEss, essUserId]);

  const getStatusStyle = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED: return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case LeaveStatus.REJECTED: return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  const LeaveBalanceCard = ({ 
    title, 
    available, 
    accrued, 
    taken, 
    color, 
    icon: Icon 
  }: { 
    title: string, 
    available: number, 
    accrued: number, 
    taken: number, 
    color: string,
    icon: any 
  }) => (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-xl transition-all">
      <div className={`absolute top-0 right-0 w-32 h-32 ${color.replace('text', 'bg')} opacity-[0.03] -mr-16 -mt-16 rounded-full transition-transform group-hover:scale-150`}></div>
      <div className="flex items-center justify-between mb-6">
        <div className={`p-3 rounded-2xl ${color.replace('text', 'bg')}/10`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BCEA Cycle Active</span>
      </div>
      
      <p className="text-[11px] uppercase font-black text-slate-500 tracking-wider mb-2">{title}</p>
      <div className="flex items-baseline gap-2 mb-6">
        <h3 className={`text-5xl font-black ${color} tracking-tighter`}>{available}</h3>
        <span className="text-sm font-bold text-slate-400">Working Days</span>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Accrued YTD</p>
          <p className="text-sm font-bold text-slate-800">{accrued}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Taken</p>
          <p className="text-sm font-bold text-slate-800">{taken}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Navigation & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: 'OVERVIEW', label: 'Absence Dashboard', icon: TrendingUp },
            { id: 'HISTORY', label: 'Audit History', icon: History },
            { id: 'POLICY', label: 'Compliance Manual', icon: Scale }
          ].map(t => (
            <button 
              key={t.id} 
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === t.id 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
        
        {viewAsEss && (
           <button 
            onClick={() => setShowApplyModal(true)}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-indigo-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
           >
            <Plus className="w-5 h-5" /> Submit Absence Request
          </button>
        )}
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <LeaveBalanceCard title="Annual Leave" available={12.5} accrued={15} taken={2.5} color="text-indigo-600" icon={Calendar} />
              <LeaveBalanceCard title="Sick Leave" available={30} accrued={30} taken={0} color="text-emerald-600" icon={ShieldAlert} />
              <LeaveBalanceCard title="Family Resp." available={3} accrued={3} taken={0} color="text-amber-600" icon={Users} />
           </div>

           <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between">
               <h4 className="text-xl font-black text-slate-900 tracking-tight">Active Requests</h4>
               <Filter className="w-5 h-5 text-slate-400" />
             </div>
             <div className="divide-y divide-slate-100">
               {filteredRequests.length > 0 ? filteredRequests.map(req => (
                 <div key={req.id} className="p-8 hover:bg-slate-50 transition-all flex items-center justify-between">
                   <div className="flex items-center gap-6">
                     <div className={`p-4 rounded-2xl ${getStatusStyle(req.status)} border shadow-sm`}>
                       {req.status === LeaveStatus.APPROVED ? <CheckCircle2 /> : req.status === LeaveStatus.REJECTED ? <XCircle /> : <Clock />}
                     </div>
                     <div>
                       <p className="font-black text-slate-900 text-lg tracking-tighter">{req.type} • {req.days} Days</p>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{req.startDate} to {req.endDate}</p>
                     </div>
                   </div>
                   <div className="text-right">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(req.status)}`}>
                        {req.status}
                      </span>
                   </div>
                 </div>
               )) : (
                 <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                   No pending or active requests
                 </div>
               )}
             </div>
           </div>
        </div>
      )}

      {activeTab === 'HISTORY' && (
         <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 text-center py-20">
            <History className="w-16 h-16 text-slate-200 mx-auto mb-6" />
            <h4 className="text-xl font-black text-slate-900">No Historical Data Found</h4>
            <p className="text-slate-500 mt-2">Historical leave records are archived after the 12-month cycle reset.</p>
         </div>
      )}

      {activeTab === 'POLICY' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BCEA_POLICIES.map((policy, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className={`w-12 h-12 rounded-2xl ${policy.bg} ${policy.color} flex items-center justify-center mb-6`}>
                <Scale className="w-6 h-6" />
              </div>
              <h5 className="text-2xl font-black text-slate-900 mb-2">{policy.type} Regulation</h5>
              <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4">{policy.rule}</p>
              <p className="text-slate-500 leading-relaxed">{policy.detail}</p>
            </div>
          ))}
        </div>
      )}

      {showApplyModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-indigo-950/90 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowApplyModal(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600"><X /></button>
            <h3 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter mb-2">Leave Application</h3>
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-8">Submission Protocol</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Absence Category</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold">
                  <option>Annual Leave</option>
                  <option>Sick Leave</option>
                  <option>Family Responsibility</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Start Date</label>
                  <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                </div>
                 <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">End Date</label>
                  <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Reason / Notes</label>
                <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold min-h-[100px]" placeholder="Provide context..."></textarea>
              </div>
              <button 
                onClick={() => {
                  setShowApplyModal(false);
                  onLog?.('LEAVE', 'Absence Request Submitted', 'An employee submitted a new leave application for management review.');
                }}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 mt-4"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManager;
