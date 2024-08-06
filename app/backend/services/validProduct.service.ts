import { getProductsByCollection } from "../external_apis/shopify/collection.service";
import { getSessionByShop } from "./session.service";

export const checkProductInCollection = async (
  productIdTarget: Array<string>,
  pixels: any
) => {
  const shop: string = pixels[0]?.shop; // Accessing shop safely
  if (!shop) return ""; // If shop is not available, return empty string

  const sessionData = await getSessionByShop(shop);
  const accessToken: string = sessionData?.result?.accessToken || "";

  const arrValidPixel = await Promise.all(
    pixels.map(async (pixel: any) => {
      if (pixel.targetArea === "all") {
        return pixel; // If targetArea is 'All', consider the pixel valid without checking collections
      }
      else if (pixel.targetArea === "collections") {
        const collectionsActive = pixel?.lstCollects?.split(",") || [];
        for (const collection of collectionsActive) {
          const productIds = await getProductsByCollection({
            shop,
            shopifyToken: accessToken,
            collectionId: collection,
          });
          if (Array.isArray(productIdTarget)) {
            const checkId: boolean = productIdTarget.some((productId: string) => productIds?.includes(Number(productId)));
            if (checkId) {
              return pixel
            }
          } else {
            console.error("productIdTarget is not an array.");
          }
        }
      }
      else {
        const productIds = pixel?.lstProducts;
        if (Array.isArray(productIdTarget)) {
          const checkId: boolean = productIdTarget.some((productId: string) => productIds?.includes(Number(productId)));
          if (checkId) {
            return pixel
          }
        } else {
          console.error("productIdTarget is not an array.");
        }

      }
      return null; // Returning null if pixel is not valid
    })
  );
  const validPixels = arrValidPixel.filter((pixel) => pixel !== null); // Filtering out null values
  if (validPixels.length > 0) return validPixels;
  else return []; // Returning empty string if no valid pixels found
};