import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { deleteUserData } from "~/backend/services/userData.service";

export const action = async ({ request }: ActionFunctionArgs) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { topic, shop, session, admin } = await authenticate.webhook(
    request
  );
  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }
  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        deleteUserData(shop);
      }
      break;
    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
