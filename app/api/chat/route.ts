import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client responsibly
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY');
      return NextResponse.json(
        { text: "Maaf, sistem sedang maintenance. (API Key Missing)" },
        { status: 500 }
      );
    }

    // 1. Fetch Context from DB (Fail-safe)
    let productContext = "";
    let categoryContext = "";

    try {
      // Fetch all active products (limit 20 for safety) to provide full context
      const products = await prisma.product.findMany({
        take: 20,
        where: {
          isActive: true
        },
        select: { name: true, price: true, stock: true, description: true }
      });

      if (products.length > 0) {
        productContext = `PRODUK TERKAIT DARI DATABASE:\n${products.map((p: any) =>
          `- ${p.name}: Rp ${p.price}, Stok: ${p.stock}, Info: ${p.description}`
        ).join('\n')}\n`;
      }

    } catch (dbError) {
      console.error("Database Error (Ignored for Chat):", dbError);
      // Continue without product context
      productContext = "Note: Database produk sedang tidak bisa diakses. Jawab secara umum saja.";
    }

    // 2. Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    // 3. Construct Prompt
    const prompt = `
      Anda adalah customer service De.Amoura hijab fashion.
      Tugas: Jawab pertanyaan customer dengan ramah, gaul, dan sopan. Pakai emoji 💕.
      
      KONTEKS PRODUK:
      ${productContext}
      
      User: "${message}"
      
      Instruksi:
      - Jika ada info produk di atas, promosikan.
      - Jika tidak ada, minta maaf dan tawarkan bantuan lain.
      - JANGAN HALUSINASI produk yang tidak ada di data.
      
      Jawab:
    `;

    // 4. Generate Output
    console.log("Sending to Gemini...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini Response:", text);

    // 5. Return JSON in format expected by ChatWidget
    return NextResponse.json({
      text: text, // Primary text
      reply: text, // Fallback
      response: text // Fallback
    });

  } catch (error: any) {
    console.error("Critical Chat API Error:", error);

    // Check for Quota limits
    if (error.message?.includes('429') || error.message?.includes('Quota')) {
      return NextResponse.json({ text: "Maaf, kuota AI sedang penuh. Coba 1 menit lagi ya kak! 🙏" });
    }

    return NextResponse.json({
      text: "Maaf, sedang ada gangguan sistem. Silakan hubungi admin via WhatsApp ya! 🙏"
    });
  }
}