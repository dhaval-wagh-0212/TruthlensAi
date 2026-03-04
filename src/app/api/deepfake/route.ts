import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return NextResponse.json({ error: "No image file provided" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes("your_gemini_api_key_here")) {
            console.error("GEMINI_API_KEY is not set correctly.");
            return NextResponse.json({ error: "API Key not configured. Please add it to .env.local and MUST restart 'npm run dev' to apply it." }, { status: 500 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString('base64');

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: file.type
            }
        };

        const prompt = `You are a highly accurate digital forensics AI analyzing images for deepfakes and AI generation (Midjourney, DALL-E, etc.). 

VERY IMPORTANT INSTRUCTIONS for 95%+ accuracy:
1. Real photos have natural, random imperfections, slight sensor noise, realistic lighting, and genuine textures. If the image is completely natural with NO anomalies, score it 0-15%.
2. AI-generated images often look hyper-realistic but have subtle tells: overly smooth skin textures, perfect but unnatural lighting, slight blending errors, inconsistent background depth, or minor geometric/text flaws.
3. If you detect ANY signs of AI generation, hyper-realism, or deepfake artifacts (even subtle ones), you MUST assign a "deepfakeProbability" and "aiGenerated" score between 60% and 95% depending on their obviousness. 
4. Do not blindly default to 0% just because the image looks good. Analyze the pixels, lighting, and textures thoroughly to determine if it is human photography or AI generated.

Respond ONLY with a strict JSON object mapping to this schema. DO NOT include any markdown formatting or code blocks around the JSON.
{
    "deepfakeProbability": <number between 0 and 100>,
    "aiGenerated": <number between 0 and 100>,
    "metadata": {
        "camera": "<string, e.g., 'Stripped / None', or 'Simulated DSLR'>",
        "software": "<string, e.g., 'Midjourney / Stable Diffusion Signature' or 'None detected'>",
        "date": "<string, e.g., 'Unknown' or ISO date>",
        "location": "<string, e.g., 'None' or location data>"
    },
    "reverseImageMatch": "<string explaining if structural similarity with known AI templates is found>",
    "issues": [
        "<string, forensic observation 1 (e.g., Inconsistent specular highlights)>",
        "<string, forensic observation 2>",
        "<string, forensic observation 3>"
    ]
}`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent([prompt, imagePart]);
        let rawText = result.response.text();

        // Clean up markdown formatting if Gemini includes it
        const startIndex = rawText.indexOf('{');
        const endIndex = rawText.lastIndexOf('}');
        if (startIndex !== -1 && endIndex !== -1) {
            rawText = rawText.substring(startIndex, endIndex + 1);
        }

        const analysisData = JSON.parse(rawText);

        const analysisResult = {
            filename: file.name,
            deepfakeProbability: analysisData.deepfakeProbability || 0,
            aiGenerated: analysisData.aiGenerated || 0,
            metadata: analysisData.metadata || {
                camera: "Unknown",
                software: "Unknown",
                date: "Unknown",
                location: "Unknown",
            },
            reverseImageMatch: analysisData.reverseImageMatch || "No match data available.",
            issues: analysisData.issues || []
        };

        return NextResponse.json(analysisResult, { status: 200 });

    } catch (err: any) {
        console.error("Deepfake API Error:", err);
        return NextResponse.json({ error: err.message || "Server Error processing deepfake analysis" }, { status: 500 });
    }
}
