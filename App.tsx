
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  CalendarClock, 
  FileText, 
  Wallet, 
  Menu, 
  X,
  ChevronDown, 
  Building2, 
  UserCircle, 
  ShieldCheck, 
  User, 
  Settings, 
  Plus, 
  Globe, 
  ArrowRight, 
  Zap, 
  Lock, 
  BarChart3, 
  LogOut, 
  ChevronLeft, 
  History, 
  CreditCard, 
  FolderLock, 
  DatabaseZap, 
  ClipboardList,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import LeaveManager from './components/LeaveManager';
import Reports from './components/Reports';
import ChatAssistant from './components/ChatAssistant';
import CompanyManager from './components/CompanyManager';
import AuditLog from './components/AuditLog';
import DocumentManager from './components/DocumentManager';
import ExportCenter from './components/ExportCenter';
import CommandCenter from './components/CommandCenter';
import { Company, Employee, AuditEntry, Position, AppTask, AppDocument, LeaveRequest, LeaveStatus, LeaveType } from './types';

const initialCompanies: Company[] = [
  { 
    id: 'c1', 
    name: 'ZumaTech Solutions (Pty) Ltd', 
    registrationNumber: '2020/123456/07', 
    payeNumber: '7900012345', 
    uifNumber: 'U12345678', 
    address: '123 Rivonia Rd, Sandton, 2196',
    contactPerson: 'Admin User',
    contactEmail: 'admin@zumatech.co.za'
  }
];

const initialDocuments: AppDocument[] = [
  {
    id: 'doc-1',
    title: 'Employment Contract - Sipho Ndlovu',
    category: 'CONTRACT',
    fileName: 'contract_ndlovu_s.pdf',
    uploadDate: '2022-01-15',
    expiryDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // Expires in 5 days (Critical)
    sensitivity: 'HIGH',
    employeeId: '1'
  }
];

const initialLeaveRequests: LeaveRequest[] = [
  { 
    id: 'l1', 
    employeeId: '1', 
    employeeName: 'Sipho Ndlovu', 
    type: LeaveType.ANNUAL, 
    startDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // Starts in 3 days
    endDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
    days: 3, 
    status: LeaveStatus.APPROVED, 
    reason: 'Family event' 
  }
];

const initialEmployees: Employee[] = [
  { 
    id: '1', 
    companyId: 'c1', 
    role: 'ADMIN',
    status: 'ACTIVE',
    gender: 'Male',
    firstName: 'Sipho', 
    lastName: 'Ndlovu', 
    idNumber: '9201015678082', 
    taxNumber: '1234567890', 
    email: 'sipho@example.com', 
    phoneNumber: '082 123 4567',
    address: '12 Highview Estate, Johannesburg',
    basicSalary: 45000, 
    bankAccount: 'FNB 62345678901', 
    jobTitle: 'Senior HR Lead', 
    positionId: 'p1',
    reportsToId: 'md-1',
    joinDate: '2022-01-15',
    nokName: 'Lindiwe Ndlovu',
    nokRelationship: 'Spouse',
    nokContact: '083 987 6543',
    recurringItems: [
      { id: 'i1', code: '3601', description: 'Basic Salary', amount: 45000, type: 'EARNING', isTaxable: true, isFixed: true },
      { id: 'i2', code: '4001', description: 'Pension Fund', amount: 3375, type: 'DEDUCTION', isTaxable: false },
      { id: 'i3', code: '4005', description: 'Medical Aid', amount: 4200, type: 'DEDUCTION', isTaxable: false }
    ],
    medicalAidDependents: 2,
    leaveBalanceAnnual: 12,
    leaveBalanceSick: 30,
    leaveBalanceFamily: 3
  }
];

