import { z } from "zod";

export const analyzeRequestSchema = z.object({
  url: z.string().url("A valid YouTube URL is required."),
  summaryLanguage: z.string().min(2).max(64)
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
