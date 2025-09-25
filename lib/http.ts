import { NextResponse } from "next/server";
import { logError } from "./error-logger";

export function createErrorResponse({
  error,
  context,
  status = 500
}: {
  error: unknown;
  context: string;
  status?: number;
}) {
  const referenceId = logError(context, error);
  return NextResponse.json(
    {
      message: "An unexpected error occurred while processing this request.",
      referenceId
    },
    { status }
  );
}
