'use server';
/**
 * @fileOverview Summarizes the financial health of a business, highlighting cash flow stress, delayed receivables, and high expense ratios.
 *
 * - summarizeFinancialData - A function that summarizes financial data.
 * - FinancialDataSummaryInput - The input type for the summarizeFinancialData function.
 * - FinancialDataSummaryOutput - The return type for the summarizeFinancialData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialDataSummaryInputSchema = z.object({
  cashInflow: z.number().describe('Total cash inflow for the period.'),
  cashOutflow: z.number().describe('Total cash outflow for the period.'),
  unpaidInvoicesCount: z.number().describe('Number of unpaid invoices.'),
  expenseRatio: z
    .number()
    .describe(
      'The ratio of expenses to revenue, expressed as a decimal (e.g., 0.6 for 60%).'
    ),
  delayedReceivablesRatio: z
    .number()
    .describe(
      'The ratio of receivables that are past due to total receivables, expressed as a decimal (e.g., 0.3 for 30%).'
    ),
});
export type FinancialDataSummaryInput = z.infer<
  typeof FinancialDataSummaryInputSchema
>;

const FinancialDataSummaryOutputSchema = z.object({
  summary: z.string().describe('A plain English summary of the financial health.'),
  recommendations: z
    .string()
    .describe('Actionable recommendations for improving financial health.'),
});
export type FinancialDataSummaryOutput = z.infer<
  typeof FinancialDataSummaryOutputSchema
>;

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
  },
  async input => {
    const {output} = await summarizeFinancialDataPrompt(input);
    return output!;
  }
);
