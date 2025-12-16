
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // 1. Create Admin
    const adminEmail = 'admin@deamoura.com'
    const adminPassword = 'AdminPassword123!'
    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    const admin = await prisma.admin.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Admin De.Amoura',
            passwordHash: hashedPassword,
        },
    })
    console.log(`Created admin: ${admin.email}`)

    // 2. Create Categories
    const categoriesData = [
        { name: 'Hijab Instan', slug: 'hijab-instan', description: 'Hijab praktis langsung pakai.' },
        { name: 'Pashmina', slug: 'pashmina', description: 'Hijab panjang mudah dikreasikan.' },
        { name: 'Square / Segi Empat', slug: 'square', description: 'Hijab segi empat klasik dan elegan.' },
    ]

    for (const cat of categoriesData) {
        const category = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        })
        console.log(`Created category: ${category.name}`)
    }

    // 3. Create FAQs
    const faqData = [
        { question: 'Apakah bahan hijab panas?', answer: 'Tidak, kami menggunakan bahan premium yang adem dan menyerap keringat.' },
        { question: 'Berapa lama pengiriman?', answer: 'Pengiriman biasanya memakan waktu 2-3 hari kerja untuk Jabodetabek.' },
        { question: 'Bagaimana cara retur?', answer: 'Silakan hubungi admin via WhatsApp dengan menyertakan video unboxing.' },
    ]

    for (const faq of faqData) {
        await prisma.faq.create({
            data: faq,
        })
    }
    console.log(`Created ${faqData.length} FAQs`)

    // 4. Create Dummy Products
    const pashminaCat = await prisma.category.findUnique({ where: { slug: 'pashmina' } })

    if (pashminaCat) {
        await prisma.product.create({
            data: {
                name: 'Pashmina Ceruty Babydoll',
                slug: 'pashmina-ceruty-babydoll',
                description: 'Pashmina berbahan ceruty babydoll premium, jatuh, dan mudah dibentuk.',
                price: 45000,
                stock: 100,
                materials: ['Ceruty Babydoll'],
                colors: ['Hitam', 'Navy', 'Mocca', 'Dusty Pink'],
                imageUrl: '/images/pashmina-test.jpg',
                categoryId: pashminaCat.id,
                isActive: true,
                isFeatured: true
            }
        })
        console.log('Created dummy product: Pashmina Ceruty Babydoll')
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
