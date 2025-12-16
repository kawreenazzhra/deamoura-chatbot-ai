
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@deamoura.com'
    const password = 'password'
    const name = 'Admin DeAmoura'

    try {
        // Delete existing admin
        await prisma.admin.deleteMany({
            where: {
                email: email
            }
        })
        console.log('Deleted existing admin')

        // Create new admin
        const passwordHash = await bcrypt.hash(password, 10)
        const admin = await prisma.admin.create({
            data: {
                email,
                passwordHash,
                name
            }
        })
        console.log(`Created new admin: ${admin.email} with password: ${password}`)
    } catch (e) {
        console.error(e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
