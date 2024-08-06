import { sentryLogger, LOG_LEVELS } from "~/utils/logger";
import {
  createAudienceConfigRepo,
  deleteAudienceConfigByIdRepo,
  deleteAudienceConfigByShopRepo,
  getAudienceConfigByIdRepo,
  getListAudienceConfigByShopRepo,
  getListAudienceConfigIsLookaLikeByShopRepo,
  updateAudienceConfigRepo,
} from "../repositories/audienceConfig.repository";
import type { IAudienceConfigReq } from "../types/audienceConfig.type";

export const createAudienceConfig = async (data: IAudienceConfigReq) => {
  try {
    // const existingRecord = await getFistOrDefaultAudienceConfigRepo(data.shop);
    // if (existingRecord) {
    //   return {
    //     isSuccessful: false,
    //     errorCode: "409",
    //     message: `Pixel Id: ${data.pixelId} already exists.`
    //   };
    // }
    const res = await createAudienceConfigRepo(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in createAudienceConfigervice ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const updateAudienceConfig = async (data: IAudienceConfigReq) => {
  try {

    const res = await updateAudienceConfigRepo(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateAudienceConfigervice ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getAudienceConfigById = async (id: number) => {
  try {
    const res = await getAudienceConfigByIdRepo(id);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in getListAudienceConfigByShop ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};
export const getListAudienceConfigByShop = async (shop: string) => {
  try {
    const res = await getListAudienceConfigByShopRepo(shop);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in getListAudienceConfigByShop ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getListAudienceConfigIsLookaLikeByShop = async (shop: string) => {
  try {
    const res = await getListAudienceConfigIsLookaLikeByShopRepo(shop);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in getListAudienceConfigByShop ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const deletePixelById = async (id: number) => {
  try {
    const res = await deleteAudienceConfigByIdRepo(id);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in deletePixelByPixelId ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const deletePixelByShop = async (shop: string) => {
  try {
    const res = await deleteAudienceConfigByShopRepo(shop);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in deletePixelByShop ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};
export function validateAudienceConfig(data: any) {
  const errors: any = {};

  if (!data.audienceName) {
    errors.audienceName = "Name is required";
  }
  if (Object.keys(errors).length) {
    return errors;
  }
}
