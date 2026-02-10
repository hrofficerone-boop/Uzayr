
import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Mail, FileText, Printer, Download, X, Phone, Heart, Save, 
  PieChart as PieChartIcon, Info, Globe, PlusCircle, MinusCircle, Calculator, AlertTriangle,
  Eye, CheckCircle, ArrowRight, History, Clock, GitBranch, Briefcase, UserPlus, ChevronRight,
  Users,
  ShieldCheck,
  Zap,
  Building,
  MapPin,
  Stethoscope,
  TrendingUp,
  UserCheck,
  Smartphone,
  CreditCard,
  User,
  UserMinus,
  AlertOctagon
} from 'lucide-react';
import { Employee, Company, PayrollItem, PayrollItemType, Position, AuditEntry } from '../types';
import { formatCurrency, calculateAdvancedPayroll } from '../utils/payrollCalculators';

interface EmployeeListProps {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  positions: Position[];
  setPositions: React.Dispatch<React.SetStateAction<Position[]>>;
  company: Company;
  viewAsEss?: boolean;
  essUserId?: string;
  onLog?: (category: AuditEntry['category'], action: string, details: string) => void;
}

const SARS_CODES: Record<string, { desc: string, type: PayrollItemType, taxable: boolean }> = {
  '3601': { desc: 'Basic Salary', type: 'EARNING', taxable: true },
  '3606': { desc: 'Commission', type: 'EARNING', taxable: true },
  '3701': { desc: 'Travel Allowance', type: 'EARNING', taxable: true },
  '3605': { desc: 'Annual Bonus', type: 'EARNING', taxable: true },
  '3714': { desc: 'Non-Taxable Reimbursement', type: 'REIMBURSEMENT', taxable: false },
  '4001': { desc: 'Pension Fund Contribution', type: 'DEDUCTION', taxable: false },
  '4003': { desc: 'Provident Fund Contribution', type: 'DEDUCTION', taxable: false },
  '4005': { desc: 'Medical Aid Contribution', type: 'DEDUCTION', taxable: false },
  '3801': { desc: 'Taxable Fringe Benefit', type: 'FRINGE_BENEFIT', taxable: true },
};

