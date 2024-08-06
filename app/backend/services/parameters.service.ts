import { sentryLogger, LOG_LEVELS } from "~/utils/logger";
import { getAllParametersRepo } from "../repositories/parameters.repository";


export const getParamerersByShopService = async (shop: string) => {
    try {
      const res = await getAllParametersRepo(shop);
      return {
        isSuccessful: true,
        result: res.result
      };
    } catch (error) {
      sentryLogger(LOG_LEVELS.ERROR, "Error in getParamerersByShopService", {
        additionalInfo: error
      });
      return {
        isSuccessful: false,
        errorCode: "500",
        message: error
      };
    }
  };