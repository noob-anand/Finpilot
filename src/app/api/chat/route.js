
import { GoogleGenerativeAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;

  if (!apiKey || apiKey === 'your_actual_api_key_here') {
    return NextResponse.json(
      {
        error:
          'AI features are not configured. Please add your Google AI API key to the .env file.',
      },
      { status: 500 }
    );
  }

  try {
    const { question } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
    });

    const result = await model.generateContent(question);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ answer: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    let errorMessage = 'Failed to generate content';
    if (error.message && error.message.includes('API key not valid')) {
      errorMessage =
        'The provided Google AI API key is not valid. Please check your .env file.';
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
