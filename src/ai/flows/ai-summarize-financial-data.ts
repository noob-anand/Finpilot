'use server';
/**
 * @fileOverview Summarizes the financial health of a business, highlighting cash flow stress, delayed receivables, and high expense ratios.
 *
 * - summarizeFinancialData - A function that summarizes financial data.
 */

import {ai} from '@/ai/genkit';
import {
  FinancialDataSummaryInputSchema,
  FinancialDataSummaryOutputSchema,
  type FinancialDataSummaryInput,
  type FinancialDataSummaryOutput,
} from '@/ai/schemas';

export async function summarizeFinancialData(
  input: FinancialDataSummaryInput
): Promise<FinancialDataSummaryOutput> {
  return summarizeFinancialDataFlow(input);
}

const summarizeFinancialDataPrompt = ai.definePrompt({
  name: 'summarizeFinancialDataPrompt',
  input: {schema: FinancialDataSummaryInputSchema},
  output: {schema: FinancialDataSummaryOutputSchema},
  prompt: `You are a virtual financial advisor for small business owners.  You will receive a financial summary of their business and provide a plain English explanation of their financial health, as well as actionable recommendations.

Here is the financial data:

Cash Inflow: {{cashInflow}}
Cash Outflow: {{cashOutflow}}
Net Cash Flow: {{netCashFlow}}
Unpaid Invoices Count: {{unpaidInvoicesCount}}
Expense Ratio: {{expenseRatio}}
Delayed Receivables Ratio: {{delayedReceivablesRatio}}

Summary:

Recommendations:`,
});

const summarizeFinancialDataFlow = ai.defineFlow(
  {
    name: 'summarizeFinancialDataFlow',
    inputSchema: FinancialDataSummaryInputSchema,
    outputSchema: FinancialDataSummaryOutputSchema,
    model: 'googleai/gemini-1.5-flash',
  },
  async input => {
    const {output} = await summarizeFinancialDataPrompt(input);
    return output!;
  }
);
