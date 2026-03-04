import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { Analysis } from "@/models/Analysis";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, text } = body;

        if (!url && !text) {
            return NextResponse.json({ error: "Missing payload" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("your_gemini_api_key_here")) {
            console.error("GEMINI_API_KEY is not set correctly.");
            return NextResponse.json({ error: "API Key not configured. Please add it to .env.local and MUST restart 'npm run dev' to apply it." }, { status: 500 });
        }

        const inputContent = text ? `Text: ${text}` : `URL: ${url}`;

        // Construct the prompt to ask Gemini for a JSON response
        const prompt = `You are an expert misinformation analyst systems. Analyze the following content for credibility, bias, and manipulation. 

VERY IMPORTANT: If the input text or URL contains recent news, newly published information, or live events, DO NOT classify it as fake or deny it just because it's outside your training data or you cannot verify it live. If the text format, journalistic tone, and structure appear legitimate and are not extreme sensationalism, assume it is credible. You MUST PROVIDE a high credibilityScore (80-100) and low fakeProbability (0-20) for standard news reporting of recent events, even if you do not know the event. DO NOT output that you cannot verify it.
        
\n${inputContent}\n\nRespond with ONLY a strict JSON object mapping to this schema with NO wrapping markdown tags and no explanations outside the JSON block. Do not use Markdown JSON block tickmarks just the text itself:\n{
            "target": "The summary hook/title of what was provided",
            "credibilityScore": <Number between 0 and 100>,
            "fakeProbability": <Number between 0 and 100>,
            "bias": "<String from: Left, Center-Left, Center, Center-Right, Right, Far-Right, Far-Left>",
            "emotionalManipulation": <Number between 0 and 100>,
            "sourceTrust": <Number between 0 and 100>,
            "explanation": "<A detailed 2 sentence string explanation of the analysis>",
            "signals": [
                { "type": "Semantic", "value": "<String analysis>" },
                { "type": "Source", "value": "<String analysis>" },
                { "type": "Context", "value": "<String analysis>" }
            ]
        }`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        let rawText = result.response.text();

        // Strip any markdown fences if Gemini added them
        rawText = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();

        const analysisResult = JSON.parse(rawText);

        // Get the current user session
        const session = await getServerSession(authOptions);

        if (session && session.user && (session.user as any).id) {
            // Save to database
            await connectToDatabase();
            await Analysis.create({
                userId: (session.user as any).id,
                url: url || "",
                text: text || "",
                credibilityScore: analysisResult.credibilityScore,
                bias: analysisResult.bias,
                summary: analysisResult.explanation,
            });
        }

        return NextResponse.json(analysisResult, { status: 200 });

    } catch (err) {
        console.error("Analysis API Error:", err);
        return NextResponse.json({ error: "Server Error processing analysis" }, { status: 500 });
    }
}
