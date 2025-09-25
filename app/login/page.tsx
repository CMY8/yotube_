"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../providers";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const payload = await response.json();
        setError(payload?.message ?? t("loginError"));
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(t("loginError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-6 py-16">
      <form
        onSubmit={onSubmit}
        className="flex w-full max-w-md flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
      >
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-slate-900">{t("loginTitle")}</h1>
          <p className="text-sm text-slate-600">{t("loginDescription")}</p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            {t("passwordLabel")}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading ? "..." : t("loginCta")}
        </button>
      </form>
    </main>
  );
}
