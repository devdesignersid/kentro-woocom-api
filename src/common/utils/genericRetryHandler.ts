import { type Observable, retry, timer } from 'rxjs';

/**
 * Represents the configuration options for a generic retry handler.
 */
export interface IGenericRetryHandler {
  /** The maximum delay (in milliseconds) for retrying. */
  maxDelay?: number;
  /** The initial delay (in milliseconds) before the first retry attempt. */
  initialDelay?: number;
  /** The retry strategy to use. Currently only 'exponential-backoff' is supported. */
  retryStrategy?: RetryStrategy;
  /** The maximum number of retry attempts. */
  maxRetryAttempts?: number;
  /** An array of HTTP status codes that should trigger a retry when encountered. */
  includedStatusCodes?: number[];
}

/** Represents the available retry strategies. */
export type RetryStrategy = 'exponential-backoff';

/**
 * Checks if an error is a transient error based on the provided status codes.
 *
 * @param error - The error object to check.
 * @param allowedStatusCodes - An array of HTTP status codes that are considered transient errors.
 * @returns `true` if the error is a transient error, otherwise `false`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTransientError = (error: any, allowedStatusCodes: number[]): boolean =>
  // Check if the error's status code is not in the allowedStatusCodes array
  Boolean(
    error &&
      error.response.status &&
      !allowedStatusCodes.includes(error.response.status as number),
  ); // Return false for non-transient errors

/**
 * Calculates the retry interval based on the response headers, retry count, initial delay, and max delay.
 *
 * @param responseHeaders - The response headers from the HTTP request.
 * @param retryCount - The current retry attempt count.
 * @param initialDelay - The initial delay before the first retry.
 * @param maxDelay - The maximum delay for retrying.
 * @returns The calculated retry interval in milliseconds.
 */
const getRetryInterval = (
  responseHeaders: Headers,
  retryCount: number,
  initialDelay: number,
  maxDelay: number,
): number => {
  // Check if the response contains a "retry-after" header and use it as the retry interval
  const retryAfter = responseHeaders.get('RETRY_AFTER_HEADER');

  if (retryAfter) {
    const parsedRetryAfter = Number.parseInt(retryAfter, 10);

    if (!Number.isNaN(parsedRetryAfter)) {
      return Math.min(parsedRetryAfter * 1000, maxDelay);
    }
  }

  // If there is no "retry-after" header, use exponential back-off
  return Math.min(initialDelay * Math.pow(2, retryCount), maxDelay);
};

/**
 * Creates a generic retry handler for Observables based on the provided configuration options.
 *
 * @param config - The configuration options for the retry handler.
 * @returns A function that can be used as an operator in an Observable pipeline.
 */
export function genericRetryHandler(
  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  config: IGenericRetryHandler = {
    initialDelay: 500,
    maxDelay: 15_000,
    maxRetryAttempts: 3,
    includedStatusCodes: [408, 429, 500, 502, 503, 504, 522, 524],
  },
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (source: Observable<any>) =>
    source.pipe(
      retry({
        count: config.maxRetryAttempts,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delay: (error: any, retryCount: number) => {
          console.error(`Retrying ${retryCount}`);

          if (
            config.includedStatusCodes &&
            isTransientError(error, config.includedStatusCodes)
          ) {
            throw error;
          }

          return timer(
            getRetryInterval(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              error.response.headers,
              retryCount,
              config.initialDelay as number,
              config.maxDelay as number,
            ),
          );
        },
      }),
    );
}
