import { Transaction } from '../types/lexguard';

export const mockTransactions: Transaction[] = [
  {
    id: "TXN-8821",
    vendorName: "Apex Tech Solutions",
    amount: 145000,
    date: "2024-04-15",
    riskLevel: "high",
    confidenceScore: 92,
    status: "pending",
    category: "Professional Fees",
    description: "Q1 IT Consultation Services",
    flagReason: "TDS Not Deducted (Sec 194J)",
    aiExplanation: {
      summary: "Transaction exceeds ₹30,000 threshold for professional services without TDS deduction.",
      clause: "Any person, not being an individual or HUF, who is responsible for paying to a resident any sum by way of fees for professional services... shall deduct an amount equal to ten per cent.",
      clauseReference: "Income Tax Act, Section 194J",
      reasoningSteps: [
        "Identified payment as 'Professional Fees'.",
        "Cumulative payment to vendor > ₹30,000.",
        "No TDS component found in invoice breakdown.",
        "Vendor is a domestic entity."
      ]
    },
    auditNote: "Vendor has not provided lower deduction certificate. Full 10% deduction required."
  },
  {
    id: "TXN-8824",
    vendorName: "City Office Rentals",
    amount: 45000,
    date: "2024-04-14",
    riskLevel: "medium",
    confidenceScore: 78,
    status: "pending",
    category: "Rent",
    description: "Monthly Office Rent - Wing B",
    flagReason: "PAN Invalid / Mismatch",
    aiExplanation: {
      summary: "Landlord PAN on invoice does not match central database records for this GSTIN.",
      clause: "Every person deducting tax... shall quote the Permanent Account Number...",
      clauseReference: "Income Tax Rules, Rule 37BA",
      reasoningSteps: [
        "Extracted PAN from Invoice PDF.",
        "Cross-referenced with GSTIN registry.",
        "Name mismatch detected: 'City Rentals' vs 'City Prop Ltd'."
      ]
    },
    auditNote: "Verify landlord ownership documents before processing."
  },
  {
    id: "TXN-8819",
    vendorName: "Global Supplies Corp",
    amount: 12500,
    date: "2024-04-12",
    riskLevel: "low",
    confidenceScore: 99,
    status: "approved",
    category: "Office Supplies",
    description: "Stationery and Printer Ink",
    aiExplanation: {
      summary: "Compliant. GST charged correctly at 18%.",
      clause: "N/A",
      clauseReference: "GST Act",
      reasoningSteps: [
        "Invoice format valid.",
        "GSTIN active.",
        "Tax rate matches HSN code 4820."
      ]
    }
  },
  {
    id: "TXN-8820",
    vendorName: "Express Logistics",
    amount: 5600,
    date: "2024-04-13",
    riskLevel: "low",
    confidenceScore: 98,
    status: "pending",
    category: "Transport",
    description: "Courier Charges",
    aiExplanation: {
      summary: "Low value transaction. No RCM applicable.",
      clause: "N/A",
      clauseReference: "N/A",
      reasoningSteps: ["Amount < Threshold", "Vendor is GTA registered"]
    }
  },
  {
    id: "TXN-8825",
    vendorName: "Marketing Pros",
    amount: 250000,
    date: "2024-04-16",
    riskLevel: "high",
    confidenceScore: 89,
    status: "pending",
    category: "Advertising",
    description: "Annual Campaign Advance",
    flagReason: "GST Input Credit Blocked",
    aiExplanation: {
      summary: "Vendor has not filed GSTR-1 for previous quarter. ITC risk.",
      clause: "Input tax credit shall not be availed unless the details have been communicated...",
      clauseReference: "CGST Act, Section 16(2)(aa)",
      reasoningSteps: [
        "Checked GSTR-2B.",
        "Invoice not reflected.",
        "Vendor filing status: Defaulter."
      ]
    },
    auditNote: "Hold payment until GSTR-1 filing proof is submitted."
  }
];
