"use client";

import { createContext, useContext, useMemo, useState } from "react";

type LanguageKey = "en" | "es";

type TranslationDictionary = Record<LanguageKey, Record<string, string>>;

const translations: TranslationDictionary = {
  en: {
    appName: "YouTube Insight Studio",
    tagline: "AI-powered insights, transcripts, and strategic takeaways for any video.",
    badgeLabel: "Gemini-powered intelligence",
    videoUrlLabel: "YouTube video link",
    videoUrlPlaceholder: "https://www.youtube.com/watch?v=...",
    summaryLanguageLabel: "Summary language",
    interfaceLanguageLabel: "Interface language",
    analyzeCta: "Analyze video",
    analyzingState: "Analyzing...",
    resultTitle: "Structured analysis",
    transcriptTitle: "Transcript preview",
    transcriptPreviewDescription:
      "Previewing the first highlights to verify language quality. Admins can review full logs from the control center.",
    featureTranscript: "Transcripts with timestamps",
    featureAnalogies: "Strategic analogies",
    featureCritical: "Critical perspectives",
    featureTranscriptDescription: "High-fidelity captions with precise markers ready for knowledge bases and content repurposing.",
    featureAnalogiesDescription: "Turn dense explanations into relatable narratives for faster comprehension.",
    featureCriticalDescription: "Surface nuanced debates, trade-offs, and data-backed signals automatically.",
    architectureTitle: "Launch-ready architecture",
    architectureDescription:
      "Designed for single-video processing, multilingual output, secure admin diagnostics, and future monetization hooks like subscriptions or premium analyses.",
    playbookTitle: "Playbook-ready outputs",
    playbookBody:
      "Each analysis comes with structured sections, analogies, critical perspectives, and optional action frameworks you can adapt to consulting, coaching, or course creation.",
    playbookBulletOne: "Markdown-formatted summaries optimized for SEO landing pages.",
    playbookBulletTwo: "Automated memory anchors and mnemonic cues for faster retention.",
    playbookBulletThree: "Ethical and practical commentary backed by publicly available data.",
    monetizationTitle: "Monetization ready",
    monetizationBody:
      "Future modules can introduce credit-based billing, workspace collaboration, or premium export formats. The architecture already isolates the AI layer to support tiered offerings.",
    loginTitle: "Admin access",
    loginDescription: "Sign in to review diagnostics and error logs.",
    passwordLabel: "Admin passphrase",
    loginCta: "Sign in",
    logoutCta: "Sign out",
    loginError: "Unable to sign in",
    errorHeading: "We couldn't finish this analysis",
    errorSubheading: "Please try again in a few minutes. Share the reference code with support if the problem continues.",
    referenceLabel: "Reference",
    actionableFramework: "Actionable framework",
    adminHeading: "Admin control center",
    adminSubheading: "Monitor analysis diagnostics and review recent errors with full stack traces.",
    diagnosticsLabel: "Diagnostics",
    timestamp: "Timestamp",
    context: "Context",
    details: "Details",
    noErrors: "No errors recorded yet.",
    copyReference: "Copy reference",
    copied: "Copied!"
  },
  es: {
    appName: "YouTube Insight Studio",
    tagline: "Ideas y resúmenes estratégicos generados por IA para cualquier video.",
    badgeLabel: "Inteligencia con Gemini",
    videoUrlLabel: "Enlace del video de YouTube",
    videoUrlPlaceholder: "https://www.youtube.com/watch?v=...",
    summaryLanguageLabel: "Idioma del resumen",
    interfaceLanguageLabel: "Idioma de la interfaz",
    analyzeCta: "Analizar video",
    analyzingState: "Analizando...",
    resultTitle: "Análisis estructurado",
    transcriptTitle: "Vista previa de la transcripción",
    transcriptPreviewDescription:
      "Vista previa de los primeros fragmentos para validar la calidad del idioma. Los administradores pueden revisar los registros completos en el panel de control.",
    featureTranscript: "Transcripciones con marcas de tiempo",
    featureAnalogies: "Analogías estratégicas",
    featureCritical: "Perspectivas críticas",
    featureTranscriptDescription: "Subtítulos de alta fidelidad con marcadores precisos listos para repositorios de conocimiento.",
    featureAnalogiesDescription: "Convierte explicaciones densas en relatos cotidianos para una comprensión más rápida.",
    featureCriticalDescription: "Destaca debates, compensaciones y señales con respaldo de datos automáticamente.",
    architectureTitle: "Arquitectura lista para lanzar",
    architectureDescription:
      "Diseñada para procesar un solo video, ofrecer salida multilingüe, diagnósticos seguros para administradores y futuras opciones de monetización como suscripciones o análisis premium.",
    playbookTitle: "Entregables listos para playbooks",
    playbookBody:
      "Cada análisis incluye secciones estructuradas, analogías, perspectivas críticas y marcos accionables que puedes adaptar a consultoría, coaching o cursos.",
    playbookBulletOne: "Resúmenes en Markdown optimizados para páginas SEO.",
    playbookBulletTwo: "Anclas de memoria y mnemotecnias automatizadas para retención acelerada.",
    playbookBulletThree: "Comentario ético y práctico respaldado por datos disponibles públicamente.",
    monetizationTitle: "Listo para monetizar",
    monetizationBody:
      "Los módulos futuros pueden añadir cobro por créditos, colaboración en espacios de trabajo o formatos de exportación premium. La arquitectura ya separa la capa de IA para permitir planes escalonados.",
    loginTitle: "Acceso de administrador",
    loginDescription: "Inicia sesión para revisar diagnósticos y errores.",
    passwordLabel: "Frase de acceso",
    loginCta: "Iniciar sesión",
    logoutCta: "Cerrar sesión",
    loginError: "No se pudo iniciar sesión",
    errorHeading: "No pudimos completar el análisis",
    errorSubheading: "Inténtalo de nuevo en unos minutos. Comparte el código de referencia si el problema continúa.",
    referenceLabel: "Referencia",
    actionableFramework: "Marco accionable",
    adminHeading: "Centro de control administrativo",
    adminSubheading: "Supervisa diagnósticos y revisa errores recientes con detalles completos.",
    diagnosticsLabel: "Diagnósticos",
    timestamp: "Fecha",
    context: "Contexto",
    details: "Detalles",
    noErrors: "Aún no hay errores registrados.",
    copyReference: "Copiar referencia",
    copied: "¡Copiado!"
  }
};

type LanguageContextValue = {
  language: LanguageKey;
  setLanguage: (value: LanguageKey) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageKey>("en");

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      setLanguage,
      t: (key: string) => translations[language][key] ?? key
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within Providers");
  }
  return context;
}

export const supportedLanguages: { code: LanguageKey; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" }
];
