import "server-only";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth/minimal";
import { emailOTP } from "better-auth/plugins";
import { getDatabase } from "@/lib/db/client";
import * as schema from "@/lib/db/schema";
import { sendStudioCode } from "@/lib/email/otp";

function createAuth() {
  return betterAuth({
    appName: "My Museum",
    baseURL: process.env.BETTER_AUTH_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3001"),
    trustedOrigins: ["https://archival-museum.vercel.app"],
    database: drizzleAdapter(getDatabase(), { provider: "pg", schema }),
    emailAndPassword: { enabled: false },
    session: { expiresIn: 60 * 60 * 24 * 14, updateAge: 60 * 60 * 24 },
    plugins: [emailOTP({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      storeOTP: "hashed",
      disableSignUp: true,
      rateLimit: { window: 60, max: 3 },
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type !== "sign-in") throw new Error("Unsupported Studio code request.");
        await sendStudioCode(email, otp);
      },
    })],
  });
}
let authInstance: ReturnType<typeof createAuth> | null = null;
export function getAuth() { return authInstance ??= createAuth(); }
