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
} from '@/ai/schemas';
import {summarizeFinancialData} from './ai-summarize-financial-data';

export async function aiCopilotAnswersCashFlowQuestions(
  input
) {
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
      model: 'gemini-pro',
      output: {
        schema: AICopilotAnswersCashFlowQuestionsOutputSchema,
      },
      prompt: `You are a world-class financial analyst and AI Copilot for a small business owner. Your expertise spans financial planning, market analysis, investment strategies, and cash flow management. You provide clear, concise, and actionable advice based on the data provided.

Use the provided financial summary to answer the user's question about their business. Go beyond surface-level answers. Provide deep insights, identify potential risks, and suggest concrete opportunities for improvement.

User's Question: ${input.question}

Business Financial Summary:
${summaryText}`,
    });

    return output;
  }
);