const LandingPage: React.FC<{ onStart: () => void, reminderCount: number, highestSeverity: 'CRITICAL' | 'WARNING' | 'INFO' }> = ({ onStart, reminderCount, highestSeverity }) => {
  return (
    <div className="min-h-screen bg-indigo-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600 rounded-full blur-[150px] opacity-10"></div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl mb-8">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-black text-indigo-200 uppercase tracking-[0.3em]">Global Visa Management Group</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-8 leading-[0.8]">
            Uni<span className="text-indigo-400">Pay</span>
          </h1>
          <p className="text-xl text-indigo-200/70 max-w-2xl mx-auto font-medium leading-relaxed">
            The next generation of South African payroll and compliance. <br />
            <span className="text-white/40 font-bold uppercase text-xs tracking-widest">Enterprise HR Ecosystem</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          {[
            { title: "SARS Native", desc: "Fully automated EMP201/501 reports with built-in eFiling validation.", icon: ShieldCheck, color: "text-emerald-400" },
            { title: "UniMap Org", desc: "Map complex hierarchies and reporting lines with real-time sync.", icon: BarChart3, color: "text-indigo-400" },
            { title: "UniPortal", desc: "Premium employee self-service for leave and digital tax certificates.", icon: UserCircle, color: "text-amber-400" }
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all hover:translate-y-[-5px] cursor-default group">
              <feature.icon className={`w-10 h-10 ${feature.color} mb-6 transition-transform group-hover:scale-110`} />
              <h3 className="text-white font-black text-xl mb-3">{feature.title}</h3>
              <p className="text-indigo-200/60 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-1000 delay-500">
          <button 
            onClick={onStart}
            className="group relative bg-white text-indigo-950 px-12 py-6 rounded-3xl font-black text-lg uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-2xl shadow-indigo-500/20 flex items-center gap-4 overflow-hidden"
          >
            <div className="absolute inset-0 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            <span className="relative z-10 group-hover:text-white transition-colors">Enter UniPay Workspace</span>
            <ArrowRight className="relative z-10 w-6 h-6 group-hover:text-white group-hover:translate-x-2 transition-all" />
          </button>
        </div>
      </div>

      {/* Compliance Pulse Corner Indicator */}
      <div className="fixed bottom-10 left-10 z-50 animate-in slide-in-from-left-10 duration-1000 delay-700">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl flex items-center gap-4 shadow-2xl group cursor-help">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full absolute -top-0.5 -right-0.5 ${
              highestSeverity === 'CRITICAL' ? 'bg-rose-500' : highestSeverity === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'
            } animate-ping opacity-75`}></div>
            <div className={`w-3 h-3 rounded-full ${
              highestSeverity === 'CRITICAL' ? 'bg-rose-500' : highestSeverity === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'
            }`}></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest leading-none">Compliance Pulse</span>
            <span className="text-xs font-bold text-white mt-1">{reminderCount} Active Alerts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [showBriefing, setShowBriefing] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'leave' | 'reports' | 'profile' | 'companies' | 'audit' | 'documents' | 'export' | 'tasks'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [companies] = useState<Company[]>(initialCompanies);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [documents] = useState<AppDocument[]>(initialDocuments);
  const [leaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [tasks, setTasks] = useState<AppTask[]>([
    { id: 't1', title: 'Verify EMP201 for June', notes: 'Final sign-off required.', status: 'PENDING', priority: 'HIGH', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  ]);
  const [activeCompany, setActiveCompany] = useState<Company>(companies[0]);
  const [viewMode, setViewMode] = useState<'ADMIN' | 'EMPLOYEE'>('ADMIN');
  const [logs, setLogs] = useState<AuditEntry[]>([]);

  // System-wide Reminder Engine
  const reminders = useMemo(() => {
    const list: any[] = [];
    
    // SARS Check
    const today = new Date();
    const emp201Date = new Date(today.getFullYear(), today.getMonth(), 7);
    const diffSars = Math.ceil((emp201Date.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (diffSars >= 0 && diffSars <= 10) {
      list.push({ id: 'rem-sars', type: 'SARS', title: 'EMP201 Submission', severity: diffSars < 3 ? 'CRITICAL' : 'WARNING', date: emp201Date.toISOString().split('T')[0], detail: 'PAYE return due by 7th.' });
    }

    // Contracts Check
    documents.filter(d => d.category === 'CONTRACT' && d.expiryDate).forEach(doc => {
      const days = Math.ceil((new Date(doc.expiryDate!).getTime() - today.getTime()) / (1000 * 3600 * 24));
      if (days < 60) {
        list.push({ id: `rem-doc-${doc.id}`, type: 'CONTRACT', title: `Contract Expiry: ${doc.title}`, severity: days < 15 ? 'CRITICAL' : 'WARNING', date: doc.expiryDate, detail: `Expires in ${days} days.` });
      }
    });

    // Leave Check
    leaveRequests.filter(l => l.status === LeaveStatus.APPROVED).forEach(leave => {
      const days = Math.ceil((new Date(leave.startDate).getTime() - today.getTime()) / (1000 * 3600 * 24));
      if (days >= 0 && days <= 7) {
        list.push({ id: `rem-leave-${leave.id}`, type: 'LEAVE', title: `Upcoming absence: ${leave.employeeName}`, severity: 'INFO', date: leave.startDate, detail: `Approved leave starts in ${days} days.` });
      }
    });

    return list.sort((a, b) => (a.severity === 'CRITICAL' ? -1 : 1));
  }, [documents, leaveRequests]);

  const highestSeverity = reminders.some(r => r.severity === 'CRITICAL') ? 'CRITICAL' : reminders.some(r => r.severity === 'WARNING') ? 'WARNING' : 'INFO';

  const addAuditLog = (category: AuditEntry['category'], action: string, details: string) => {
    const newLog: AuditEntry = { id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString(), category, action, details, user: 'Sipho Ndlovu' };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleStart = () => {
    setHasStarted(true);
    setShowBriefing(reminders.length > 0);
  };

  if (!hasStarted) {
    return <LandingPage onStart={handleStart} reminderCount={reminders.length} highestSeverity={highestSeverity as any} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Strategic Briefing Popup */}
      {showBriefing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-indigo-950/95 backdrop-blur-2xl p-4 animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col">
             <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-indigo-50/30">
                <div>
                  <h3 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter">Strategic Command Briefing</h3>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Operational Readiness Required</p>
                </div>
                <div className="bg-indigo-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bell className="w-6 h-6" />
                </div>
             </div>
             
             <div className="p-10 space-y-6 flex-1 overflow-y-auto max-h-[60vh]">
                {reminders.map(rem => (
                  <div key={rem.id} className={`p-6 rounded-3xl border flex items-center gap-6 ${
                    rem.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <div className={`p-4 rounded-2xl ${rem.severity === 'CRITICAL' ? 'bg-rose-500 text-white' : 'bg-white text-indigo-600 shadow-sm'}`}>
                      {rem.type === 'SARS' ? <ShieldCheck /> : rem.type === 'CONTRACT' ? <FileText /> : <Calendar />}
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                         <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                           rem.severity === 'CRITICAL' ? 'bg-rose-200 text-rose-800' : 'bg-indigo-100 text-indigo-800'
                         }`}>{rem.type}</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rem.date}</span>
                       </div>
                       <h5 className="font-black text-slate-900 text-lg tracking-tight">{rem.title}</h5>
                       <p className="text-sm font-medium text-slate-500">{rem.detail}</p>
                    </div>
                    {rem.severity === 'CRITICAL' && <AlertTriangle className="text-rose-500 w-6 h-6 animate-pulse" />}
                  </div>
                ))}
             </div>

             <div className="p-10 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => setShowBriefing(false)}
                  className="w-full py-5 bg-indigo-950 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-indigo-900 transition-all shadow-2xl shadow-indigo-900/20"
                >
                  Acknowledge & Proceed to Dashboard
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Sidebar and Workspace - Existing Layout */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-indigo-950 text-white transition-all duration-300 flex flex-col z-50 shrink-0`}>
        <div className="p-6 flex items-center gap-3 border-b border-indigo-900">
          <div className="bg-indigo-500 p-2 rounded-lg shrink-0 shadow-lg shadow-indigo-500/20">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col leading-tight">
              <span className="font-black text-lg tracking-tighter uppercase">UniPay</span>
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none">by GVM Group</span>
            </div>
          )}
        </div>
        
        <nav className="flex-1 mt-10 px-3 space-y-1">
          {[
            { id: 'dashboard', label: 'HR Insights', icon: LayoutDashboard },
            { id: 'companies', label: 'Entity Manager', icon: Building2 },
            { id: 'employees', label: 'Workforce', icon: Users },
            { id: 'leave', label: 'Absence Portal', icon: CalendarClock },
            { id: 'documents', label: 'Document Vault', icon: FolderLock },
            { id: 'reports', label: 'SARS Compliance', icon: FileText },
            { id: 'audit', label: 'Audit Ledger', icon: History },
            { id: 'tasks', label: 'Task Command', icon: ClipboardList }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/10' 
                  : 'text-indigo-300 hover:bg-indigo-900 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-900">
           <button onClick={() => setHasStarted(false)} className="w-full flex items-center gap-3 p-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all group">
             <LogOut className="w-5 h-5" />
             {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">Logout</span>}
           </button>
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center gap-3 p-3 text-indigo-400">
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            UniPay <span className="text-indigo-500">| {activeTab.toUpperCase()}</span>
          </h2>
          <div className="flex items-center gap-4">
             {reminders.length > 0 && (
               <button 
                onClick={() => setShowBriefing(true)}
                className="relative p-2 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-all border border-slate-100"
               >
                 <Bell className="w-5 h-5 text-indigo-600" />
                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                   {reminders.length}
                 </span>
               </button>
             )}
             <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black shadow-lg">S</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'companies' && <CompanyManager companies={companies} onAdd={() => {}} />}
          {activeTab === 'employees' && <EmployeeList employees={employees} setEmployees={setEmployees} positions={[]} setPositions={() => {}} company={activeCompany} onLog={addAuditLog} />}
          {activeTab === 'leave' && <LeaveManager onLog={addAuditLog} />}
          {activeTab === 'documents' && <DocumentManager employees={employees} onLog={addAuditLog} />}
          {activeTab === 'reports' && <Reports employees={employees} company={activeCompany} onLog={addAuditLog} />}
          {activeTab === 'audit' && <AuditLog logs={logs} />}
          {activeTab === 'tasks' && (
             <CommandCenter tasks={tasks} setTasks={setTasks} documents={documents} leaveRequests={leaveRequests} onLog={addAuditLog} />
          )}
        </div>
      </main>

      <ChatAssistant />
    </div>
  );
};

export default App;
