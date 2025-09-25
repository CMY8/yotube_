import crypto from "crypto";

export type ErrorLogEntry = {
  id: string;
  createdAt: string;
  context: string;
  details: string;
};

const MAX_LOGS = 100;
const store: ErrorLogEntry[] = [];

export function logError(context: string, error: unknown): string {
  const id = crypto.randomUUID();
  const details =
    error instanceof Error
      ? `${error.message}\n${error.stack ?? ""}`
      : typeof error === "string"
        ? error
        : JSON.stringify(error, null, 2);
  store.unshift({
    id,
    createdAt: new Date().toISOString(),
    context,
    details
  });

  if (store.length > MAX_LOGS) {
    store.length = MAX_LOGS;
  }

  return id;
}

export function getErrorLogs(): ErrorLogEntry[] {
  return store;
}
