import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-07";
import prisma from "./db.server";
// import { apiGetShopInFo } from "./backend/external_apis/shopify/shop.service";
// import { confirmPixel, createProfileShop } from "./backend/services/profileShop.service";
// import { IProfileShopCreate, IProfileShopUpdate } from "./backend/types/profileShop.type";
// import { setProfileShopToCache } from "./backend/redis/profile.service";
import { pushNoticeInstallTelegram } from "./backend/external_apis/telegram/initInstallTasks.service";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.July24,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  restResources,
  hooks: {
    afterAuth: async ({ session }) => {
  //     const start = performance.now();
  //     shopify.registerWebhooks({ session });
  //     const { accessToken, id, shop }: any = session;

  //     const shopInstall = (await apiGetShopInFo({
  //       shop: shop,
  //       token: accessToken || "",
  //     })) as any;
    
  //     try {
  //       //confirm pixel for web pixel
  //       const data: any = {
  //         id: id,
  //         name: shop,
  //         accessToken: accessToken,
  //       };
  //       let isConfirmPixel = false;
  //         const res_confirm = await confirmPixel(data);
  //         if (res_confirm) {
  //           isConfirmPixel = true;
  //         }
        
  //       const profileData: IProfileShopCreate = {
  //         shop,
  //         shopId: shopInstall?.id.toString(),
  //         shopName:shopInstall.name,
  //         domain: shopInstall?.domain,
  //         email: shopInstall?.email || "",
  //         country: shopInstall?.country_name,
  //         planShopify:shopInstall?.plan_name,
  //         installApp: true,
  //         facebookName: "",
  //         facebookAvatar: "",
  //         accessTokenFb: "",
  //         timezone:shopInstall?.timezone,
  //         isConfirmPixel,
  //         isBlackList:false,
  //       };
  //       // insert profile shop to CSDL
  //       const resDB = await createProfileShop(profileData);
  //       if(resDB.isSuccessful){
  //         // insert profile shop to Redis
  //         await setProfileShopToCache(resDB.result as IProfileShopUpdate);
  //       }
  //       const end = performance.now();
  //       console.log(`Thời gian thực thi: ${end - start} mili giây`);
  //     } catch (error) {
  //       console.log('error create Profile:', error)
  //     }

      await pushNoticeInstallTelegram({myshopify_domain: session.shop, country_name:'', email:''});

    },
  },
  future: {
    unstable_newEmbeddedAuthStrategy: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.July24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
