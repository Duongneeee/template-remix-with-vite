import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { cors } from "remix-utils/cors";
import { pushEventsDataToDataBaseService } from "~/backend/services/eventData.service";
import { IEventDataCreate } from "~/backend/types/eventData.type";
import { pushEventsDataToFBService } from "~/backend/external_apis/facebook/facebook.service";

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response> {
  try {
    const dataJson = await request.json();
    const pixels = dataJson.listPixels || [];
    delete dataJson.listPixels;

    var body: IEventDataCreate[] = [];

    for (let i = 0; i < pixels.length; i++) {
      
      body.push({
        ...dataJson,
        pixelId: pixels[i].pixelId,
        data: JSON.stringify(dataJson.data),
        eventTime: String(dataJson.eventTime),
        platform: pixels[i].platform || ""
      })
    }
    
    const resPushDataToDb = await pushEventsDataToDataBaseService(body)

    // lấy ra thông tin của các Pixel
    // const listActivePixelCAPI = (await getListActivePixelCAPIByPixelsService(dataJson.pixelId)).result;

    const resCAPI = await pushEventsDataToFBService(pixels, body)

    // Assuming the JSON body is an object
    const response = json({
      resPushDataToDb: resPushDataToDb,
      resCAPI: resCAPI
    });
    return await cors(request, response);
  } catch (error) {
    console.error('Error processing the request:', error);

    // Handle the error and return an appropriate response
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
