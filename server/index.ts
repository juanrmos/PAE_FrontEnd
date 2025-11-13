import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleForgotPassword, handleLogin, handleVerify2FA, handleRegister, handleGetSessions, handleLogoutAll } from "./routes/auth";
import { getGroupAnalytics, getGroupFiles, getGroupsCounts, getMyGroups, getPublicGroups, getGroupChat, postGroupChat, getPublicForums, postPublicForum } from "./routes/groups";
import { getPopular, getMyRepos, saveRepo } from "./routes/repository";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth API (mock) with validation
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/verify-2fa", handleVerify2FA);
  app.post("/api/auth/forgot", handleForgotPassword);
  app.post("/api/auth/register", handleRegister);
  app.get("/api/auth/sessions", handleGetSessions);
  app.post("/api/auth/logout-all", handleLogoutAll);

  // Groups/Communities API
  app.get("/api/groups/my", getMyGroups);
  app.get("/api/groups/public", getPublicGroups);
  app.get("/api/groups/:id/files", getGroupFiles);
  app.get("/api/groups/:id/analytics", getGroupAnalytics);
  app.get("/api/groups/counts", getGroupsCounts);
  app.get("/api/groups/:id/chat", getGroupChat);
  app.post("/api/groups/:id/chat", postGroupChat);
  app.get("/api/groups/forums/public", getPublicForums);
  app.post("/api/groups/forums/public", postPublicForum);

  // Repository API
  app.get("/api/repos/popular", getPopular);
  app.get("/api/repos/my", getMyRepos);
  app.post("/api/repos/save", saveRepo);

  return app;
}
