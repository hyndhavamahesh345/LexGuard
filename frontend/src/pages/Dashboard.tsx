import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { analyzeComplianceViaBackend } from '../lib/api';
import { TransactionInput, ComplianceResult } from '../lib/mockAgents';
import { formatCurrency } from '../lib/utils';
import { Loader2, AlertTriangle, CheckCircle2, FileText, ArrowRight, Sparkles } from 'lucide-react';

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

      // Add to history if compliant or checked
      setHistory(prev => [{
        ...formData,
        status: complianceResult.status,
        timestamp: new Date()
      }, ...prev]);
    } catch (error: any) {
      console.error(error);
      setError("Failed to connect to AI Agents. Please ensure backend is running.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: INPUT FORM */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Transaction Check</h1>
              <p className="text-slate-500 text-sm">Enter details to run AI compliance agents.</p>
            </div>

            <Card className="border-t-4 border-t-indigo-600">
              <form onSubmit={handleCheck} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Office Rent for March"
                    className="w-full h-10 rounded-md border-slate-300 border px-3 text-sm focus:ring-2 focus:ring-indigo-500"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount (INR)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full h-10 rounded-md border-slate-300 border px-3 text-sm focus:ring-2 focus:ring-indigo-500"
                      value={formData.amount || ''}
                      onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      className="w-full h-10 rounded-md border-slate-300 border px-3 text-sm focus:ring-2 focus:ring-indigo-500"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Counterparty Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ABC Properties"
                    className="w-full h-10 rounded-md border-slate-300 border px-3 text-sm focus:ring-2 focus:ring-indigo-500"
                    value={formData.counterparty}
                    onChange={e => setFormData({ ...formData, counterparty: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type Hint</label>
                    <select
                      className="w-full h-10 rounded-md border-slate-300 border px-3 text-sm focus:ring-2 focus:ring-indigo-500"
                      value={formData.typeHint}
                      onChange={e => setFormData({ ...formData, typeHint: e.target.value })}
                    >
                      <option value="Rent">Rent</option>
                      <option value="Service">Professional Service</option>
                      <option value="Contractor">Contractor</option>
                      <option value="Purchase">Purchase of Goods</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                    <select
                      className="w-full h-10 rounded-md border-slate-300 border px-3 text-sm focus:ring-2 focus:ring-indigo-500"
                      value={formData.frequency}
                      onChange={e => setFormData({ ...formData, frequency: e.target.value as any })}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="one-time">One-Time</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11" isLoading={isChecking}>
                  {isChecking ? 'Running AI Agents...' : 'Check Compliance'}
                </Button>
              </form>
            </Card>

            {/* Recent History */}
            <div className="pt-4">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Checks</h3>
              <div className="space-y-3">
                {history.length === 0 && <p className="text-sm text-slate-400 italic">No history yet.</p>}
                {history.slice(0, 3).map((item, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium text-slate-900">{item.description}</p>
                      <p className="text-slate-500">{formatCurrency(item.amount)} • {item.date}</p>
                    </div>
                    <Badge variant={item.status === 'Compliant' ? 'success' : 'error'}>{item.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: RESULTS */}
          <div className="lg:col-span-7">
            {error && (
              <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            {isChecking ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl border border-slate-200">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <h3 className="text-lg font-medium text-slate-900">AI Agents Working...</h3>
                <div className="space-y-2 mt-4 text-center">
                  <p className="text-sm text-slate-500 animate-pulse">Agent 1: Classifying Transaction...</p>
                  <p className="text-sm text-slate-500 animate-pulse delay-100">Agent 2: Retrieving Tax Laws...</p>
                  <p className="text-sm text-slate-500 animate-pulse delay-200">Agent 3: Calculating Thresholds...</p>
                  <p className="text-sm text-slate-500 animate-pulse delay-300">Agent 4: Generating Plain English Explanation...</p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Status Header */}
                <div className={`p-6 rounded-xl border-l-8 shadow-sm ${result.status === 'Compliant' ? 'bg-emerald-50 border-l-emerald-500' : 'bg-rose-50 border-l-rose-500'}`}>
                  <div className="flex items-start gap-4">
                    {result.status === 'Compliant' ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mt-1" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-rose-600 mt-1" />
                    )}
                    <div>
                      <h2 className={`text-2xl font-bold ${result.status === 'Compliant' ? 'text-emerald-900' : 'text-rose-900'}`}>
                        {result.status.toUpperCase()}
                      </h2>
                      <p className={`mt-1 font-medium ${result.status === 'Compliant' ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {result.explanation.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Agent 4: Plain English Explanation */}
                <Card className="bg-indigo-50/30 border-indigo-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">AI Explanation</h3>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {result.explanation.detail}
                  </p>
                </Card>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Classification */}
                  <Card>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Classification</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Type</span>
                        <span className="font-medium text-slate-900">{result.classification.type}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Category</span>
                        <span className="font-medium text-slate-900">{result.classification.category}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-500">TDS Applicable</span>
                        <span className={`font-medium ${result.classification.tds_relevant ? 'text-rose-600' : 'text-slate-900'}`}>
                          {result.classification.tds_relevant ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Rules Applied */}
                  <Card>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Rules Checked</h3>
                    {result.rules_applied.length > 0 ? (
                      <ul className="space-y-3">
                        {result.rules_applied.map((rule, i) => (
                          <li key={i} className="text-sm bg-slate-50 p-2 rounded border border-slate-100">
                            <p className="font-bold text-slate-800">{rule.law} - Sec {rule.section}</p>
                            <p className="text-xs text-slate-500">{rule.description}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500 italic">No specific tax rules found for this category.</p>
                    )}
                  </Card>
                </div>

                {/* Action Plan */}
                <Card className="border-indigo-100 bg-white">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Recommended Actions
                  </h3>
                  <ul className="space-y-3">
                    {result.explanation.actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        {action}
                      </li>
                    ))}
                  </ul>
                  {result.status === 'Non-Compliant' && (
                    <div className="mt-6 pt-4 border-t border-indigo-100">
                      <Button className="w-full sm:w-auto">Save Transaction & Alert Accountant</Button>
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
                <ArrowRight className="w-12 h-12 mb-4 opacity-20" />
                <p>Fill the form to see AI analysis results here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
