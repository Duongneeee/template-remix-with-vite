import prisma from "~/db.server";
import { sentryLogger, LOG_LEVELS } from "~/utils/logger";

export const getAllParametersRepo = async (shop: string) => {
    try {
      const res = await prisma.parameters.findMany({
        where: {
          shop,
        },
      });
      return {
        result: res,
        isSuccessful: true,
      };
    } catch (error) {
      console.log(error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getAllParametersRepo", {
        additionalInfo: error,
      });
      return {
        message: error,
        isSuccessful: false,
      };
    }
  };