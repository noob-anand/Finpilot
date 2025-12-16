export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'inflow' | 'outflow';
};

export type Invoice = {
  id: string;
  customer: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  dueDate: string;
  issueDate: string;
};

export type FinancialSummary = {
  cashInflow: number;
  cashOutflow: number;
  netCashFlow: number;
  unpaidInvoicesCount: number;
  transactionPatterns: string;
};
