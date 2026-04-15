type NextLikeError = {
  digest?: string;
};

export function rethrowIfNextControlFlow(error: unknown) {
  if (!error || typeof error !== "object") {
    return;
  }

  const digest = (error as NextLikeError).digest;

  if (digest === "DYNAMIC_SERVER_USAGE" || digest?.startsWith("NEXT_REDIRECT")) {
    throw error;
  }
}
