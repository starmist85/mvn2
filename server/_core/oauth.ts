import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    console.log("[OAuth] Callback received with code:", code ? "present" : "missing", "state:", state ? "present" : "missing");

    if (!code || !state) {
      console.error("[OAuth] Missing code or state");
      res.redirect(302, "/?error=missing_auth_params");
      return;
    }

    try {
      console.log("[OAuth] Exchanging code for token...");
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      console.log("[OAuth] Token exchange successful");
      
      console.log("[OAuth] Getting user info...");
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      console.log("[OAuth] User info retrieved, openId:", userInfo.openId);

      if (!userInfo.openId) {
        console.error("[OAuth] openId missing from user info");
        res.redirect(302, "/?error=missing_openid");
        return;
      }

      console.log("[OAuth] Upserting user...");
      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });
      console.log("[OAuth] User upserted successfully");

      console.log("[OAuth] Creating session token...");
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });
      console.log("[OAuth] Session token created");

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      console.log("[OAuth] Session cookie set");

      // Get the user to check if they're an admin
      const user = await db.getUserByOpenId(userInfo.openId);
      const redirectUrl = user?.role === "admin" ? "/admin" : "/";
      console.log("[OAuth] Redirecting to:", redirectUrl, "user role:", user?.role);
      res.redirect(302, redirectUrl);
    } catch (error) {
      console.error("[OAuth] Callback failed:", error instanceof Error ? error.message : String(error));
      console.error("[OAuth] Full error:", error);
      res.redirect(302, "/?error=oauth_failed");
    }
  });
}
