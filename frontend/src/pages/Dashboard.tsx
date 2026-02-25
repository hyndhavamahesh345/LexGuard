import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';

import { analyzeComplianceViaBackend } from '../lib/api';
import { TransactionInput, ComplianceResult } from '../lib/mockAgents';
import { formatCurrency } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Sparkles,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search
} from 'lucide-react';

export const Dashboard = () => {
  const [formData, setFormData] = useState<TransactionInput>({
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    counterparty: '',
    typeHint: 'Rent',
    frequency: 'monthly'
  });

  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChecking(true);
    setResult(null);
    setError("");

    try {
      const complianceResult = await analyzeComplianceViaBackend(formData);
      setResult(complianceResult);

      setHistory(prev => [{
        ...formData,
        status: complianceResult.status,
        timestamp: new Date()
      }, ...prev]);
    } catch (error: any) {
      console.error(error);
      setError("Compliance engine connection loss. Retrying in background...");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-semibold tracking-tight mb-2">Compliance Dashboard</h1>
            <p className="text-[#86868b] text-lg font-medium">Analyze and verify financial transactions with AI intelligence.</p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT: TRANSACTION INPUT */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="glass apple-shadow rounded-[2rem] p-8 bg-white/70">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
                    <Search size={20} />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">New Transaction</h2>
                </div>

                <form onSubmit={handleCheck} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#86868b] ml-1">Description</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Office Space Rental"
                      className="w-full h-14 bg-[#F5F5F7] border-none rounded-2xl px-5 text-[15px] focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#86868b] ml-1">Amount (INR)</label>
                      <input
                        type="number"
                        required
                        className="w-full h-14 bg-[#F5F5F7] border-none rounded-2xl px-5 text-[15px] focus:ring-2 focus:ring-black/5 transition-all outline-none"
                        value={formData.amount || ''}
                        onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#86868b] ml-1">Date</label>
                      <input
                        type="date"
                        required
                        className="w-full h-14 bg-[#F5F5F7] border-none rounded-2xl px-5 text-[15px] focus:ring-2 focus:ring-black/5 transition-all outline-none"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#86868b] ml-1">Counterparty</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Skyline Realty Ltd."
                      className="w-full h-14 bg-[#F5F5F7] border-none rounded-2xl px-5 text-[15px] focus:ring-2 focus:ring-black/5 transition-all outline-none"
                      value={formData.counterparty}
                      onChange={e => setFormData({ ...formData, counterparty: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#86868b] ml-1">Category</label>
                      <select
                        className="w-full h-14 bg-[#F5F5F7] border-none rounded-2xl px-5 text-[15px] focus:ring-2 focus:ring-black/5 transition-all outline-none appearance-none"
                        value={formData.typeHint}
                        onChange={e => setFormData({ ...formData, typeHint: e.target.value })}
                      >
                        <option value="Rent">Rent</option>
                        <option value="Service">Professional Service</option>
                        <option value="Contractor">Contractor</option>
                        <option value="Purchase">Purchase of Goods</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#86868b] ml-1">Frequency</label>
                      <select
                        className="w-full h-14 bg-[#F5F5F7] border-none rounded-2xl px-5 text-[15px] focus:ring-2 focus:ring-black/5 transition-all outline-none appearance-none"
                        value={formData.frequency}
                        onChange={e => setFormData({ ...formData, frequency: e.target.value as any })}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="one-time">One-Time</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl bg-black text-white hover:bg-black/90 font-bold text-lg shadow-lg active:scale-[0.98] transition-all"
                    isLoading={isChecking}
                  >
                    Check Compliance
                    <Sparkles className="ml-2 w-5 h-5 text-amber-400" />
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* History Feed */}
            <div className="space-y-4 px-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#86868b] flex items-center gap-2">
                <Clock size={14} /> Recent Analysis
              </h3>
              <div className="space-y-3">
                {history.length === 0 && <p className="text-sm text-[#86868b] font-medium italic">No recent activity.</p>}
                {history.slice(0, 3).map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i}
                    className="bg-white p-5 rounded-2xl apple-shadow flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-black">{item.description}</p>
                      <p className="text-xs text-[#86868b] font-semibold mt-0.5">{formatCurrency(item.amount)} • {item.date}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tighter ${item.status === 'Compliant' ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                      {item.status}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE AGENT RESULTS */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-5 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 flex items-center gap-4"
                >
                  <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                  <p className="font-semibold">{error}</p>
                </motion.div>
              )}

              {isChecking ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center glass apple-shadow rounded-[3rem] bg-white/40 border-slate-100"
                >
                  <div className="relative mb-8">
                    <Loader2 className="w-20 h-20 text-black/5 animate-spin" strokeWidth={1} />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-black animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight mb-2">Engaging AI Agents</h3>
                  <div className="space-y-3 mt-6">
                    {['Synthesizing tax clauses...', 'Verifying entity history...', 'Calculating risk vectors...', 'Finalizing reasoning engine...'].map((text, i) => (
                      <div key={i} className="flex items-center gap-3 text-[#86868b] font-medium text-sm animate-pulse" style={{ animationDelay: `${i * 150}ms` }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        {text}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Status Banner */}
                  <div className={`p-10 rounded-[3rem] shadow-2xl relative overflow-hidden ${result.status === 'Compliant' ? 'bg-green-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {/* Decorative shield background */}
                    <ShieldCheck className="absolute -top-10 -right-10 w-64 h-64 opacity-10" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        {result.status === 'Compliant' ? (
                          <CheckCircle2 className="w-8 h-8" />
                        ) : (
                          <AlertTriangle className="w-8 h-8" />
                        )}
                        <span className="text-sm font-bold uppercase tracking-[0.2em]">{result.status}</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                        {result.explanation.summary}
                      </h2>
                    </div>
                  </div>

                  {/* AI Explanation Glass Panel */}
                  <div className="glass apple-shadow rounded-[2.5rem] p-10 bg-white/80 border-slate-100">
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <h3 className="text-xs font-bold text-[#86868b] uppercase tracking-widest">AI Reasoning Engine</h3>
                    </div>
                    <p className="text-xl font-medium leading-[1.6] text-slate-800">
                      {result.explanation.detail}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-[2rem] p-8 apple-shadow">
                      <h3 className="text-xs font-bold text-[#86868b] uppercase tracking-widest mb-6 px-1">Classification</h3>
                      <div className="space-y-4">
                        <Pair label="Type" value={result.classification.type} />
                        <Pair label="Category" value={result.classification.category} />
                        <Pair
                          label="TDS Relevance"
                          value={result.classification.tds_relevant ? 'Required' : 'Not Required'}
                          highlight={result.classification.tds_relevant}
                        />
                      </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 apple-shadow">
                      <h3 className="text-xs font-bold text-[#86868b] uppercase tracking-widest mb-6 px-1">Legal Reference</h3>
                      {result.rules_applied.length > 0 ? (
                        <div className="space-y-4">
                          {result.rules_applied.map((rule, i) => (
                            <div key={i} className="bg-[#F5F5F7] p-5 rounded-2xl group hover:bg-black transition-colors">
                              <p className="font-bold text-black text-sm group-hover:text-white transition-colors">{rule.law} - {rule.section}</p>
                              <p className="text-xs text-[#86868b] mt-1 group-hover:text-white/70 transition-colors uppercase font-bold tracking-tight">{rule.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[#86868b] font-medium italic">General compliance rules applied.</p>
                      )}
                    </div>
                  </div>

                  {/* Recommended Action Items */}
                  <div className="bg-black text-white rounded-[2.5rem] p-10 shadow-2xl">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-white/50 flex items-center gap-2">
                      <FileText size={16} /> Recommended Actions
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {result.explanation.actions.map((action, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-sm font-semibold leading-relaxed text-white/90">{action}</p>
                        </div>
                      ))}
                    </div>
                    {result.status === 'Non-Compliant' && (
                      <div className="mt-10 pt-10 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                        <Button className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-white/90 font-bold">
                          Process Correction
                        </Button>
                        <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/20 text-white bg-transparent hover:bg-white/10 font-bold">
                          Generate Report
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[500px] flex flex-col items-center justify-center bg-[#F5F5F7] rounded-[3rem] border-2 border-dashed border-slate-200 text-[#86868b]"
                >
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                    <ArrowRight className="w-10 h-10 opacity-20" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-black mb-2">Waiting for Input</h3>
                  <p className="font-medium">Analysis results will appear here in real-time.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pair = ({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) => (
  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
    <span className="text-sm font-bold text-[#86868b]">{label}</span>
    <span className={`text-sm font-bold ${highlight ? 'text-rose-600' : 'text-black'}`}>{value}</span>
  </div>
);
