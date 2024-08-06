import { LOG_LEVELS, sentryLogger } from "~/utils/logger";
import { createVoteRepository, updateVoteRepository } from "../repositories/vote.repository";

// export const getFeatureService = async (data:any) => {
//     try {
//       const res = await getFeatureRepository(data);
//       return {
//         isSuccessful: true,
//         result: res,
//       };
//     } catch (error) {
//       console.log("Error getAllEventDataService: ", error);
//       sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataService ", {
//         additionalInfo: error,
//       });
//       return {
//         isSuccessful: false,
//         errorCode: "500",
//         message: error,
//       };
//     }
// };

// export const getAllFeatureService = async (shop:string) => {
//     try {
//       const res = await getAllFeatureRepository(shop);
//       return {
//         isSuccessful: true,
//         result: res,
//       };
//     } catch (error) {
//       console.log("Error getAllEventDataService: ", error);
//       sentryLogger(LOG_LEVELS.ERROR, "Error in getAllEventDataService ", {
//         additionalInfo: error,
//       });
//       return {
//         isSuccessful: false,
//         errorCode: "500",
//         message: error,
//       };
//     }
// };

export const createVoteService = async (data:any) => {
  try {
    const res = await createVoteRepository(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log("Error createVoteService: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in createVoteService ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

export const updateVoteService = async (data:any) => {
  try {
    const res = await updateVoteRepository(data);
    return {
      isSuccessful: true,
      result: res,
    };
  } catch (error) {
    console.log("Error updateVoteRepository: ", error);
    sentryLogger(LOG_LEVELS.ERROR, "Error in updateVoteRepository ", {
      additionalInfo: error,
    });
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};