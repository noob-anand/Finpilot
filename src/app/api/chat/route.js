import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    try {
        const { message } = await req.json();

        // Ensure you have this environment variable set in .env.local
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-pro", // Consider upgrading to gemini-1.5-pro or flash later
        });

        const result = await model.generateContent(message);
        const reply = result.response.text();

        return Response.json({ reply });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return Response.json(
            { error: "Something went wrong processing your request." },
            { status: 500 }
        );
    }
}
