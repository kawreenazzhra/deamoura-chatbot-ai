const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
    try {
        console.log("Testing Key...");
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Error: GEMINI_API_KEY not found in .env");
            return;
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using gemini-1.5-flash as requested by user's prompt as "Anti-Gagal" or "gemini-flash-latest"
        // The prompt says "gemini-flash-latest" (bukan "gemini-1.5-flash" standart).
        // Let's try "gemini-flash-latest" first as per instructions.
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        console.log("Sending request to Gemini...");
        const result = await model.generateContent("Halo, tes 123");
        const response = await result.response;
        console.log("Sukses! Balasan:", response.text());
    } catch (e) {
        console.error("Gagal:", e.message);
        if (e.message.includes('404') || e.message.includes('not supported')) {
            console.log("Tip: Try a different model name.");
        }
    }
}
test();
