import { subMonths, format, subDays } from 'date-fns';

const today = new Date();

const defaultTransactions = [
  { id: 'txn1', date: format(subDays(today, 2), 'yyyy-MM-dd'), description: "Client A Payment", amount: 2500, type: 'inflow' },
  { id: 'txn2', date: format(subDays(today, 3), 'yyyy-MM-dd'), description: "Office Supplies", amount: 150, type: 'outflow' },
  { id: 'txn3', date: format(subDays(today, 5), 'yyyy-MM-dd'), description: "Client B Payment", amount: 1800, type: 'inflow' },
  { id: 'txn4', date: format(subDays(today, 7), 'yyyy-MM-dd'), description: "Software Subscription", amount: 45, type: 'outflow' },
  { id: 'txn5', date: format(subDays(today, 10), 'yyyy-MM-dd'), description: "Marketing Campaign", amount: 500, type: 'outflow' },
  { id: 'txn6', date: format(subDays(today, 12), 'yyyy-MM-dd'), description: "Client C Payment", amount: 3200, type: 'inflow' },
  { id: 'txn7', date: format(subDays(today, 15), 'yyyy-MM-dd'), description: "Rent", amount: 1200, type: 'outflow' },
  { id: 'txn8', date: format(subDays(today, 20), 'yyyy-MM-dd'), description: "Utilities", amount: 250, type: 'outflow' },
];

const defaultTaxes = [
    { id: 'TAX-001', name: 'GST', rate: 0.18 },
    { id: 'TAX-002', name: 'VAT', rate: 0.20 },
    { id: 'TAX-003', name: 'Service Tax', rate: 0.10 },
];

const defaultInvoices = [
  { id: 'INV-001', customer: 'Creative Solutions Ltd.', amount: 2500, status: 'paid', issueDate: format(subDays(today, 32), 'yyyy-MM-dd'), dueDate: format(subDays(today, 2), 'yyyy-MM-dd'), taxId: 'TAX-001', taxAmount: 450 },
  { id: 'INV-002', customer: 'Innovate Inc.', amount: 1800, status: 'paid', issueDate: format(subDays(today, 20), 'yyyy-MM-dd'), dueDate: format(subDays(today, 5), 'yyyy-MM-dd') },
  { id: 'INV-003', customer: 'Marketing Gurus', amount: 4200, status: 'unpaid', issueDate: format(subDays(today, 15), 'yyyy-MM-dd'), dueDate: format(today, 'yyyy-MM-dd'), taxId: 'TAX-003', taxAmount: 420 },
  { id: 'INV-004', customer: 'Tech Forward', amount: 3000, status: 'unpaid', issueDate: format(subDays(today, 5), 'yyyy-MM-dd'), dueDate: format(subDays(today, -10), 'yyyy-MM-dd') },
  { id: 'INV-005', customer: 'Global Exports', amount: 5500, status: 'overdue', issueDate: format(subDays(today, 45), 'yyyy-MM-dd'), dueDate: format(subDays(today, 15), 'yyyy-MM-dd'), taxId: 'TAX-002', taxAmount: 1100 },
];

const defaultInvestments = [
    { id: 'INV-ASSET-001', name: 'Bitcoin', type: 'Cryptocurrency', quantity: 0.5, buyPrice: 40000, currentPrice: 65000 },
    { id: 'INV-ASSET-002', name: 'Ethereum', type: 'Cryptocurrency', quantity: 10, buyPrice: 2500, currentPrice: 3500 },
    { id: 'INV-ASSET-003', name: 'Apple Inc.', type: 'Stocks', quantity: 100, buyPrice: 150, currentPrice: 210 },
    { id: 'INV-ASSET-004', name: 'S&P 500 ETF', type: 'ETF', quantity: 50, buyPrice: 400, currentPrice: 530 },
    { id: 'INV-ASSET-005', name: 'Tokenized Bond', type: 'Tokenized Asset', quantity: 1000, buyPrice: 98, currentPrice: 102 },
];


