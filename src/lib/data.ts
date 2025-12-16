import type { Transaction, Invoice, FinancialSummary } from '@/types';
import { subMonths, format, subDays } from 'date-fns';

const today = new Date();

export const transactions: Transaction[] = [
  { id: 'txn1', date: format(subDays(today, 2), 'yyyy-MM-dd'), description: "Client A Payment", amount: 2500, type: 'inflow' },
  { id: 'txn2', date: format(subDays(today, 3), 'yyyy-MM-dd'), description: "Office Supplies", amount: 150, type: 'outflow' },
  { id: 'txn3', date: format(subDays(today, 5), 'yyyy-MM-dd'), description: "Client B Payment", amount: 1800, type: 'inflow' },
  { id: 'txn4', date: format(subDays(today, 7), 'yyyy-MM-dd'), description: "Software Subscription", amount: 45, type: 'outflow' },
  { id: 'txn5', date: format(subDays(today, 10), 'yyyy-MM-dd'), description: "Marketing Campaign", amount: 500, type: 'outflow' },
  { id: 'txn6', date: format(subDays(today, 12), 'yyyy-MM-dd'), description: "Client C Payment", amount: 3200, type: 'inflow' },
  { id: 'txn7', date: format(subDays(today, 15), 'yyyy-MM-dd'), description: "Rent", amount: 1200, type: 'outflow' },
  { id: 'txn8', date: format(subDays(today, 20), 'yyyy-MM-dd'), description: "Utilities", amount: 250, type: 'outflow' },
];

export const invoices: Invoice[] = [
  { id: 'INV-001', customer: 'Creative Solutions Ltd.', amount: 2500, status: 'paid', issueDate: format(subDays(today, 32), 'yyyy-MM-dd'), dueDate: format(subDays(today, 2), 'yyyy-MM-dd') },
  { id: 'INV-002', customer: 'Innovate Inc.', amount: 1800, status: 'paid', issueDate: format(subDays(today, 20), 'yyyy-MM-dd'), dueDate: format(subDays(today, 5), 'yyyy-MM-dd') },
  { id: 'INV-003', customer: 'Marketing Gurus', amount: 4200, status: 'unpaid', issueDate: format(subDays(today, 15), 'yyyy-MM-dd'), dueDate: format(today, 'yyyy-MM-dd') },
  { id: 'INV-004', customer: 'Tech Forward', amount: 3000, status: 'unpaid', issueDate: format(subDays(today, 5), 'yyyy-MM-dd'), dueDate: format(subDays(today, -10), 'yyyy-MM-dd') },
  { id: 'INV-005', customer: 'Global Exports', amount: 5500, status: 'overdue', issueDate: format(subDays(today, 45), 'yyyy-MM-dd'), dueDate: format(subDays(today, 15), 'yyyy-MM-dd') },
];

export const getTransactions = (): Transaction[] => transactions;
export const getInvoices = (): Invoice[] => invoices;

export const getFinancialSummary = (): FinancialSummary => {
  const cashInflow = transactions
    .filter(t => t.type === 'inflow')
    .reduce((sum, t) => sum + t.amount, 0);

  const cashOutflow = transactions
    .filter(t => t.type === 'outflow')
    .reduce((sum, t) => sum + t.amount, 0);

  const netCashFlow = cashInflow - cashOutflow;

  const unpaidInvoicesCount = invoices.filter(
    i => i.status === 'unpaid' || i.status === 'overdue'
  ).length;

  return {
    cashInflow,
    cashOutflow,
    netCashFlow,
    unpaidInvoicesCount,
    transactionPatterns: 'Recurring subscriptions and variable client payments.'
  };
};


export const getMonthlyChartData = () => {
  const data = [];
  for (let i = 5; i >= 0; i--) {
    const month = subMonths(today, i);
    const monthName = format(month, 'MMM');
    const inflow = Math.floor(Math.random() * (10000 - 4000 + 1)) + 4000;
    const outflow = Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000;
    const netProfit = inflow - outflow;
    data.push({ month: monthName, inflow, outflow, netProfit });
  }
  return data;
};

export const getMonthlyChartDataWithOffset = (offset: number) => {
  const data = [];
  for (let i = 5; i >= 0; i--) {
    const month = subMonths(today, i);
    const monthName = format(month, 'MMM');
    const inflow = Math.floor(Math.random() * (10000 - 4000 + 1)) + 4000;
    const outflow = Math.floor(Math.random() * (8000 - 3000 + 1)) + 3000;
    const netProfit = inflow - outflow + offset;
    data.push({ month: monthName, inflow, outflow, netProfit });
  }
  return data;
};
