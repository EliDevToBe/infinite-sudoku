class FrontError extends Error {
  constructor(
    message: string,
    public context: {
      code?: number;
      status?: string;
      [key: string]: unknown;
    } = {},
  ) {
    super(message);
    this.name = "FrontError";
  }
}

// Wrapper function that logs and throws
export const throwFrontError = (
  message: string,
  contextOpts: { context: string | Record<string, unknown>; error: Error },
) => {
  const error = new FrontError(message, {
    context: contextOpts,
    url: window.location.href,
  });

  // Log the error with context
  console.error(`❌ ${message}`, {
    error: error.message,
    context: contextOpts,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  throw error;
};
