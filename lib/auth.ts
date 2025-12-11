import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET as string;
const COOKIE_NAME = "admin_token";

type AdminPayload = {
  id: number;
  email: string;
};

export function generateAdminToken(admin: AdminPayload) {
  return jwt.sign(admin, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: parseInt(decoded.sub),
      email: decoded.email
    };
  } catch (err) {
    return null;
  }
}

export function getAdminTokenFromCookie(cookieHeader: string | null) {
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map(c => c.trim().split("="))
      .map(([key, ...value]) => [key, value.join("=")])
  );

  return cookies[COOKIE_NAME] ?? null;
}

export function setAdminCookie(token: string) {
  const cookie = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`;
  return cookie;
}

export async function verifyAdmin(request: NextRequest) {
  const token = getAdminTokenFromCookie(request.headers.get("cookie"));
  if (!token) return { auth: null, error: "Unauthorized" };

  const admin = verifyAdminToken(token);
  if (!admin) return { auth: null, error: "Invalid token" };

  return { auth: admin, error: null };
}
