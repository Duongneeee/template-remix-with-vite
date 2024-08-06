import db from "~/db.server";
import type {
  IProfileShopCreate,
  IProfileShopUpdate,
} from "~/backend/types/profileShop.type";
import { LOG_LEVELS, sentryLogger } from "~/utils/logger";
import {
  createprofileShopRepo,
  getProfileShopByShopRepo,
  getStepOnBoardingProfileShopByShopRepo,
  updateProfileShopByShopRepo,
  updateProfileShopRepo,
  updateProfileShopUninstallRepo
} from "~/backend/repositories/profileShop.repository";
import axios from "axios";
import crypto from "crypto";

export const createProfileShop = async (data: IProfileShopCreate) => {
  try {
    const existingRecord = await db.profileShop.findFirst({
      where: {
        shop: data.shop,
      },
    });
    if (existingRecord) {
      const res = await updateProfileShopByShopRepo(data);
      return {
        isSuccessful: true,
        result: res,
      };
    } else {
      const res = await createprofileShopRepo(data);
      return {
        isSuccessful: true,
        result: res,
      };
    }
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in createProfileShop ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const updateProfileShop = async (data: IProfileShopUpdate) => {
  try {
    // console.log("updateProfileShop:", data);
    const res = await updateProfileShopRepo(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateProfileShop", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const updateProfileShopUninstall = async (data: IProfileShopUpdate) => {
  try {
    const res = await updateProfileShopUninstallRepo(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateProfileShopUninstall", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

// export const getProfileShopIdById = async (id: number) => {
//   return await db.profileShop.findUnique({
//     where: {
//       id,
//     },
//   });
// };

export const getProfileShopByShop = async (shop: string) => {
  try {
    const shopProfile = await getProfileShopByShopRepo(shop);
    return {
      isSuccessful: true,
      result: shopProfile,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in getProfileShopByShop ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getStepOnBoardingProfileShopByShop = async (shop: string) => {
  try {
    const shopProfile = await getStepOnBoardingProfileShopByShopRepo(shop);
    return {
      isSuccessful: true,
      result: shopProfile,
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in getProfileShopByShop ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const getAllProfileShop = async () => {
  const Shops = await db.profileShop.findMany();
  return Shops;
};

export const deleteProfileShopById = async (id: number) => {
  return await db.profileShop.delete({
    where: {
      id,
    },
  });
};

export const confirmPixel = async (req: any) => {
  const { name, accessToken } = req;
  const createWebPixelUrl = `https://${name}/admin/api/2023-10/graphql.json`;
  // console.log(createWebPixelUrl, accessToken);
  let webPixelData = JSON.stringify({
    query:
      "mutation webPixelCreate($webPixelInput: WebPixelInput!) { webPixelCreate(webPixel: $webPixelInput) { webPixel { settings id } userErrors { code field message } } }",
    variables: {
      webPixelInput: {
        settings: {
          accountID: crypto.randomUUID(),
        },
      },
    },
  });

  let webPixelConfig = {
    method: "post",
    maxBodyLength: Infinity,
    url: createWebPixelUrl,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    data: webPixelData,
  };

  const response = await axios.request(webPixelConfig);
  console.log(JSON.stringify(response?.data?.data.webPixelCreate?.userErrors));
  if (response) {
    if (response?.data?.data.webPixelCreate?.userErrors?.length > 0) {
      // const errors = response.data.webPixelCreate.userErrors;
      // throw new Error(errors.map((error: any) => error.message).join(" , "));
      return "Xác nhận lỗi";
    }
    return true;
    // return response;
  } else {
    // Handle non-OK responses (e.g., server error)
    return false; // or throw an error, depending on your needs
  }
};
