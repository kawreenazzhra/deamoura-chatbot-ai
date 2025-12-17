// lib/gemini-service.ts
import { searchProducts, getFAQ, getFeaturedProducts } from "./db";

// Define a local interface since we removed Prisma
interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  description: string | null;
  imageUrl: string | null;
  category?: { name: string };
  materials?: any; // JSON string or array
  colors?: any;    // JSON string or array
  variants?: any;  // JSON string or array
  marketplaceUrl?: string | null;
  isFeatured?: boolean;
}

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-2.5-flash"; // Updated to user-confirmed working model

export class DeAmouraChatbot {

  async generateResponse(userMessage: string): Promise<{
    text: string;
    products: Product[];
    categories: any[];
    hasProducts: boolean;
  }> {
    console.log('\n🤖 generateResponse START (REST) - message:', userMessage.substring(0, 30));

    try {
      if (!API_KEY) {
        throw new Error("Gemini API Key is missing");
      }

      // 1. Search for relevant products and FAQs based on the message
      const cleanMessage = userMessage.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
      let products: any[] = [];
      let faqs: any[] = [];

      // Strategy A: Direct Search
      console.log('🔍 Strategy A: Direct Search ->', cleanMessage);
      products = await searchProducts(cleanMessage);
      faqs = await getFAQ(cleanMessage);

      // Strategy B: Smart Search (Remove Stop Words)
      if (products.length === 0) {
        const STOP_WORDS = [
          'ada', 'nggak', 'enggak', 'tidak', 'mau', 'beli', 'cari', 'tolong', 'plis', 'please',
          'kak', 'min', 'gan', 'sis', 'hallo', 'halo', 'hai', 'hi', 'apakah', 'yang', 'dan',
          'atau', 'di', 'ke', 'dari', 'ini', 'itu', 'dong', 'sih', 'kok', 'punya', 'lihat', 'coba', 'tes'
        ];

        const words = cleanMessage.split(/\s+/);
        const keywords = words.filter(w => !STOP_WORDS.includes(w) && w.length > 2);
        const smartQuery = keywords.join(" ");

        if (smartQuery && smartQuery !== cleanMessage) {
          console.log('🔍 Strategy B: Smart Search (Cleaned) ->', smartQuery);
          products = await searchProducts(smartQuery);
          if (products.length === 0 && faqs.length === 0) {
            faqs = await getFAQ(smartQuery);
          }
        }

        // Strategy C: Individual Keywords (if smart search fails)
        if (products.length === 0 && keywords.length > 0) {
          const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
          for (const keyword of sortedKeywords) {
            console.log('🔍 Strategy C: Keyword Fallback ->', keyword);
            const keywordResults = await searchProducts(keyword);
            if (keywordResults.length > 0) {
              products = keywordResults;
              break;
            }
          }
        }
      }

      // Fallback: Featured Products if absolutely nothing found
      if (products.length === 0) {
        console.log('⚠️ No products found. Fetching featured.');
        products = await getFeaturedProducts();
        products = products.slice(0, 3);
      }

      // 2. Prepare Context
      const productContext = products.map(p => {
        try {
          const safeParse = (val: any) => {
            if (Array.isArray(val)) return val;
            if (typeof val === 'string' && val.trim().startsWith('[')) {
              try { return JSON.parse(val); } catch { return []; }
            }
            return typeof val === 'string' ? [val] : [];
          };

          const colors = safeParse(p.colors).join(', ');
          const materials = safeParse(p.materials).join(', ');
          const variants = safeParse(p.variants || [])
            .map((v: any) => `${v.name || 'Varian'} (Stok: ${v.stock ?? 'Tanya Admin'})`)
            .join(', ');

          return `- ${p.name} (${p.category?.name || 'Hijab'})
  Harga: Rp${p.price?.toLocaleString('id-ID') || '0'}
  Stok Total: ${p.stock ?? 0}
  Featured: ${p.isFeatured ? "Ya (Best Seller)" : "Tidak"}
  Warna/Varian: ${variants || colors || "-"}
  Material: ${materials || "-"}
  Marketplace: ${p.marketplaceUrl || "-"}
  Deskripsi: ${p.description || "Tidak ada deskripsi"}`;
        } catch (err) {
          console.warn('Error formatting product context:', p.id, err);
          return `- ${p.name} (Data tidak lengkap)`;
        }
      }).join("\n\n");

      const faqContext = faqs.map(f =>
        `Tanya: ${f.question}\nJawab: ${f.answer}`
      ).join("\n\n");

      const systemPrompt = `
      Kamu adalah "Amoura", asisten AI virtual untuk toko hijab "De Amoura".
      Gunakan Bahasa Indonesia yang ramah, sopan, ceria, dan kekinian (gunakan emoji seperti 💕, ✨, 🌸 dalam porsi yang pas).

      INFORMASI PRODUK YANG DITEMUKAN (Gunakan data ini!):
      ${productContext || "Tidak ada produk yang spesifik cocok dengan keyword, tapi ini rekomendasi best seller kami."}

      INFORMASI FAQ (PERTANYAAN UMUM):
      ${faqContext || "Tidak ada info FAQ spesifik."}

      PANDUAN MENJAWAB (PENTING):
      1.  **FORMAT PRODUK**: Jika menjawab tentang produk, WAJIB gunakan format list berikut agar mudah dibaca:
          
          ✨ **[Nama Produk]**
          💰 Harga: [Harga]
          📦 Stok: [Jumlah Stok]
          🎨 Varian: [Warna/Varian]
          📝 [Deskripsi singkat 1 kalimat]

      2.  **JANGAN BERTELE-TELE**: Jawab langsung ke intinya. Tidak perlu basa-basi panjang.
      3.  **Gunakan Data FAQ**: Jika user bertanya soal pengiriman/cara bayar, gunakan info FAQ.
      4.  **Persuasif Tapi Singkat**: Akhiri dengan ajakan checkout yang simpel. "Yuk order sebelum kehabisan! 💕"

      CONTOH RESPON:
      "Ada Kak! Ini rekomendasinya:

      ✨ **Pasmina Silk Premier**
      💰 Harga: Rp45.000
      📦 Stok: 5 pcs
      🎨 Varian: Maroon, Navy, Hitam
      📝 Bahannya silk premium yang jatuh dan mewah banget.

      Yuk bungkus sekarang Kak! 🌸"

      Pesan User: "${userMessage}"
      `;

      // 3. Call Gemini REST API with Retry Strategy
      const callGemini = async (model: string, retries = 3): Promise<string> => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
        const payload = {
          contents: [{ parts: [{ text: systemPrompt }] }]
        };

        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            const response = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });

