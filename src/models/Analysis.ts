import mongoose, { Schema, Document } from "mongoose";

export interface IAnalysis extends Document {
    userId: mongoose.Types.ObjectId;
    url?: string;
    text?: string;
    credibilityScore: number;
    bias: string;
    summary: string;
    createdAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        url: { type: String, required: false },
        text: { type: String, required: false },
        credibilityScore: { type: Number, required: true, min: 0, max: 100 },
        bias: { type: String, required: true },
        summary: { type: String, required: true },
    },
    { timestamps: true }
);

export const Analysis =
    mongoose.models.Analysis || mongoose.model<IAnalysis>("Analysis", AnalysisSchema);