const EmployeeList: React.FC<EmployeeListProps> = ({ employees, setEmployees, positions, setPositions, company, viewAsEss, essUserId, onLog }) => {
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [terminatingEmployee, setTerminatingEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [amendmentItems, setAmendmentItems] = useState<PayrollItem[]>([]);
  const [showDraftPreview, setShowDraftPreview] = useState(false);
  const [draftedIds, setDraftedIds] = useState<Set<string>>(new Set());
  
  // Termination details
  const [termDate, setTermDate] = useState(new Date().toISOString().split('T')[0]);
  const [termReason, setTermReason] = useState('Resignation');

  // New Employee Form State
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    firstName: '',
    lastName: '',
    gender: 'Male',
    idNumber: '',
    taxNumber: '',
    email: '',
    phoneNumber: '',
    address: '',
    basicSalary: 0,
    jobTitle: '',
    bankAccount: '',
    joinDate: new Date().toISOString().split('T')[0],
    nokName: '',
    nokRelationship: '',
    nokContact: '',
    medicalAidDependents: 0,
    status: 'ACTIVE',
    recurringItems: [{ id: 'basic', code: '3601', description: 'Basic Salary', amount: 0, type: 'EARNING', isTaxable: true, isFixed: true }]
  });

  const filteredEmployees = useMemo(() => {
    return viewAsEss 
      ? employees.filter(e => e.id === essUserId)
      : employees.filter(e => e.companyId === company.id);
  }, [employees, company.id, viewAsEss, essUserId]);

  const togglePayslipItem = (code: string) => {
    const meta = SARS_CODES[code];
    const exists = amendmentItems.find(i => i.code === code);
    
    if (exists) {
      if (exists.isFixed) return; // Cannot remove basic salary
      setAmendmentItems(amendmentItems.filter(i => i.code !== code));
    } else {
      const newItem: PayrollItem = {
        id: Math.random().toString(36).substr(2, 9),
        code,
        description: meta.desc,
        amount: 0,
        type: meta.type,
        isTaxable: meta.taxable
      };
      setAmendmentItems([...amendmentItems, newItem]);
    }
  };

  const updateAmount = (code: string, amount: number) => {
    setAmendmentItems(amendmentItems.map(i => i.code === code ? { ...i, amount } : i));
  };

  const handleFinalizeDraft = () => {
    if (editingEmployee) {
      const updatedEmployees = employees.map(e => e.id === editingEmployee.id ? { ...e, recurringItems: amendmentItems } : e);
      setEmployees(updatedEmployees);
      setDraftedIds(new Set([...draftedIds, editingEmployee.id]));
      setEditingEmployee(null);
      onLog?.('PAYROLL', 'Payroll Component Drafted', `Drafted payroll adjustments for ${editingEmployee.firstName} ${editingEmployee.lastName}`);
    }
  };

  const handleCreateEmployee = () => {
    const fullEmployee: Employee = {
      ...newEmployee as Employee,
      id: Math.random().toString(36).substr(2, 9),
      companyId: company.id,
      role: 'EMPLOYEE',
      status: 'ACTIVE',
      leaveBalanceAnnual: 15,
      leaveBalanceSick: 30,
      leaveBalanceFamily: 3,
      recurringItems: [
        { id: 'basic', code: '3601', description: 'Basic Salary', amount: newEmployee.basicSalary || 0, type: 'EARNING', isTaxable: true, isFixed: true }
      ]
    };
    setEmployees([...employees, fullEmployee]);
    setShowAddModal(false);
    setAddStep(1);
    onLog?.('WORKFORCE', 'Resource Provisioned', `New employee created: ${fullEmployee.firstName} ${fullEmployee.lastName}`);
  };

  const handleTerminateEmployee = () => {
    if (terminatingEmployee) {
      const updatedEmployees = employees.map(e => 
        e.id === terminatingEmployee.id 
          ? { ...e, status: 'TERMINATED' as const, terminationDate: termDate, terminationReason: termReason } 
          : e
      );
      setEmployees(updatedEmployees);
      onLog?.('WORKFORCE', 'Resource Terminated', `Personnel archived: ${terminatingEmployee.firstName} ${terminatingEmployee.lastName}. Reason: ${termReason}`);
      setTerminatingEmployee(null);
    }
  };

  const PersonnelPortfolio = ({ employee, onClose }: { employee: Employee, onClose: () => void }) => (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-indigo-950/95 backdrop-blur-2xl p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-white/20">
        <div className={`p-10 border-b border-slate-100 flex justify-between items-center shrink-0 ${employee.status === 'TERMINATED' ? 'bg-rose-50/50' : 'bg-indigo-50/30'}`}>
          <div className="flex items-center gap-6">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-2xl ${employee.status === 'TERMINATED' ? 'bg-rose-500' : 'bg-indigo-600'}`}>
              {employee.firstName[0]}{employee.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className={`text-4xl font-black uppercase tracking-tighter leading-none ${employee.status === 'TERMINATED' ? 'text-rose-950' : 'text-indigo-950'}`}>
                  {employee.firstName} {employee.lastName}
                </h3>
                {employee.status === 'TERMINATED' && (
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-black px-4 py-1 rounded-full border border-rose-200 uppercase tracking-widest">Archived Resource</span>
                )}
              </div>
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> {employee.jobTitle} • Staff ID: {employee.id}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white rounded-2xl hover:bg-slate-50 transition-all border border-slate-200 text-slate-400 hover:text-indigo-600"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 bg-white">
          {employee.status === 'TERMINATED' && (
            <div className="mb-12 p-8 bg-rose-50 rounded-[2rem] border border-rose-200 flex items-center gap-6 shadow-sm">
               <div className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><AlertOctagon className="w-8 h-8" /></div>
               <div>
                 <h4 className="text-xl font-black text-rose-950 tracking-tight uppercase">Termination Protocol Executed</h4>
                 <p className="text-sm font-bold text-rose-700">Effective Date: {employee.terminationDate} • Reason: {employee.terminationReason}</p>
                 <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mt-2">Resource excluded from active payroll disbursement cycles.</p>
               </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Identity & Personal */}
            <section className="space-y-8">
              <div className="pb-4 border-b border-slate-100">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6"><User className="w-3 h-3" /> Personnel Identity</h5>
                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gender</p>
                     <p className="text-sm font-black text-slate-900">{employee.gender}</p>
                   </div>
                   <div>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Onboarding Date</p>
                     <p className="text-sm font-black text-slate-900">{employee.joinDate}</p>
                   </div>
                   <div className="col-span-2">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">RSA Identity Number</p>
                     <p className="text-sm font-black text-indigo-600 font-mono tracking-widest bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 inline-block">{employee.idNumber}</p>
                   </div>
                 </div>
              </div>

              <div className="pb-4">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6"><MapPin className="w-3 h-3" /> Residential Record</h5>
                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                      "{employee.address}"
                    </p>
                 </div>
              </div>
            </section>

            {/* Statutory & Contact */}
            <section className="space-y-8">
              <div className="pb-4 border-b border-slate-100">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6"><ShieldCheck className="w-3 h-3" /> Statutory & Financial Profile</h5>
                 <div className="space-y-6">
                   <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                     <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">SARS Income Tax Ref</span>
                     <span className="text-sm font-black text-indigo-900">{employee.taxNumber}</span>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Monthly Basic Salary</span>
                     <span className="text-sm font-black text-emerald-900">{formatCurrency(employee.basicSalary)}</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-100 rounded-xl"><CreditCard className="w-5 h-5 text-slate-500" /></div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Primary Bank Account</p>
                        <p className="text-sm font-black text-slate-900">{employee.bankAccount}</p>
                      </div>
                   </div>
                 </div>
              </div>

              <div className="pb-4 border-b border-slate-100">
                 <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6"><Mail className="w-3 h-3" /> Contact Connectivity</h5>
                 <div className="grid grid-cols-1 gap-4">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-50 rounded-xl"><Mail className="w-5 h-5 text-indigo-600" /></div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Official Communications</p>
                        <p className="text-sm font-black text-slate-900">{employee.email}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-50 rounded-xl"><Smartphone className="w-5 h-5 text-indigo-600" /></div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Direct Voice/Data</p>
                        <p className="text-sm font-black text-slate-900">{employee.phoneNumber}</p>
                      </div>
                   </div>
                 </div>
              </div>

              <div className="p-8 bg-rose-50 rounded-[2.5rem] border border-rose-100">
                 <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 mb-6"><Heart className="w-3 h-3" /> Emergency Protocol (Next of Kin)</h5>
                 <div className="space-y-4">
                   <div>
                     <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mb-0.5">Kin Legal Name</p>
                     <p className="text-base font-black text-rose-900">{employee.nokName}</p>
                   </div>
                   <div className="flex justify-between items-end">
                     <div>
                       <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mb-0.5">Relationship</p>
                       <p className="text-sm font-bold text-rose-800">{employee.nokRelationship}</p>
                     </div>
                     <div className="text-right">
                       <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mb-0.5">Urgent Contact</p>
                       <p className="text-sm font-black text-rose-900">{employee.nokContact}</p>
                     </div>
                   </div>
                 </div>
              </div>
            </section>
          </div>
        </div>

        <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
           <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full animate-pulse ${employee.status === 'TERMINATED' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               UniPay Profile Integrity Verified {employee.status === 'TERMINATED' ? '• ARCHIVE STATUS' : '• ACTIVE STATUS'}
             </span>
           </div>
           <button onClick={onClose} className="px-10 py-5 bg-indigo-950 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-indigo-900 transition-all shadow-xl shadow-indigo-950/20">Finalize Review</button>
        </div>
      </div>
    </div>
  );

  const PayslipDocument = ({ employee, items, isDraft, onClose }: { employee: Employee, items: PayrollItem[], isDraft: boolean, onClose: () => void }) => {
    const result = calculateAdvancedPayroll(items, employee.medicalAidDependents);

    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-indigo-900 uppercase tracking-tighter text-sm">UniPay Verification</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payslip Preview Mode</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
            <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm space-y-10 min-h-[600px]">
              <div className="flex justify-between border-b-2 border-slate-900 pb-8">
                <div>
                  <h4 className="text-2xl font-black text-slate-900">{company.name}</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{company.payeNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-900">June 2024</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Personnel Detail</p>
                  <p className="font-black text-slate-900 text-lg">{employee.firstName} {employee.lastName}</p>
                  <p className="text-sm font-bold text-slate-500">{employee.jobTitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tax Reference</p>
                  <p className="text-xs font-bold text-slate-800">{employee.taxNumber}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100">
                  <span>Source Code / Component</span>
                  <span>Amount</span>
                </div>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-bold text-slate-800">{item.description}</span>
                        <span className="text-[10px] ml-2 text-slate-400">({item.code})</span>
                      </div>
                      <span className="font-black text-slate-900">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-sm text-rose-500 font-bold border-t border-slate-50 pt-4">
                    <span>4102 - PAYE Tax</span>
                    <span>-{formatCurrency(result.paye)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-rose-500 font-bold">
                    <span>4141 - UIF Contribution</span>
                    <span>-{formatCurrency(result.uif)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-3xl p-8 flex justify-between items-center mt-auto">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Disposable Income</p>
                  <p className="text-4xl font-black text-emerald-400 tracking-tighter">{formatCurrency(result.netPay)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Workforce Hub</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredEmployees.filter(e => e.status === 'ACTIVE').length} Active • {filteredEmployees.filter(e => e.status === 'TERMINATED').length} Inactive Resources</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
          >
            <UserPlus className="w-5 h-5" /> Provision New Employee
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search resources by name or ID..." className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" />
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Info className="w-4 h-4" /> Click employee name for full portfolio
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Personnel Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID & Tax Ref</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Payslip Items</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Workspace Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className={`transition-colors group ${emp.status === 'TERMINATED' ? 'bg-rose-50 hover:bg-rose-100/50' : 'hover:bg-indigo-50/30'}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setViewingEmployee(emp)}>
                      <div className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center font-black transition-all ${emp.status === 'TERMINATED' ? 'bg-white border-rose-200 text-rose-500' : 'bg-white border-indigo-50 text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white'}`}>
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <p className={`font-black tracking-tighter transition-colors ${emp.status === 'TERMINATED' ? 'text-rose-950' : 'text-slate-900 group-hover:text-indigo-600'}`}>{emp.firstName} {emp.lastName}</p>
                           {emp.status === 'TERMINATED' && <span className="text-[7px] font-black bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded uppercase tracking-widest">Inactive</span>}
                        </div>
                        <p className={`text-[10px] font-bold uppercase ${emp.status === 'TERMINATED' ? 'text-rose-400' : 'text-slate-400'}`}>{emp.jobTitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className={`text-xs font-bold ${emp.status === 'TERMINATED' ? 'text-rose-900 opacity-60' : 'text-slate-800'}`}>ID: {emp.idNumber}</p>
                    <p className={`text-xs font-bold ${emp.status === 'TERMINATED' ? 'text-rose-400' : 'text-indigo-500'}`}>Tax: {emp.taxNumber}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1">
                      {emp.recurringItems.map(item => (
                        <span key={item.id} className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${emp.status === 'TERMINATED' ? 'bg-rose-100 text-rose-400' : 'bg-slate-100 text-slate-500'}`}>{item.description}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    {emp.status === 'ACTIVE' ? (
                      <>
                        <button 
                          onClick={() => {
                            setEditingEmployee(emp);
                            setAmendmentItems([...emp.recurringItems]);
                          }}
                          className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          <Calculator className="w-4 h-4" /> Config Payslip
                        </button>
                        <button 
                          onClick={() => setTerminatingEmployee(emp)}
                          className="p-3 bg-white border border-rose-100 text-rose-400 rounded-xl shadow-sm hover:bg-rose-500 hover:text-white transition-all"
                          title="Terminate Resource"
                        >
                          <UserMinus className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest px-4 py-3 bg-rose-100/50 rounded-2xl border border-rose-200 inline-block">Archived Record</span>
                    )}
                    <button 
                      onClick={() => setViewingEmployee(emp)}
                      className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl shadow-sm hover:bg-slate-50"
                      title="View Personnel Portfolio"
                    >
                      <User className="w-5 h-5" />
                    </button>
                    {emp.status === 'ACTIVE' && (
                      <button 
                        onClick={() => {
                          setEditingEmployee(emp);
                          setAmendmentItems([...emp.recurringItems]);
                          setShowDraftPreview(true);
                        }}
                        className="p-3 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-indigo-950"
                        title="Quick Document Preview"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Termination Modal */}
      {terminatingEmployee && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-rose-950/90 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border-t-8 border-t-rose-500">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-rose-50/50">
                 <div>
                    <h3 className="text-3xl font-black text-rose-950 uppercase tracking-tighter">Termination Protocol</h3>
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">Resource Archive Procedure</p>
                 </div>
                 <button onClick={() => setTerminatingEmployee(null)} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100"><X /></button>
              </div>
              <div className="p-10 space-y-8">
                 <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center font-black text-lg">
                      {terminatingEmployee.firstName[0]}{terminatingEmployee.lastName[0]}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg tracking-tight">{terminatingEmployee.firstName} {terminatingEmployee.lastName}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resource Code: {terminatingEmployee.id}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Effective Termination Date</label>
                       <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={termDate} onChange={e => setTermDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Legal Departure Reason</label>
                       <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={termReason} onChange={e => setTermReason(e.target.value)}>
                          <option value="Resignation">Resignation</option>
                          <option value="Retrenchment">Retrenchment</option>
                          <option value="Dismissal">Dismissal</option>
                          <option value="Contract Expiry">Contract Expiry</option>
                          <option value="Retirement">Retirement</option>
                          <option value="Death">Death</option>
                       </select>
                    </div>
                 </div>

                 <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100 flex gap-4">
                    <AlertTriangle className="text-rose-500 shrink-0" />
                    <p className="text-[11px] text-rose-800 font-medium leading-relaxed italic">
                      Proceeding will archive the personnel record and exclude it from all active payroll, EMP201, and EMP501 cycles.
                    </p>
                 </div>
              </div>
              <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-4">
                 <button onClick={() => setTerminatingEmployee(null)} className="flex-1 py-5 font-black text-xs uppercase tracking-widest text-slate-400">Cancel</button>
                 <button onClick={handleTerminateEmployee} className="flex-[2] py-5 bg-rose-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-rose-900/20 hover:bg-rose-700 transition-all">Execute Archive</button>
              </div>
           </div>
        </div>
      )}

      {/* Personnel Portfolio Modal */}
      {viewingEmployee && (
        <PersonnelPortfolio 
          employee={viewingEmployee} 
          onClose={() => setViewingEmployee(null)} 
        />
      )}

      {/* Payslip Component Selector / Amendment Modal */}
      {editingEmployee && !showDraftPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-indigo-950/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[90vh]">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-indigo-50/20">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl border-2 border-indigo-100 flex items-center justify-center text-2xl font-black text-indigo-600">
                  {editingEmployee.firstName[0]}
                </div>
                <div>
                  <h3 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter">Payslip Logic Configuration</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resource: {editingEmployee.firstName} {editingEmployee.lastName}</p>
                </div>
              </div>
              <button onClick={() => setEditingEmployee(null)} className="p-4 bg-slate-50 rounded-2xl hover:bg-white transition-all border border-slate-100"><X /></button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-50/30">
                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Click to Toggle Payslip Components</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {Object.entries(SARS_CODES).map(([code, meta]) => {
                      const isActive = !!amendmentItems.find(i => i.code === code);
                      const item = amendmentItems.find(i => i.code === code);
                      
                      return (
                        <div 
                          key={code}
                          onClick={() => togglePayslipItem(code)}
                          className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col justify-between h-[180px] ${
                            isActive ? 'bg-white border-indigo-500 shadow-xl shadow-indigo-500/10' : 'bg-slate-50 border-slate-100 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className={`p-2 rounded-xl ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                              {meta.type === 'EARNING' ? <TrendingUp className="w-4 h-4" /> : meta.type === 'DEDUCTION' ? <MinusCircle className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                            </div>
                            {isActive && <CheckCircle className="w-5 h-5 text-indigo-500" />}
                          </div>
                          
                          <div className="mt-4">
                            <p className="font-black text-slate-900 tracking-tight leading-tight">{meta.desc}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">SARS Code: {code}</p>
                          </div>

                          {isActive && (
                            <div className="mt-4 flex items-center gap-3" onClick={e => e.stopPropagation()}>
                               <span className="text-[10px] font-black text-indigo-600">R</span>
                               <input 
                                  type="number" 
                                  autoFocus
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-black text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                                  value={item?.amount || 0}
                                  onChange={e => updateAmount(code, Number(e.target.value))}
                               />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              <div className="w-full lg:w-[420px] bg-slate-900 p-10 text-white flex flex-col">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xl font-black text-white tracking-tighter mb-4">Draft Calculation</h5>
                    <div className="space-y-4">
                       <div className="flex justify-between text-sm opacity-60">
                         <span>Gross Remuneration</span>
                         <span>{formatCurrency(calculateAdvancedPayroll(amendmentItems, editingEmployee.medicalAidDependents).grossEarnings)}</span>
                       </div>
                       <div className="flex justify-between text-sm text-rose-400">
                         <span>SARS Obligations (Est.)</span>
                         <span>-{formatCurrency(calculateAdvancedPayroll(amendmentItems, editingEmployee.medicalAidDependents).paye)}</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-white/10 text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Cycle Net Disbursement</p>
                    <p className="text-5xl font-black text-emerald-400 tracking-tighter">{formatCurrency(calculateAdvancedPayroll(amendmentItems, editingEmployee.medicalAidDependents).netPay)}</p>
                  </div>
                </div>

                <div className="mt-10 space-y-4">
                  <button 
                    onClick={() => setShowDraftPreview(true)}
                    className="w-full bg-white text-slate-900 py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-xl"
                  >
                    <Eye className="w-5 h-5" /> Full Document Preview
                  </button>
                  <button 
                    onClick={handleFinalizeDraft}
                    className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest transition-all hover:bg-indigo-700 shadow-2xl shadow-indigo-500/20"
                  >
                    Confirm & Save to Ledger
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Onboarding Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-indigo-950/95 backdrop-blur-xl p-4 animate-in zoom-in-95 duration-200">
          <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-white/20">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-indigo-50/20">
              <div>
                <h3 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter">Resource Provisioning</h3>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">GVM Enterprise Protocol Step {addStep} of 4</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-12 bg-white">
               {addStep === 1 && (
                 <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Personnel Identity</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name(s)</label>
                        <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="Legal names..." onChange={e => setNewEmployee({...newEmployee, firstName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name</label>
                        <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="Surname..." onChange={e => setNewEmployee({...newEmployee, lastName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                        <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" onChange={e => setNewEmployee({...newEmployee, gender: e.target.value as any})}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RSA Identity Number</label>
                        <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold font-mono" placeholder="13-digit numeric..." onChange={e => setNewEmployee({...newEmployee, idNumber: e.target.value})} />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residential Address</label>
                        <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium min-h-[80px]" placeholder="Full street address..." onChange={e => setNewEmployee({...newEmployee, address: e.target.value})} />
                      </div>
                    </div>
                 </div>
               )}

               {addStep === 2 && (
                 <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Statutory & Tax Profiling</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SARS Income Tax Ref</label>
                        <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="10-digit number..." onChange={e => setNewEmployee({...newEmployee, taxNumber: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Job Title / Role</label>
                        <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="Functional role..." onChange={e => setNewEmployee({...newEmployee, jobTitle: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Onboarding Date</label>
                        <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" onChange={e => setNewEmployee({...newEmployee, joinDate: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Email</label>
                        <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="Official communications..." onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} />
                      </div>
                    </div>
                 </div>
               )}

               {addStep === 3 && (
                 <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Emergency Protocol (Next of Kin)</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kin Legal Name</label>
                        <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="Full name of emergency contact..." onChange={e => setNewEmployee({...newEmployee, nokName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Relationship Status</label>
                        <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="e.g. Spouse, Parent, Child" onChange={e => setNewEmployee({...newEmployee, nokRelationship: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urgent Contact Number</label>
                        <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" placeholder="Mobile or landline..." onChange={e => setNewEmployee({...newEmployee, nokContact: e.target.value})} />
                      </div>
                    </div>
                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex gap-4">
                      <Heart className="text-indigo-600 shrink-0" />
                      <p className="text-xs text-indigo-800 font-medium leading-relaxed italic">
                        Capturing Next of Kin details is a mandatory safety protocol for GVM Group onsite resources.
                      </p>
                    </div>
                 </div>
               )}

               {addStep === 4 && (
                 <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">Primary Payroll Structure</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base CTC / Basic Salary</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-indigo-500">R</span>
                          <input 
                            type="number" 
                            className="w-full p-6 pl-10 bg-slate-50 border border-slate-200 rounded-3xl font-black text-2xl outline-none focus:ring-4 focus:ring-indigo-500/10" 
                            placeholder="0.00" 
                            onChange={e => setNewEmployee({...newEmployee, basicSalary: Number(e.target.value)})} 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Bank Account</label>
                        <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono" placeholder="Account number..." onChange={e => setNewEmployee({...newEmployee, bankAccount: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Aid Dependents</label>
                        <input type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" defaultValue={0} onChange={e => setNewEmployee({...newEmployee, medicalAidDependents: Number(e.target.value)})} />
                      </div>
                    </div>
                 </div>
               )}
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
               <button 
                onClick={() => setAddStep(Math.max(1, addStep - 1))}
                disabled={addStep === 1}
                className="px-8 py-4 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-600 disabled:opacity-0 transition-all"
               >
                Previous Step
              </button>
              <div className="flex gap-4">
                 {addStep < 4 ? (
                   <button 
                    onClick={() => setAddStep(addStep + 1)}
                    className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-2"
                   >
                    Proceed <ChevronRight className="w-4 h-4" />
                  </button>
                 ) : (
                   <button 
                    onClick={handleCreateEmployee}
                    className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2"
                   >
                    <UserCheck className="w-5 h-5 text-emerald-400" /> Commit Resource
                  </button>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showDraftPreview && editingEmployee && (
        <PayslipDocument 
          employee={editingEmployee} 
          items={amendmentItems} 
          isDraft={!draftedIds.has(editingEmployee.id)} 
          onClose={() => setShowDraftPreview(false)} 
        />
      )}
    </div>
  );
};

export default EmployeeList;
