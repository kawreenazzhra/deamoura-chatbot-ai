import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";

// Use a consistent fallback secret if env vars are missing
export const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'dev-secret';
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

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function setAdminCookie(token: string) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Max-Age=604800; SameSite=Lax`;
}

export async function verifyAdmin(request: NextRequest) {
  const token = getAdminTokenFromCookie(request.headers.get("cookie"));
  if (!token) return { auth: null, error: "Unauthorized" };

  const admin = verifyAdminToken(token);
  if (!admin) return { auth: null, error: "Invalid token" };

  return { auth: admin, error: null };
}
