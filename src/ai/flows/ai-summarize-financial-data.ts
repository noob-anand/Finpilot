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
import {googleAI} from '@genkit-ai/google-genai';

export async function summarizeFinancialData(
  input: FinancialDataSummaryInput
): Promise<FinancialDataSummaryOutput> {
  return summarizeFinancialDataFlow(input);
}

const summarizeFinancialDataFlow = ai.defineFlow(
  {
    name: 'summarizeFinancialDataFlow',
    inputSchema: FinancialDataSummaryInputSchema,
    outputSchema: FinancialDataSummaryOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      model: googleAI.model('gemini-1.0-pro'),
      output: {
        schema: FinancialDataSummaryOutputSchema,
      },
      prompt: `You are a virtual financial advisor for small business owners.  You will receive a financial summary of their business and provide a plain English explanation of their financial health, as well as actionable recommendations.

Here is the financial data:

Cash Inflow: ${input.cashInflow}
Cash Outflow: ${input.cashOutflow}
Net Cash Flow: ${input.netCashFlow}
Unpaid Invoices Count: ${input.unpaidInvoicesCount}
Expense Ratio: ${input.expenseRatio}
Delayed Receivables Ratio: ${input.delayedReceivablesRatio}

Provide a concise summary of the business's financial health, followed by a bulleted list of 2-3 actionable recommendations.`,
    });
    return output!;
  }
);
