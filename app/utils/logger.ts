// import * as Sentry from "@sentry/browser";

// Assuming you have LOG_LEVELS defined like this:
export const LOG_LEVELS = {
  INFO: "info",
  WARN: "warn",
  ERROR: "error",
} as const;

type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS];

// Assuming you have Sentry configured with Severity
type SentrySeverity = "fatal" | "error" | "warning" | "info" | "debug" | "log";

let currentLogLevel: LogLevel = LOG_LEVELS.INFO;

// Function to log messages to both console and Sentry
export function sentryLogger(level: LogLevel, message: string, extraData: any = null) {
  if (
    Object.values(LOG_LEVELS).indexOf(level) >=
    Object.values(LOG_LEVELS).indexOf(currentLogLevel)
  ) {
    // Log to console
    (console as any)[level](message + extraData);

    // Log to Sentry
    // const sentryLevel: SentrySeverity | undefined =
    //   level === LOG_LEVELS.ERROR ? "error" : undefined;
    // Sentry.captureMessage(message, { level: sentryLevel, extra: extraData });
  }
}

//   sentryLogger(LOG_LEVELS.INFO, 'This is an informational message');
//   sentryLogger(LOG_LEVELS.WARN, 'This is a warning');
//   sentryLogger(LOG_LEVELS.ERROR, 'This is an error', { additionalInfo: 'some data' });
