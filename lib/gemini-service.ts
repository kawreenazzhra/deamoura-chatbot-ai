import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  searchProductsForChatbot, 
  searchCategoriesForChatbot 
} from './db';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export class DeAmouraChatbot {
  private model;
  
  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });
  }

  async generateResponse(userMessage: string) {
    const products = await searchProductsForChatbot(userMessage);
    const categories = await searchCategoriesForChatbot(userMessage);
    
    // Format materials dan colors jika ada
    const formatArray = (arr: any) => {
      if (!arr) return '-';
      if (Array.isArray(arr)) return arr.join(', ');
      if (typeof arr === 'string') {
        try {
          const parsed = JSON.parse(arr);
          return Array.isArray(parsed) ? parsed.join(', ') : parsed;
        } catch {
          return arr;
        }
      }
      return String(arr);
    };

    const productContext = products.length > 0 ? 
      `PRODUK TERKAIT YANG TERSEDIA:\n${products.map((p: any) => 
        `- ${p.name}: Rp ${p.price.toLocaleString()}, Stok: ${p.stock}, Material: ${formatArray(p.materials)}, Warna: ${formatArray(p.colors)}`
      ).join('\n')}\n\n` : '';

    const categoryContext = categories.length > 0 ?
      `KATEGORI TERKAIT:\n${categories.map((c: any) => 
        `- ${c.name}: ${c.description || 'Tidak ada deskripsi'}`
      ).join('\n')}\n\n` : '';

    const prompt = `
      Anda adalah customer service De.Amoura hijab fashion. 
      TARGET: Remaja & dewasa muda (15-35 tahun)
      STYLE: Ramah, casual, pakai emoji, bahasa gaul tapi sopan
      
      ${productContext}
      ${categoryContext}
      
      INSTRUKSI:
      1. Balas dengan friendly "Haii!" atau "Halo say!" 
      2. Jika ada produk terkait, sebutkan dan berikan detail lengkap
      3. Dorong untuk melihat katalog di website ini
      4. Gunakan emoji 💕✨🤗
      5. JANGAN buat-buat informasi produk
      6. Jika tidak ada produk terkait, tawarkan bantuan lain
      
      PERTANYAAN: "${userMessage}"
      
      BALASAN:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return {
        text: response.text(),
        products: products.slice(0, 3),
        categories: categories.slice(0, 2),
        hasProducts: products.length > 0
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        text: "Haii! Maaf ya, aku lagi gangguan nih. Yuk langsung lihat katalog produk kita atau chat lagi ya! 💕",
        products: [],
        categories: [],
        hasProducts: false
      };
    }
  }
}