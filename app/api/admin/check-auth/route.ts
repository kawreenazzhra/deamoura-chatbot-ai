import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
    const { error, auth } = await verifyAdmin(request)

    if (error) {
        return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true, user: auth })
}
