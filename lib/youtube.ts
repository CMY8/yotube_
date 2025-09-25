import { YoutubeTranscript } from "youtube-transcript";

export type TranscriptSegment = {
  text: string;
  offset: number;
};

export async function fetchTranscriptSegments(videoId: string, preferredLanguage?: string) {
  const languages = [preferredLanguage, "en", "es", "fr", "de"].filter(Boolean) as string[];

  for (const lang of languages) {
    try {
      const segments = await YoutubeTranscript.fetchTranscript(videoId, { lang });
      if (segments?.length) {
        return segments.map((segment) => ({
          text: segment.text,
          offset: segment.offset / 1000
        }));
      }
    } catch (error) {
      // Continue to next language
    }
  }

  throw new Error("Transcript not available in the requested languages.");
}

export function extractVideoId(url: string): string {
  const parsed = new URL(url);
  if (parsed.hostname.includes("youtube.com")) {
    const v = parsed.searchParams.get("v");
    if (!v) {
      throw new Error("Invalid YouTube URL: missing video identifier.");
    }
    return v;
  }

  if (parsed.hostname === "youtu.be") {
    const id = parsed.pathname.replace("/", "");
    if (!id) {
      throw new Error("Invalid YouTube short link.");
    }
    return id;
  }

  throw new Error("Only YouTube URLs are supported.");
}
