import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { Analysis } from "@/models/Analysis";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !(session.user as any).id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const history = await Analysis.find({ userId: (session.user as any).id })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(history, { status: 200 });
    } catch (err) {
        console.error("Dashboard API Error:", err);
        return NextResponse.json({ error: "Server Error processing history" }, { status: 500 });
    }
}
