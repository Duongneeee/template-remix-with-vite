import { LOG_LEVELS, sentryLogger } from "~/utils/logger";
import { 
  getReportEventAnalyticByPixelIdRepo, 
  getReportEventAnalyticByShopRepo, 
  getReportEventAnalyticTableByPixelIdRepo, 
  getReportEventAnalyticTableByShopRepo, 
  getReportEventByShopRepo, 
  getReportEventPlatformByShopRepo 
} from "../repositories/reportEvent.repository";
import { ReportDate } from "../types/reportEvent.type";
import { IEventDataByDate } from "../types/eventData.type";

export const getReportEventByShopService = async (shop:string, data:ReportDate) => {
    try {
      const res = await getReportEventByShopRepo(shop, data);
      return {
        isSuccessful: true,
        result: res,
      };
    } catch (error) {
      console.log("Error getReportEventByShopService: ", error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getReportEventByShopService ", {
        additionalInfo: error,
      });
      return {
        isSuccessful: false,
        errorCode: "500",
        message: error,
      };
    }
  };

  export const getReportEventAnalyticByShopService = async (data:IEventDataByDate) => {
    try {
      const res = await getReportEventAnalyticByShopRepo(data);
      return {
        isSuccessful: true,
        result: res,
      };
    } catch (error) {
      console.log("Error getReportEventAnalyticByShopService: ", error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getReportEventAnalyticByShopService ", {
        additionalInfo: error,
      });
      return {
        isSuccessful: false,
        errorCode: "500",
        message: error,
      };
    }
  };

  export const getReportEventAnalyticTableByShopService = async (data:IEventDataByDate) => {
    try {
      const res = await getReportEventAnalyticTableByShopRepo(data);
      return {
        isSuccessful: true,
        result: res,
      };
    } catch (error) {
      console.log("Error getReportEventAnalyticTableByShopService: ", error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getReportEventAnalyticTableByShopService ", {
        additionalInfo: error,
      });
      return {
        isSuccessful: false,
        errorCode: "500",
        message: error,
      };
    }
  };

  export const getReportEventAnalyticByPixelIdService = async (data:IEventDataByDate) => {
    try {
      const res = await getReportEventAnalyticByPixelIdRepo(data);
      return {
        isSuccessful: true,
        result: res,
      };
    } catch (error) {
      console.log("Error getReportEventAnalyticByPixelIdService: ", error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getReportEventAnalyticByPixelIdService ", {
        additionalInfo: error,
      });
      return {
        isSuccessful: false,
        errorCode: "500",
        message: error,
      };
    }
  };

  export const getReportEventAnalyticTableByPixelIdService = async (data:IEventDataByDate) => {
    try {
      const res = await getReportEventAnalyticTableByPixelIdRepo(data);
      return {
        isSuccessful: true,
        result: res,
      };
    } catch (error) {
      console.log("Error getReportEventAnalyticTableByPixelIdService: ", error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getReportEventAnalyticTableByPixelIdService ", {
        additionalInfo: error,
      });
      return {
        isSuccessful: false,
        errorCode: "500",
        message: error,
      };
    }
  };

  export const getReportEventPlatformByShopService = async ( data:IEventDataByDate ) => {
    try {
      const res = await getReportEventPlatformByShopRepo(data);
      return {
        isSuccessful: true,
        result: res,
      };
    } catch (error) {
      console.log("Error getReportEventPlatformByShopService: ", error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getReportEventPlatformByShopService ", {
        additionalInfo: error,
      });
      return {
        isSuccessful: false,
        errorCode: "500",
        message: error,
      };
    }
  };