import db from "~/db.server";
import type { ICApi_MetaPixelCreate, ICApi_MetaPixelUpdate } from "./types";
import { deleteEventDataByAppId } from "../event_data/event-data.services";

export const createPixel = async (data: ICApi_MetaPixelCreate) => {
    try {
        const existingRecord = await db.cApi_MetaPixel.findFirst({
            where: {
              appId: data.appId,
            },
        });

        if (existingRecord) {
            // Record with the same name already exists, handle accordingly
            return existingRecord;
        }
        return await db.cApi_MetaPixel.create({data});
    } catch (error) {
      return error;
    }
};
export const updatePixel = async (data: ICApi_MetaPixelUpdate) => {
    try {
        return await db.cApi_MetaPixel.update({ where: { id: Number(data.id) }, data });
    } catch (error) {
      console.error("Error creating CApi_MetaPixel:", error);
      throw error;
    }
};
export const updatePixelStatus = async (id: number, newStatus: boolean) => {
  try {
    return await db.cApi_MetaPixel.update({
      where: { id },
      data: {
        status: newStatus,
      },
    });
  } catch (error) {
    console.error(`Error updating status for CApi_MetaPixel with id ${id}:`, error);
    throw error;
  }
};
export const getPixel = async (shopName: string) => {
  return await db.cApi_MetaPixel.findFirst({ 
    where: { shopName },
    orderBy: {
    id: 'desc',
  }, });
};
export const getPixelById = async (id: number) => {
  return await db.cApi_MetaPixel.findFirst({ where: { id } });
};
export const getPixelByAppId = async (appId: string) => {
  return await db.cApi_MetaPixel.findFirst({ where: { appId } });
};
export const getPixels = async (shopName:string) => {
  return await db.cApi_MetaPixel.findMany({
    where: { shopName },
    orderBy: {
      id: 'desc',
    }
  });
};

export const deletePixel = async (id: number) => {
  const res =  await getPixelById(id);
  if(res){
    await deleteEventDataByAppId(res.appId);
    return await db.cApi_MetaPixel.delete({
      where: {
        id,
      },
    });
  }
};
export const getAppIdActiveByShop = async (shop: string) =>{
  return await db.cApi_MetaPixel.findMany(
    {
      where: {
        shopName:shop,
        isActiveCApi: true,
        status: true
      },
    }
  )
}
export const confirmPixel = async (data:any) =>{
  // console.log(process.env.BACKEND_URL,data)
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  return await 
  fetch(`${process.env.BACKEND_URL}/api/pixel/confirm`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(data),
    keepalive: true
  });
}