import { LOG_LEVELS, sentryLogger } from "~/utils/logger";
import { createFeatureRepository, getAllFeatureRepository, getFeatureRepository, updateFeatureRepository } from "../repositories/feature.repository";
import { IFeatureRequest, IFeatureRequestUpdate } from "../types/feature.type";

export const getFeatureService = async (data:any) => {
    try {
      const res = await getFeatureRepository(data);
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
/*
Lấy danh sách feature kèm voting cho shop và new feature của hệ thống
*/
export const getAllFeatureService = async (shop:string) => {
    try {
      const res = await getAllFeatureRepository(shop);
      return {
        isSuccessful: true,
        result: res,
      };
    } catch (error) {
      console.log("Error getAllFeatureService: ", error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getAllFeatureService ", {
        additionalInfo: error,
      });
      return {
        isSuccessful: false,
        errorCode: "500",
        message: error,
      };
    }
};

export const createFeatureService = async (data:IFeatureRequest) => {
  try {
    const res = await createFeatureRepository(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log("Error createFeatureService: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in createFeatureService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const updateFeatureService = async (data:IFeatureRequestUpdate) => {
  try {
    const res = await updateFeatureRepository(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log("Error updateFeatureService: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateFeatureService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};