function isLocalStorageAvailable() {
    try {
        const test = '__localStorageTest__';
        window.localStorage.setItem(test, test);
        window.localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

function getLocalData(key, fallback) {
    if (!isLocalStorageAvailable()) return fallback;
    
    const dataSource = localStorage.getItem('finpilot_data_source');
    if (dataSource !== 'local') {
        return fallback;
    }
    
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
}


export const getTransactions = (dataSource = 'default') => {
    if (dataSource === 'local') {
        return getLocalData('personal_transactions', []);
    }
    return defaultTransactions;
};

export const getInvoices = (dataSource = 'default') => {
    if (dataSource === 'local') {
        return getLocalData('personal_invoices', []);
    }
    return defaultInvoices;
};

export const getTaxes = (dataSource = 'default') => {
    if (dataSource === 'local') {
        return getLocalData('personal_taxes', []);
    }
    return defaultTaxes;
};

export const getInvestments = (dataSource = 'default') => {
    if (dataSource === 'local') {
        return getLocalData('personal_investments', []);
    }
    return defaultInvestments;
};

export const getFinancialSummary = (dataSource = 'default') => {
  const transactions = getTransactions(dataSource);
  const invoices = getInvoices(dataSource);

  const cashInflow = transactions
    .filter(t => t.type === 'inflow')
    .reduce((sum, t) => sum + t.amount, 0);

  const cashOutflow = transactions
    .filter(t => t.type === 'outflow')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netCashFlow = cashInflow - cashOutflow;

  const netTaxes = invoices.reduce((sum, invoice) => sum + (invoice.taxAmount || 0), 0);

  const unpaidInvoicesCount = invoices.filter(
    i => i.status === 'unpaid' || i.status === 'overdue'
  ).length;

  return {
    cashInflow,
    cashOutflow,
    netCashFlow,
    netTaxes,
    unpaidInvoicesCount,
    transactionPatterns: 'Recurring subscriptions and variable client payments.'
  };
};

export const getPortfolioSummary = (dataSource = 'default') => {
    const investments = getInvestments(dataSource);
    const totalInvested = investments.reduce((sum, asset) => sum + (asset.quantity * asset.buyPrice), 0);
    const totalValue = investments.reduce((sum, asset) => sum + (asset.quantity * asset.currentPrice), 0);
    const totalProfitLoss = totalValue - totalInvested;
    const totalProfitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    return { totalValue, totalInvested, totalProfitLoss, totalProfitLossPercentage };
}

export const getAssetAllocation = (dataSource = 'default') => {
    const investments = getInvestments(dataSource);
    const allocation = {};
    investments.forEach(asset => {
        if (!allocation[asset.type]) {
            allocation[asset.type] = 0;
        }
        allocation[asset.type] += asset.quantity * asset.currentPrice;
    });

    return Object.entries(allocation).map(([name, value]) => ({ name, value }));
}

export const getCapitalAllocation = (dataSource = 'default') => {
    const financialSummary = getFinancialSummary(dataSource);
    const portfolioSummary = getPortfolioSummary(dataSource);
    const transactions = getTransactions(dataSource);

    const rent = transactions.find(t => t.description.toLowerCase() === 'rent')?.amount || (dataSource === 'default' ? 1200 : 0);
    const salaries = transactions.find(t => t.description.toLowerCase() === 'salaries')?.amount || (dataSource === 'default' ? 2500 : 0);
    const marketing = transactions.find(t => t.description.toLowerCase() === 'marketing campaign')?.amount || 0;
    
    const taxes = financialSummary.netTaxes;
    const investments = portfolioSummary.totalInvested;

    return [
        { name: 'Rent', value: rent },
        { name: 'Salaries', value: salaries },
        { name: 'Taxes', value: taxes },
        { name: 'Marketing', value: marketing },
        { name: 'Investments', value: investments }
    ].filter(item => item.value > 0);
};


export const getMonthlyChartData = (dataSource = 'default') => {
  const data = [];
  const transactions = getTransactions(dataSource);

  if (dataSource === 'local' && transactions.length === 0) {
      for (let i = 5; i >= 0; i--) {
        const month = subMonths(today, i);
        data.push({ month: format(month, 'MMM'), inflow: 0, outflow: 0, netProfit: 0 });
      }
      return data;
  }
  if (dataSource === 'local') {
    const monthlyData = {};
     for (let i = 5; i >= 0; i--) {
        const monthName = format(subMonths(today, i), 'MMM');
        monthlyData[monthName] = { inflow: 0, outflow: 0 };
     }

    transactions.forEach(t => {
        const monthName = format(new Date(t.date), 'MMM');
        if(monthlyData[monthName]) {
            if(t.type === 'inflow') monthlyData[monthName].inflow += t.amount;
            else monthlyData[monthName].outflow += t.amount;
        }
    });

    return Object.keys(monthlyData).map(month => ({
        month,
        inflow: monthlyData[month].inflow,
        outflow: monthlyData[month].outflow,
        netProfit: monthlyData[month].inflow - monthlyData[month].outflow
    }))

  }


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

export const getMonthlyChartDataWithOffset = (offset, dataSource = 'default') => {
  const data = getMonthlyChartData(dataSource);
  return data.map(d => ({...d, netProfit: d.netProfit + offset}));
};
