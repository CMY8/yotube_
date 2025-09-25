"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLanguage } from "../providers";
import { LanguageToggle } from "./language-toggle";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AnalysisResponse {
  analysis: string;
  transcriptPreview: { text: string; start: number }[];
  referenceId: string;
}

interface FormValues {
  videoUrl: string;
  summaryLanguage: string;
}

const summaryLanguageOptions = [
  { value: "English", label: "English" },
  { value: "Español", label: "Español" },
  { value: "Français", label: "Français" },
  { value: "Deutsch", label: "Deutsch" }
];

export function LandingPage() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<{ message: string; referenceId?: string } | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      videoUrl: "",
      summaryLanguage: "English"
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: values.videoUrl,
          summaryLanguage: values.summaryLanguage
        })
      });

      if (!result.ok) {
        const payload = await result.json();
        setError({
          message: payload?.message ?? t("errorHeading"),
          referenceId: payload?.referenceId
        });
        return;
      }

      const payload: AnalysisResponse = await result.json();
      setResponse(payload);
    } catch (err) {
      setError({ message: t("errorHeading") });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-6 py-12">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-3xl flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
              {t("badgeLabel")}
            </span>
            <LanguageToggle />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">{t("appName")}</h1>
          <p className="text-lg text-slate-600 md:text-xl">{t("tagline")}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: t("featureTranscript"), description: t("featureTranscriptDescription") },
              { title: t("featureAnalogies"), description: t("featureAnalogiesDescription") },
              { title: t("featureCritical"), description: t("featureCriticalDescription") }
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-brand-700">{card.title}</p>
                <p className="mt-1 text-sm text-slate-500">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-brand-100 bg-white/80 p-6 shadow-xl backdrop-blur">
          <h2 className="text-lg font-semibold text-slate-800">{t("architectureTitle")}</h2>
          <p className="mt-2 text-sm text-slate-500">{t("architectureDescription")}</p>
        </div>
      </header>

      <section className="grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="videoUrl" className="text-sm font-semibold text-slate-700">
              {t("videoUrlLabel")}
            </label>
            <input
              id="videoUrl"
              type="url"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder={t("videoUrlPlaceholder")}
              {...form.register("videoUrl", { required: true })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="summaryLanguage" className="text-sm font-semibold text-slate-700">
              {t("summaryLanguageLabel")}
            </label>
            <select
              id="summaryLanguage"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              {...form.register("summaryLanguage", { required: true })}
            >
              {summaryLanguageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLoading ? t("analyzingState") : t("analyzeCta")}
          </button>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">{t("errorHeading")}</p>
              <p className="mt-1 text-red-600">{t("errorSubheading")}</p>
              {error.referenceId ? (
                <p className="mt-2 font-mono text-xs text-red-500">
                  {t("referenceLabel")}: {error.referenceId}
                </p>
              ) : null}
            </div>
          )}
        </form>

        <aside className="flex flex-col gap-6">
          <div className="rounded-3xl border border-brand-100 bg-gradient-to-br from-white via-white to-brand-50 p-6 shadow-lg">
            <h3 className="text-base font-semibold text-slate-800">{t("playbookTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("playbookBody")}</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• {t("playbookBulletOne")}</li>
              <li>• {t("playbookBulletTwo")}</li>
              <li>• {t("playbookBulletThree")}</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-base font-semibold text-slate-800">{t("monetizationTitle")}</h3>
            <p className="mt-2 text-sm text-slate-600">{t("monetizationBody")}</p>
          </div>
        </aside>
      </section>

      {response ? (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <article className="prose prose-slate max-w-none rounded-3xl border border-slate-200 bg-white p-8 shadow-lg prose-headings:text-slate-900 prose-p:text-slate-700">
            <h2>{t("resultTitle")}</h2>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{response.analysis}</ReactMarkdown>
          </article>

          <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800">{t("transcriptTitle")}</h3>
            <p className="text-sm text-slate-600">{t("transcriptPreviewDescription")}</p>
            <div className="flex flex-col gap-3">
              {response.transcriptPreview.map((item) => (
                <div key={`${item.start}-${item.text}`} className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">{formatTimestamp(item.start)}</p>
                  <p className="text-sm text-slate-700">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              {t("referenceLabel")}: {response.referenceId}
            </p>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function formatTimestamp(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
}
