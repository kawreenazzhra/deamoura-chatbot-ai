// lib/gemini-service.ts
import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-2.5-flash";

export class DeAmouraChatbot {

  async generateResponse(userMessage: string): Promise<{
    text: string;
    products: Product[];
    categories: any[];
    hasProducts: boolean;
  }> {
    console.log('\n🤖 generateResponse START (REST) - message:', userMessage.substring(0, 30));
    console.log('🤖 Model Version:', GEMINI_MODEL);

    try {
      if (!API_KEY) {
        throw new Error("Gemini API Key is missing");
      }

      // 1. Search for relevant products based on the message
      const keywords = userMessage.split(" ").filter(w => w.length > 3);
      let products: Product[] = [];

      if (keywords.length > 0) {
        products = await prisma.product.findMany({
          where: {
            OR: [
              { name: { contains: userMessage } },
              ...keywords.map(k => ({ name: { contains: k } })),
              ...keywords.map(k => ({ description: { contains: k } }))
            ],
            isActive: true
          },
          take: 5,
        });
      }

      // Fallback
      if (products.length === 0) {
        products = await prisma.product.findMany({
          where: { isFeatured: true, isActive: true },
          take: 3
        });
      }

      // 2. Prepare Context
      const productContext = products.map(p =>
        `- ${p.name} (Harga: Rp${p.price}): ${p.description || "Tidak ada deskripsi"} [Warna: ${p.colors}, Material: ${p.materials}]`
      ).join("\n");

      const systemPrompt = `
      Kamu adalah asisten AI untuk toko hijab "De Amoura".
      Gunakan Bahasa Indonesia yang ramah, sopan, dan kekinian (ada emoji 💕, ✨).
      
      Konteks Produk yang Ditemukan:
      ${productContext}

      Tugasmu:
      1. Jawab pertanyaan user berdasarkan produk di atas jika relevan.
      2. Jika ada produk yang cocok, rekomendasikan dengan sebutkan nama.
      3. Jika tidak ada, sebutkan produk best seller kami.
      4. Jawab singkat dan persuasif.

      Pesan User: "${userMessage}"
      `;

      // 3. Call Gemini REST API
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`;

      const payload = {
        contents: [{
          parts: [{ text: systemPrompt }]
        }]
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn("⚠️ Gemini Quota Exceeded");
          return {
            text: "Maaf ya, kuota AI harian habis nih 🥺. Coba tanya lagi besok atau nanti ya! (429 Too Many Requests)",
            products: products,
            categories: [],
            hasProducts: products.length > 0
          };
        }
        const errData = await response.text();
        throw new Error(`Gemini API Error: ${response.status} - ${errData}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, aku tidak bisa menjawab sekarang.";

      console.log('✅ Response generated:', text.substring(0, 50) + '...');

      return {
        text: text,
        products: products,
        categories: [],
        hasProducts: products.length > 0
      };

    } catch (error: any) {
      console.error('❌ Error:', error?.message);
      return {
        text: "Maaf ya, aku lagi gangguan nih. Coba tanya lagi nanti ya! 💕 (Server Error)",
        products: [],
        categories: [],
        hasProducts: false
      };
    }
  }
}