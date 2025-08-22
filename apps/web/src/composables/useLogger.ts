import { isFrontError } from "@/utils/error";

class GlobalLogger {
  log(message: string, context: Record<string, unknown>) {
    console.log(message, context);
  }

  error(error: unknown) {
    if (isFrontError(error)) {
      console.error(error.message, error.context);
    } else {
      console.error(error);
    }
  }
}

export const Logger = new GlobalLogger();
