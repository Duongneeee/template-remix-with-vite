import prisma from "~/db.server";
import { pushNoticeTelegramUninstall } from "../external_apis/telegram/initInstallTasks.service";
import { updateProfileShopUninstall } from "../services/profileShop.service";
import { IProfileShopUpdate } from "../types/profileShop.type";
import { updateManyPixelService } from "../services/cApiConfig.service";
import { ICApi_MetaPixelUpdate } from "../types/cApiConfig.type";
// import { updateReviewIsCloseService } from "../services/review.service";
import { delDataCacheProfileAppConfig } from "../external_apis/backend_pixel/pixel_api.service";

export const deleteUserDataRepo = async (shop: string) => {
  try {
      await prisma.$transaction([
      prisma.session.deleteMany({ where: { shop } }),
      prisma.$queryRaw`DELETE FROM EventsData WHERE shop = ${shop}`,
      prisma.$queryRaw`DELETE FROM EventsDataTiktok WHERE shop = ${shop}`,
      prisma.profileAppConfig.deleteMany({where: {shop} }),
      // prisma.profileShop.deleteMany({ where: { shop } }),
      // prisma.cApi_MetaPixel.deleteMany({ where: { shop } }),
    ]);

    await delDataCacheProfileAppConfig(shop);
    const data = {
      shop: shop,
      isConfirmPixel:false,
      installApp:false
    } as IProfileShopUpdate
    await updateProfileShopUninstall(data);

    const dataPixel = {
      shop:shop,
      status:false
    } as ICApi_MetaPixelUpdate

    await updateManyPixelService(dataPixel);
    // await updateReviewIsCloseService(shop);
    const bodyContentTele = `${shop} just uninstalled the Zotek Facebook Pixel.`;
    await pushNoticeTelegramUninstall(shop, bodyContentTele);
  } catch (error: any) {
    console.log(error);
    await pushNoticeTelegramUninstall(shop, `${shop} just uninstalled with error: ${error?.message || ""}`);
  }
};

export const deleteUserDataByPixelIdRepo = async (data:any) => {
  try {
    if(data?.platform === 'facebook') {
      await prisma.$transaction([
        prisma.$queryRaw`DELETE FROM EventsData WHERE pixelId = ${data.pixelId} and shop = ${data.shop}`,
        prisma.cApi_MetaPixel.delete({ where: { id:data.id } })
      ]);
    }else{
      await prisma.$transaction([
        prisma.$queryRaw`DELETE FROM EventsDataTiktok WHERE pixelId = ${data.pixelId} and shop = ${data.shop}`,
        prisma.cApi_MetaPixel.delete({ where: { id:data.id } })
      ]);
    }
  } catch (error) {
     console.log(error);
  }
};
