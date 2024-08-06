import db from "~/db.server";
import { LOG_LEVELS, sentryLogger } from "~/utils/logger";

export const createVoteRepository = async (data:any) =>{
  try{
    const existingRecord = await db.vote.findFirst({where:{shop:data.shop,idFeature:data.idFeature}})
    if(!existingRecord) return await db.vote.create({data})
  }catch(error){
    console.log("Error createVoteRepository: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in createVoteRepository", {
      additionalInfo: error,
    });
  }
}

export const updateVoteRepository = async (data:any) =>{
  try{
    return await db.vote.update({
      where: { id: data.id },
      data: { ...data },
    })
  }catch(error){
    console.log("Error updateVoteRepository: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateVoteRepository", {
      additionalInfo: error,
    });
  }
}