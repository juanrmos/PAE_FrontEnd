/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Auth types (shared)
export interface LoginRequest {
  email: string;
  password: string;
}
export type LoginResponse = { need2FA: true; challengeId: string } | { need2FA: false; token: string };

export interface Verify2FARequest {
  challengeId: string;
  code: string; // 6 digits
}
export interface Verify2FAResponse {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}
export interface ForgotPasswordResponse {
  message: string;
}

// Registration
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  acceptTerms: boolean;
  isTeacher?: boolean;
  institutionEmail?: string;
}
export interface RegisterResponse {
  userId: string;
  message: string;
}

export interface SessionInfo {
  id: string;
  device: string;
  ip: string;
  lastActive: number;
  current?: boolean;
}
export interface SessionsResponse {
  sessions: SessionInfo[];
}