            if (response.ok) {
              const data = await response.json();
              return data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, aku tidak bisa menjawab sekarang.";
            }

            // If error is 503 or 429, we retry
            if (response.status === 503 || response.status === 429) {
              console.warn(`Attempt ${attempt} failed with ${response.status}. Retrying...`);
              if (attempt === retries) throw new Error(`Model ${model} overloaded after ${retries} attempts.`);
              // Exponential backoff: 1s, 2s, 4s...
              await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt - 1)));
              continue;
            }

            // For other errors, throw immediately
            const errText = await response.text();
            throw new Error(`Gemini API Error: ${response.status} - ${errText}`);

          } catch (e) {
            if (attempt === retries) throw e;
            console.warn(`Attempt ${attempt} error:`, e);
            await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt - 1)));
          }
        }
        throw new Error("Unable to generate response");
      };

      let text = "";
      try {
        // Try preferred model first
        console.log(`🤖 Invoking Gemini with ${GEMINI_MODEL}...`);
        text = await callGemini(GEMINI_MODEL, 2); // 2 retries on primary
      } catch (primaryError) {
        console.warn(`⚠️ Primary model ${GEMINI_MODEL} failed. Switching to fallback...`);
        // Fallback to gemini-1.5-flash (stable)
        try {
          const FALLBACK_MODEL = "gemini-1.5-flash";
          console.log(`🤖 Invoking Fallback ${FALLBACK_MODEL}...`);
          text = await callGemini(FALLBACK_MODEL, 2);
        } catch (fallbackError) {
          console.error("❌ All models failed.");
          return {
            text: "Waduh, server AI lagi sibuk banget nih (Overload). Tunggu sebentar lalu coba lagi ya! 🤯",
            products: products,
            categories: [],
            hasProducts: products.length > 0
          };
        }
      }

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
        text: "Maaf ya, aku lagi gangguan nih. Coba tanya lagi nanti ya! 💕 (System Error)",
        products: [],
        categories: [],
        hasProducts: false
      };
    }
  }
}