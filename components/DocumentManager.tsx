
import React, { useState, useMemo } from 'react';
import { 
  FolderLock, 
  Search, 
  Download, 
  Eye, 
  Trash2, 
  Plus, 
  FileText, 
  ShieldCheck, 
  Clock, 
  User, 
  AlertCircle,
  FileBadge,
  X,
  UploadCloud,
  Building2,
  Users,
  ChevronRight,
  ChevronLeft,
  FolderClosed,
  FolderOpen,
  Lock
} from 'lucide-react';
import { AppDocument, Employee, AuditEntry } from '../types';

interface DocumentManagerProps {
  employees: Employee[];
  viewAsEss?: boolean;
  essUserId?: string;
  onLog?: (category: AuditEntry['category'], action: string, details: string) => void;
}

const initialDocuments: AppDocument[] = [
  {
    id: 'doc-1',
    title: 'Employment Contract - Sipho Ndlovu',
    category: 'CONTRACT',
    fileName: 'contract_ndlovu_s.pdf',
    uploadDate: '2022-01-15',
    expiryDate: '2025-01-15',
    sensitivity: 'HIGH',
    employeeId: '1'
  },
  {
    id: 'doc-2',
    title: 'Certified South African ID - Sarah Smith',
    category: 'IDENTIFICATION',
    fileName: 'id_smith_s.pdf',
    uploadDate: '2023-03-22',
    sensitivity: 'HIGH',
    employeeId: '2'
  },
  {
    id: 'doc-3',
    title: 'UniPay Corporate Leave Policy',
    category: 'POLICY',
    fileName: 'unipay_leave_v4.pdf',
    uploadDate: '2024-01-01',
    sensitivity: 'LOW'
  }
];

