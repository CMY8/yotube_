"use client";

import { supportedLanguages, useLanguage } from "../providers";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
      {supportedLanguages.map((item) => {
        const isActive = item.code === language;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            className={`rounded-full px-2 py-1 text-xs font-medium transition ${
              isActive ? "bg-brand-500 text-white" : "text-slate-600 hover:text-brand-600"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
