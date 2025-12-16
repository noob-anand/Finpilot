export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'inflow' | 'outflow';
};

export type Tax = {
  id: string;
  name: string;
  rate: number;
  type: 'GST' | 'VAT' | 'Sales Tax' | 'Income Tax' | 'Payroll Tax' | 'Service Tax' | 'Withholding Tax';
};

export type Invoice = {
  id: string;
  customer: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  dueDate: string;
  issueDate: string;
  taxId?: string;
  taxAmount?: number;
};

export type FinancialSummary = {
  cashInflow: number;
  cashOutflow: number;
  netTaxes: number;
  unpaidInvoicesCount: number;
  transactionPatterns: string;
};
