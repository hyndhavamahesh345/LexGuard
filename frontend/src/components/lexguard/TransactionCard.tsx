import { motion } from 'framer-motion';
import { Transaction, UserRole } from '../../types/lexguard';
import { AlertTriangle, CheckCircle2, ChevronRight, FileText, MoreHorizontal, ShieldAlert } from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';
import { useState } from 'react';

interface TransactionCardProps {
  transaction: Transaction;
  role: UserRole;
  onSelect: (t: Transaction) => void;
  isSelected: boolean;
}

export const TransactionCard = ({ transaction, role, onSelect, isSelected }: TransactionCardProps) => {
  const isHighRisk = transaction.riskLevel === 'high';
  const isMediumRisk = transaction.riskLevel === 'medium';
  
  // Anti-Gravity Logic: High risk expands, Low risk collapses
  const isExpanded = isHighRisk || isSelected;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isSelected ? 1.02 : 1,
        borderColor: isSelected ? '#6366f1' : 'transparent'
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={() => onSelect(transaction)}
      className={cn(
        "relative bg-white rounded-xl border shadow-sm cursor-pointer transition-shadow hover:shadow-md overflow-hidden group",
        isHighRisk ? "border-rose-100 shadow-rose-50" : "border-slate-200",
        isSelected ? "ring-2 ring-indigo-500 ring-offset-2" : ""
      )}
    >
      {/* Risk Indicator Strip */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1.5",
        isHighRisk ? "bg-rose-500" : isMediumRisk ? "bg-amber-500" : "bg-emerald-500"
      )} />

      <div className="p-5 pl-7">
        <div className="flex justify-between items-start">
          
          {/* Left: Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-mono text-slate-400">#{transaction.id}</span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {transaction.category}
              </span>
              {isHighRisk && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wide animate-pulse">
                  <ShieldAlert className="w-3 h-3" /> Risk Detected
                </span>
              )}
            </div>
            
            <h3 className="font-bold text-slate-900 text-lg">{transaction.vendorName}</h3>
            <p className="text-sm text-slate-500">{transaction.description}</p>
          </div>

          {/* Right: Amount & Confidence */}
          <div className="text-right">
            <div className="font-bold text-slate-900 text-xl tracking-tight">
              {formatCurrency(transaction.amount)}
            </div>
            <div className="flex items-center justify-end gap-1.5 mt-1">
              <div className="text-xs text-slate-400 font-medium">AI Confidence</div>
              <div className={cn(
                "text-xs font-bold px-1.5 py-0.5 rounded",
                transaction.confidenceScore > 90 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              )}>
                {transaction.confidenceScore}%
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Content (Anti-Gravity Reveal) */}
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-slate-100"
          >
            {transaction.flagReason ? (
              <div className="flex items-start gap-3 bg-rose-50/50 p-3 rounded-lg border border-rose-100">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-rose-700">Compliance Flag: {transaction.flagReason}</p>
                  <p className="text-xs text-rose-600 mt-1">Click to view legal explanation and suggested actions.</p>
                </div>
                <div className="ml-auto">
                   <button className="text-xs font-semibold text-rose-600 bg-white border border-rose-200 px-3 py-1.5 rounded-md hover:bg-rose-50 transition-colors shadow-sm">
                     Why?
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Transaction is compliant with current GST/TDS norms.</span>
              </div>
            )}

            {/* Action Strip - One Gesture UI */}
            <div className="flex items-center justify-between mt-4 gap-3">
               <div className="flex gap-2">
                 <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                   <CheckCircle2 className="w-4 h-4" /> Approve
                 </button>
                 <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                   Override
                 </button>
               </div>
               <button className="p-2 text-slate-400 hover:text-slate-600">
                 <MoreHorizontal className="w-5 h-5" />
               </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
