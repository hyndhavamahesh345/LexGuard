import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

const riskData = [
  { subject: 'TDS Filing', A: 120, fullMark: 150 },
  { subject: 'GST Returns', A: 98, fullMark: 150 },
  { subject: 'Doc Quality', A: 86, fullMark: 150 },
  { subject: 'Timeliness', A: 99, fullMark: 150 },
  { subject: 'Vendor Risk', A: 85, fullMark: 150 },
  { subject: 'Audit Trail', A: 65, fullMark: 150 },
];

const issueData = [
  { name: 'Late TDS', count: 4 },
  { name: 'GST Mismatch', count: 2 },
  { name: 'Doc Missing', count: 6 },
  { name: 'Wrong Rate', count: 1 },
];

export const RiskSummary = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Audit Risk Summary</h1>
        <p className="text-slate-500 mt-1">Detailed analysis of potential compliance vulnerabilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-rose-50 border-rose-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-100 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-rose-600 font-bold text-sm uppercase tracking-wider">Overall Risk Level</p>
              <h3 className="text-2xl font-bold text-rose-900 mt-1">Medium-High</h3>
              <p className="text-xs text-rose-700 mt-2">Driven by repeated TDS delays.</p>
            </div>
          </div>
        </Card>
        
        <Card>
           <p className="text-slate-500 text-sm font-medium">Open Issues</p>
           <h3 className="text-3xl font-bold text-slate-900 mt-2">7</h3>
           <p className="text-xs text-slate-400 mt-2">Requires attention before next audit cycle.</p>
        </Card>

        <Card>
           <p className="text-slate-500 text-sm font-medium">Compliance Score</p>
           <h3 className="text-3xl font-bold text-slate-900 mt-2">82/100</h3>
           <p className="text-xs text-emerald-600 mt-2">Top 20% of industry peers.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900">Risk Radar</h3>
            <p className="text-xs text-slate-500">Visualizing exposure across key compliance vectors.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="Risk Score"
                  dataKey="A"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="#fca5a5"
                  fillOpacity={0.4}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900">Repeated Issues</h3>
            <p className="text-xs text-slate-500">Frequency of specific compliance failures.</p>
          </div>
          <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={issueData} layout="vertical" margin={{ left: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                 <XAxis type="number" hide />
                 <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                 <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                 <Bar dataKey="count" fill="#475569" radius={[0, 4, 4, 0]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="border-l-4 border-l-amber-500 bg-amber-50/30">
        <div className="flex gap-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Advisory Note</h4>
            <p className="text-sm text-amber-800 mt-1">
              Repeated TDS lapses in the "Professional Fees" category increase audit risk significantly. 
              Consider automating deduction at the source system level.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
