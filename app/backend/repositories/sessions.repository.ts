import db from "~/db.server";
export const getSessionByShopRepo = async (shop: string) => {
    try{
        return await db.session.findFirst({
            where: {
              shop,
            },
          });
    }
    catch (error) {
        throw error;
    }
  };