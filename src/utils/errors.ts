/* eslint-disable @typescript-eslint/no-explicit-any */
export class ApplicationError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, any>;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: Record<string, any>,
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

export class ExternalAIError extends ApplicationError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, "EXTERNAL_AI_ERROR", 502, details);
  }
}

export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

export function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function Err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export class ErrorCollector {
  errors: Error[] = [];

  add(error: Error): void {
    this.errors.push(error);
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getErrors(): Error[] {
    return [...this.errors];
  }

  getMessages(): string[] {
    return this.errors.map(e => e.message);
  }
}

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export class CircuitBreaker {
  failureThreshold: number;
  timeoutMs: number;
  failureCount: number = 0;
  state: CircuitState = "CLOSED";
  lastFailureTime: number | null = null;

  constructor(failureThreshold: number = 3, timeoutMs: number = 10000) {
    this.failureThreshold = failureThreshold;
    this.timeoutMs = timeoutMs;
  }

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (this.lastFailureTime && Date.now() - this.lastFailureTime > this.timeoutMs) {
        this.state = "HALF_OPEN";
      } else {
        throw new ApplicationError("System overloaded, please try again later.", "CIRCUIT_OPEN");
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (e) {
      this.onFailure();
      throw e;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
    }
  }
}
