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

      // 1. Search for relevant products and FAQs based on the message
      const cleanMessage = userMessage.toLowerCase().replace(/[^\w\s]/g, '');
      const keywords = cleanMessage.split(" ").filter(w => w.length > 2);

      let products: any[] = [];
      let faqs: any[] = [];

      if (keywords.length > 0) {
        // Search Products
        products = await prisma.product.findMany({
          where: {
            OR: [
              { name: { contains: cleanMessage } },
              ...keywords.map(k => ({ name: { contains: k } })),
              ...keywords.map(k => ({ description: { contains: k } })),
              ...keywords.map(k => ({ category: { name: { contains: k } } }))
            ],
            isActive: true
          },
          include: { category: true },
          take: 5,
        });

        // Search FAQs
        faqs = await prisma.faq.findMany({
          where: {
            OR: [
              { question: { contains: cleanMessage } },
              ...keywords.map(k => ({ question: { contains: k } })),
              ...keywords.map(k => ({ answer: { contains: k } }))
            ],
            isActive: true
          },
          take: 3
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
        `- ${p.name} (${p.category?.name || 'Hijab'})\n  Harga: Rp${p.price.toLocaleString('id-ID')}\n  Stok: ${p.stock}\n  Deskripsi: ${p.description || "Tidak ada deskripsi"}\n  Warna: ${p.colors}\n  Material: ${p.materials}`
      ).join("\n\n");

      const faqContext = faqs.map(f =>
        `Tanya: ${f.question}\nJawab: ${f.answer}`
      ).join("\n\n");

      const systemPrompt = `
      Kamu adalah "Amoura", asisten AI virtual untuk toko hijab "De Amoura".
      Gunakan Bahasa Indonesia yang ramah, sopan, ceria, dan kekinian (gunakan emoji seperti 💕, ✨, 🌸 dalam porsi yang pas).

      INFORMASI PRODUK YANG DITEMUKAN:
      ${productContext || "Tidak ada produk yang spesifik cocok dengan keyword, tapi ini rekomendasi best seller kami."}

      INFORMASI FAQ (PERTANYAAN UMUM):
      ${faqContext || "Tidak ada info FAQ spesifik."}

      PANDUAN MENJAWAB:
      1.  **Gunakan Data Produk**: Jika user bertanya tentang produk, JANGAN mengarang. Gunakan informasi harga, material, dan stok dari data di atas.
      2.  **Gunakan Data FAQ**: Jika user bertanya soal pengiriman, toko, atau cara bayar, gunakan info dari bagian FAQ.
      3.  **Detail & Spesifik**: Jelaskan kelebihan produk berdasarkan deskripsi dan materialnya. Contoh: "Bahannya dari ${products[0]?.materials || 'bahan premium'} yang adem banget lho, Kak!"
      4.  **Persuasif**: Ajak user untuk checkout. Jika stok sedikit (< 10), ingatkan agar tidak kehabisan.
      5.  **Cerdas**: Jika user tanya "ada something?", cari di list produk "somethingsomething" dan jawab "Ada dong Kak! Kita punya somethingsomething...".
      6.  **Alternatif**: Jika produk yang dicari benar-benar tidak ada di list, tawarkan produk lain yang tersedia.

      CONTOH RESPON YANG BAGUS:
      "Halo Kak! Untuk hijab merah, kita punya *Pasmina Silk* nih. Harganya Rp45.000 aja. Bahannya silk premium yang flowy dan mewah banget. Stoknya tinggal 5 lho, yuk buruan diorder sebelum kehabisan! 💕"

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