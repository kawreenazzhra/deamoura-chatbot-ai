// lib/gemini-service.ts
export class DeAmouraChatbot {
  private templates: { [key: string]: string[] } = {
    greeting: [
      "Haii! 👋 Aku asisten de.amoura. Ada yang bisa aku bantu? 💕",
      "Halo say! 😊 Selamat datang di de.amoura. Mau cari hijab yang bagus? ✨",
      "Haii! Welcome to de.amoura 💕 Ada yang bisa aku bantu kamu?"
    ],
    color_question: [
      "Untuk kombinasi warna {color} itu mantap pakai hijab warna-warna natural atau neutral! Coba lihat koleksi Pashmina atau Segi Empat kami yang cocok banget 💕",
      "Warna {color} itu bagus! Kami punya banyak pilihan hijab yang bisa match. Cek koleksi kami yuk! ✨",
      "Untuk outfit warna {color}, hijab warna cerah atau pastel bisa jadi pilihan. Lihat katalog lengkapnya di sini! 🤗"
    ],
    material_question: [
      "Material favorit kami ada Pashmina, Jersey, dan Voal yang nyaman banget! Mau lihat koleksinya? 💕",
      "Kami punya berbagai material pilihan - dari Pashmina premium hingga Jersey casual. Cek katalog yuk! ✨"
    ],
    style_question: [
      "Untuk gaya kasual, Jersey atau Voal cocok! Untuk formal, Pashmina atau Segi Empat elegant. Mau lihat koleksi lengkapnya? 💕",
      "Tergantung gaya kamu! Kami punya semua style dari casual hingga formal. Mari explore katalog kami! ✨"
    ],
    default: [
      "Mantap! Aku bantu kamu cari hijab yang pas. Ada pertanyaan lebih spesifik? 💕",
      "Oke! Coba lihat katalog lengkap kami atau tanya lebih detail yuk! ✨",
      "Sip! Semua produk kami punya kualitas terbaik. Mau tahu lebih banyak? 💕"
    ]
  };

  async generateResponse(userMessage: string): Promise<{
    text: string;
    products: any[];
    categories: any[];
    hasProducts: boolean;
  }> {
    console.log('\n🤖 generateResponse START - message:', userMessage.substring(0, 30));
    
    try {
      const lowerMessage = userMessage.toLowerCase();
      let responseText = '';

      // Determine intent and generate response
      if (lowerMessage.match(/^(halo|hi|hello|haii|assalamualaikum|pagi|siang|sore|malam)/i)) {
        responseText = this.randomTemplate('greeting');
      } else if (lowerMessage.match(/warna|color/i)) {
        const colorMatch = userMessage.match(/warna\s+(\w+)|color\s+(\w+)/i);
        const color = colorMatch ? (colorMatch[1] || colorMatch[2]) : '';
        if (color) {
          responseText = this.randomTemplate('color_question').replace('{color}', color);
        } else {
          responseText = this.randomTemplate('default');
        }
      } else if (lowerMessage.match(/material|kain|bahan/i)) {
        responseText = this.randomTemplate('material_question');
      } else if (lowerMessage.match(/gaya|style|kasual|formal|casual/i)) {
        responseText = this.randomTemplate('style_question');
      } else {
        responseText = this.randomTemplate('default');
      }

      responseText += `\n\nCek katalog lengkap kami atau tanya lagi ya! 💕`;

      console.log('✅ Response generated:', responseText.substring(0, 50) + '...');

      return {
        text: responseText,
        products: [],
        categories: [],
        hasProducts: false
      };
    } catch (error: any) {
      console.error('❌ Error:', error?.message);
      return {
        text: "Haii! 👋 Ada gangguan ni. Coba lagi ya! 💕",
        products: [],
        categories: [],
        hasProducts: false
      };
    }
  }

  private randomTemplate(key: string): string {
    const templates = this.templates[key] || this.templates.default;
    return templates[Math.floor(Math.random() * templates.length)];
  }
}