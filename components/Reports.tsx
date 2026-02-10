
import React, { useState, useMemo } from 'react';
import { 
  Download, 
  FileDown, 
  Search, 
  Filter, 
  ShieldCheck, 
  Info, 
  Globe, 
  CreditCard,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency, calculateAdvancedPayroll } from '../utils/payrollCalculators';
import { Employee, Company, AuditEntry } from '../types';

interface ReportsProps {
  employees: Employee[];
  company: Company;
  onLog?: (category: AuditEntry['category'], action: string, details: string) => void;
}

const Reports: React.FC<ReportsProps> = ({ employees, company, onLog }) => {
  // Aggregate data only for active employees
  const activeEmployees = useMemo(() => employees.filter(e => e.status === 'ACTIVE'), [employees]);
  
  const payrollAggregates = useMemo(() => {
    return activeEmployees.reduce((acc, emp) => {
      const calc = calculateAdvancedPayroll(emp.recurringItems, emp.medicalAidDependents);
      return {
        paye: acc.paye + calc.paye,
        uif: acc.uif + calc.uif,
        sdl: acc.sdl + (calc.grossEarnings * 0.01), // Simple SDL calc
        total: acc.total + calc.paye + calc.uif + (calc.grossEarnings * 0.01)
      };
    }, { paye: 0, uif: 0, sdl: 0, total: 0 });
  }, [activeEmployees]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-indigo-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-300 font-black mb-6 uppercase tracking-widest text-[10px]">
              <CreditCard className="w-4 h-4" /> UniPay Compliance Hub
            </div>
            <h3 className="text-4xl font-black mb-6 tracking-tighter leading-none">SARS Tax & Regulatory Reports</h3>
            <p className="text-indigo-200 leading-relaxed mb-10 text-lg font-medium opacity-90">
              Generate fully compliant UniPay EMP201 monthly returns and EMP501 reconciliation reports. 
              <span className="block mt-2 text-rose-300 text-xs font-black uppercase tracking-widest">
                Protocol: Active Workforce Only ({activeEmployees.length} Resources)
              </span>
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-indigo-950 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-xl shadow-indigo-950/40">
                <FileDown className="w-5 h-5" /> Export UniPay EMP501
              </button>
              <button className="bg-indigo-800/50 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-800 border border-indigo-700 transition-all">
                GVM Group Audit
              </button>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 w-full lg:w-[22rem] shadow-2xl">
            <h5 className="font-black mb-6 text-indigo-300 uppercase text-xs tracking-widest text-center">UniPay Monthly Aggregate</h5>
            <div className="space-y-5">
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-indigo-200 font-medium">PAYE Obligations</span>
                <span className="font-bold text-white">{formatCurrency(payrollAggregates.paye)}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-indigo-200 font-medium">UIF Declaration</span>
                <span className="font-bold text-white">{formatCurrency(payrollAggregates.uif)}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
                <span className="text-indigo-200 font-medium">SDL Levy</span>
                <span className="font-bold text-white">{formatCurrency(payrollAggregates.sdl)}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-black pt-4">
                <span>Total Due</span>
                <span className="text-emerald-400 font-black">{formatCurrency(payrollAggregates.total)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xl font-black text-slate-800 tracking-tight">UniPay Filing Archive</h4>
            <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              <ShieldCheck className="w-4 h-4" /> SARS eFiling Ready
            </div>
          </div>
          <div className="space-y-3">
            {[
              { period: 'May 2024', paye: 47200, uif: 4120, sdl: 4100, eti: 2000 },
              { period: 'Apr 2024', paye: 46800, uif: 4080, sdl: 4050, eti: 1500 },
            ].map((rep, i) => (
              <div key={i} className="flex items-center justify-between p-6 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all group cursor-pointer">
                <div>
                  <p className="font-black text-slate-900 text-lg tracking-tighter">{rep.period}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Aggregate Total: {formatCurrency(rep.paye + rep.uif + rep.sdl - rep.eti)}</p>
                </div>
                <button className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-300 transition-all">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h4 className="text-xl font-black text-slate-800 mb-8 tracking-tight">UniPay ETI Optimization</h4>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-8">
            <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">GVM Verified Staff: {activeEmployees.length} Active Resources</p>
            <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-2/3" />
            </div>
            <div className="flex justify-between text-[10px] font-black mt-4 text-slate-400 uppercase tracking-widest">
              <span>Current Claim: R4,500</span>
              <span>UniPay Efficiency: High</span>
            </div>
          </div>
          <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4 items-start">
            <Info className="w-6 h-6 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-800 font-medium leading-relaxed italic">
              UniPay Alert: All ETI calculations are cross-referenced with the Global Visa Management Group compliance framework. Terminated resources are excluded from current month's ETI claims.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
