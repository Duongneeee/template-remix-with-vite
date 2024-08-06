import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getListActivePixelByShopService } from "~/backend/services/cApiConfig.service";
import { sentryLogger, LOG_LEVELS } from "~/utils/logger";
import { cors } from "remix-utils/cors";
import type { ICApi_MetaPixelRequest } from "~/backend/types/cApiConfig.type";
import { extractNumbersFromStringArray } from "~/utils/transform";
import { getParamerersByShopService } from "~/backend/services/parameters.service";
export async function loader({
  request,
  params,
}: ActionFunctionArgs): Promise<Response> {
  try {
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop") || "";
    const pixels = (await getListActivePixelByShopService(shop)) as any;
    const currentTimestamp = new Date().getTime();
    const params = (await getParamerersByShopService(shop)) as any;
    const lstParams = params && params.result.map((param: any) => ({
      type: param.type,
      value: param.value
    }))
    const lstPixel =
      pixels.result &&
      pixels.result.map((pixel: ICApi_MetaPixelRequest) => {
        const eventConfig = JSON.parse(pixel.lstEvents);
        const activeEvents = Object.keys(eventConfig)
          .filter((event) => eventConfig[event].isActive)
          .join(",");
        const events = eventConfig;
        const collections =
          pixel.lstCollects &&
          extractNumbersFromStringArray(pixel.lstCollects?.split(","));
        return {
          ...pixel,
          lstEvents: activeEvents,
          lstCollects: collections
        };
      });
    let userIp = await getUserIp(request.headers);
    const response = json({
      Pixel: lstPixel,
      Parameters: lstParams,
      Now: currentTimestamp,
      UserIp: userIp,
    });

    return await cors(request, response);
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in createEventDataService ", {
      additionalInfo: error,
    });
    return new Response(`Internal Server Error ${error}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

async function getUserIp(headers: Headers) {
  const ipHeaders = ['x-forwarded-for', 'cf-connecting-ip'];
  for (const [key, value] of headers.entries()) {
    if (ipHeaders.includes(key.toLowerCase())) {
      if (key.toLowerCase() === 'x-forwarded-for') {
        const ip = value.split(',')[0].trim();
        if (ip !== 'undefined')
          return ip;
      } else if (key.toLowerCase() === 'cf-connecting-ip') {
        if (value !== 'undefined')
          return value;
      }
    }
  }
}