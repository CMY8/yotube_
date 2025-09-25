import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-pro";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export async function generateAnalysis({
  transcript,
  videoUrl,
  summaryLanguage
}: {
  transcript: string;
  videoUrl: string;
  summaryLanguage: string;
}): Promise<string> {
  const apiKey = requireEnv("GEMINI_API_KEY");
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: MODEL_NAME });

  const prompt = buildPrompt({ transcript, videoUrl, summaryLanguage });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.6,
      topP: 0.9,
      topK: 40
    }
  });

  const text = result.response.text();
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}

function buildPrompt({
  transcript,
  videoUrl,
  summaryLanguage
}: {
  transcript: string;
  videoUrl: string;
  summaryLanguage: string;
}): string {
  return `You are an expert video analyst. Analyze the YouTube video at ${videoUrl}.

Follow these steps:
1. Accurately summarize the full transcript with key timestamps.
2. Identify the core message, main concepts, supporting arguments, and evidence/data.
3. Extract essential knowledge points and present them as a structured summary between 300-600 words unless a different length is required.
4. For each major point, add 1-2 clear analogies that translate complex ideas into relatable scenarios.
5. Provide a critical analysis section that includes:
   - Pros and cons.
   - Ethical, educational, and practical perspectives.
   - Public sentiment based on general observable trends.
   - Any science or data-backed references that apply.
6. When relevant, deliver a customizable step-by-step actionable framework derived from the content.
7. Finish with memory aids (mnemonics or anchors) and conclude with a final verdict metric such as an efficiency score or key takeaway index.
8. Output must be formatted with Markdown headings and subheadings, optimized for SEO readability, and spoiler-free for entertainment media.

Respond in ${summaryLanguage}.

--- TRANSCRIPT START ---
${transcript}
--- TRANSCRIPT END ---`;
}
