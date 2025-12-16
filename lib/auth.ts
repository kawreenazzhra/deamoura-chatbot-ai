// @ts-ignore
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'dev-secret'

export interface AdminToken {
  sub: string
  email: string
}

export function verifyAdminToken(token: string): AdminToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminToken
    return decoded
  } catch (err) {
    return null
  }
}

export function generateAdminToken(adminId: string, email: string): string {
  return jwt.sign({ sub: adminId, email }, JWT_SECRET, { expiresIn: '7d' })
}

export function getAdminTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const cookies = cookieHeader.split(';').map(c => c.trim())
  const adminCookie = cookies.find(c => c.startsWith('admin_token='))
  return adminCookie?.split('=')[1] || null
}
