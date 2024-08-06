import { LOG_LEVELS, sentryLogger } from "~/utils/logger";
import type { ReviewCreate, ReviewUpdate } from "../types/review.type";
import { createReviewRepo, getFirstReviewRepo, getListReviewRepo, updateReviewIsCloseRepo, updateReviewRepo } from "../repositories/review.repository";

export const createReviewService = async (data: ReviewCreate) => {
  try {
    const existingRecord = await getFirstReviewRepo(data.shop);
    if(!existingRecord){
      const res = await createReviewRepo(data);
      return {
        isSuccessful: true,
        result:res
      }
    }else{
      const dataUpdate: ReviewUpdate = {
        ...data,
        id: existingRecord.id
      }
      const res = await updateReviewService(dataUpdate);
      return {
        isSuccessful: true,
        result:res
      }
    }
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in createReviewService", {
      additionalInfo: error,
    });
    return {
        isSuccessful: false,
        errorCode:"500",
        message: error
    }
  }
};

export const updateReviewService = async (data: ReviewUpdate) => {
  try {
    const res = await updateReviewRepo(data);
    return {
      isSuccessful: true,
      result:res
    }
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in CeateReviewService", {
      additionalInfo: error,
    });
    return {
        isSuccessful: false,
        errorCode:"500",
        message: error
    }
  }
};

export const updateReviewIsCloseService = async (shop:string) => {
  try {
    const res = await updateReviewIsCloseRepo(shop);
    return {
      isSuccessful: true,
      result:res
    }
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in CeateReviewService", {
      additionalInfo: error,
    });
    return {
        isSuccessful: false,
        errorCode:"500",
        message: error
    }
  }
};

export const getReviewService = async (shop:string) => {
  try {
    const res = await getListReviewRepo(shop);
    return {
      isSuccessful: true,
      result:res
    }
  } catch (error) {
    console.log(error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in CeateReviewService", {
      additionalInfo: error,
    });
    return {
        isSuccessful: false,
        errorCode:"500",
        message: error
    }
  }
};
