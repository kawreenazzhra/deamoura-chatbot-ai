import { NextRequest, NextResponse } from 'next/server'
import { createAdmin, findAdminByEmail } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Prevent creating more than one admin via this route
    const existing = await findAdminByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 409 })
    }

    const admin = await createAdmin(email, password, name)
    return NextResponse.json({ ok: true, admin: { id: admin.id, email: admin.email, name: admin.name } })
  } catch (err) {
    console.error('Admin register error:', err)
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 })
  }
}
