import db from "~/db.server";
import type { IProductFeedConfigReq, IProductFeedConfigUpdate } from "../types/productFeedConfig.type";

export const createProductFeedConfigRepo = async (data: IProductFeedConfigReq) => {
  try {
    return await db.productFeedConfig.create({ data });
  } catch (error) {
    throw error;
  }
};

export const updateProductFeedConfigRepo = async (data: IProductFeedConfigUpdate) => {
  try {
    return await db.productFeedConfig.update({
      where: { id: data.id },
      data: {...data}
    });
  } catch (error) {
    throw error;
  }
};

// export const getFistOrDefaultProductFeedConfigRepo = async (shop: string) => {
//   try {
//     return await db.productFeedConfig.findUnique({
//       where: {
//         shop: shop,
//       },
//     });
//   } catch (error) {
//     throw error;
//   }
// };

export const getProductFeedConfigByIdRepo = async (id: number) => {
  try {
    return await db.productFeedConfig.findUnique({
      where: {
        id: id,
      }
    });
  } catch (error) {
    throw error;
  }
};

export const getListProductFeedConfigByShopRepo = async (shop: string) => {
  try {
    return await db.productFeedConfig.findMany({
      where: {
        shop: shop,
      },
      orderBy: {
        id: "desc",
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteProductFeedConfigByIdRepo = async (id: number) => {
  try {
    return await db.productFeedConfig.deleteMany({
      where: {
        id
      }
    });
  } catch (error) {
    throw error;
  }
};


export const deleteProductFeedConfigByShopRepo = async (shop: string) => {
  try {
    return await db.productFeedConfig.deleteMany({
      where: {
        shop: shop
      }
    });
  } catch (error) {
    throw error;
  }
};