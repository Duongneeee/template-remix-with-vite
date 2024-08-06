import { LOG_LEVELS, sentryLogger } from "~/utils/logger";
import type {
  ICApi_MetaPixelCreate,
  ICApi_MetaPixelUpdate,
} from "~/backend/types/cApiConfig.type";
import db from "~/db.server";

export const createPixelRepo = async (data: ICApi_MetaPixelCreate) => {
  try {
    return await db.cApi_MetaPixel.create({ data });
  } catch (error) {
    console.log(error)
    sentryLogger(LOG_LEVELS.ERROR, "Error in createPixelRepo", {
      additionalInfo: error,
    });
  }
};
export const updatePixelRepo = async (data: ICApi_MetaPixelUpdate) => {
  try {
    return await db.cApi_MetaPixel.update({
      where: { id: data.id },
      data: { ...data },
    });
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in updatePixelRepo", {
      additionalInfo: error,
    });
    console.log(error);
  }
};

export const updateManyPixelRepo = async (data: ICApi_MetaPixelUpdate) => {
  try {
    return await db.cApi_MetaPixel.updateMany({
      where: { shop: data.shop },
      data: { ...data },
    });
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateManyPixelRepo", {
      additionalInfo: error,
    });
  }
};

export const updatePixelStatusRepo = async (value: string, pixelId: string, shop:string) => {
  try {
    var res;
    if (value === "true") {
      res =
        await db.$queryRaw`UPDATE CApi_MetaPixel  SET STATUS = true WHERE pixelId = ${pixelId} AND shop = ${shop} `;
    } else {
      res =
        await db.$queryRaw`UPDATE CApi_MetaPixel  SET STATUS = false WHERE pixelId = ${pixelId} AND shop = ${shop} `;
    }
    return {
      result: res,
      isSuccessful: true,
    };
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in updatePixelStatusRepo", {
      additionalInfo: error,
    });
  }
};

export const updatePixelAccessTokenFbRepo = async (data:any)=>{
  try {
    return await db.cApi_MetaPixel.updateMany({
      where: { shop: data.shop,mode:"auto" },
      data: { ...data},
    });
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in updatePixelAccessTokenFbRepo", {
      additionalInfo: error,
    });
  }
}

export const deletePixelRepo = async (id:number) => {
  try {
    const res = await db.cApi_MetaPixel.delete({
      where: {
        id: id,
      },
    });
    return {
      result: res,
      isSuccessful: true,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in deletePixelRepo", {
      additionalInfo: error,
    });
    return {
      message: error,
      isSuccessful: false,
    };
  }
};

export const getListActivePixelByShopRepo = async (shop: string) => {
  return await db.cApi_MetaPixel.findMany({
    where: {
      shop: shop,
      status: true,
    },
    orderBy: {
      id: "desc",
    },
  });
};

export const getListActivePixelCAPIByShopRepo = async (shop: string) => {
  return await db.cApi_MetaPixel.findMany({
    where: {
      shop: shop,
      status: true,
      isActiveCApi: true,
    },
    orderBy: {
      id: "desc",
    },
  });
};

export const getListActivePixelCAPIByPixelsRepo = async (
  pixelIds: string[]
) => {
  return await db.cApi_MetaPixel.findMany({
    where: {
      pixelId: { in: pixelIds },
      isActiveCApi: true,
    },
    orderBy: {
      id: "desc",
    },
  });
};

export const getListPixelByShopRepo = async (shop: string) => {
  return await db.cApi_MetaPixel.findMany({
    where: {
      shop: shop,
    },
    orderBy: {
      id: "desc",
    },
  });
};
export const getListPixelByPixelIdRepo = async (id:number) => {
  return await db.cApi_MetaPixel.findUnique({
    where: {
      id:id
    },
  });
};
export const getFistOrDefaultPixelByShopRepo = async (pixelId: string,shop:string) => {
  return await db.cApi_MetaPixel.findFirst({
    where: {
      pixelId: pixelId,
      shop:shop
    },
  });
};

export const getAllPixelByShopEventRepo = async (shop: string) => {
  return await db.$queryRaw`SELECT * FROM CApi_MetaPixel WHERE shop=${shop} AND (JSON_CONTAINS(lstEvents, 'true', '$.InitiateCheckout.isActive') OR JSON_CONTAINS(lstEvents, 'true', '$.Purchase.isActive'));
  `;
};
