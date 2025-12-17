import { NextResponse } from "next/server";
import { createAdmin, findAdminByEmail } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 });
    }

    const existing = await findAdminByEmail(email);
    if (existing) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    // Password hashing is handled inside createAdmin in lib/db.ts
    const admin = await createAdmin(email, password, name);

    return NextResponse.json({ message: "Admin registered", admin });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
