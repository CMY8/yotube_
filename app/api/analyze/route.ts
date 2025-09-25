import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { analyzeRequestSchema } from "../../../lib/validation";
import { extractVideoId, fetchTranscriptSegments } from "../../../lib/youtube";
import { generateAnalysis } from "../../../lib/gemini";
import { createErrorResponse } from "../../../lib/http";

const languageCodeMap: Record<string, string> = {
  English: "en",
  Español: "es",
  Français: "fr",
  Deutsch: "de"
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = analyzeRequestSchema.parse(body);

    const videoId = extractVideoId(input.url);
    const preferredLanguage = languageCodeMap[input.summaryLanguage] ?? "en";
    const segments = await fetchTranscriptSegments(videoId, preferredLanguage);

    const transcript = segments
      .map((segment) => `[${formatTimestamp(segment.offset)}] ${segment.text}`)
      .join("\n");

    const analysis = await generateAnalysis({
      transcript,
      videoUrl: input.url,
      summaryLanguage: input.summaryLanguage
    });

    const referenceId = crypto.randomUUID();

    return NextResponse.json({
      analysis,
      transcriptPreview: segments.slice(0, 6).map((segment) => ({
        text: segment.text,
        start: segment.offset
      })),
      referenceId
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
    }

    if (error instanceof Error && error.message.includes("Transcript")) {
      return createErrorResponse({
        error,
        context: "analyze-transcript",
        status: 502
      });
    }

    if (error instanceof ZodError) {
      const firstIssue = error.issues[0]?.message ?? "Invalid request.";
      return NextResponse.json({ message: firstIssue }, { status: 400 });
    }

    return createErrorResponse({
      error,
      context: "analyze-generic"
    });
  }
}

function formatTimestamp(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
