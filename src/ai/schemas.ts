import {z} from 'genkit';

export const FinancialDataSummaryInputSchema = z.object({
  cashInflow: z.number().describe('Total cash inflow for the period.'),
  cashOutflow: z.number().describe('Total cash outflow for the period.'),
  netCashFlow: z.number().describe('Net cash flow for the period.'),
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

export const FinancialDataSummaryOutputSchema = z.object({
  summary: z.string().describe('A plain English summary of the financial health.'),
  recommendations: z
    .string()
    .describe('Actionable recommendations for improving financial health.'),
});
export type FinancialDataSummaryOutput = z.infer<
  typeof FinancialDataSummaryOutputSchema
>;

export const AiCopilotSuggestsImprovementsInputSchema = z.object({
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

export const AiCopilotSuggestsImprovementsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('AI-generated insights and recommendations for financial improvements.'),
});
export type AiCopilotSuggestsImprovementsOutput = z.infer<
  typeof AiCopilotSuggestsImprovementsOutputSchema
>;

export const AICopilotAnswersCashFlowQuestionsInputSchema = z.object({
  question: z.string().describe('The user question about their cash flow.'),
  cashInflow: z.number().describe('The total cash inflow.'),
  cashOutflow: z.number().describe('The total cash outflow.'),
  netCashFlow: z.number().describe('The net cash flow.'),
  unpaidInvoicesCount: z.number().describe('The number of unpaid invoices.'),
  transactionPatterns: z.string().describe('Description of transaction patterns.'),
});
export type AICopilotAnswersCashFlowQuestionsInput = z.infer<typeof AICopilotAnswersCashFlowQuestionsInputSchema>;

export const AICopilotAnswersCashFlowQuestionsOutputSchema = z.object({
  answer: z.string().describe('The AI Copilot answer to the user question.'),
});
export type AICopilotAnswersCashFlowQuestionsOutput = z.infer<typeof AICopilotAnswersCashFlowQuestionsOutputSchema>;
