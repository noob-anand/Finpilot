import { GoogleGenerativeAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_actual_api_key_here') {
    return NextResponse.json(
      {
        error:
          'AI features are not configured. Please add your Gemini API key to the .env file.',
      },
      { status: 500 }
    );
  }

  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required.' },
        { status: 400 }
      );
    }

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
        'The provided Gemini API key is not valid. Please check your .env file.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
