import axios from 'axios';
import { TransactionInput, ComplianceResult } from './mockAgents';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const analyzeComplianceViaBackend = async (data: TransactionInput): Promise<ComplianceResult> => {
  const response = await axios.post(`${API_BASE_URL}/api/transactions/analyze`, {
    description: data.description,
    amount: data.amount,
    date: data.date,
    counterparty: data.counterparty,
    typeHint: data.typeHint,
    frequency: data.frequency
  });

  return response.data;
};
