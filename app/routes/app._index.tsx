/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-duplicates */
import type { ActionFunctionArgs, LoaderFunction} from "@remix-run/node";
import { json,redirect } from "@remix-run/node";
import { defer, useLoaderData } from "@remix-run/react";

import { authenticate } from "~/shopify.server";
import { DEFAULT_EVENTS } from "~/constants/events";
import {
  getAllEventDataToDayPlatformService,
  getEventDataRangePlatformService,
} from "~/backend/services/eventData.service";
import type { ReviewCreate } from "~/backend/types/review.type";
import { 
  createProfileAppConfigService, 
  createProfileAppConfigThemeAppService, 
} from "~/backend/services/profileAppConfig.service";
import { 
  dateToString, 
  extractOffsetFromString, 
  formatDateAtLocalOffset, 
  reduceByDay  
} from "~/utils";
import { appConfig } from "~/constants/options";
import { getReportEventPlatformByShopService } from "~/backend/services/reportEvent.service";
import { IEventDataByDate } from "~/backend/types/eventData.type";
import { getDataCacheProfileAppConfig, getDataCacheReportSevenDayFB } from "~/backend/external_apis/backend_pixel/pixel_api.service";
import Home from "~/components/home/Home";
import { checkOnboarding } from "~/utils/checkOnBoarding";

export interface IProfileConfigApp {
  shop?:string,
  appConfigId:number,
  value:string
}

export const loader: LoaderFunction = async ({ request }) => {
  // const { session } = await authenticate.admin(request);
  // const {shop} = session;

  // let listProfileConfigApp:IProfileConfigApp[] = await getDataCacheProfileAppConfig(shop);

  // let isOnBoarding;
  // let isConfigThemeApp;
  // let isReview: boolean = false;

  // if (listProfileConfigApp) {
  //   listProfileConfigApp.forEach((item: IProfileConfigApp)=>{
  //     if(item.appConfigId === appConfig.reviewApp){
  //       const { star, isClose } = JSON.parse(item.value);
  //       isReview = (star === 5 || isClose === true) ? true : false;
  //     }
  //     if(item.appConfigId === appConfig.stepOnBoarding){
  //       isOnBoarding = true;
  //     }else if(item.appConfigId === appConfig.themeApp && item.value === "true"){
  //       isConfigThemeApp = true;
  //     }
  //   })
  // }
  const { isOnBoarding, isConfigThemeApp, isReview, shop }: any = await checkOnboarding(request);

  // Trả về màn Home
  if (!isOnBoarding) {
    const url = new URL(request.url);
    return redirect(`/app/onboarding?${url.searchParams.toString()}`)
  }
  const sevenDayAgo =  reduceByDay(7);
  const oneDayAgo =  reduceByDay(1);

  // default 7 day
  const eventsData = getDataCacheReportSevenDayFB(shop, "facebook") 

  const initialRange = {
      since: sevenDayAgo,
      until: oneDayAgo
    }

  return defer({
      isOnBoarding,
      isReview,
      isReport:true,
      eventsData,
      initialRange,
      shop: shop,
      isConfigThemeApp,
    });
};

