
import React, { useState } from 'react';
import { 
  Plus, 
  Building2, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  X, 
  Save, 
  Globe, 
  ShieldCheck, 
  Wallet, 
  CreditCard,
  Briefcase,
  Award,
  FileText
} from 'lucide-react';
import { Company, BankDetails } from '../types';

interface CompanyManagerProps {
  companies: Company[];
  onAdd: (company: Company) => void;
}

const CompanyManager: React.FC<CompanyManagerProps> = ({ companies, onAdd }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFormSection, setActiveFormSection] = useState<'STATUTORY' | 'BANKING' | 'IDENTITY'>('IDENTITY');
  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    name: '',
    tradingName: '',
    registrationNumber: '',
    payeNumber: '',
    uifNumber: '',
    sdlNumber: '',
    vatNumber: '',
    coidaNumber: '',
    industry: 'Technology',
    bbbeeLevel: 1,
    address: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    bankDetails: {
      bankName: '',
      accountNumber: '',
      branchCode: '',
      accountType: 'Business'
    }
  });

  const handleSave = () => {
    if (!newCompany.name || !newCompany.payeNumber) {
      alert("Company Name and PAYE Reference are mandatory for South African compliance.");
      return;
    }
    onAdd({
      ...newCompany as Company,
      id: Math.random().toString(36).substr(2, 9)
    });
    setShowAddModal(false);
    setNewCompany({});
    setActiveFormSection('IDENTITY');
  };

  const updateBankDetails = (field: keyof BankDetails, value: string) => {
    setNewCompany({
      ...newCompany,
      bankDetails: {
        ...(newCompany.bankDetails as BankDetails),
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Client Registry</h3>
          <p className="text-sm text-slate-500 font-medium">Provision and audit multi-entity corporate structures within the GVMS compliance framework.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" /> Provision New Client
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {companies.map(company => (
          <div key={company.id} className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden border-t-4 border-t-indigo-600">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-40 group-hover:scale-150 transition-transform"></div>

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                  <Building2 className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-2">{company.name}</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">{company.tradingName || 'No Trading Name Registered'}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100">Level {company.bbbeeLevel} B-BBEE</span>
                <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-100">SARS Compliant</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 py-10 border-y border-slate-50 mb-8">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Statutory Profile</p>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800"><span className="text-slate-400">PAYE:</span> {company.payeNumber}</p>
                    <p className="text-xs font-bold text-slate-800"><span className="text-slate-400">VAT:</span> {company.vatNumber || 'Not Registered'}</p>
                    <p className="text-xs font-bold text-slate-800"><span className="text-slate-400">UIF:</span> {company.uifNumber}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-2"><Briefcase className="w-3 h-3" /> Industry</p>
                  <p className="text-xs font-bold text-indigo-600 uppercase">{company.industry}</p>
                </div>
              </div>
              <div className="space-y-6 text-right">
                <div className="flex flex-col items-end">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Primary HR Liaison</p>
                  <p className="text-sm font-black text-slate-900">{company.contactPerson}</p>
                  <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-tight mt-1">{company.contactEmail}</p>
                </div>
                {company.bankDetails && (
                   <div className="flex flex-col items-end">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-2">Disbursement Bank <Wallet className="w-3 h-3" /></p>
                    <p className="text-xs font-bold text-slate-800">{company.bankDetails.bankName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">****{company.bankDetails.accountNumber.slice(-4)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
               <div className="flex items-start gap-3 text-xs text-slate-500 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-1">
                <MapPin className="w-5 h-5 shrink-0 text-slate-400" />
                <p className="truncate">{company.address}</p>
              </div>
              <button className="p-4 bg-indigo-950 text-white rounded-2xl shadow-xl hover:bg-indigo-900 transition-all active:scale-95">
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-indigo-950/90 backdrop-blur-xl p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-white/20">
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-indigo-50/20">
              <div>
                <h3 className="text-4xl font-black text-indigo-950 uppercase tracking-tighter">Entity Provisioning</h3>
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em] mt-2">South African Regulatory Protocol v2024</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-indigo-950 transition-colors bg-white p-3 rounded-2xl shadow-sm border border-slate-100"><X /></button>
            </div>

            {/* Modal Sub-Nav */}
            <div className="flex px-10 py-4 bg-slate-50 border-b border-slate-100 gap-2">
               {[
                { id: 'IDENTITY', label: 'Identity & Structure', icon: Building2 },
                { id: 'STATUTORY', label: 'Statutory & Tax', icon: ShieldCheck },
                { id: 'BANKING', label: 'Banking & Finance', icon: CreditCard }
               ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveFormSection(tab.id as any)}
                   className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     activeFormSection === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'
                   }`}
                 >
                   <tab.icon className="w-4 h-4" />
                   {tab.label}
                 </button>
               ))}
            </div>

            {/* Modal Content */}
            <div className="p-10 flex-1 overflow-y-auto bg-white">
              {activeFormSection === 'IDENTITY' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-10 duration-300">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Registered Legal Name</label>
                    <input 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold shadow-sm"
                      placeholder="e.g. ZumaTech Solutions (Pty) Ltd"
                      value={newCompany.name}
                      onChange={e => setNewCompany({...newCompany, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Trading As (Name)</label>
                    <input 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold shadow-sm"
                      placeholder="e.g. ZumaCloud"
                      value={newCompany.tradingName}
                      onChange={e => setNewCompany({...newCompany, tradingName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Registration Number (CIPC)</label>
                    <input 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-mono text-sm shadow-sm"
                      placeholder="YYYY/NNNNNN/NN"
                      value={newCompany.registrationNumber}
                      onChange={e => setNewCompany({...newCompany, registrationNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Industry Vertical</label>
                    <select 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold shadow-sm"
                      value={newCompany.industry}
                      onChange={e => setNewCompany({...newCompany, industry: e.target.value})}
                    >
                      <option>Technology & SaaS</option>
                      <option>Finance & Legal</option>
                      <option>Manufacturing</option>
                      <option>Retail & Distribution</option>
                      <option>Energy & Mining</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Official Address</label>
                    <textarea 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none min-h-[100px] font-medium shadow-sm"
                      placeholder="Full physical and postal address..."
                      value={newCompany.address}
                      onChange={e => setNewCompany({...newCompany, address: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {activeFormSection === 'STATUTORY' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-10 duration-300">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">SARS PAYE Reference (7xx)</label>
                    <input 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-mono shadow-sm"
                      placeholder="7900012345"
                      value={newCompany.payeNumber}
                      onChange={e => setNewCompany({...newCompany, payeNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">SARS VAT Number (4xx)</label>
                    <input 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-mono shadow-sm"
                      placeholder="4000123456"
                      value={newCompany.vatNumber}
                      onChange={e => setNewCompany({...newCompany, vatNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">UIF Reference (Uxx)</label>
                    <input 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-mono shadow-sm"
                      placeholder="U12345678"
                      value={newCompany.uifNumber}
                      onChange={e => setNewCompany({...newCompany, uifNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">SDL Reference (Lxx)</label>
                    <input 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-mono shadow-sm"
                      placeholder="L12345678"
                      value={newCompany.sdlNumber}
                      onChange={e => setNewCompany({...newCompany, sdlNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">COIDA Number</label>
                    <input 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-mono shadow-sm"
                      placeholder="Workmen's Compensation Ref"
                      value={newCompany.coidaNumber}
                      onChange={e => setNewCompany({...newCompany, coidaNumber: e.target.value})}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">B-BBEE Compliance Level</label>
                    <select 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold shadow-sm"
                      value={newCompany.bbbeeLevel}
                      onChange={e => setNewCompany({...newCompany, bbbeeLevel: Number(e.target.value)})}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(l => (
                        <option key={l} value={l}>Level {l} Contributor</option>
                      ))}
                      <option value={0}>Non-Compliant</option>
                    </select>
                  </div>
                </div>
              )}

              {activeFormSection === 'BANKING' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-right-10 duration-300">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Bank Institution</label>
                    <input 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold shadow-sm"
                      placeholder="e.g. Standard Bank, FNB"
                      value={newCompany.bankDetails?.bankName}
                      onChange={e => updateBankDetails('bankName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Account Number</label>
                    <input 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-mono shadow-sm"
                      placeholder="000 000 0000"
                      value={newCompany.bankDetails?.accountNumber}
                      onChange={e => updateBankDetails('accountNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Branch Code</label>
                    <input 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-mono shadow-sm"
                      placeholder="Universal or Specific Code"
                      value={newCompany.bankDetails?.branchCode}
                      onChange={e => updateBankDetails('branchCode', e.target.value)}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Account Category</label>
                    <select 
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold shadow-sm"
                      value={newCompany.bankDetails?.accountType}
                      onChange={e => updateBankDetails('accountType', e.target.value as any)}
                    >
                      <option>Business</option>
                      <option>Current</option>
                      <option>Savings</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4 items-center">
                    <Award className="w-8 h-8 text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-800 font-medium leading-relaxed italic">
                      "Ensure banking details are verified against a stamped bank confirmation letter for secure disbursement of payroll obligations."
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-5 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Abort Mission</button>
              <button 
                onClick={handleSave}
                className="flex-[2] py-5 bg-indigo-950 text-white font-black text-xs uppercase tracking-[0.25em] rounded-3xl shadow-2xl shadow-indigo-950/20 flex items-center justify-center gap-3 transition-all hover:bg-indigo-900 active:scale-[0.98]"
              >
                <Save className="w-5 h-5" /> Commit Enterprise Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManager;
