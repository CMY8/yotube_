import crypto from "crypto";
import { cookies, type ReadonlyRequestCookies } from "next/headers";

const ADMIN_COOKIE_NAME = "yt_insight_admin";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function expectedToken(): string {
  const password = requireEnv("ADMIN_PASSWORD");
  const secret = requireEnv("SESSION_SECRET");
  return crypto.createHash("sha256").update(`${password}:${secret}`).digest("hex");
}

export function validateAdminPassword(password: string): boolean {
  const stored = requireEnv("ADMIN_PASSWORD");
  return password === stored;
}

export function setAdminSessionCookie(response: Response | import("next/server").NextResponse) {
  const token = expectedToken();
  const maxAge = 60 * 60 * 8; // 8 hours
  if ("cookies" in response) {
    // NextResponse
    (response as import("next/server").NextResponse).cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge
    });
  } else {
    (response as Response).headers.append("Set-Cookie", `${ADMIN_COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${maxAge}`);
  }
}

export function clearAdminSessionCookie(response: import("next/server").NextResponse) {
  response.cookies.delete(ADMIN_COOKIE_NAME);
}

export function isAdminAuthenticated(cookieStore?: ReadonlyRequestCookies): boolean {
  const store = cookieStore ?? cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return token === expectedToken();
}
