
import { GoogleGenerativeAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;

  // First, check if the API key is configured.
  if (!apiKey || apiKey === 'your_actual_api_key_here') {
    console.error('GOOGLE_GENAI_API_KEY is not defined in the .env file.');
    return NextResponse.json(
      { error: 'AI features are not configured. Please add your Google AI API key to the .env file.' },
      { status: 500 }
    );
  }

  try {
    const { question, financialSummary } = await req.json();

    // Initialize the Gemini client only after validating the key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro-latest',
      systemInstruction: `You are a highly experienced and meticulous financial analyst, serving as an AI Copilot for a small business owner. Your name is Fin. Your expertise is deep and covers financial planning, market analysis, investment strategies, risk management, and cash flow optimization.

You communicate with precision and clarity, avoiding vague statements. Your goal is to provide actionable, data-driven advice. When you analyze data, you identify underlying trends, pinpoint potential risks, and uncover concrete opportunities for improvement that the user might have missed. You are expected to go beyond surface-level answers and deliver deep insights.`,
    });

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
    let errorMessage = 'Failed to generate content';
    if (error.message && error.message.includes('API key not valid')) {
      errorMessage = 'The provided Google AI API key is not valid. Please check your .env file.';
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
