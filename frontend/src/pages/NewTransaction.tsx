import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  CheckCircle2, 
  AlertOctagon, 
  ArrowRight, 
  Loader2, 
  BookOpen, 
  Gavel,
  ChevronRight
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

// Types for the simulation
type ComplianceStatus = 'compliant' | 'non-compliant' | 'idle';

interface AnalysisResult {
  status: ComplianceStatus;
  issue?: string;
  lawApplied?: string;
  action?: string;
  explanation?: string;
  legalText?: string;
}

export const NewTransaction = () => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    vendorType: 'service_provider',
    gstRegistered: 'yes'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(0); // 0: Idle, 1-3: Processing steps, 4: Result
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Reset if user changes input after checking
    if (step === 4) {
      setStep(0);
      setResult(null);
    }
  };

  const runComplianceCheck = async () => {
    if (!formData.amount || !formData.description) return;

    setIsProcessing(true);
    setStep(1);

    setTimeout(() => setStep(2), 600);
    setTimeout(() => setStep(3), 1200);

    try {
      const response = await fetch("http://localhost:8000/api/transactions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: formData.description,
          amount: Number(formData.amount),
          vendorType: formData.vendorType,
          gstRegistered: formData.gstRegistered
        })
      });

      const data = await response.json();

      setTimeout(() => {
        setResult({
          status: data.status,
          issue: data.issue,
          lawApplied: data.lawApplied,
          action: data.action,
          explanation: data.explanation,
          legalText: data.legalText || "N/A"
        });
        setStep(4);
        setIsProcessing(false);
      }, 1200);

    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const generateResult = () => {
    const amount = parseFloat(formData.amount);
    const isRent = formData.vendorType === 'landlord';
    
    // Simple Logic for Demo
    if (isRent && amount > 20000) { // Assuming monthly rent > 20k implies annual > 2.4L for demo simplicity
      setResult({
        status: 'non-compliant',
        issue: 'TDS Deduction Required on Rent',
        lawApplied: 'Income Tax Act - Section 194I',
        action: `Deduct 10% TDS (${formatCurrency(amount * 0.1)}) and deposit before the 7th of next month.`,
        explanation: 'Since the annual rent is likely to exceed ₹2,40,000, you must deduct tax at source (TDS) at 10% for land/building.',
        legalText: 'Any person, not being an individual or HUF, who is responsible for paying to a resident any income by way of rent, shall, at the time of credit of such income to the account of the payee or at the time of payment thereof in cash or by the issue of a cheque or draft or by any other mode, whichever is earlier, deduct income-tax thereon at the rate of ten per cent.'
      });
    } else if (formData.vendorType === 'service_provider' && amount > 30000) {
       setResult({
        status: 'non-compliant',
        issue: 'Professional Fees Threshold Exceeded',
        lawApplied: 'Income Tax Act - Section 194J',
        action: `Deduct 10% TDS (${formatCurrency(amount * 0.1)}) immediately.`,
        explanation: 'Payments for professional or technical services exceeding ₹30,000 in a financial year require a 10% TDS deduction.',
        legalText: 'Any person, not being an individual or HUF, who is responsible for paying to a resident any sum by way of fees for professional services, or fees for technical services... shall, at the time of credit of such sum... deduct an amount equal to ten per cent of such sum as income-tax.'
      });
    } else {
      setResult({
        status: 'compliant',
        issue: 'No Compliance Issues Detected',
        lawApplied: 'GST & TDS Rules Checked',
        action: 'Proceed with payment.',
        explanation: 'The transaction amount is below the threshold for TDS deduction, or the vendor category does not attract specific withholdings at this value.',
        legalText: 'N/A'
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-8rem)]">
      
      {/* LEFT PANEL: INPUT */}
      <div className="lg:col-span-5 flex flex-col h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">New Transaction</h1>
          <p className="text-slate-500 text-sm">Enter details. RegulAIte determines the tax rules.</p>
        </div>

        <Card className="flex-1 overflow-y-auto border-t-4 border-t-slate-900">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); runComplianceCheck(); }}>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Transaction Description</label>
              <input 
                type="text" 
                name="description"
                placeholder="e.g. Office Rent for October"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full h-11 rounded-md border-slate-300 border px-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Amount (INR)</label>
                <input 
                  type="number" 
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full h-11 rounded-md border-slate-300 border px-3 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Payment Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full h-11 rounded-md border-slate-300 border px-3 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Vendor Type</label>
              <select 
                name="vendorType"
                value={formData.vendorType}
                onChange={handleInputChange}
                className="w-full h-11 rounded-md border-slate-300 border px-3 text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="service_provider">Service Provider (Professional/Technical)</option>
                <option value="landlord">Landlord (Rent)</option>
                <option value="supplier">Supplier (Goods)</option>
                <option value="contractor">Contractor (Labor/Works)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Is Vendor GST Registered?</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 border rounded-md px-4 py-3 w-full cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                  <input 
                    type="radio" 
                    name="gstRegistered" 
                    value="yes" 
                    checked={formData.gstRegistered === 'yes'}
                    onChange={handleInputChange}
                    className="accent-emerald-600"
                  />
                  <span className="text-sm font-medium">Yes</span>
                </label>
                <label className="flex items-center gap-2 border rounded-md px-4 py-3 w-full cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
                  <input 
                    type="radio" 
                    name="gstRegistered" 
                    value="no" 
                    checked={formData.gstRegistered === 'no'}
                    onChange={handleInputChange}
                    className="accent-emerald-600"
                  />
                  <span className="text-sm font-medium">No</span>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 text-base bg-slate-900 hover:bg-slate-800"
                disabled={isProcessing || !formData.amount}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                  </span>
                ) : (
                  "Check Compliance"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* RIGHT PANEL: PROCESS & RESULT */}
      <div className="lg:col-span-7 flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* HEADER */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <Gavel className="w-4 h-4 text-slate-500" />
            Compliance Engine
          </h2>
          {step > 0 && step < 4 && (
            <Badge variant="info" className="animate-pulse">Analyzing</Badge>
          )}
        </div>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto relative">
          
          {/* STATE 0: IDLE */}
          {step === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <BookOpen className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">Ready to Analyze</h3>
              <p className="text-sm text-slate-500 max-w-xs mt-2">
                Fill in the transaction details on the left to initiate the compliance check.
              </p>
            </div>
          )}

          {/* STATE 1-3: PROCESSING STEPS */}
          <AnimatePresence>
            {(step >= 1 && step < 4) && (
              <div className="space-y-6 max-w-md mx-auto mt-12">
                <StepItem 
                  active={step >= 1} 
                  completed={step > 1} 
                  label="Classifying Transaction Type..." 
                  subtext={formData.vendorType === 'landlord' ? 'Identified as Rent Payment' : 'Identified as Service Payment'}
                />
                <StepItem 
                  active={step >= 2} 
                  completed={step > 2} 
                  label="Scanning GST & TDS Rules..." 
                  subtext="Checking Income Tax Act 1961 & CGST Act 2017"
                />
                <StepItem 
                  active={step >= 3} 
                  completed={step > 3} 
                  label="Verifying Thresholds..." 
                  subtext={`Analyzing amount: ${formatCurrency(parseFloat(formData.amount))}`}
                />
              </div>
            )}
          </AnimatePresence>

          {/* STATE 4: RESULT */}
          {step === 4 && result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* STATUS CARD */}
              <div className={cn(
                "p-6 rounded-lg border-l-8 shadow-sm",
                result.status === 'compliant' 
                  ? "bg-emerald-50 border-l-emerald-500" 
                  : "bg-rose-50 border-l-rose-500"
              )}>
                <div className="flex items-start gap-4">
                  {result.status === 'compliant' ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mt-1" />
                  ) : (
                    <AlertOctagon className="w-8 h-8 text-rose-600 mt-1" />
                  )}
                  <div>
                    <h2 className={cn(
                      "text-2xl font-bold tracking-tight",
                      result.status === 'compliant' ? "text-emerald-900" : "text-rose-900"
                    )}>
                      {result.status === 'compliant' ? "COMPLIANT" : "NON-COMPLIANT"}
                    </h2>
                    <p className={cn(
                      "mt-2 font-medium text-lg",
                      result.status === 'compliant' ? "text-emerald-800" : "text-rose-800"
                    )}>
                      {result.issue}
                    </p>
                    {result.status !== 'compliant' && (
                      <div className="mt-4 p-4 bg-white/60 rounded border border-rose-100">
                        <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">Suggested Action</p>
                        <p className="text-rose-900 font-medium">{result.action}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* EXPLANATION SECTION */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-slate-500" />
                    Rule Explanation
                  </h3>
                  
                  <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                    <div className="mb-4">
                      <Badge variant="neutral" className="mb-2">Plain English</Badge>
                      <p className="text-slate-700 leading-relaxed">
                        {result.explanation}
                      </p>
                    </div>
                    {result.legalText !== 'N/A' && (
                      <div className="pt-4 border-t border-slate-200">
                        <Badge variant="neutral" className="mb-2 bg-slate-200 text-slate-600">Legal Reference: {result.lawApplied}</Badge>
                        <p className="text-slate-500 text-sm italic font-serif leading-relaxed bg-white p-3 rounded border border-slate-100">
                          "{result.legalText}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

const StepItem = ({ active, completed, label, subtext }: { active: boolean, completed: boolean, label: string, subtext: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: active ? 1 : 0.3, x: 0 }}
    className="flex gap-4"
  >
    <div className="flex flex-col items-center">
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300",
        completed ? "bg-emerald-500 border-emerald-500" : active ? "border-emerald-500 bg-white" : "border-slate-200 bg-white"
      )}>
        {completed ? (
          <CheckCircle2 className="w-5 h-5 text-white" />
        ) : (
          <div className={cn("w-2 h-2 rounded-full", active ? "bg-emerald-500 animate-pulse" : "bg-slate-200")} />
        )}
      </div>
      <div className="w-0.5 h-12 bg-slate-100 mt-2 last:hidden" />
    </div>
    <div className="pt-1">
      <p className={cn("font-medium", active ? "text-slate-900" : "text-slate-400")}>{label}</p>
      {active && (
        <p className="text-xs text-slate-500 mt-1">{subtext}</p>
      )}
    </div>
  </motion.div>
);
