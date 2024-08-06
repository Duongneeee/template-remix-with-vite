import { LOG_LEVELS, sentryLogger } from "~/utils/logger";
import type { ReviewCreate, ReviewUpdate } from "../types/review.type";
import db from "~/db.server";

export const createReviewRepo = async (data: ReviewCreate) => {
  try {
    return await db.reviews.create({ data });
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in createReviewRepo", {
      additionalInfo: error,
    });

    throw error;
  }
};

export const updateReviewRepo = async (data: ReviewUpdate) => {
  try {
    return await db.reviews.update({
      where: { id: data.id },
      data: { ...data },
    });
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateReivewRepo", {
      additionalInfo: error,
    });

    throw error;
  }
};

export const updateReviewIsCloseRepo = async (shop:string)=>{
  try{
    const review = await db.reviews.findFirst({
      where:{
        shop,
        NOT:{
          isClose:false
        }
      }
    })
    if(review){
      return await db.reviews.update({
        where:{
          id:review.id
        },
        data:{
          ...review,
          isClose:(!review.isClose)
        }
      })
    }
  }catch(error){
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateReivewRepo", {
      additionalInfo: error,
    });
  }
}

export const getListReviewRepo = async (shop: string) => {
  return await db.reviews.findFirst({
    where: {
      shop,
      OR:[
        {
          isClose:true,
        },
        {
          star:5
        }
      ]
    },
    orderBy:{
      createdAt:'desc'
    }
  });
};

export const getFirstReviewRepo = async (shop:string) => {
  try {
    return await db.reviews.findFirst({
      where: { shop }
    });
  } catch (error) {
    sentryLogger(LOG_LEVELS.ERROR, "Error in getFirstReviewRepo", {
      additionalInfo: error,
    });

    throw error;
  }
};