import { NextResponse } from "next/server";
import { findAdminByEmail, verifyAdminPassword } from "@/lib/db";
import { generateAdminToken, setAdminCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const admin = await findAdminByEmail(email);

    if (!admin) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await verifyAdminPassword(password, admin.passwordHash);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = generateAdminToken({ id: admin.id, email: admin.email });
    const cookieHeader = setAdminCookie(token);

    const response = NextResponse.json({ message: "Login success", token });
    response.headers.set("Set-Cookie", cookieHeader);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
