import { formatCurrency } from './utils';

// --- Types ---
export interface TransactionInput {
  description: string;
  amount: number;
  date: string;
  counterparty: string;
  typeHint?: string;
  frequency: 'one-time' | 'monthly';
}

export interface ComplianceResult {
  status: 'Compliant' | 'Non-Compliant';
  classification: {
    type: string;
    category: string;
    gst_relevant: boolean;
    tds_relevant: boolean;
  };
  rules_applied: Array<{
    law: string;
    section: string;
    description: string;
  }>;
  evaluation: {
    threshold_exceeded: boolean;
    tax_required: boolean;
    tax_amount: number;
    details: string;
    triggered_rule: any;
  };
  explanation: {
    summary: string;
    detail: string; // Added for Plain English explanation
    actions: string[];
    risk_level: 'Low' | 'Medium' | 'High';
  };
}

// --- Mock Knowledge Base ---
const KNOWLEDGE_BASE = [
  {
    id: 'TDS_194I',
    law: 'Income Tax Act',
    section: '194I',
    applies_to: ['Rent'],
    threshold_annual: 240000,
    rate: 10, // 10% for land/building
    description: 'TDS on Rent'
  },
  {
    id: 'TDS_194J',
    law: 'Income Tax Act',
    section: '194J',
    applies_to: ['Service', 'Professional Fees'],
    threshold_annual: 30000,
    rate: 10,
    description: 'TDS on Professional/Technical Services'
  },
  {
    id: 'TDS_194C',
    law: 'Income Tax Act',
    section: '194C',
    applies_to: ['Contractor', 'Labor'],
    threshold_single: 30000,
    threshold_annual: 100000,
    rate: 1, // 1% for individual
    description: 'TDS on Payments to Contractors'
  }
];

// --- AGENT 1: Transaction Understanding ---
// Input: Raw Transaction
// Output: Classification
const agentClassify = async (input: TransactionInput) => {
  await new Promise(r => setTimeout(r, 600)); // Simulate LLM processing
  
  const desc = input.description.toLowerCase();
  const hint = input.typeHint?.toLowerCase() || '';

  let type = 'Purchase';
  let category = 'Expense';
  
  if (desc.includes('rent') || hint === 'rent') type = 'Rent';
  else if (desc.includes('fee') || desc.includes('consult') || hint === 'service') type = 'Service';
  else if (desc.includes('work') || desc.includes('labor') || hint === 'contractor') type = 'Contractor';

  return {
    type,
    category,
    gst_relevant: true, 
    tds_relevant: ['Rent', 'Service', 'Contractor'].includes(type)
  };
};

// --- AGENT 2: Rule Retrieval ---
// Input: Classification
// Output: Applicable Rules
const agentRetrieve = async (classification: any) => {
  await new Promise(r => setTimeout(r, 400)); // Simulate DB Query
  return KNOWLEDGE_BASE.filter(rule => rule.applies_to.includes(classification.type));
};

// --- AGENT 3: Compliance Evaluation ---
// Input: Rules + Transaction Data
// Output: Mathematical Evaluation
const agentEvaluate = async (input: TransactionInput, rules: any[]) => {
  await new Promise(r => setTimeout(r, 500)); // Simulate Calculation
  
  let result = {
    threshold_exceeded: false,
    tax_required: false,
    tax_amount: 0,
    details: 'No specific tax rules triggered.',
    triggered_rule: null as any
  };

  // Logic: Annualize amount if monthly
  const annualAmount = input.frequency === 'monthly' ? input.amount * 12 : input.amount;

  for (const rule of rules) {
    if (rule.threshold_annual && annualAmount > rule.threshold_annual) {
      result.threshold_exceeded = true;
      result.tax_required = true;
      result.tax_amount = input.amount * (rule.rate / 100);
      result.triggered_rule = rule;
      result.details = `Annual value (${formatCurrency(annualAmount)}) exceeds threshold of ${formatCurrency(rule.threshold_annual)} under Sec ${rule.section}.`;
      break; 
    }
  }

  return result;
};

// --- AGENT 4: Explanation & Action (THE REQUESTED AGENT) ---
// Input: Evaluation + Rules
// Output: Human-readable text + Action Plan
const agentExplain = async (evaluation: any, classification: any, input: TransactionInput) => {
  await new Promise(r => setTimeout(r, 800)); // Simulate LLM Generation

  // Scenario A: Compliant
  if (!evaluation.tax_required) {
    return {
      summary: `Compliant. No TDS deduction required.`,
      detail: `This ${classification.type} payment is currently below the annual threshold for TDS. You can proceed to pay the full amount to ${input.counterparty}.`,
      actions: [
        'Pay the full invoice amount.',
        'File the invoice in your "Expenses" folder.'
      ],
      risk_level: 'Low' as const
    };
  }

  // Scenario B: Non-Compliant (TDS Required)
  const rule = evaluation.triggered_rule;
  const tdsAmount = evaluation.tax_amount;
  const netPayable = input.amount - tdsAmount;

  return {
    summary: `TDS Deduction Required (${rule.section})`,
    detail: `Since the estimated annual value of this ${classification.type} exceeds ₹${(rule.threshold_annual/100000).toFixed(1)} Lakhs, the Income Tax Act requires you to deduct tax at source. Do not pay the full amount.`,
    actions: [
      `Deduct TDS of ${formatCurrency(tdsAmount)} (${rule.rate}%) from the bill.`,
      `Pay only ${formatCurrency(netPayable)} to ${input.counterparty}.`,
      `Deposit the deducted TDS to the government by the 7th of next month.`,
      `Issue Form 16A to the vendor after filing returns.`
    ],
    risk_level: 'High' as const
  };
};

// --- Orchestrator ---
export const checkCompliance = async (input: TransactionInput): Promise<ComplianceResult> => {
  console.log("Starting Compliance Check...");
  
  // 1. Classify
  const classification = await agentClassify(input);
  
  // 2. Retrieve
  const rules = await agentRetrieve(classification);
  
  // 3. Evaluate
  const evaluation = await agentEvaluate(input, rules);
  
  // 4. Explain
  const explanation = await agentExplain(evaluation, classification, input);

  return {
    status: evaluation.tax_required ? 'Non-Compliant' : 'Compliant',
    classification,
    rules_applied: rules,
    evaluation,
    explanation
  };
};
