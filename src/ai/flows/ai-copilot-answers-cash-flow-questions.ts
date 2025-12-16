'use server';

/**
 * @fileOverview This file implements the Genkit flow for the AICopilotAnswersCashFlowQuestions story.
 *
 * - aiCopilotAnswersCashFlowQuestions - A function that handles the AI Copilot answering cash flow questions.
 * - AICopilotAnswersCashFlowQuestionsInput - The input type for the aiCopilotAnswersCashFlowQuestions function.
 * - AICopilotAnswersCashFlowQuestionsOutput - The return type for the aiCopilotAnswersCashFlowQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICopilotAnswersCashFlowQuestionsInputSchema = z.object({
  question: z.string().describe('The user question about their cash flow.'),
  cashInflow: z.number().describe('The total cash inflow.'),
  cashOutflow: z.number().describe('The total cash outflow.'),
  netCashFlow: z.number().describe('The net cash flow.'),
  unpaidInvoiceCount: z.number().describe('The number of unpaid invoices.'),
  transactionPatterns: z.string().describe('Description of transaction patterns.'),
});
export type AICopilotAnswersCashFlowQuestionsInput = z.infer<typeof AICopilotAnswersCashFlowQuestionsInputSchema>;

const AICopilotAnswersCashFlowQuestionsOutputSchema = z.object({
  answer: z.string().describe('The AI Copilot answer to the user question.'),
});
export type AICopilotAnswersCashFlowQuestionsOutput = z.infer<typeof AICopilotAnswersCashFlowQuestionsOutputSchema>;

export async function aiCopilotAnswersCashFlowQuestions(input: AICopilotAnswersCashFlowQuestionsInput): Promise<AICopilotAnswersCashFlowQuestionsOutput> {
  return aiCopilotAnswersCashFlowQuestionsFlow(input);
}

const financialSummaryTool = ai.defineTool({
    name: 'financialSummary',
    description: 'Summarizes the financial health of the business, based on cash flow metrics and unpaid invoices.',
    inputSchema: z.object({
      cashInflow: z.number().describe('The total cash inflow.'),
      cashOutflow: z.number().describe('The total cash outflow.'),
      netCashFlow: z.number().describe('The net cash flow.'),
      unpaidInvoiceCount: z.number().describe('The number of unpaid invoices.'),
      transactionPatterns: z.string().describe('Description of transaction patterns.'),
    }),
    outputSchema: z.string().describe('A summary of the financial data.'),
  },
  async (input) => {
    let summary = `Cash Inflow: ${input.cashInflow}, Cash Outflow: ${input.cashOutflow}, Net Cash Flow: ${input.netCashFlow}, Unpaid Invoices: ${input.unpaidInvoiceCount}. Transaction Patterns: ${input.transactionPatterns}`;
    return summary;
  }
);


const prompt = ai.definePrompt({
  name: 'aiCopilotAnswersCashFlowQuestionsPrompt',
  tools: [financialSummaryTool],
  input: {schema: AICopilotAnswersCashFlowQuestionsInputSchema},
  output: {schema: AICopilotAnswersCashFlowQuestionsOutputSchema},
  prompt: `You are a virtual financial advisor for small business owners. Use the financialSummary tool to generate a financial summary. Answer the user's question about their cash flow in plain English, providing actionable explanations and recommendations.

Question: {{{question}}}

Financial Summary: {{financialSummaryTool cashInflow=cashInflow cashOutflow=cashOutflow netCashFlow=netCashFlow unpaidInvoiceCount=unpaidInvoiceCount transactionPatterns=transactionPatterns}}`,
});

const aiCopilotAnswersCashFlowQuestionsFlow = ai.defineFlow(
  {
    name: 'aiCopilotAnswersCashFlowQuestionsFlow',
    inputSchema: AICopilotAnswersCashFlowQuestionsInputSchema,
    outputSchema: AICopilotAnswersCashFlowQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
