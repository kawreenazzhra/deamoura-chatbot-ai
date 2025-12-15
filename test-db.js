const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Connecting to DB...");
        const products = await prisma.product.findMany();
        console.log(`Found ${products.length} products:`);
        products.forEach(p => {
            console.log(`- [${p.id}] ${p.name} (Active: ${p.isActive})`);
        });

        // Specific search test
        const search = "bergo";
        const found = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: search } },
                    { description: { contains: search } }
                ]
            }
        });
        console.log(`\nSearch for '${search}': Found ${found.length}`);
    } catch (e) {
        console.error("DB Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
