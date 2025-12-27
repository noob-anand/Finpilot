import { GoogleGenerativeAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the Gemini client
const apiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey || apiKey === 'your_actual_api_key_here') {
  throw new Error('GOOGLE_GENAI_API_KEY is not defined in the .env file. Please add it to use the AI Copilot.');
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest',
  systemInstruction: `You are a world-class financial analyst and AI Copilot for a small business owner. Your expertise spans financial planning, market analysis, investment strategies, and cash flow management. You provide clear, concise, and actionable advice based on the data provided.

Go beyond surface-level answers. Provide deep insights, identify potential risks, and suggest concrete opportunities for improvement.`,
});

export async function POST(req) {
  try {
    if (!apiKey || apiKey === 'your_actual_api_key_here') {
      return NextResponse.json(
        { error: 'AI features are not configured. Please add your Google AI API key to the .env file.' },
        { status: 500 }
      );
    }
    
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
    let errorMessage = 'Failed to generate content';
    if (error.message.includes('API key not valid')) {
      errorMessage = 'The provided Google AI API key is not valid. Please check your .env file.';
    } else if (error.message.includes('GOOGLE_GENAI_API_KEY is not defined')) {
      errorMessage = 'AI features are not configured. Please add your Google AI API key to the .env file.';
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
