import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    email: string;
    password?: string;
    name?: string;
    tier: "free" | "pro";
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false }, // Optional for OAuth
        name: { type: String, required: false },
        tier: { type: String, enum: ["free", "pro"], default: "free" },
    },
    { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
