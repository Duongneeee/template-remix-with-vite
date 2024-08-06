import { platform } from "os";
import {
  createPixelRepo,
  deletePixelRepo,
  getFistOrDefaultPixelByShopRepo,
  getListActivePixelByShopRepo,
  getListPixelByPixelIdRepo,
  getListPixelByShopRepo,
  updatePixelRepo,
  updatePixelStatusRepo,
  getListActivePixelCAPIByPixelsRepo,
  getAllPixelByShopEventRepo,
  updatePixelAccessTokenFbRepo,
  updateManyPixelRepo,
} from "~/backend/repositories/cApiConfig.repository";
import type {
  ICApi_MetaPixelCreate,
  ICApi_MetaPixelUpdate,
} from "~/backend/types/cApiConfig.type";
import { LOG_LEVELS, sentryLogger } from "~/utils/logger";
import { getBussinessSource, invalidAccessToken } from "../external_apis/facebook/facebook.service";

export const createPixelService = async (data: ICApi_MetaPixelCreate) => {
  try {
    const existingRecord = await getFistOrDefaultPixelByShopRepo(data.pixelId, data.shop);
    if (existingRecord) {
      return {
        isSuccessful: false,
        errorCode: "409",
        message: `Facebook Pixel ID: ${data.pixelId} already exists.`,
      };
    }
    const res = await createPixelRepo(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    // console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in createPixelService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const updatePixelService = async (data: ICApi_MetaPixelUpdate) => {
  try {
    const res = await updatePixelRepo(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in updatePixelService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};
export const updateManyPixelService = async (data: ICApi_MetaPixelUpdate) => {
  try {
    const res = await updateManyPixelRepo(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateManyPixelService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};
export const updatePixelStatus = async (pixelId: string, newStatus: string, shop: string) => {
  try {
    const res = await updatePixelStatusRepo(newStatus, pixelId, shop);
    if (res?.isSuccessful) {
      return {
        isSuccessful: true,
        result: res.result,
      };
    }
    return {
      isSuccessful: false,
      result: res,
    };
  } catch (error) {
    console.error(
      `Error updating status for updatePixelStatus with id ${pixelId}:`,
      error
    );
    throw error;
  }
};

export const updatePixelAccessTokenFbService = async (data: any) => {
  try {
    const res = await updatePixelAccessTokenFbRepo(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in updatePixelAccessTokenFbService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const deletePixelService = async (id: number) => {
  try {
    const res = await deletePixelRepo(id);
    if (res.isSuccessful) {
      return {
        isSuccessful: true,
        result: res.result,
      };
    }
    return {
      isSuccessful: false,
      result: res.message,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in deletePixelService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getListPixelByShopService = async (shop: string) => {
  try {
    const res = await getListPixelByShopRepo(shop);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in getListPixelByShopService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};
export const getListActivePixelByShopService = async (shop: string) => {
  try {
    // const insertText = 'NwLXV';
    const res = await getListActivePixelByShopRepo(shop);
    // for (let i = 0; i < res.length; i++) {
    //   if (res[i].accessTokenFB) {
    //     res[i].accessTokenFB = res[i].accessTokenFB?.slice(0,10) + insertText + res[i].accessTokenFB?.slice(10)
    //   }
    // }
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in getListPixelByShopService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getListActivePixelCAPIByPixelsService = async (
  pixelIds: string[]
) => {
  try {
    const res = await getListActivePixelCAPIByPixelsRepo(pixelIds);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(
      LOG_LEVELS.ERROR,
      "Error in getListActivePixelCAPIByPixelsService ",
      {
        additionalInfo: error,
      }
    );
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getPixelByPixelIdService = async (id: number) => {
  try {
    const res = await getListPixelByPixelIdRepo(id);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in getPixelByPixelIdService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getAllPixelByShopEventService = async (shop: string) => {
  try {
    const res = await getAllPixelByShopEventRepo(shop);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in getPixelByPixelIdService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const validatePixel = async (data:any) =>{
  const errors: any = {};
  if (data.mode == "auto") {
    if (!data.name) {
      errors.title = "Pixel Name is required";
    }
    if (!data.pixelId) {
      if(data.platform === "facebook"){
        errors.pixelId = "Facebook Pixel ID is required";
      }else{
        errors.pixelId = "Tiktok Pixel ID is required";

      }
    } else {
      if(data.platform === "facebook")
        if (!Boolean(/^\d+$/.test(data?.pixelId?.trim()))) {
          errors.pixelId = "Facebook Pixel ID is number";
        }
    }
  }
  if (data.mode == "manual") {
    if (!data.nameManual) {
      errors.nameManual = "Pixel Name is required";
    }
    if (!data.pixelIdManual) {
      if(data.platform === "facebook"){
        errors.pixelIdManual = "Facebook Pixel ID is required";
      }else{
        errors.pixelIdManual = "Tiktok Pixel ID is required";

      }
    } else {
      if(data.platform === "facebook")
      if (!Boolean(/^\d+$/.test(data?.pixelIdManual?.trim()))) {
        errors.pixelIdManual = "Facebook Pixel ID is number";
      }
    }
  }

  if (data?.testEventCode) {
    if (data?.testEventCode?.trim().length > 10) {
      errors.testEventCode = "Test Event Code with a max of 10 characters";
    }
  }
  if (data.isActiveCApi == "true") {
    // if (data.mode == "manual") {
      if (data.accessTokenFB) {
        
        if (!data.accessTokenFB.trim()) {
          if(data.platform === "facebook")
            errors.accessTokenFB = "Facebook Access Token is required";
          else
            errors.accessTokenFB = "Tiktok Access Token is required";
        }
        else{
          if(data.platform === "facebook"){
            if(data.mode === "auto"){
              if(!errors.pixelId){
                const res = await invalidAccessToken({access_token:data.accessTokenFB, adAccount:data.pixelId});
                if(res?.error){
                  errors.accessTokenFB = res?.error.message;
                }
              }
            }
            if(data.mode === "manual"){
              if(!errors.pixelIdManual){
                const res = await invalidAccessToken({access_token:data.accessTokenFB, adAccount:data.pixelIdManual});
                if(res?.error){
                  errors.accessTokenFB = res?.error.message;
                }
              }
            }
          }
        }
      } else {
        if(data.platform === "facebook")
          errors.accessTokenFB = "Facebook Access Token is required";
        else
          errors.accessTokenFB = "Tiktok Access Token is required";
      }
    // }
  }
  if (Object.keys(errors).length) {
    return errors;
  }
}

