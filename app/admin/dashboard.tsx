"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ErrorLogEntry } from "../../lib/error-logger";
import { useLanguage } from "../providers";

export function AdminDashboard({ logs }: { logs: ErrorLogEntry[] }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const handleCopy = async (id: string) => {
    await navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">{t("adminHeading")}</h1>
          <p className="text-sm text-slate-600">{t("adminSubheading")}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSigningOut ? "..." : t("logoutCta")}
        </button>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">{t("diagnosticsLabel")}</h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {logs.length} logs
          </span>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">{t("timestamp")}</th>
                <th className="px-4 py-3">{t("context")}</th>
                <th className="px-4 py-3">{t("details")}</th>
                <th className="px-4 py-3">{t("referenceLabel")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                    {t("noErrors")}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="align-top">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs uppercase tracking-wide text-slate-500">{log.context}</td>
                    <td className="px-4 py-3">
                      <pre className="whitespace-pre-wrap break-words rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
                        {log.details}
                      </pre>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleCopy(log.id)}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-200 hover:text-brand-600"
                      >
                        {copiedId === log.id ? t("copied") : t("copyReference")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
