import { LOG_LEVELS, sentryLogger } from "~/utils/logger";
import { getAllDataFacebookCategoryLevelRepo, getDataFacebookCategoryLevelRepo } from "../repositories/facebookCategoryLevel.repository";

export const getAllDataFacebookCategoryLevelService = async () => {
    try {
      const res = await getAllDataFacebookCategoryLevelRepo();
      return {
        isSuccessful: true,
        result: res,
      };
    } catch (error) {
      console.log(error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getAllDataFacebookCategoryLevelService ", {
        additionalInfo: error,
      });
      return {
        isSuccessful: false,
        errorCode: "500",
        message: error,
      };
    }
  };

export const getDataFacebookCategoryLevelService = async ( data: any ) => {
    try {
      const res = await getDataFacebookCategoryLevelRepo( data );
      return {
        isSuccessful: true,
        result: res,
      };
    } catch (error) {
      console.log(error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getDataFacebookCategoryLevelService ", {
        additionalInfo: error,
      });
      return {
        isSuccessful: false,
        errorCode: "500",
        message: error,
      };
    }
  };