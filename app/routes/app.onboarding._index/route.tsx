/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-duplicates */
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useSubmit, useActionData, useRouteLoaderData } from "@remix-run/react";
import {
  Card,
  Button,
  Page,
  ProgressBar,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import { authenticate } from "~/shopify.server";
import { createProfileAppConfigService, createProfileAppConfigThemeAppService } from "~/backend/services/profileAppConfig.service";
import { appConfig } from "~/constants/options";
import { ILoaderRoot } from "~/types/common.type";
import OnBoardingStepOne from "./OnBoardingStepOne";
import OnBoardingStepTwo from "./OnBoardingStepTwo";
import OnBoardingStepThree from "./OnBoardingStepThree";
import { apiGetShopInFo } from "~/backend/external_apis/shopify/shop.service";
import { confirmPixel, createProfileShop } from "~/backend/services/profileShop.service";
import { IProfileShopCreate, IProfileShopUpdate } from "~/backend/types/profileShop.type";
import { setProfileShopToCache } from "~/backend/redis/profile.service";

export async function action({ request }: ActionFunctionArgs): Promise<Response> {
    try {
      const { session, admin } = await authenticate.admin(request);
      const { id, accessToken, shop } = session;
  
      var formDataAction: any = {
        ...Object.fromEntries(await request.formData()),
      };
  
      let isThemeApp:any;
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
                isThemeApp = false;
              }
            }else{
              isThemeApp = false;
            }
            await createProfileAppConfigThemeAppService(shop, appConfig.themeApp, "true", isThemeApp);
      }
  
      if(formDataAction &&
        formDataAction?.action === "createConfigOnboarding"){
          const shopInstall = (await apiGetShopInFo({
            shop: shop,
            token: accessToken || "",
          })) as any;
      
          //confirm pixel for web pixel
          const data: any = {
            id: id,
            name: shop,
            accessToken: accessToken,
          };
          let isConfirmPixel = false;
            const res_confirm = await confirmPixel(data);
            if (res_confirm) {
              isConfirmPixel = true;
            }
          
          const profileData: IProfileShopCreate = {
            shop,
            shopId: shopInstall?.id.toString(),
            shopName:shopInstall.name,
            domain: shopInstall?.domain,
            email: shopInstall?.email || "",
            country: shopInstall?.country_name,
            planShopify:shopInstall?.plan_name,
            installApp: true,
            facebookName: "",
            facebookAvatar: "",
            accessTokenFb: "",
            timezone:shopInstall?.timezone,
            isConfirmPixel,
            isBlackList:false,
          };
          // insert profile shop to CSDL
          const resDB = await createProfileShop(profileData);
          if(resDB.isSuccessful){
            // insert profile shop to Redis
            await setProfileShopToCache(resDB.result as IProfileShopUpdate);
          }
          const res = await createProfileAppConfigService(shop, appConfig.stepOnBoarding, "true");
          if (res.isSuccessful) return redirect(`/app/pixel-manager`);
      }
    
      return json({
        isThemeApp,
        shop: session.shop,
        formDataAction,
      });
    } catch (error) {
      console.error("Error processing the request:", error);
      return new Response("Internal Server Error", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
}

export default function HomeOnBoarding() {
    const { shop } =  useRouteLoaderData('root') as ILoaderRoot ;
    let actionData:any = useActionData<ActionFunctionArgs>();
    const submit = useSubmit();

    const averageProgress = 100/3;
    const [identifystepOnBoarding,setIdentifyStepOnBoarding] = useState<number>(1);
    const [numberProgress, setNumberProgress] = useState<number>(averageProgress);
    const [isButtonCreatePixel,setIsButtonCreatePixel] = useState(true);
    const [isThemeAppNextStep,setIsThemeAppNextStep] = useState(false);
    const [isThemeAppAction, setIsThemeAppAction] = useState<boolean | undefined>(undefined);

    const handleContinue = useCallback(()=>{
        if(identifystepOnBoarding === 1){
        setIsButtonCreatePixel(false)
        submit({action:'checkThemeApp'},{method:"post"})
        setIsThemeAppNextStep(true);
        }else if(identifystepOnBoarding === 2){
        setIsButtonCreatePixel(false)
        submit({action:'checkThemeApp'},{method:"post"})
        }else{
        setNumberProgress((prev)=>prev + averageProgress)
        setIdentifyStepOnBoarding(identifystepOnBoarding+1)
        }
    },[identifystepOnBoarding, averageProgress, setNumberProgress, setIdentifyStepOnBoarding, submit])


    useEffect(()=>{
        setIsButtonCreatePixel(true)
        if(isThemeAppNextStep){
        setIsThemeAppAction(actionData?.isThemeApp === true);
        setIdentifyStepOnBoarding(identifystepOnBoarding+1)
        setNumberProgress((prev)=>prev + averageProgress)
        setIsThemeAppNextStep(false);
        }else{
        if(actionData){
            if( actionData?.isThemeApp === true ){
              setIsThemeAppAction(true);
              setNumberProgress((prev)=>prev + averageProgress)
              setIdentifyStepOnBoarding(identifystepOnBoarding + 1)
            }else{
              setIsThemeAppAction(false);
            }
        }
        }
    },[actionData])

    const handleCreateConfigOnboarding = ()=>{
        setIsButtonCreatePixel(false);
        submit({action:"createConfigOnboarding"},{method:"post"})
    }

    const steps = [
        {
            id: 1,
            component: <OnBoardingStepOne/>
        },
        {
            id: 2,
            component:
                <OnBoardingStepTwo shop={shop}
                    actionData={actionData}
                    isButtonCreatePixel={isButtonCreatePixel}
                    averageProgress={averageProgress}
                    identifystepOnBoarding={identifystepOnBoarding}
                    setNumberProgress={setNumberProgress}
                    setIdentifyStepOnBoarding={setIdentifyStepOnBoarding}
                    isThemeAppAction={isThemeAppAction}
                />
        },
        {
            id: 3,
            component: 
                <OnBoardingStepThree 
                  actionData={actionData}
                  isThemeAppAction={isThemeAppAction}
                />
        }
    ]

    return (
        <Page>
        <Card>
            <div className="">
            { 
                identifystepOnBoarding > 1 &&
                <Button variant="tertiary" size="large" icon={ArrowLeftIcon} onClick={()=>{
                    setNumberProgress((prev)=>Math.max(prev-averageProgress, averageProgress));
                    setIdentifyStepOnBoarding(Math.max(identifystepOnBoarding-1,1 ))}} 
                />
            }

            {
                steps.find((step:any)=>step.id === identifystepOnBoarding)?.component
            }
            
            <div className="mb-2">
            <ProgressBar progress={numberProgress} size="small" tone="success"/>
            </div>
            <div className=" mt-4 flex justify-center">
            
            { 
                identifystepOnBoarding === 3 ? 
                <Button variant="primary" loading={!isButtonCreatePixel} onClick={handleCreateConfigOnboarding}>Create new pixel</Button>
                : 
                <Button variant="primary" loading={!isButtonCreatePixel} onClick={handleContinue}>Continue</Button>
            }
            
            </div>
            </div>
        </Card>
        </Page>
        )
}