import { Link, Outlet, useRouteLoaderData } from "@remix-run/react"
import { AppProvider } from "@shopify/shopify-app-remix/react"

const AppProviderComponent = () =>{
const dataRoot:any = useRouteLoaderData("root");
    return (
      <AppProvider isEmbeddedApp apiKey={dataRoot.apiKey}>
      <ui-nav-menu>
        <Link
          to="/app"
          rel="home"
          prefetch="intent"
        >
          Home
        </Link>
        <Link
          to="/app/pixel-manager"
          prefetch="intent"
        >
          Pixel Manager
        </Link>
        <Link
          to="/app/analytics"
          prefetch="intent"
        >
          Analytics
        </Link>
        <Link
          to="/app/product-feed"
          prefetch="intent"
        >
            Product Feed
        </Link>
        <Link
          to="/app/help"
          prefetch="intent"
        >
          Help
        </Link>
      </ui-nav-menu>
      <Outlet />
    </AppProvider>
    )
}

export default AppProviderComponent