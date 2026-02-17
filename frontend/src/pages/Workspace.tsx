import { useState, useMemo } from 'react';
import { TopBar } from '../components/lexguard/TopBar';
import { SideRail } from '../components/lexguard/SideRail';
import { TransactionCard } from '../components/lexguard/TransactionCard';
import { ExplainPanel } from '../components/lexguard/ExplainPanel';
import { mockTransactions } from '../data/mockData';
import { Transaction, UserRole } from '../types/lexguard';
import { motion } from 'framer-motion';

export const Workspace = () => {
  const [role, setRole] = useState<UserRole>('PAO');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Anti-Gravity Sort: High risk floats to top
  const sortedTransactions = useMemo(() => {
    return [...mockTransactions].sort((a, b) => {
      const riskScore = { high: 3, medium: 2, low: 1 };
      return riskScore[b.riskLevel] - riskScore[a.riskLevel];
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900">
      <TopBar role={role} setRole={setRole} />
      <SideRail />

      <main className="pl-24 pt-24 pr-6 pb-12 max-w-7xl mx-auto flex gap-8">
        
        {/* Main Feed - The Gravity Free Zone */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Pending Review</h2>
              <p className="text-sm text-slate-500">5 transactions require your attention.</p>
            </div>
            <div className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              Latest Rules: 15 April 2024
            </div>
          </div>

          <motion.div layout className="space-y-4 pb-20">
            {sortedTransactions.map((txn) => (
              <TransactionCard 
                key={txn.id} 
                transaction={txn} 
                role={role}
                onSelect={setSelectedTxn}
                isSelected={selectedTxn?.id === txn.id}
              />
            ))}
          </motion.div>
        </div>

        {/* Right Spacer for the Slide-out Panel to not overlap content if we wanted a persistent 2-col layout, 
            but here we use fixed position panel so this is just empty space if needed or hidden */}
        {selectedTxn && <div className="w-[400px] hidden xl:block transition-all duration-300" />}

      </main>

      <ExplainPanel 
        transaction={selectedTxn} 
        onClose={() => setSelectedTxn(null)} 
        role={role}
      />
    </div>
  );
};
