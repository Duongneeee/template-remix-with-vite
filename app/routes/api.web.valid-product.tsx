import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { cors } from "remix-utils/cors";
import { checkProductInCollection } from "~/backend/services/validProduct.service";

export async function loader({ request }: LoaderFunctionArgs): Promise<Response> {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.getAll("productId");
    const pixels = url.searchParams.get("pixels");

    if (!productId || !pixels) {
      return new Response('Bad Request: Missing productId or pixels', {
        status: 400,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Credentials': 'true',
        }
      });
    }
    const pixelsArray = JSON.parse(pixels);
    const res = await checkProductInCollection(productId, pixelsArray);
    const response = json({
      filteredPixel: res
    });
    return await cors(request, response);
  } catch (error) {
    // console.error('Error processing the request:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }
}


export async function action({
  request,
}: ActionFunctionArgs): Promise<Response> {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.getAll("productId");
    const pixels = url.searchParams.get("pixels");

    if (!productId || !pixels) {
      return new Response('Bad Request: Missing productId or pixels', {
        status: 400,
        headers: {
          'Content-Type': 'text/plain',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Credentials': 'true',
        }
      });
    }
    const pixelsArray = JSON.parse(pixels);
    const res = await checkProductInCollection(productId, pixelsArray);
    const response = json({
      filteredPixel: res
    });
    return await cors(request, response);
  } catch (error) {
    // console.error('Error processing the request:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      }
    });
  }
}