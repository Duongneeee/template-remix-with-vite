import { getDataCacheProfileAppConfig } from "~/backend/external_apis/backend_pixel/pixel_api.service";
import { redirect } from "@remix-run/node";
import { appConfig } from "~/constants/options";
import { IProfileConfigApp } from "~/routes/app._index";
import { authenticate } from "~/shopify.server";

export async function checkOnboarding(request:Request)  {
    const { session } = await authenticate.admin(request);
    const {shop} = session;

  let listProfileConfigApp:IProfileConfigApp[] = await getDataCacheProfileAppConfig(shop);

  let isOnBoarding = false;
  let isConfigThemeApp = false;
  let isReview: boolean = false;

  if (listProfileConfigApp) {
    listProfileConfigApp.forEach((item: IProfileConfigApp)=>{
      if(item.appConfigId === appConfig.reviewApp){
        const { star, isClose } = JSON.parse(item.value);
        isReview = (star === 5 || isClose === true) ? true : false;
      }
      if(item.appConfigId === appConfig.stepOnBoarding){
        isOnBoarding = true;
      }else if(item.appConfigId === appConfig.themeApp && item.value === "true"){
        isConfigThemeApp = true;
      }
    })
}
    return {isOnBoarding, isConfigThemeApp, isReview, shop}
}