const DocumentManager: React.FC<DocumentManagerProps> = ({ employees, viewAsEss, essUserId, onLog }) => {
  const [documents, setDocuments] = useState<AppDocument[]>(initialDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | 'GENERAL' | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Grouping logic: Files per employee
  const folders = useMemo(() => {
    const groups: Record<string, AppDocument[]> = { 'GENERAL': [] };
    
    documents.forEach(doc => {
      if (!doc.employeeId) {
        groups['GENERAL'].push(doc);
      } else {
        if (!groups[doc.employeeId]) groups[doc.employeeId] = [];
        groups[doc.employeeId].push(doc);
      }
    });

    return groups;
  }, [documents]);

  const getEmployee = (id: string) => employees.find(e => e.id === id);

  const handleAction = (doc: AppDocument, action: string) => {
    onLog?.('DOCUMENTS', 'Asset Interaction', `${action} protocol for: ${doc.fileName}`);
    alert(`${action}: ${doc.title}`);
  };

  const handleFolderClick = (id: string | 'GENERAL') => {
    const context = id === 'GENERAL' ? 'Corporate Repository' : `Personnel File: ${getEmployee(id)?.firstName}`;
    onLog?.('DOCUMENTS', 'Folder Access', `Accessing secure vault folder: ${context}`);
    setSelectedFolderId(id);
  };

  const filteredFolders = employees.filter(emp => {
    if (viewAsEss) return emp.id === essUserId;
    const name = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    return name.includes(searchTerm.toLowerCase());
  });

  if (selectedFolderId) {
    const folderDocs = folders[selectedFolderId] || [];
    const targetEmployee = selectedFolderId !== 'GENERAL' ? getEmployee(selectedFolderId) : null;

    return (
      <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedFolderId(null)}
            className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Global Vault
          </button>
          <div className="flex gap-4">
             <button 
                onClick={() => setShowUploadModal(true)}
                className="bg-indigo-950 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-900 transition-all flex items-center gap-2 shadow-xl"
              >
                <Plus className="w-4 h-4" /> Add Asset to File
              </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-6 mb-12">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl ${targetEmployee ? 'bg-indigo-600' : 'bg-slate-900'}`}>
              {targetEmployee ? `${targetEmployee.firstName[0]}${targetEmployee.lastName[0]}` : <Building2 className="w-10 h-10" />}
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                {targetEmployee ? `${targetEmployee.firstName} ${targetEmployee.lastName}` : 'Corporate Repository'}
              </h3>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">
                {targetEmployee ? `Employee Master File ID: ${targetEmployee.id}` : 'All Staff / General Access Resources'}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Document</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {folderDocs.length > 0 ? folderDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-6">
                       <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-xl ${doc.sensitivity === 'HIGH' ? 'bg-rose-50 text-rose-500' : 'bg-slate-100 text-slate-400'}`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{doc.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{doc.fileName}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-4 py-6">
                       <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest">
                          {doc.category}
                        </span>
                    </td>
                    <td className="px-4 py-6 text-right space-x-2">
                       <button onClick={() => handleAction(doc, 'Preview')} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Eye className="w-5 h-5" /></button>
                       <button onClick={() => handleAction(doc, 'Download')} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Download className="w-5 h-5" /></button>
                       {!viewAsEss && <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="w-5 h-5" /></button>}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                      No documents ingested into this personnel file.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Personnel File Vault</h3>
          <p className="text-sm text-slate-500 font-medium">Secure, folder-based management for corporate and employee artifacts.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Find Personnel File..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Corporate Folder */}
        <div 
          onClick={() => handleFolderClick('GENERAL')}
          className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between min-h-[280px]"
        >
          <div>
            <div className="flex justify-between items-start mb-10">
              <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8" />
              </div>
              <Lock className="w-5 h-5 text-slate-300" />
            </div>
            <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-2">Corporate Repository</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company-wide Policies</p>
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-slate-50">
             <span className="text-xs font-bold text-slate-500">{folders['GENERAL']?.length || 0} Artifacts</span>
             <ChevronRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Employee Folders */}
        {filteredFolders.map(emp => {
          const docCount = folders[emp.id]?.length || 0;
          const highSensitivityCount = folders[emp.id]?.filter(d => d.sensitivity === 'HIGH').length || 0;
          
          return (
            <div 
              key={emp.id}
              onClick={() => handleFolderClick(emp.id)}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between min-h-[280px]"
            >
              <div>
                <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 font-black text-xl border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    {emp.firstName[0]}{emp.lastName[0]}
                  </div>
                  {highSensitivityCount > 0 && (
                    <div className="flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
                      <ShieldCheck className="w-3 h-3 text-rose-500" />
                      <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest">{highSensitivityCount} Sensitive</span>
                    </div>
                  )}
                </div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-2">{emp.firstName} {emp.lastName}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{emp.jobTitle}</p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center gap-2">
                   <FolderClosed className="w-4 h-4 text-slate-300 group-hover:hidden" />
                   <FolderOpen className="w-4 h-4 text-indigo-500 hidden group-hover:block" />
                   <span className="text-xs font-bold text-slate-500">{docCount} Documents</span>
                </div>
                <ChevronRight className="w-5 h-5 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal Simulation */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-indigo-950/95 backdrop-blur-xl p-4 animate-in zoom-in-95 duration-200">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-indigo-50/20">
              <div>
                <h3 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter">Asset Ingest</h3>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">UniPay Secure Upload Protocol</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm border border-slate-200"><X /></button>
            </div>
            
            <div className="p-10 space-y-10">
              <div className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center group hover:border-indigo-200 transition-all cursor-pointer">
                <UploadCloud className="w-16 h-16 text-slate-200 mx-auto mb-6 group-hover:scale-110 group-hover:text-indigo-400 transition-all" />
                <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Drop enterprise files here</p>
                <p className="text-xs text-slate-400 font-bold uppercase mt-2">Maximum encrypted size: 50MB</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target Folder</label>
                    <select className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold shadow-inner text-sm">
                      <option>Corporate Repository</option>
                      {employees.map(e => <option key={e.id}>{e.firstName} {e.lastName}</option>)}
                    </select>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Sensitivity Rank</label>
                    <select className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold shadow-inner text-rose-600 text-sm">
                      <option>High (Confidential)</option>
                      <option>Medium (Internal)</option>
                      <option>Low (Public)</option>
                    </select>
                 </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50 border-t border-slate-100 flex gap-6">
               <button onClick={() => setShowUploadModal(false)} className="flex-1 py-5 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600">Abort Ingest</button>
               <button 
                onClick={() => {
                  alert("File Successfully Encrypted & Saved to Master Personnel File.");
                  setShowUploadModal(false);
                  onLog?.('DOCUMENTS', 'Document Ingested', 'New asset added to personnel record.');
                }}
                className="flex-[2] py-5 bg-indigo-950 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-950/40 hover:bg-indigo-900 transition-all flex items-center justify-center gap-3"
               >
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Confirm & Secure File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManager;
