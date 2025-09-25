import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { inter } from "./theme";

export const metadata: Metadata = {
  title: "YouTube Insight Studio",
  description:
    "Analyze any YouTube video with AI-powered transcripts, structured summaries, analogies, and critical insights.",
  keywords: [
    "YouTube analysis",
    "video transcription",
    "Gemini AI",
    "structured summary",
    "SEO-friendly video insights",
    "multi-language video summary"
  ],
  openGraph: {
    title: "YouTube Insight Studio",
    description:
      "Transform any YouTube video into a structured, multi-language analysis with AI-generated summaries and critical insights.",
    url: "https://yotube.local",
    siteName: "YouTube Insight Studio",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
