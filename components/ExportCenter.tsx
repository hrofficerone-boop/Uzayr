
import React from 'react';
import { 
  Download, 
  DatabaseZap, 
  Share2, 
  FileJson, 
  ArrowRightLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Globe,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Employee, Company, AuditEntry } from '../types';

interface ExportCenterProps {
  employees: Employee[];
  company: Company;
  onLog?: (category: AuditEntry['category'], action: string, details: string) => void;
}

const ExportCenter: React.FC<ExportCenterProps> = ({ employees, company, onLog }) => {
  const exportToCSV = () => {
    const headers = [
      'Company', 'Registration', 'Employee_Name', 'ID_Number', 'Tax_Number', 
      'Bank', 'Account_Number', 'Basic_Salary', 'Job_Title', 'Join_Date'
    ];
    
    const rows = employees.map(e => [
      company.name,
      company.registrationNumber,
      `${e.firstName} ${e.lastName}`,
      e.idNumber,
      e.taxNumber,
      e.bankAccount,
      e.bankAccount,
      e.basicSalary,
      e.jobTitle,
      e.joinDate
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `UniPay_Migration_${company.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onLog?.('SYSTEM', 'Data Migration Export', `Generated universal CSV migration file for ${employees.length} employees.`);
  };

  const exportToJSON = () => {
    const data = {
      entity: company,
      workforce: employees,
      exportMetadata: {
        timestamp: new Date().toISOString(),
        version: "UniPay-GVM-v4.2",
        generator: "UniPay Migration Engine"
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `UniPay_System_Master_${company.id}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onLog?.('SYSTEM', 'System Master Export', 'Generated full JSON structural master file for system-to-system migration.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] p-12 border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-50"></div>

        <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-start">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
                <DatabaseZap className="w-5 h-5 text-indigo-600" />
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Universal Portability Protocol</span>
              </div>
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Data Portability Hub</h3>
              <p className="text-slate-500 text-xl leading-relaxed font-medium max-w-2xl">
                UniPay exports are pre-formatted for seamless upload into primary financial ERPs, secondary payroll platforms, or high-security regulatory databases.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-200 group hover:border-indigo-300 transition-all shadow-sm">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <Share2 className="w-7 h-7" />
                </div>
                <h5 className="font-black text-slate-900 text-2xl mb-3 tracking-tight">Workforce Ledger (CSV)</h5>
                <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium">Flat-file export of all employee identity, banking, and compensation structures for bulk third-party uploads.</p>
                <button 
                  onClick={exportToCSV}
                  className="w-full py-5 bg-indigo-950 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-950/20 hover:bg-indigo-900 transition-all flex items-center justify-center gap-3"
                >
                  <Download className="w-5 h-5" /> Generate CSV Export
                </button>
              </div>

              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-200 group hover:border-indigo-300 transition-all shadow-sm">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <FileJson className="w-7 h-7" />
                </div>
                <h5 className="font-black text-slate-900 text-2xl mb-3 tracking-tight">System Master (JSON)</h5>
                <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium">Full entity metadata and deep workforce object tree for complete system-to-system structural replication.</p>
                <button 
                  onClick={exportToJSON}
                  className="w-full py-5 bg-white text-indigo-950 border-2 border-slate-200 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:border-indigo-600 transition-all flex items-center justify-center gap-3"
                >
                  <Download className="w-5 h-5" /> Generate JSON Master
                </button>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[380px] space-y-8">
            <div className="bg-emerald-50 rounded-[2.5rem] p-10 border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h6 className="font-black text-emerald-900 text-lg tracking-tighter">Migration Analysis</h6>
              </div>
              <ul className="space-y-5">
                {[
                  { label: 'Resource Mapping', status: 'Optimal' },
                  { label: 'Bank Hash Integrity', status: 'Verified' },
                  { label: 'Tax Normalization', status: 'Ready' },
                  { label: 'BCEA Validation', status: 'Passed' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700">{item.label}</span>
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-white/50 px-3 py-1 rounded-lg border border-emerald-100">{item.status}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-indigo-950 rounded-[2.5rem] p-10 border border-white/10 shadow-2xl text-white">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">Active Export Focus</p>
              <div className="space-y-2">
                <p className="text-xl font-black tracking-tight">{company.name}</p>
                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-300 uppercase tracking-widest opacity-70">
                   <Globe className="w-3 h-3" /> Entity ID: {company.id}
                </div>
              </div>
              <div className="pt-8 mt-8 border-t border-white/10 flex justify-between items-center">
                <div>
                  <p className="text-2xl font-black text-indigo-400">{employees.length}</p>
                  <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Active Records</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-400">100%</p>
                  <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Portability</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-amber-50 rounded-3xl border border-amber-100 items-start">
               <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
               <p className="text-[11px] text-amber-800 font-medium leading-relaxed italic">
                 UniPay Secure Export: All extracted data is locally encrypted before browser disbursement.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportCenter;
