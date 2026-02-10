
import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Calendar, 
  Bell, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  X,
  PlusCircle,
  Archive,
  Star,
  RefreshCcw,
  CalendarCheck,
  Zap,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  FileText,
  UserCheck,
  AlertTriangle,
  History,
  Video
} from 'lucide-react';
import { AppTask, AuditEntry, Meeting, AppDocument, LeaveRequest, LeaveStatus } from '../types';

interface CommandCenterProps {
  tasks: AppTask[];
  setTasks: React.Dispatch<React.SetStateAction<AppTask[]>>;
  documents: AppDocument[];
  leaveRequests: LeaveRequest[];
  onLog?: (category: AuditEntry['category'], action: string, details: string) => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ tasks, setTasks, documents, leaveRequests, onLog }) => {
  const [activeView, setActiveView] = useState<'TASKS' | 'CALENDAR' | 'REMINDERS'>('TASKS');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', notes: '', priority: 'MEDIUM' as AppTask['priority'] });
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: 'm1', title: 'Monthly Payroll Review', date: new Date().toISOString().split('T')[0], startTime: '10:00', endTime: '11:00', type: 'PAYROLL' },
    { id: 'm2', title: 'SARS Submission Check', date: '2024-07-07', startTime: '14:00', endTime: '15:00', type: 'SARS' }
  ]);
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({ title: '', type: 'HR', startTime: '09:00', endTime: '10:00' });

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '--';
    return new Date(isoStr).toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Automated Reminders Engine
  const reminders = useMemo(() => {
    const list: any[] = [];
    
    // 1. Contract Expiries
    documents.filter(d => d.category === 'CONTRACT' && d.expiryDate).forEach(doc => {
      const daysLeft = Math.ceil((new Date(doc.expiryDate!).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      if (daysLeft < 60) {
        list.push({
          id: `rem-doc-${doc.id}`,
          type: 'CONTRACT',
          title: `Contract Expiry: ${doc.title}`,
          detail: `Contract for asset ${doc.fileName} expires in ${daysLeft} days.`,
          severity: daysLeft < 15 ? 'CRITICAL' : 'WARNING',
          date: doc.expiryDate
        });
      }
    });

    // 2. Upcoming Leave
    leaveRequests.filter(l => l.status === LeaveStatus.APPROVED).forEach(leave => {
      const diff = new Date(leave.startDate).getTime() - new Date().getTime();
      const daysToStart = Math.ceil(diff / (1000 * 3600 * 24));
      if (daysToStart >= 0 && daysToStart <= 7) {
        list.push({
          id: `rem-leave-${leave.id}`,
          type: 'LEAVE',
          title: `Absence: ${leave.employeeName}`,
          detail: `Approved ${leave.type} leave starts in ${daysToStart} days.`,
          severity: 'INFO',
          date: leave.startDate
        });
      }
    });

    // 3. SARS Deadlines (Statutory)
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-indexed
    
    // EMP201 is usually 7th of every month
    const emp201Date = new Date(currentYear, currentMonth, 7);
    const diffSars = Math.ceil((emp201Date.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffSars >= 0 && diffSars <= 10) {
      list.push({
        id: 'rem-sars-emp201',
        type: 'SARS',
        title: 'EMP201 Submission Window',
        detail: 'Monthly SARS PAYE/UIF/SDL return due by the 7th.',
        severity: diffSars < 3 ? 'CRITICAL' : 'WARNING',
        date: emp201Date.toISOString().split('T')[0]
      });
    }

    return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [documents, leaveRequests]);

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const now = new Date().toISOString();
    const createdTask: AppTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      notes: newTask.notes,
      status: 'PENDING',
      priority: newTask.priority,
      createdAt: now,
      updatedAt: now
    };
    setTasks([createdTask, ...tasks]);
    setNewTask({ title: '', notes: '', priority: 'MEDIUM' });
    setShowAddForm(false);
    onLog?.('TASKS', 'Task Protocol Initiated', `Created operational task: ${createdTask.title}`);
  };

  const addMeeting = () => {
    if (!newMeeting.title || !newMeeting.date) return;
    const meeting: Meeting = {
      id: Math.random().toString(36).substr(2, 9),
      title: newMeeting.title,
      date: newMeeting.date,
      startTime: newMeeting.startTime || '09:00',
      endTime: newMeeting.endTime || '10:00',
      type: newMeeting.type as any,
    };
    setMeetings([...meetings, meeting]);
    setNewMeeting({ title: '', type: 'HR', startTime: '09:00', endTime: '10:00' });
    setShowMeetingForm(false);
    onLog?.('MEETING', 'Session Scheduled', `New ${meeting.type} session scheduled for ${meeting.date}`);
  };

  const toggleTask = (id: string) => {
    const now = new Date().toISOString();
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
        if (nextStatus === 'COMPLETED') {
          onLog?.('TASKS', 'Task Protocol Completed', `Administrator finalized task: ${t.title}`);
          return { ...t, status: nextStatus, completedAt: now, updatedAt: now };
        }
        const { completedAt, ...rest } = t;
        return { ...rest, status: nextStatus, updatedAt: now };
      }
      return t;
    }));
  };

  // Calendar Helper: Render Days
  const daysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();
    return { days, startDay };
  };

  const { days, startDay } = daysInMonth(currentMonth);
  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= days; i++) calendarDays.push(i);

  return (
    <div className="flex h-full bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      {/* Internal Navigation Bar */}
      <div className="w-20 md:w-64 bg-indigo-950 border-r border-indigo-900 flex flex-col p-4">
        <div className="mb-8 hidden md:block">
          <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest px-4">Command Menu</h4>
        </div>
        <nav className="space-y-2">
          {[
            { id: 'TASKS', label: 'Operational Tasks', icon: ClipboardList, count: tasks.filter(t => t.status === 'PENDING').length },
            { id: 'CALENDAR', label: 'Unified Calendar', icon: Calendar, count: meetings.length },
            { id: 'REMINDERS', label: 'Smart Reminders', icon: Bell, count: reminders.length }
          ].map(view => (
            <button 
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                activeView === view.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/10' : 'text-indigo-300 hover:bg-indigo-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <view.icon className="w-5 h-5 shrink-0" />
                <span className="hidden md:block font-bold text-sm">{view.label}</span>
              </div>
              {view.count > 0 && (
                <span className={`hidden md:block text-[10px] font-black px-2 py-0.5 rounded-lg ${activeView === view.id ? 'bg-indigo-500 text-white' : 'bg-indigo-900 text-indigo-400'}`}>
                  {view.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Primary Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
        {activeView === 'TASKS' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
               <div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Operational Protocols</h3>
                 <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Pending Management Actions</p>
               </div>
               <button 
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-slate-950 text-white rounded-xl hover:bg-indigo-950 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
               >
                <Plus className="w-4 h-4" /> New Protocol
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
               {showAddForm && (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-200 shadow-2xl mb-8 animate-in zoom-in-95 duration-200 space-y-6 border-t-8 border-t-indigo-600 max-w-2xl mx-auto">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em]">Initiate Task</span>
                      <button onClick={() => setShowAddForm(false)} className="text-slate-400"><X /></button>
                    </div>
                    <input 
                      autoFocus
                      className="w-full bg-slate-50 p-5 rounded-2xl text-base font-bold border border-slate-100 outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600"
                      placeholder="Title..."
                      value={newTask.title}
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                    />
                    <textarea 
                      className="w-full bg-slate-50 p-5 rounded-2xl text-sm font-medium border border-slate-100 min-h-[100px]"
                      placeholder="Notes..."
                      value={newTask.notes}
                      onChange={e => setNewTask({...newTask, notes: e.target.value})}
                    />
                    <button onClick={addTask} className="w-full py-5 bg-indigo-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Deploy Protocol</button>
                  </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {tasks.filter(t => t.status === 'PENDING').map(task => (
                   <div key={task.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-400 transition-all">
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${task.priority === 'HIGH' ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                      <div className="flex items-start gap-4">
                        <button onClick={() => toggleTask(task.id)} className="text-slate-300 hover:text-indigo-600 mt-1"><Circle /></button>
                        <div>
                          <h5 className="font-black text-slate-900 text-base">{task.title}</h5>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.notes}</p>
                          <div className="mt-4 flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase">
                             <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(task.createdAt)}</div>
                             <div className="flex items-center gap-1 text-indigo-400"><RefreshCcw className="w-3 h-3" /> {formatDate(task.updatedAt)}</div>
                          </div>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {activeView === 'CALENDAR' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-white flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Unified Events</h3>
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-100 p-1">
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-2 hover:bg-white rounded-lg transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="px-4 font-black text-xs uppercase tracking-widest text-slate-700">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-2 hover:bg-white rounded-lg transition-colors"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>
              <button 
                onClick={() => setShowMeetingForm(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
              >
                <Video className="w-4 h-4" /> Schedule Meeting
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {showMeetingForm && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-200 shadow-2xl mb-8 animate-in slide-in-from-top-4 duration-300 space-y-6 max-w-xl mx-auto">
                   <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">New Meeting Session</h4>
                   <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold" placeholder="Subject..." onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} />
                   <div className="grid grid-cols-2 gap-4">
                     <input type="date" className="p-4 bg-slate-50 border border-slate-100 rounded-xl" onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} />
                     <select className="p-4 bg-slate-50 border border-slate-100 rounded-xl" onChange={e => setNewMeeting({...newMeeting, type: e.target.value as any})}>
                        <option value="HR">HR General</option>
                        <option value="PAYROLL">Payroll Sync</option>
                        <option value="SARS">SARS Compliance</option>
                     </select>
                   </div>
                   <button onClick={addMeeting} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase">Confirm Session</button>
                </div>
              )}

              <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="bg-slate-50 p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">{d}</div>
                ))}
                {calendarDays.map((day, idx) => {
                  const dateStr = day ? `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
                  const dayMeetings = meetings.filter(m => m.date === dateStr);
                  const isToday = new Date().toISOString().split('T')[0] === dateStr;

                  return (
                    <div key={idx} className={`min-h-[140px] bg-white p-4 transition-all hover:bg-indigo-50/30 ${!day ? 'bg-slate-50/50' : ''}`}>
                      <span className={`text-xs font-black ${isToday ? 'bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-lg shadow-lg' : 'text-slate-400'}`}>{day}</span>
                      <div className="mt-3 space-y-1.5">
                        {dayMeetings.map(m => (
                          <div key={m.id} className="p-2 bg-indigo-100 border border-indigo-200 rounded-lg shadow-sm">
                            <p className="text-[10px] font-black text-indigo-900 leading-tight truncate">{m.title}</p>
                            <p className="text-[8px] font-bold text-indigo-500 mt-0.5">{m.startTime}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeView === 'REMINDERS' && (
          <div className="flex-1 flex flex-col overflow-hidden">
             <div className="p-8 border-b border-slate-100 bg-white shrink-0">
               <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Automated Alert Registry</h3>
               <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Smart Compliance Monitoring</p>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {reminders.length > 0 ? reminders.map(rem => (
                  <div key={rem.id} className={`p-8 rounded-[2.5rem] border shadow-sm flex items-center gap-8 group transition-all hover:scale-[1.01] ${
                    rem.severity === 'CRITICAL' ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'
                  }`}>
                    <div className={`p-5 rounded-3xl ${
                      rem.severity === 'CRITICAL' ? 'bg-rose-500 text-white' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {rem.type === 'CONTRACT' ? <FileText /> : rem.type === 'LEAVE' ? <UserCheck /> : <ShieldCheck />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                          rem.severity === 'CRITICAL' ? 'bg-rose-200 text-rose-800 border-rose-300' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                        }`}>
                          {rem.severity} Priority
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rem.date}</span>
                      </div>
                      <h5 className="text-xl font-black text-slate-900 tracking-tight">{rem.title}</h5>
                      <p className="text-sm font-medium text-slate-500 mt-1">{rem.detail}</p>
                    </div>
                    <button className="text-slate-300 hover:text-indigo-600 p-2"><ChevronRight /></button>
                  </div>
                )) : (
                  <div className="py-20 text-center">
                    <History className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No active alerts detected</p>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommandCenter;
