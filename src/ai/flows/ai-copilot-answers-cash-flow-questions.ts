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
import { summarizeFinancialData } from './ai-summarize-financial-data';
import {
  AICopilotAnswersCashFlowQuestionsInputSchema,
  AICopilotAnswersCashFlowQuestionsOutputSchema,
  type AICopilotAnswersCashFlowQuestionsInput,
  type AICopilotAnswersCashFlowQuestionsOutput
} from '@/ai/schemas';

export {type AICopilotAnswersCashFlowQuestionsInput, type AICopilotAnswersCashFlowQuestionsOutput};


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
        netCashFlow: input.netCashFlow,
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
