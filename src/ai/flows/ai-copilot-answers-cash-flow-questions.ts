'use server';

/**
 * @fileOverview This file implements the Genkit flow for the AICopilotAnswersCashFlowQuestions story.
 *
 * - aiCopilotAnswersCashFlowQuestions - A function that handles the AI Copilot answering cash flow questions.
 */

import {ai} from '@/ai/genkit';
import {
  AICopilotAnswersCashFlowQuestionsInputSchema,
  AICopilotAnswersCashFlowQuestionsOutputSchema,
  type AICopilotAnswersCashFlowQuestionsInput,
  type AICopilotAnswersCashFlowQuestionsOutput,
} from '@/ai/schemas';
import {summarizeFinancialData} from './ai-summarize-financial-data';
import {googleAI} from '@genkit-ai/google-genai';

export async function aiCopilotAnswersCashFlowQuestions(
  input: AICopilotAnswersCashFlowQuestionsInput
): Promise<AICopilotAnswersCashFlowQuestionsOutput> {
  return aiCopilotAnswersCashFlowQuestionsFlow(input);
}

const aiCopilotAnswersCashFlowQuestionsFlow = ai.defineFlow(
  {
    name: 'aiCopilotAnswersCashFlowQuestionsFlow',
    inputSchema: AICopilotAnswersCashFlowQuestionsInputSchema,
    outputSchema: AICopilotAnswersCashFlowQuestionsOutputSchema,
  },
  async input => {
    const expenseRatio =
      input.cashInflow > 0 ? input.cashOutflow / input.cashInflow : 0;
    // This is a mock value for demonstration. In a real app, you'd calculate this.
    const delayedReceivablesRatio = 0.2; 

    const financialSummary = await summarizeFinancialData({
      ...input,
      expenseRatio,
      delayedReceivablesRatio,
    });

    const summaryText = `${financialSummary.summary}\n\n**Recommendations:**\n${financialSummary.recommendations}`;

    const {output} = await ai.generate({
      model: googleAI.model('gemini-1.0-pro'),
      output: {
        schema: AICopilotAnswersCashFlowQuestionsOutputSchema,
      },
      prompt: `You are a virtual financial advisor for small business owners. Use the provided financial summary to answer the user's question about their cash flow in plain English, providing actionable explanations and recommendations.

Question: ${input.question}

Financial Summary: ${summaryText}`,
    });

    return output!;
  }
);
