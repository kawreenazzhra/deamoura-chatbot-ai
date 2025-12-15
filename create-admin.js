const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@gmail.com';
    const password = '1234567890';
    const name = 'admin';

    try {
        console.log(`Hashing password for ${email}...`);
        const passwordHash = await bcrypt.hash(password, 10);

        console.log('Creating/Updating admin user...');
        const admin = await prisma.admin.upsert({
            where: { email },
            update: {
                passwordHash,
                name
            },
            create: {
                email,
                passwordHash,
                name
            }
        });

        console.log(`Admin user ${admin.email} created/updated successfully!`);
        console.log(`Name: ${admin.name}`);
        console.log(`Password: ${password}`);
    } catch (e) {
        console.error('Error creating admin:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
