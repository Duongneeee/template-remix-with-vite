import { LOG_LEVELS, sentryLogger } from "~/utils/logger";
import { createProfileAppConfigRepo, 
  createProfileAppConfigThemeAppRepo, 
  getFirstProfileAppConfigRepo, 
  getProfileAppConfigRepo, 
  getStepOnBoardingProfileAppConfigRepo, 
  updateProfileAppConfigThemeAppRepo 
} from "../repositories/profileAppConfig.repository";
import { IProfileAppConfigRequest } from "../types/profileAppConfig.type";

export const createProfileAppConfigService = async (shop: string, appConfigId: number, value: string) => {
    try {
      const data: IProfileAppConfigRequest = {
        shop,
        appConfigId: appConfigId,
        value: value
      }

      const res = await createProfileAppConfigRepo(data);
      return {
        isSuccessful: true,
        result: res
      };
    } catch (error) {
      console.log(error)
      sentryLogger(LOG_LEVELS.ERROR, "Error in createProfileAppConfig ", {
        additionalInfo: error
      });
      return {
       isSuccessful: false, 
        errorCode: "500",
        message: error
      };
    }
  };

  export const createProfileAppConfigThemeAppService = async (shop: string, appConfigId: number, value: string, isThemeApp:any) => {
    try {
      const data: IProfileAppConfigRequest = {
        shop,
        appConfigId: appConfigId,
        value: value
      }

      const res = await createProfileAppConfigThemeAppRepo(data,isThemeApp);
      return {
        isSuccessful: true,
        result: res
      };
    } catch (error) {
      console.log(error)
      sentryLogger(LOG_LEVELS.ERROR, "Error in createProfileAppConfigThemeAppService ", {
        additionalInfo: error
      });
      return {
       isSuccessful: false, 
        errorCode: "500",
        message: error
      };
    }
  };


  export const updateProfileAppConfigThemeAppService = async (shop: string, appConfigId: number, value: string) => {
    try {
      const data: IProfileAppConfigRequest = {
        shop,
        appConfigId: appConfigId,
        value: value
      }

      const res = await updateProfileAppConfigThemeAppRepo(data);
      return {
        isSuccessful: true,
        result: res
      };
    } catch (error) {
      console.log(error)
      sentryLogger(LOG_LEVELS.ERROR, "Error in updateProfileAppConfigThemeAppService ", {
        additionalInfo: error
      });
      return {
       isSuccessful: false, 
        errorCode: "500",
        message: error
      };
    }
  };
  export const getFirstProfileAppConfigService = async (shop: string, appConfigId:number,value:string) => {
    try {
      const res = await getFirstProfileAppConfigRepo(shop,appConfigId,value);
      return {
        isSuccessful: true,
        result: res
      };
    } catch (error) {
      console.log(error)
      sentryLogger(LOG_LEVELS.ERROR, "Error in getFirstProfileAppConfigService ", {
        additionalInfo: error
      });
      return {
       isSuccessful: false, 
        errorCode: "500",
        message: error
      };
    }
  };

  export const getProfileAppConfigService = async (shop: string) => {
    try {
      const res = await getProfileAppConfigRepo(shop);
      return {
        isSuccessful: true,
        result: res
      };
    } catch (error) {
      console.log(error)
      sentryLogger(LOG_LEVELS.ERROR, "Error in getProfileAppConfigService ", {
        additionalInfo: error
      });
      return {
       isSuccessful: false, 
        errorCode: "500",
        message: error
      };
    }
  };

  export const getStepOnBoardingProfileAppConfigService = async (data: any) => {
    try {
      const res = await getStepOnBoardingProfileAppConfigRepo(data);
      return {
        isSuccessful: true,
        result: res
      };
    } catch (error) {
      console.log(error)
      sentryLogger(LOG_LEVELS.ERROR, "Error in getStepOnBoardingProfileAppConfigService ", {
        additionalInfo: error
      });
      return {
       isSuccessful: false, 
        errorCode: "500",
        message: error
      };
    }
  };