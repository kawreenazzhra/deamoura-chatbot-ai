import { gemini } from "@/app/lib/gemini";
import { streamText, UIMessage } from "ai";
import { systemPrompt } from "@/app/lib/systemPrompt";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  console.log("API Key present:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  console.log("API Key length:", process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length);

  if (!messages || !Array.isArray(messages)) {
    return new Response("Invalid messages", { status: 400 });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("❌ Missing GOOGLE_GENERATIVE_AI_API_KEY");
    return new Response("Gemini API key not configured.", { status: 500 });
  }

  const result = await streamText({
    model: gemini("gemini-1.5-pro"),
    system: systemPrompt,
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content as string,
    })),
  });

  return result.toUIMessageStreamResponse();
}
