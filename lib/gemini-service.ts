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
      const cleanMessage = userMessage.toLowerCase().replace(/[^\w\s]/g, '');
      const keywords = cleanMessage.split(" ").filter(w => w.length > 2);

      let products: any[] = [];
      let faqs: any[] = [];

      if (keywords.length > 0) {
        // Search Products
        products = await searchProducts(cleanMessage);
        // Search FAQs
        faqs = await getFAQ(cleanMessage);
      }

      // Fallback
      if (products.length === 0) {
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