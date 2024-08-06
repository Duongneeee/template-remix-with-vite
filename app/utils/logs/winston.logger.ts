import ecsFormat from "@elastic/ecs-winston-format";
import winston, { format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

/**
 * Winston Logging Levels:
 *
 * 0: error
 * 1: warn
 * 2: info
 * 3: verbose
 * 4: debug
 * 5: silly
 *
 */
const { combine, timestamp, json, prettyPrint, errors, metadata } = format;

const logFormat = ecsFormat({ convertReqRes: true });

const fileLogFormat = combine(errors({ stack: true }), timestamp(), json());

const requestInfoLogger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new DailyRotateFile({
      filename: "logs/server/request-info-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "7d",
      format: fileLogFormat,
      level: "info",
    }),
  ],
});

const errorLogger = winston.createLogger({
  level: "error",
  format: logFormat,
  transports: [
    new DailyRotateFile({
      filename: "logs/server/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "7d",
      format: fileLogFormat,
      level: "error",
    }),
  ],
});

const errorLoggerClient = winston.createLogger({
  level: "error",
  format: logFormat,
  transports: [
    new DailyRotateFile({
      filename: "logs/client/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "10m",
      maxFiles: "7d",
      format: fileLogFormat,
      level: "error",
    }),
  ],
});

function logRequestInfo(request: Request, responseStatusCode: number, duration: number) {
  // Extract path and params from URL
  const url = new URL(request.url);
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  // Get the client's IP address
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]
                || request.headers.get('client-ip')
                || request.headers.get('x-real-ip')
                || request.headers.get('cf-connecting-ip');
                
  requestInfoLogger.info(`Request handled`, {
    event: {
      duration: duration * 1000000 // ECS yêu cầu thời gian xử lý request bằng nano giây
    },
    http: {
      request: {
        method: request.method,
        body: request.body
      },
      response: {
        status_code: responseStatusCode,
      }
    },
    url: {
      url: request.url,
      path: pathname,
      query: searchParams
    },
    user_agent: {
      original: request.headers.get("user-agent")
    },
    client: {
      ip: clientIp
    }
  });
}

function logError(message: string, payload?: any) {
  errorLogger.error(message, { err: payload.err });
}

function logErrorClient(message: string, payload?: any) {
  errorLoggerClient.error(message, { err: payload.err });
}

export { logRequestInfo, logError, logErrorClient };
