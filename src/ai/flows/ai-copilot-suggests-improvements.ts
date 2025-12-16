'use server';
/**
 * @fileOverview An AI agent that suggests improvements for business finances.
 *
 * - aiCopilotSuggestsImprovements - A function that suggests improvements for business finances.
 * - AiCopilotSuggestsImprovementsInput - The input type for the aiCopilotSuggestsImprovements function.
 * - AiCopilotSuggestsImprovementsOutput - The return type for the aiCopilotSuggestsImprovements function.
 */

import {ai} from '@/ai/genkit';
import {
  AiCopilotSuggestsImprovementsInputSchema,
  AiCopilotSuggestsImprovementsOutputSchema,
  type AiCopilotSuggestsImprovementsInput,
  type AiCopilotSuggestsImprovementsOutput,
} from '@/ai/schemas';
import {googleAI} from '@genkit-ai/google-genai';

export async function aiCopilotSuggestsImprovements(
  input: AiCopilotSuggestsImprovementsInput
): Promise<AiCopilotSuggestsImprovementsOutput> {
  return aiCopilotSuggestsImprovementsFlow(input);
}

const aiCopilotSuggestsImprovementsFlow = ai.defineFlow(
  {
    name: 'aiCopilotSuggestsImprovementsFlow',
    inputSchema: AiCopilotSuggestsImprovementsInputSchema,
    outputSchema: AiCopilotSuggestsImprovementsOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      model: googleAI.model('gemini-pro'),
      output: {
        schema: AiCopilotSuggestsImprovementsOutputSchema,
      },
      prompt: `You are a virtual financial advisor for small business owners. Based on the provided financial data, provide actionable recommendations to improve their financial performance this month.

Financial Data:
- Cash Inflow: ${input.cashInflow}
- Cash Outflow: ${input.cashOutflow}
- Net Cash Flow: ${input.netCashFlow}
- Unpaid Invoices Count: ${input.unpaidInvoicesCount}
- Transaction Patterns: ${input.transactionPatterns}

Recommendations:`,
    });
    return output!;
  }
);
