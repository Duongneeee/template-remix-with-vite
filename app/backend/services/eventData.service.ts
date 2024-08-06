import {
  createEventDataRepo,
  createManyEventDataRepo,
  getAllEventDataByPixelIdIsCheckoutRepo,
  getAllEventDataByShopRepo,
  getAllEventDataToDayActionByShopRepo,
  getAllEventDataToDayByShopRepo,
  getAllEventDataToDayPlatformByShopRepo,
  getAllEventDataYesterdayByShopRepo,
  getEventDataRangePlatformByShopRepo,
} from "~/backend/repositories/eventData.repository";
import type { IEventDataByDate, IEventDataCreate } from "~/backend/types/eventData.type";
import { LOG_LEVELS, sentryLogger } from "~/utils/logger";

export const createEventDataService = async (data: IEventDataCreate) => {
  try {
    const res = await createEventDataRepo(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in createEventDataService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};
export const pushEventsDataToDataBaseService = async (
  data: IEventDataCreate[]
) => {
  try {
    const res = await createManyEventDataRepo(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in pushEventsDataToDataBaseService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getAllEventDataService = async (shop: string) => {
  try {
    const res = await getAllEventDataByShopRepo(shop);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log("Error getAllEventDataService: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getAllEventDataToDayService = async (shop: string, today:any) => {
  try {
    const res = await getAllEventDataToDayByShopRepo(shop, today);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log("Error getAllEventDataToDayService: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataToDayService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getAllEventDataToDayActionService = async (shop: string, today:string) => {
  try {
    const res = await getAllEventDataToDayActionByShopRepo(shop, today);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log("Error getAllEventDataToDayActionService: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataToDayActionService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getAllEventDataYesterdayService = async (shop: string, until:string, since:string) => {
  try {
    const res = await getAllEventDataYesterdayByShopRepo(shop , until, since);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log("Error getAllEventDataYesterdayService: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataYesterdayService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getAllEventDataByPixelIdIsCheckoutService = async (
  pixelId: string
) => {
  try {
    const res = await getAllEventDataByPixelIdIsCheckoutRepo(pixelId);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log("Error getAllEventDataService: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getAllEventDataToDayPlatformService = async ( data:IEventDataByDate ) => {
  try {
    const res = await getAllEventDataToDayPlatformByShopRepo(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log("Error getAllEventDataToDayPlatformService: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataToDayPlatformService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getEventDataRangePlatformService = async ( data:IEventDataByDate ) => {
  try {
    const res = await getEventDataRangePlatformByShopRepo(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log("Error getEventDataRangePlatformService: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getEventDataRangePlatformService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};
