import { RequestHandler } from "express";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const twoFASchema = z.object({
  challengeId: z.string().min(1),
  code: z.string().regex(/^\d{6}$/),
});

const forgotSchema = z.object({
  email: z.string().email(),
});

const registerSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  acceptTerms: z.literal(true),
  isTeacher: z.boolean().optional().default(false),
  institutionEmail: z.string().email().optional(),
}).refine((val) => !val.isTeacher || !!val.institutionEmail, {
  message: "Institution email is required for teachers",
  path: ["institutionEmail"],
}).refine((val) => !val.isTeacher || /\.(edu|school|ac|uni)\b/.test(val.institutionEmail ?? ""), {
  message: "Institution email must be academic domain",
  path: ["institutionEmail"],
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type LoginResponse = { need2FA: true; challengeId: string } | { need2FA: false; token: string };
export type Verify2FARequest = z.infer<typeof twoFASchema>;
export type Verify2FAResponse = { token: string };
export type ForgotPasswordRequest = z.infer<typeof forgotSchema>;
export type ForgotPasswordResponse = { message: string };
export type RegisterRequest = z.infer<typeof registerSchema>;
export type RegisterResponse = { userId: string; message: string };

// In-memory demo store for 2FA challenges (mock). In real apps, use a database or cache.
const challenges = new Map<string, { email: string; createdAt: number }>();

const generateId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export const handleLogin: RequestHandler = (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }
  const { email } = parsed.data;

  // Always require 2FA for demo security posture
  const challengeId = generateId();
  challenges.set(challengeId, { email, createdAt: Date.now() });
  const response: LoginResponse = { need2FA: true, challengeId };
  return res.json(response);
};

export const handleVerify2FA: RequestHandler = (req, res) => {
  const parsed = twoFASchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }
  const { challengeId, code } = parsed.data;
  const challenge = challenges.get(challengeId);
  if (!challenge) {
    return res.status(400).json({ message: "Invalid or expired challenge." });
  }
  // Demo code: 123456
  if (code !== "123456") {
    return res.status(401).json({ message: "Invalid 2FA code." });
  }
  challenges.delete(challengeId);
  // Issue a mock token (do NOT use in production)
  const token = `mock.${Buffer.from(challenge.email).toString("base64")}.${generateId()}`;
  const response: Verify2FAResponse = { token };
  return res.json(response);
};

export const handleForgotPassword: RequestHandler = (req, res) => {
  const parsed = forgotSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }
  const response: ForgotPasswordResponse = {
    message: "If an account exists for this email, a reset link has been sent.",
  };
  return res.json(response);
};

export const handleRegister: RequestHandler = (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }
  const id = Math.random().toString(36).slice(2);
  const response: RegisterResponse = { userId: id, message: "Registration successful" };
  return res.status(201).json(response);
};

export const handleGetSessions: RequestHandler = (_req, res) => {
  const exampleSessions = [
    { id: "s1", device: "Chrome on Mac", ip: "192.168.1.2", lastActive: Date.now(), current: true },
    { id: "s2", device: "Safari on iPhone", ip: "10.0.0.5", lastActive: Date.now() - 3600_000 },
  ];
  res.json({ sessions: exampleSessions });
};

export const handleLogoutAll: RequestHandler = (_req, res) => {
  res.json({ message: "All sessions have been logged out" });
};
