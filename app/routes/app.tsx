import type { HeadersFunction } from "@remix-run/node";
import { Link, Outlet, useRouteError, useRouteLoaderData } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { useEffect } from "react";
import logLCP from "~/utils/WebVitals";
export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const handle = { hydrate: true };

export default function App() {
const dataRoot:any = useRouteLoaderData("root");
useEffect(() => {
  logLCP({
    shop:dataRoot.shop,
    planShopify: dataRoot.planShopify,
    country:dataRoot.country,
    ip:dataRoot.ip,
    url:dataRoot.url,
    pathname:dataRoot.pathname})
}, []);
  return (
    <>
    <AppProvider isEmbeddedApp apiKey={dataRoot.apiKey}>
      <NavMenu>
        <Link
          to="/app"
          rel="home"
          prefetch="intent"
        >
          Home
        </Link>
        <Link
          to="/app/pixel-manager"
        >
          Pixel Manager
        </Link>
        <Link
          to="/app/analytics"
        >
          Analytics
        </Link>
        <Link
          to="/app/product-feed"
        >
            Product Feed
        </Link>
        <Link
          to="/app/help"
        >
          Help
        </Link>
      </NavMenu>
      <Outlet />
    </AppProvider>
    </>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
