
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareQuote, Send, X, Loader2, Bot, Globe, CreditCard } from 'lucide-react';
import { getPayrollAdvice } from '../services/geminiService';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const advice = await getPayrollAdvice(userMsg);
    setMessages(prev => [...prev, { role: 'bot', text: advice || "UniPay HR specialist is currently offline. Please refer to GVM Group documentation." }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 h-[550px] rounded-[2rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
          <div className="bg-indigo-950 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-600/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h6 className="font-black text-sm uppercase tracking-tight">UniPay Assistant</h6>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest leading-none">by GVM Group</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-900 p-2 rounded-xl transition-colors">
              <X className="w-5 h-5 text-indigo-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <div className="bg-white w-16 h-16 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-2">
                  <Bot className="w-8 h-8 text-indigo-300" />
                </div>
                <div>
                  <p className="text-sm text-slate-800 font-black uppercase tracking-tight">UniPay HR Intelligence</p>
                  <p className="text-xs text-slate-500 font-medium px-8 mt-2">
                    Expert advice on South African payroll, tax brackets, and compliance powered by Global Visa Management Group.
                  </p>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 text-sm font-medium shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-3xl rounded-br-none' 
                    : 'bg-white text-slate-800 rounded-3xl rounded-bl-none border border-slate-100'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-3xl rounded-bl-none border border-slate-100 shadow-sm flex items-center gap-3 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Querying UniPay Core...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-slate-100">
            <div className="relative group">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask UniPay about SARS..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pr-14 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-600 shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[8px] text-center text-slate-400 mt-4 font-black uppercase tracking-[0.2em]">UniPay AI Specialist • Powered by GVM Group</p>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-indigo-950 text-white p-5 rounded-[1.5rem] shadow-2xl hover:scale-110 transition-all border border-white/10 group"
        >
          <CreditCard className="w-7 h-7 group-hover:rotate-12 transition-transform text-indigo-300" />
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;