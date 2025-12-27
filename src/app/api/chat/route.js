import { GoogleGenerativeAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest',
  systemInstruction: `You are a world-class financial analyst and AI Copilot for a small business owner. Your expertise spans financial planning, market analysis, investment strategies, and cash flow management. You provide clear, concise, and actionable advice based on the data provided.

Go beyond surface-level answers. Provide deep insights, identify potential risks, and suggest concrete opportunities for improvement.`,
});

export async function POST(req) {
  try {
    const { question, financialSummary } = await req.json();

    const summaryText = `
- Cash Inflow: ${financialSummary.cashInflow}
- Cash Outflow: ${financialSummary.cashOutflow}
- Net Cash Flow: ${financialSummary.netCashFlow}
- Unpaid Invoices: ${financialSummary.unpaidInvoicesCount}
- Transaction Patterns: ${financialSummary.transactionPatterns}
`;

    const prompt = `
User's Question: ${question}

Business Financial Summary:
${summaryText}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ answer: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
