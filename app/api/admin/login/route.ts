import { NextRequest, NextResponse } from 'next/server'
import { findAdminByEmail, verifyAdminPassword } from '@/lib/db'
// @ts-ignore
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const admin = await findAdminByEmail(email)
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const ok = await verifyAdminPassword(password, admin.passwordHash)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = jwt.sign({ sub: String(admin.id), email: admin.email }, process.env.ADMIN_JWT_SECRET || 'dev-secret', { expiresIn: '7d' })

    return NextResponse.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } })
  } catch (err) {
    console.error('Admin login error:', err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
