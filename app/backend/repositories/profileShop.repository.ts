import { LOG_LEVELS, sentryLogger } from "~/utils/logger";
import db from "~/db.server";
import {
  IProfileShopCreate,
  IProfileShopUpdate,
} from "../types/profileShop.type";

export const createprofileShopRepo = async (data: IProfileShopCreate) => {
  try {
    const res = await db.profileShop.create({ data });
    return res;
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in createprofileShopRepo", {
      additionalInfo: error,
    });
  }
};

export const updateProfileShopRepo = async (data: IProfileShopUpdate) => {
  try {
    if(!data.id) return;
      const existingProfile = await db.profileShop.findUnique({
        where: { id: data.id },
      });
  
      if (!existingProfile) {
        throw new Error("Shop profile not found");
      }
  
      // Create an update object with only the fields that are provided in the update
      const updateData: Record<string, any> = {};
      if (data.shop !== undefined) {
        updateData.shop = data.shop;
      }
      // if (data.onBoardingStep !== undefined) {
      //   updateData.onBoardingStep = data.onBoardingStep;
      // }
      if (data.facebookName !== undefined) {
        updateData.facebookName = data.facebookName;
      }
      if (data.accessTokenFb !== undefined) {
        updateData.accessTokenFb = data.accessTokenFb;
      }
      if (data.facebookAvatar !== undefined) {
        updateData.facebookAvatar = data.facebookAvatar;
      }
      if (data.isConfirmPixel !== undefined) {
        updateData.isConfirmPixel = data.isConfirmPixel;
      }
      if (data.installApp !== undefined) {
        updateData.installApp = data.installApp;
      }
      if (data.email !== undefined) {
        updateData.email = data.email;
      }
      if (data.country !== undefined) {
        updateData.country = data.country;
      }
      if (data.shopId !== undefined) {
        updateData.shopId = data.shopId;
      }

      if (data.domain !== undefined) {
        updateData.domain = data.domain;
      }

      if (data.storeFrontAccessToken !== undefined) {
        updateData.storeFrontAccessToken = data.storeFrontAccessToken;
      }
      
      // Perform the update only with the specified fields
      const res = await db.profileShop.update({
        where: { id: data.id },
        data: updateData,
      });
    return {
      result: res,
      isSuccessful: true,
    };
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateProfileShopRepo", {
      additionalInfo: error,
    });
    return {
      message: error,
      isSuccessful: false,
    };
  }
};

export const updateProfileShopUninstallRepo = async (data: IProfileShopUpdate) => {
  try {
   
      // Create an update object with only the fields that are provided in the update
      const updateData: Record<string, any> = {};
      if (data.shop !== undefined) {
        updateData.shop = data.shop;
      }
     
      
      if (data.isConfirmPixel !== undefined) {
        updateData.isConfirmPixel = data.isConfirmPixel;
      }
      if (data.installApp !== undefined) {
        updateData.installApp = data.installApp;
      }
      // Perform the update only with the specified fields
      const res = await db.profileShop.update({
        where: { shop: data.shop },
        data: updateData,
      });
    return {
      result: res,
      isSuccessful: true,
    };
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateProfileShopUninstallRepo", {
      additionalInfo: error,
    });
    return {
      message: error,
      isSuccessful: false,
    };
  }
};

export const updateProfileShopByShopRepo = async (data: IProfileShopCreate) => {
  try {
      // Perform the update only with the specified fields
      const res = await db.profileShop.update({
        where: { shop: data.shop },
        data: data,
      });
    return {
      result: res,
      isSuccessful: true,
    };
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateProfileShopByShopRepo", {
      additionalInfo: error,
    });
    return {
      message: error,
      isSuccessful: false,
    };
  }
};


// export const getProfileShopIdByIdRepo = async (id: number) => {
//     return await db.profileShop.findUnique({
//       where: {
//         id,
//       },
//     });
//   };

export const getProfileShopByShopRepo = async (shop: string) => {
  return await db.profileShop.findFirst({ where: { shop } });
};

export const getAllProfileShop = async () => {
  const Shops = await db.profileShop.findMany();
  return Shops;
};

export const deleteProfileShopByIdRepo = async (id: number) => {
  return await db.profileShop.delete({
    where: {
      id,
    },
  });
};

export const getStepOnBoardingProfileShopByShopRepo = async (shop: string) => {
  return await db.$queryRaw`SELECT ProfileShop.shop, Reviews.isClose FROM ProfileShop LEFT JOIN Reviews ON ProfileShop.shop = Reviews.shop WHERE ProfileShop.shop=${shop}`;
};
