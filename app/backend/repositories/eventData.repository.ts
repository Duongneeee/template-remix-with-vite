import type { IEventDataByDate, IEventDataCreate } from "~/backend/types/eventData.type";
import db from "~/db.server";
import { sentryLogger, LOG_LEVELS } from "~/utils/logger";

export const createEventDataRepo = async (data: IEventDataCreate) => {
  try {
    return await db.eventsData.create({ data });
  } catch (error) {
    return error;
  }
};
export const createManyEventDataRepo = async (body: IEventDataCreate[]) => {
  try {
    const re = await db.eventsData.createMany({ data: body, skipDuplicates: true });
    return re;
  } catch (error) {
    console.log("Error createManyEventDataRepo: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in createManyEventDataRepo", {
      additionalInfo: error,
    });
  }
};
export const getAllEventDataByShopRepo = async (shop: string) => {
  try {
    const res = await db.eventsData.findMany({
      where: {
        shop,
      },
    });
    return res;
  } catch (error) {
    console.log("Error getAllEventDataByShopRepo: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataByShopRepo", {
      additionalInfo: error,
    });
  }
};
export const getAllEventDataToDayByShopRepo = async (shop: string, today:any) => {
  try {
    // const currentDate = today;
    const res = await db.eventsData.findMany({
      where: {
        shop: {
          equals: shop,
        },
        createdAt: {
          gte: today,
        },
      },
    });
    return res;
  } catch (error) {
    console.log("Error getAllEventDataToDayByShopRepo: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataToDayByShopRepo", {
      additionalInfo: error,
    });
    throw error;
  }
};

export const getAllEventDataToDayActionByShopRepo = async (shop: string, today:string) => {
  try {
    const res = await db.$queryRaw`SELECT * FROM EventsData WHERE shop=${shop} AND Date(createdAt)=${today}`
    return res;
  } catch (error) {
    console.log("Error getAllEventDataToDayActionByShopRepo: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataToDayActionByShopRepo", {
      additionalInfo: error,
    });
  }
};

export const getAllEventDataYesterdayByShopRepo = async (shop: string, until:string, since:string) => {
  try {
    const res = await db.eventsData.findMany({
      where: {
        shop: {
          equals: shop,
        },
        createdAt: {
          gte:new Date(until),
          lt: new Date(since)
        },
      },
    });
    return res;
  } catch (error) {
    console.log("Error getAllEventDataYesterdayByShopRepo: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataYesterdayByShopRepo", {
      additionalInfo: error,
    });
  }
};

export const getAllEventDataByPixelIdRepo = async (pixelId: string) => {
  try {
    const res = await db.eventsData.findMany({
      where: {
        pixelId,
      },
    });
    return {
      result: res,
      isSuccessful: true,
    };
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataByPixelIdRepo", {
      additionalInfo: error,
    });
  }
};
export const deleteEventDataByPixelIdRepo = async (pixelId: string) => {
  try {
    const res = await db.eventsData.deleteMany({
      where: {
        pixelId: pixelId,
      },
    });
    return {
      result: res,
      isSuccessful: true,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in deleteEventDataByPixelIdRepo", {
      additionalInfo: error,
    });
    return {
      message: error,
      isSuccessful: false,
    };
  }
};
export const deleteEventDataByShopRepo = async (shop: string) => {
  try {
    const res = await db.eventsData.deleteMany({
      where: {
        shop: shop,
      },
    });
    return {
      result: res,
      isSuccessful: true,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in deleteEventDataByShopRepo", {
      additionalInfo: error,
    });
    return {
      message: error,
      isSuccessful: false,
    };
  }
};

export const getAllEventDataByPixelIdIsCheckoutRepo = async (
  pixelId: string
) => {
  try {
    const res = await db.eventsData.findMany({
      where: {
        AND: [
          {
            pixelId: {
              equals: pixelId,
            },
          },
          {
            OR: [
              {
                eventName: {
                  equals: "InitiateCheckout",
                },
              },
              {
                eventName: {
                  equals: "Purchase",
                },
              },
            ],
          },
        ],
      },
    });
    return {
      result: res,
      isSuccessful: true,
    };
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataByPixelIdRepo", {
      additionalInfo: error,
    });
    return {
      message: error,
      isSuccessful: false,
    };
  }
};

// Returns today data by platform
export const getAllEventDataToDayPlatformByShopRepo = async (data:IEventDataByDate) => {
  try {
    const res = await db.$queryRaw`
      SELECT ed.* FROM EventsData ed 
      WHERE ed.shop = ${data.shop} 
      AND  ed.createdAt >= ${data.since} AND ed.platform = ${data.platform}`
      return res;
  } catch (error) {
    console.log("Error getAllEventDataToDayPlatformByShopRepo: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataToDayPlatformByShopRepo", {
      additionalInfo: error,
    });
    throw error;
  }
};

// Returns yesterday data by platform
export const getEventDataRangePlatformByShopRepo = async (data:IEventDataByDate) => {
  try {
    const res = await db.$queryRaw`
      SELECT ed.* FROM EventsData ed   
      WHERE ed.shop = ${data.shop} 
      AND  date(ed.createdAt) >= ${data.since}
      AND  date(ed.createdAt) <= ${data.until} AND ed.platform = ${data.platform}`
      return res;
  } catch (error) {
    console.log("Error getEventDataRangePlatformByShopRepo: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getEventDataRangePlatformByShopRepo", {
      additionalInfo: error,
    });
    throw error;
  }
};
