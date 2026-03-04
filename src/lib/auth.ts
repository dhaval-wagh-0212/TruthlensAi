import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "./mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                await connectToDatabase();

                const user = await User.findOne({ email: credentials.email });

                if (!user || (!user.password && user.email)) {
                    throw new Error("No user found with this email");
                }

                const isPasswordMatch = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordMatch) {
                    throw new Error("Incorrect password");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    tier: user.tier,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.tier = (user as any).tier;
            }
            if (trigger === "update" && session?.name) {
                token.name = session.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id as string;
                (session.user as any).tier = token.tier as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
