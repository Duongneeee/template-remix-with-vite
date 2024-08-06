import { LinksFunction, LoaderFunctionArgs, json} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
  useMatches,
} from "@remix-run/react";
import styles from "./tailwind.css?url";
import common from './css/common.css?url';
import { authenticate } from "./shopify.server";
import { IProfileShopUpdate } from "./backend/types/profileShop.type";
import { ComponentType, lazy, Suspense } from "react";
import { getProfileShopOnCache } from "./backend/redis/profile.service";

const CrispChat = lazy(()=> import('./utils/CrispChat.js').then(module => module as unknown as { default: ComponentType<any> }))

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: common },
  // { rel: "preconnect", href: "https://otlp-http-production.shopifysvc.com" },
  // { rel: "preconnect", href: "https://destinations.shopifysvc.com" },
  // { rel: "preconnect", href: "https://monorail-edge.shopifysvc.com" },
  // { rel: "prefetch", href: "https://client.crisp.chat" },  
  { rel: "preconnect", href: "https://cdn.shopify.com/"}, // co change
  // { rel: "prefetch", href: "https://admin.shopify.com" },

];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  
  const { session } = await authenticate.admin(request);
  const url = new URL(request.url);

  const { shop }: any = session;

  let shopInfo:IProfileShopUpdate = await getProfileShopOnCache(shop);

  const country = request.headers.get('cf-ipcountry')
  const ip  = request.headers.get('cf-connecting-ip')
  const pathname = url.pathname
  
  return json({
    apiKey: process.env.SHOPIFY_API_KEY || "",
    shop: shop || "null",
    shopName: shopInfo?.shopName || shop,
    emailShop: shopInfo?.email || "",
    planShopify: shopInfo?.planShopify || "",
    country,
    ip,
    url,
    pathname,
    // isBlackList: shopInfo?.isBlackList
  });
};

function App() {
  
  const { shop, shopName, emailShop, planShopify } = useLoaderData<typeof loader>();

  const matches = useMatches();

  const includeScripts = matches.some(
    (match:any) => match.handle?.hydrate
  );

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet/>
        <Suspense>
          <CrispChat shop={shop} planShopify={planShopify} shopName={shopName} emailShop={emailShop}/>
        </Suspense>
        {/* <ScrollRestoration /> */}
        {includeScripts ? <Scripts /> : null}
      </body>
    </html>
  );
}
export default App;