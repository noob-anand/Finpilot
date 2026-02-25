import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
        });

        const { message } = req.body;

        const result = await model.generateContent(message);
        const reply = result.response.text();

        res.status(200).json({ reply });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}