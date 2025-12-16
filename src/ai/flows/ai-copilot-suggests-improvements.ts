'use server';
/**
 * @fileOverview An AI agent that suggests improvements for business finances.
 *
 * - aiCopilotSuggestsImprovements - A function that suggests improvements for business finances.
 * - AiCopilotSuggestsImprovementsInput - The input type for the aiCopilotSuggestsImprovements function.
 * - AiCopilotSuggestsImprovementsOutput - The return type for the aiCopilotSuggestsImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiCopilotSuggestsImprovementsInputSchema = z.object({
  cashInflow: z.number().describe('Total cash inflow for the month.'),
  cashOutflow: z.number().describe('Total cash outflow for the month.'),
  netCashFlow: z.number().describe('Net cash flow for the month.'),
  unpaidInvoicesCount: z.number().describe('Number of unpaid invoices.'),
  transactionPatterns: z
    .string()
    .describe('Description of transaction patterns.'),
});
export type AiCopilotSuggestsImprovementsInput = z.infer<
  typeof AiCopilotSuggestsImprovementsInputSchema
>;

const AiCopilotSuggestsImprovementsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('AI-generated insights and recommendations for financial improvements.'),
});
export type AiCopilotSuggestsImprovementsOutput = z.infer<
  typeof AiCopilotSuggestsImprovementsOutputSchema
>;

export async function aiCopilotSuggestsImprovements(
  input: AiCopilotSuggestsImprovementsInput
): Promise<AiCopilotSuggestsImprovementsOutput> {
  return aiCopilotSuggestsImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCopilotSuggestsImprovementsPrompt',
  input: {schema: AiCopilotSuggestsImprovementsInputSchema},
  output: {schema: AiCopilotSuggestsImprovementsOutputSchema},
  prompt: `You are a virtual financial advisor for small business owners. Based on the provided financial data, provide actionable recommendations to improve their financial performance this month.\n\nFinancial Data:\n- Cash Inflow: {{{cashInflow}}}\n- Cash Outflow: {{{cashOutflow}}}\n- Net Cash Flow: {{{netCashFlow}}}\n- Unpaid Invoices Count: {{{unpaidInvoicesCount}}}\n- Transaction Patterns: {{{transactionPatterns}}}\n\nRecommendations:`,
});

const aiCopilotSuggestsImprovementsFlow = ai.defineFlow(
  {
    name: 'aiCopilotSuggestsImprovementsFlow',
    inputSchema: AiCopilotSuggestsImprovementsInputSchema,
    outputSchema: AiCopilotSuggestsImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
