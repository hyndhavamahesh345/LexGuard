export type RiskLevel = 'high' | 'medium' | 'low';
export type Status = 'pending' | 'approved' | 'escalated' | 'rejected';
export type UserRole = 'PAO' | 'Auditor' | 'Senior';

export interface Transaction {
  id: string;
  vendorName: string;
  amount: number;
  date: string;
  riskLevel: RiskLevel;
  confidenceScore: number;
  status: Status;
  category: string;
  description: string;
  flagReason?: string;
  aiExplanation?: {
    summary: string;
    clause: string;
    clauseReference: string;
    reasoningSteps: string[];
  };
  auditNote?: string;
}
