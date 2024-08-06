import { sentryLogger, LOG_LEVELS } from "~/utils/logger";
import { createProductFeedConfigRepo, 
    deleteProductFeedConfigByIdRepo, 
    deleteProductFeedConfigByShopRepo, 
    getProductFeedConfigByIdRepo,
    updateProductFeedConfigRepo,
    getListProductFeedConfigByShopRepo} from "../repositories/productFeedConfig.repository";
import type { IProductFeedConfigReq, IProductFeedConfigUpdate } from "../types/productFeedConfig.type";

export const createProductFeedConfig = async (data: IProductFeedConfigReq) => {
    try {
      // const existingRecord = await getFistOrDefaultProductFeedConfigRepo(data.shop);
      // if (existingRecord) {
      //   return {
      //     isSuccessful: false,
      //     errorCode: "409",
      //     message: `Product Feed config : ${data.name} already exists.`
      //   };
      // }
      const res = await createProductFeedConfigRepo(data);
      return {
        isSuccessful: true,
        result: res
      };
    } catch (error) {
      console.log(error)
      sentryLogger(LOG_LEVELS.ERROR, "Error in createProductFeedConfig ", {
        additionalInfo: error
      });
      return {
       isSuccessful: false, 
        errorCode: "500",
        message: error
      };
    }
  };

export const updateProductFeedConfig = async (data: IProductFeedConfigUpdate) => {
  try {
    const res = await updateProductFeedConfigRepo(data);
    return {
      isSuccessful: true,
      result: res
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateProductFeedConfigService ", {
      additionalInfo: error
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error
    };
  }
};

export const getProductFeedConfigById = async (id: number) => {
  try {
    const res = await getProductFeedConfigByIdRepo(id);
    return {
      isSuccessful: true,
      result: res
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in getProductFeedConfigById ", {
      additionalInfo: error
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error
    };
  }
};

export const getListProductFeedConfigByShop = async (shop: string) => {
  try {
    const res = await getListProductFeedConfigByShopRepo(shop);
    return {
      isSuccessful: true,
      result: res
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in getListProductFeedConfigByShop ", {
      additionalInfo: error
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error
    };
  }
};

export const deleteProductFeedConfigById = async (id: number) => {
  try {
    const res = await deleteProductFeedConfigByIdRepo(id);
    return {
      isSuccessful: true,
      result: res
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in deleteProductFeedConfigById ", {
      additionalInfo: error
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error
    };
  }
};

export const deleteProductFeedConfigByShop = async (shop: string) => {
  try {
    const res = await deleteProductFeedConfigByShopRepo(shop);
    return {
      isSuccessful: true,
      result: res
    };
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in deleteProductFeedConfigByShop ", {
      additionalInfo: error
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error
    };
  }
};

  export function validateProductFeedConfig(data: any) {
    const errors: any = {};
    const formatRule = JSON.parse(data.rule)
    // if (!data.name) {
    //   errors.name = "Product Feed name is required";
    // }
    // if(data.selected === '0'){
    //   if (!data.adAccount) {
    //     errors.adAccount = "Business Account is required";
    //   }
    //   if (!data.catalog) {
    //     errors.catalog = "Catalog is required";
    //   }
    // }
    if(!formatRule.productCondition){
      errors.productCondition = "Product Condition is required";
    }
    // if(data?.profileShopCountry === 'India'){
      
    //   const { originCountry, importerName, importerAddress, manufacturerInfo } = formatRule
    //   if (!originCountry) {
    //     errors.originCountry = "Origin country is required"
    //   }
    //   if (!importerName) {
    //     errors.importerName = "Importer name is required"
    //   }
    //   if (!manufacturerInfo) {
    //     errors.manufacturerInfo = "Manufacure Info is required"
    //   }
 
    //   if(!importerAddress?.street1){
    //     errors.importerAddressStreet1 = "Street 1 is required"
    //   }
    //   if(!importerAddress?.city){
    //     errors.importerAddressCity = "City is required"
    //   }
    //   if(!importerAddress?.country){
    //     errors.importerAddressCountry = "Country is required"
    //   }
    // }
    if (Object.keys(errors).length) {
      return errors;
    }
  }