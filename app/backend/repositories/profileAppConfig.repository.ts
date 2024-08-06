import db from "~/db.server";
import { IProfileAppConfigRequest } from "../types/profileAppConfig.type";
import { LOG_LEVELS, sentryLogger } from "~/utils/logger";
import { appConfig } from "~/constants/options";
import { setDataCacheProfileAppConfig } from "../external_apis/backend_pixel/pixel_api.service";


export const createProfileAppConfigRepo = async(data: IProfileAppConfigRequest) => {
    try {
      
      const existingRecord = await db.profileAppConfig.findFirst({ where:{ shop:data.shop, appConfigId:data.appConfigId } })

      if (!existingRecord) {
        const res = await db.profileAppConfig.create({data});
        if(res){
          await setDataCacheProfileAppConfigRepo(data.shop);
        }
        return res;
      }
      else{
        if(data.appConfigId === appConfig.reviewApp){
          const dataReview = {
            shop: data.shop,
            appConfigId: data.appConfigId,
            value: data.value
          }
          await updateProfileAppConfigReviewAppRepo(dataReview)
        }
      }

    } catch (error) {
      sentryLogger(LOG_LEVELS.ERROR, "Error in createProfileAppConfigRepo", {
        additionalInfo: error,
      });
    }
};

export const createProfileAppConfigThemeAppRepo = async(data: IProfileAppConfigRequest, isThemeApp:any) => {
  try {
    const existingRecord = await db.profileAppConfig.findFirst({ where:{ shop:data.shop, appConfigId:data.appConfigId }})

    if (!existingRecord) {
      if(isThemeApp === true){
        const res = await db.profileAppConfig.create({ data });
        if(res){
          await setDataCacheProfileAppConfigRepo(data.shop);
        }
        return res;
      }
    }

  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in createProfileAppConfigThemeAppRepo", {
      additionalInfo: error,
    });
  }
};

export const updateProfileAppConfigThemeAppRepo = async(data: IProfileAppConfigRequest) => {
  try {
    
    const existingRecord = await db.profileAppConfig.findFirst({where:{shop:data.shop,appConfigId:5}})

    if (existingRecord) {
      const res = await db.$queryRaw`UPDATE ProfileAppConfig
        SET value=${data.value}
        WHERE shop=${data.shop} AND appConfigId=${data.appConfigId}`;
      
      if(res){
        await setDataCacheProfileAppConfigRepo(data.shop)
      }
      return res;
    }

  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateProfileAppConfigThemeAppRepo", {
      additionalInfo: error,
    });
  }
};

export const updateProfileAppConfigReviewAppRepo = async(data: IProfileAppConfigRequest) => {
  try {
      const res = await db.$queryRaw`UPDATE ProfileAppConfig
        SET value=${data.value}
        WHERE shop=${data.shop} AND appConfigId=${data.appConfigId}`;
      
      if(res){
        await setDataCacheProfileAppConfigRepo(data.shop)
      }
      return res;
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateProfileAppConfigReviewAppRepo", {
      additionalInfo: error,
    });
  }
};

export const updateProfileAppConfigValueReviewAppRepo = async(shop:string) => {
  try {
    const existingRecord = await db.profileAppConfig.findFirst({ where:{shop, appConfigId: appConfig.reviewApp }})

    if (existingRecord) {
      let value = JSON.parse(existingRecord.value || '');
      value = {...value, isClose: !value.isClose}
      const res = await db.$queryRaw`UPDATE ProfileAppConfig
        SET value=${value}
        WHERE shop=${shop} AND appConfigId=${ appConfig.reviewApp }`;

      if(res){
        await setDataCacheProfileAppConfigRepo(shop)
      }
      return res;
    }
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateProfileAppConfigValueReviewAppRepo", {
      additionalInfo: error,
    });
  }
};

export const getStepOnBoardingProfileAppConfigRepo = async(data: any) => {
  try {
    
    const res = await db.profileAppConfig.findFirst({where:{...data}});
    return res;

  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in getStepOnBoardingProfileAppConfigRepo", {
      additionalInfo: error,
    });
  }
};

export const getProfileAppConfigRepo = async(shop:string) => {
    try {
        const res = await db.$queryRaw`SELECT 
          shop, 
	        appConfigId,
	        value
          FROM ProfileAppConfig
          WHERE shop = ${shop}`
      return res;

    } catch (error) {
      console.log(error)
      sentryLogger(LOG_LEVELS.ERROR, "Error in getProfileAppConfigRepo", {
        additionalInfo: error,
      });
    }
};

export const getFirstProfileAppConfigRepo = async(shop:string,appConfigId:number,value:string) => {
  try {
    
      const res = await db.profileAppConfig.findFirst(
          {
              where:{
                  shop,
                  appConfigId,
                  value
              }
          }
      );
    return res;

  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in getFirstProfileAppConfigRepo", {
      additionalInfo: error,
    });
  }
};

export const setDataCacheProfileAppConfigRepo  = async (shop:string) => {
  try {
    
    const resProfileAppConfig = await db.profileAppConfig.findMany({
      select:{
        appConfigId: true,
        value: true,
      },
      where:{
        shop
      }
    });
    const profileAppConfigStr = JSON.stringify(resProfileAppConfig);
    await setDataCacheProfileAppConfig(shop, profileAppConfigStr)

  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in setDataCacheProfileAppConfigRepo", {
      additionalInfo: error,
    });
  }
}