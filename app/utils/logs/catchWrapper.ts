import { LoaderFunctionArgs } from "@remix-run/node";
import {
  HttpResponseError,
  ShopifyError,
  InvalidOAuthError,
  HttpThrottlingError,
} from "@shopify/shopify-api";
import { logError, logRequestInfo } from "./winston.logger";

export function catchWrapper<
  T extends (args: LoaderFunctionArgs) => Promise<any>,
>(fn: T): (args: LoaderFunctionArgs) => Promise<ReturnType<T>> {
  return async function wrappedFunction({
    request,
    params,
    context
  }: LoaderFunctionArgs): Promise<ReturnType<T> | any> {
    try {
      logRequestInfo(`${request}: ${params} : ${context}`);
      return await fn({ request, params, context });
    } catch (error) {
      if (error instanceof HttpResponseError) {
        logError(error.message, { err: new Error(error.message) });
      } else if (error instanceof ShopifyError) {
        logError(error.message, { err: new Error(error.message) });
      } else if (error instanceof InvalidOAuthError) {
        logError(error.message, { err: new Error(error.message) });
      } else if (error instanceof HttpThrottlingError) {
        logError(error.message, { err: new Error(error.message) });
      } else {
        logError("Internal Server Error", {
          err: "Internal Server Error, please try again",
        });
      }
      return null;
    }
  };
}