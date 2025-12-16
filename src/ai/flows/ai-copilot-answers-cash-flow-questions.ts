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
import { summarizeFinancialData, type FinancialDataSummaryInput } from './ai-summarize-financial-data';
import { FinancialDataSummaryOutputSchema } from './ai-summarize-financial-data';
import { FinancialDataSummaryInputSchema } from './ai-summarize-financial-data';

const AICopilotAnswersCashFlowQuestionsInputSchema = z.object({
  question: z.string().describe('The user question about their cash flow.'),
  cashInflow: z.number().describe('The total cash inflow.'),
  cashOutflow: z.number().describe('The total cash outflow.'),
  netCashFlow: z.number().describe('The net cash flow.'),
  unpaidInvoicesCount: z.number().describe('The number of unpaid invoices.'),
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

const prompt = ai.definePrompt({
  name: 'aiCopilotAnswersCashFlowQuestionsPrompt',
  input: {
    schema: z.object({
      question: z.string(),
      summary: z.string(),
    }),
  },
  output: {schema: AICopilotAnswersCashFlowQuestionsOutputSchema},
  prompt: `You are a virtual financial advisor for small business owners. Use the provided financial summary to answer the user's question about their cash flow in plain English, providing actionable explanations and recommendations.

Question: {{{question}}}

Financial Summary: {{{summary}}}`,
});

const aiCopilotAnswersCashFlowQuestionsFlow = ai.defineFlow(
  {
    name: 'aiCopilotAnswersCashFlowQuestionsFlow',
    inputSchema: AICopilotAnswersCashFlowQuestionsInputSchema,
    outputSchema: AICopilotAnswersCashFlowQuestionsOutputSchema,
  },
  async input => {
    const expenseRatio = input.cashInflow > 0 ? input.cashOutflow / input.cashInflow : 0;
    const delayedReceivablesRatio = 0; // Assuming no data for this yet

    const financialSummary = await summarizeFinancialData({
        cashInflow: input.cashInflow,
        cashOutflow: input.cashOutflow,
        unpaidInvoicesCount: input.unpaidInvoicesCount,
        expenseRatio: expenseRatio,
        delayedReceivablesRatio: delayedReceivablesRatio,
    });
    
    const summaryText = `${financialSummary.summary}\n\n**Recommendations:**\n${financialSummary.recommendations}`;

    const {output} = await prompt({
        question: input.question,
        summary: summaryText,
    });
    return output!;
  }
);
