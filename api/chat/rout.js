import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    try {
        const { message } = await req.json();

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
        });

        const result = await model.generateContent(message);
        const reply = result.response.text();

        return Response.json({ reply });

    } catch (error) {
        return Response.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}