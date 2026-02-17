import { motion, AnimatePresence } from 'framer-motion';
import { Transaction, UserRole } from '../../types/lexguard';
import { X, BookOpen, Gavel, Sparkles, Send } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useState, useEffect } from 'react';

interface ExplainPanelProps {
  transaction: Transaction | null;
  onClose: () => void;
  role: UserRole;
}

export const ExplainPanel = ({ transaction, onClose, role }: ExplainPanelProps) => {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (transaction?.auditNote) {
      setNote(transaction.auditNote);
    } else {
      setNote('');
    }
  }, [transaction]);

  return (
    <AnimatePresence>
      {transaction && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-0 top-16 bottom-0 w-[450px] bg-white border-l border-slate-200 shadow-2xl z-30 flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={transaction.riskLevel === 'high' ? 'error' : 'success'}>
                  {transaction.riskLevel === 'high' ? 'High Risk' : 'Compliant'}
                </Badge>
                <span className="text-xs font-mono text-slate-400">#{transaction.id}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">Compliance Truth Panel</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* AI Reasoning */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                AI Reasoning
              </h3>
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <p className="text-slate-700 text-sm leading-relaxed">
                  {transaction.aiExplanation?.summary}
                </p>
                <div className="mt-4 space-y-2">
                  {transaction.aiExplanation?.reasoningSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legal Clause */}
            {transaction.aiExplanation?.clause && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Gavel className="w-4 h-4 text-slate-500" />
                  Legal Reference
                </h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <BookOpen className="w-24 h-24" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {transaction.aiExplanation.clauseReference}
                  </p>
                  <p className="text-slate-600 text-sm italic font-serif leading-relaxed border-l-2 border-slate-300 pl-3">
                    "{transaction.aiExplanation.clause}"
                  </p>
                </div>
              </div>
            )}

            {/* Auto-Draft Audit Note */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                Audit Note (Auto-Draft)
              </h3>
              <div className="relative">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full h-32 p-4 text-sm text-slate-700 bg-amber-50/30 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-200 focus:border-amber-300 resize-none"
                  placeholder="Add your observation here..."
                />
                <div className="absolute bottom-3 right-3">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-md hover:bg-amber-200 transition-colors">
                    <Send className="w-3 h-3" /> Save Note
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
             <button className="flex-1 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 shadow-sm">
               Confirm Decision
             </button>
             <button className="px-4 py-2.5 bg-white border border-slate-200 text-rose-600 text-sm font-medium rounded-lg hover:bg-rose-50">
               Escalate
             </button>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