export async function action({ request }: ActionFunctionArgs): Promise<Response> {
  try {
    const { session, admin } = await authenticate.admin(request);
    const { shop } = session;

    var formDataAction: any = {
      ...Object.fromEntries(await request.formData()),
    };

    let isThemeApp:any = false;
    if(formDataAction &&
      formDataAction?.action === "checkThemeApp"){
        const { data } = await admin.rest.resources.Theme.all({
          session: session,
        });
      
        let id = null;
      
        data.forEach((element) => {
          if (element.role === "main") {
            id = element.id;
            return;
          }
        });
      
        const asset = await admin.rest.resources.Asset.all({
          session: session,
          theme_id: id,
          asset: { key: "config/settings_data.json" },
        });

        const assetData = JSON.parse(asset.data[0].value as string)

          if (!(assetData.current === "Default")) {
            for (let key in assetData.current.blocks) {

              const assetAppEmbeds = assetData.current.blocks[key];
              let typeSplit = assetAppEmbeds.type.split("/");

              typeSplit.pop();

              const stringType = typeSplit.join("/");

              if (stringType == process.env.THEME_APP_NAME) {
                if (!assetAppEmbeds.disabled === true) {
                  isThemeApp = true;
                }
                break;
              }
            }
          }
          await createProfileAppConfigThemeAppService(shop, appConfig.themeApp, "true", isThemeApp);
    }

    if(formDataAction &&
      formDataAction?.action === "createConfigOnboarding"){
      const res = await createProfileAppConfigService(shop, appConfig.stepOnBoarding, "true");
      if (res.isSuccessful) return redirect(`/app/pixel-manager`);
    }

    // start action Review
    if (formDataAction && formDataAction.action == "createReview") {
      const data: ReviewCreate = {
        shop: shop,
        star: Number(formDataAction.star),
        review: formDataAction.review,
        isClose: String(formDataAction.isClose).toLowerCase() === "true",
      };
        // await createReviewService(data);
        await createProfileAppConfigService(shop,appConfig.reviewApp, JSON.stringify(data));
    }
      
    // End action Review

    const eventNameMap: Array<{ value: string; label: string }> =
    DEFAULT_EVENTS.map((obj: any) => ({
      value: obj.display_name,
      label: obj.display_name,
      color:obj.color
    }));
    const defaultEventShopify = DEFAULT_EVENTS.map(
      (obj: any) => obj.display_name
    );

    let eventsData:any = [];
    let isReport;
    let isFlagEventData = false;
    if(formDataAction && formDataAction?.until && formDataAction?.since){

      const since = formatDateAtLocalOffset(new Date(formDataAction?.since), extractOffsetFromString(formDataAction?.since))
      const until = formatDateAtLocalOffset(new Date(formDataAction?.until), extractOffsetFromString(formDataAction?.until))
      const today = dateToString(new Date())

      const day = until === since ? true : false;

      const data:IEventDataByDate = {
        shop:shop,
        since,
        until,
        platform: formDataAction?.platform || ""
      }

      if(day){
        if(today === until){
          eventsData =
          (await getAllEventDataToDayPlatformService(data)).result || [];
        }else{
          eventsData =
          (await getEventDataRangePlatformService(data)).result || [];
        }
      }else{
        isReport = true
        if(formDataAction?.aliasOfDateRange === "last7days"){
          eventsData = await getDataCacheReportSevenDayFB(session.shop, formDataAction.platform);
        }else{
          eventsData = (await getReportEventPlatformByShopService(data)).result || [];
        }
      }
      isFlagEventData = true;
    }
    // Feature and Vote
    // if (
    //   formDataAction &&
    //   formDataAction?.action === "voteAction"
    // ) {
    //   let dataUpdate= {
    //     id:Number(formDataAction.idFeature),
    //     voteNumber:formDataAction.voteNumber,
    //     updatedAt: new Date()
    //   };
    //   if(formDataAction?.voteId === "null"){
    //     const data = {
    //       idFeature:Number(formDataAction.idFeature),
    //       shop:shop,
    //       status:1,
    //       updatedAt: new Date()
    //     }
    //     dataUpdate.voteNumber = ++formDataAction.voteNumber,
    //     await createVoteService(data);
        
    //   }else{

    //     let data = {
    //       id:Number(formDataAction.voteId),
    //       status:0,
    //       updatedAt: new Date()
    //     }
    //     if(formDataAction.voteStatus == 1){
    //       dataUpdate.voteNumber = --formDataAction.voteNumber;
    //     }else{
    //       data.status = 1;
    //       dataUpdate.voteNumber = ++formDataAction.voteNumber;
    //     }
    //     await updateVoteService(data);
    //   }
    //   await updateFeatureService(dataUpdate);
    // }

    // if (
    //   formDataAction &&
    //   formDataAction?.action === "createFeature"
    // ){
    //   const data={
    //     shop,
    //     title:formDataAction.title,
    //     description:"",
    //     voteNumber:0,
    //     status:-2
    //   }
    //   await createFeatureService(data);
    // }
  
    return json({
      isThemeApp,
      eventsData,
      isFlagEventData,
      shop: session.shop,
      defaultEventShopify,
      eventNameMap,
      formDataAction,
      isReport,
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

export default function Dashboard() {
  const loaderData:any = useLoaderData<typeof loader>();
  return (
    <div>
      <Home {...loaderData}/>  
    </div>
  )
}