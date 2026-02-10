
import React from 'react';
import { 
  TrendingUp, 
  Users, 
  AlertCircle, 
  ChevronRight,
  ArrowUpRight,
  CalendarDays,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { formatCurrency } from '../utils/payrollCalculators';

const mockData = [
  { name: 'Jan', paye: 45000, net: 280000 },
  { name: 'Feb', paye: 46000, net: 285000 },
  { name: 'Mar', paye: 45500, net: 282000 },
  { name: 'Apr', paye: 48000, net: 300000 },
  { name: 'May', paye: 47000, net: 295000 },
  { name: 'Jun', paye: 49000, net: 310000 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Global Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Managed Payroll Vol.', value: 'R 420,500.00', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Total Managed Staff', value: '24', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Compliance Deadline', value: '7 July 2024', icon: CalendarDays, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'HR Action Required', value: '2', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-2xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center border border-emerald-100 uppercase tracking-widest">
                <ArrowUpRight className="w-3 h-3 mr-1" /> Healthy
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Cost Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" /> Managed Resource Costs (H1 2024)
            </h4>
            <select className="text-xs font-bold border-slate-100 rounded-xl bg-slate-50 px-4 py-2 outline-none text-slate-600">
              <option>Net Disbursements vs PAYE</option>
              <option>Total Cost to Client</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(val) => `R${val/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#f8fafc', radius: 8}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="net" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Employee Net Pay" barSize={32} />
                <Bar dataKey="paye" fill="#fbbf24" radius={[6, 6, 0, 0]} name="SARS Obligations" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Compliance Checklist */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h4 className="font-bold text-slate-800 tracking-tight">SARS Compliance Status</h4>
          </div>
          <div className="space-y-4">
            {[
              { title: 'EMP201 Submission', status: 'Verified', date: '7 June', color: 'bg-emerald-500' },
              { title: 'UIF Declaration', status: 'Verified', date: '7 June', color: 'bg-emerald-500' },
              { title: 'SDL Levy Payment', status: 'Action Required', date: 'Next Cycle', color: 'bg-amber-500' },
              { title: 'EMP501 Interim Recon', status: 'Scheduled', date: 'Oct 2024', color: 'bg-slate-300' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.color} shadow-sm`} />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.title}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.date}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-tighter ${
                  item.status === 'Verified' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 px-4 bg-indigo-50 text-indigo-700 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-100 transition-all flex items-center justify-center gap-2">
            Audit Trail <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
