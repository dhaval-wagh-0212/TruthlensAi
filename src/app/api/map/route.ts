import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET() {
    try {
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("your_gemini_api_key_here")) {
            console.error("GEMINI_API_KEY is not set correctly.");
            return NextResponse.json({ error: "API Key not configured." }, { status: 500 });
        }

        const prompt = `You are a global intelligence AI tracking real-time misinformation and current affairs. Generate a JSON payload containing exactly 5 trending misinformation or news topics based on today's date and current events.
        
Group them into these categories: "Politics", "Health", "Finance", "Technology", "Global Conflicts" (one topic per category).
For each category, provide:
- region: A plausible region (e.g., "North America", "Global", "Eastern Europe")
- severity: "Medium", "High", or "Critical"
- topic: A very concise (3-5 words) description of the trending topic.
- trend: A string like "+45%" or "-10%".

Respond ONLY with a strict JSON object mapping to this schema:
{
  "Politics": [{ "region": "...", "severity": "...", "topic": "...", "trend": "..." }],
  "Health": [...],
  "Finance": [...],
  "Technology": [...],
  "Global Conflicts": [...]
}
NO markdown formatting or code blocks around the JSON.`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        let rawText = result.response.text();

        // Extract the JSON object robustly
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to extract JSON from Gemini response");
        }
        const data = JSON.parse(jsonMatch[0]);

        return NextResponse.json(data, { status: 200 });

    } catch (err: any) {
        console.error("Map API Error:", err.message || err);

        // Fallback to mock data to keep the UI functioning when API quota is exceeded or fails
        const mockData = {
            "Politics": [{ "region": "North America", "severity": "High", "topic": "Election Integrity Disputes", "trend": "+34%" }],
            "Health": [{ "region": "Global", "severity": "Medium", "topic": "Vaccine Misinformation", "trend": "+12%" }],
            "Finance": [{ "region": "Europe", "severity": "Medium", "topic": "Market Crash Rumors", "trend": "-5%" }],
            "Technology": [{ "region": "Asia Pacific", "severity": "Critical", "topic": "AI Deepfake Scams", "trend": "+85%" }],
            "Global Conflicts": [{ "region": "Eastern Europe", "severity": "Critical", "topic": "Coordinated Disinformation", "trend": "+45%" }]
        };

        return NextResponse.json(mockData, { status: 200 });
    }
}
