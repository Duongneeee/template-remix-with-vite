import { sentryLogger, LOG_LEVELS } from "~/utils/logger";
import { getSessionByShopRepo } from "../repositories/sessions.repository";


export const getSessionByShop = async (shop: string) => {
    try {
      const res = await getSessionByShopRepo(shop);
      return {
        isSuccessful: true,
        result: res
      };
    } catch (error) {
      sentryLogger(LOG_LEVELS.ERROR, "Error in getSessionByShop", {
        additionalInfo: error
      });
      return {
        isSuccessful: false,
        errorCode: "500",
        message: error
      };
    }
  };