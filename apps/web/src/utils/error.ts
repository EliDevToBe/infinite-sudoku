export class FrontError extends Error {
  constructor(
    message: string,
    public context: Record<string, unknown>,
  ) {
    super(`${message}`);
    this.name = "FrontError";
  }
}

// Wrapper function that logs and throws
export const throwFrontError = (
  message: string,
  contextOpts: Record<string, unknown>,
) => {
  const error = new FrontError(message, {
    context: contextOpts,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  });

  throw error;
};

export const isFrontError = (error: unknown): error is FrontError => {
  return error instanceof FrontError && typeof error.message === "string";
};
