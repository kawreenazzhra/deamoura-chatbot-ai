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
    console.log('🤖 Model Version:', GEMINI_MODEL);

    try {
      if (!API_KEY) {
        throw new Error("Gemini API Key is missing");
      }

      // 1. Search for relevant products and FAQs based on the message
      // Clean message: remove non-alphanumeric chars (keep spaces), lowercase, trim
      const cleanMessage = userMessage.toLowerCase().replace(/[^\w\s]/g, ' ').trim();

      // Initial Search (Exact phrase match attempts)
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

        // Remove stop words and extra spaces
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
          // Try searching for the longest word first (likely the most unique part of a product name)
          // e.g., "pashmina silk" -> "pashmina" (common) vs "silk" (material)
          const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);

          for (const keyword of sortedKeywords) {
            console.log('🔍 Strategy C: Keyword Fallback ->', keyword);
            const keywordResults = await searchProducts(keyword);
            if (keywordResults.length > 0) {
              products = keywordResults;
              break; // Found something!
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

      // 2. Prepare Context (Enhanced & Safe)
      const productContext = products.map(p => {
        try {
          // Helper to safe parse JSON-like fields
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
        const errText = await response.text();
        console.error(`❌ Gemini API Error (${response.status}):`, errText);
        console.error(`❌ Request Payload:`, JSON.stringify(payload, null, 2)); // Log payload for debugging

        if (response.status === 429 || response.status === 503) {
          console.warn("⚠️ Gemini Overloaded or Quota Exceeded");
          return {
            text: "Waduh, server AI lagi sibuk banget atau kuota habis nih (Overload/Rate Limit). Tunggu sebentar lalu coba lagi ya! 🤯\n\n(Error Code: 429/503)",
            products: products,
            categories: [],
            hasProducts: products.length > 0
          };
        }

        // Return a visible error message to the chatbot UI for easier debugging
        return {
          text: `Maaf, terjadi error pada sistem AI. (Status: ${response.status})\nDetail: ${errText.substring(0, 100)}...`,
          products: products,
          categories: [],
          hasProducts: products.length > 0
        }
        // throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
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