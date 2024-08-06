import db from "~/db.server";
import { IFeatureRequest, IFeatureRequestUpdate } from "../types/feature.type";
import { LOG_LEVELS, sentryLogger } from "~/utils/logger";
export const getFeatureRepository = async(data:any)=>{
  try{
    return await db.feature.findFirst({
      where: {
        ...data
      },
    });
  }catch(error){
    console.log("Error getFeatureRepository: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getFeatureRepository", {
      additionalInfo: error,
    });
  }
}

export const  getAllFeatureRepository = async (shop:string)=>{
  try{
    return await db.$queryRaw` SELECT f.*, v.id as voteId, v.status as voteStatus
    FROM Feature f
    LEFT JOIN Vote v ON f.id = v.idFeature AND v.shop=${shop} WHERE f.status <> -2`
  }catch(error){
    console.log("Error getAllFeatureRepository: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in getAllFeatureRepository", {
      additionalInfo: error,
    });
  }
}

export const createFeatureRepository = async (data:IFeatureRequest) =>{
  try{
    return await db.feature.create({data})
  }catch(error){
    console.log("Error createFeatureRepository: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in createFeatureRepository", {
      additionalInfo: error,
    });
  }
}

export const updateFeatureRepository = async (data:IFeatureRequestUpdate) =>{
  try{
    return await db.feature.update({
      where: { id: data.id },
      data: { ...data },
    })
  }catch(error){
    console.log("Error updateFeatureRepository: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateFeatureRepository", {
      additionalInfo: error,
    });
  }
}