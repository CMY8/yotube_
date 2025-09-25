import { NextRequest, NextResponse } from "next/server";
import { createErrorResponse } from "../../../../lib/http";
import { setAdminSessionCookie, validateAdminPassword } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = body?.password;

    if (typeof password !== "string" || password.length === 0) {
      return NextResponse.json({ message: "Password is required." }, { status: 400 });
    }

    if (!validateAdminPassword(password)) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    setAdminSessionCookie(response);
    return response;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
    }

    return createErrorResponse({
      error,
      context: "auth-login"
    });
  }
}
