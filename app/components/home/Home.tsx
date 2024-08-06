/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-duplicates */
import type { ActionFunctionArgs } from "@remix-run/node";
import { useActionData, Await } from "@remix-run/react";
import {
  Page,
  List,
} from "@shopify/polaris";
import { Crisp } from "crisp-sdk-web";
import BannerNoti from "../common/BannerNoti";
import FooterComponent from "../common/FooterComponent";
import Review from "./Review";
import Post from "./Post";
import DataEventHome from "./DataEventHome";
import { Suspense, useState } from "react";
import SkeletonDataEvent from "./SkeletonDataEvent";

export interface IHomeProps{
  shop: string
  isOnBoarding: boolean
  isReview: boolean
  isReport: boolean
  eventsData: any
  initialRange: any
  isConfigThemeApp: boolean
}
export default function Home(props:IHomeProps) {

  var loaderData: any;
  var actionData: any;

  loaderData = {...props};
  actionData = useActionData<ActionFunctionArgs>();

  //xac dinh co isBannerThemeApp la true hay false de hien thi
  const isBannerThemeApp = (!actionData || actionData?.isThemeApp == false) ? !loaderData.isConfigThemeApp : !actionData?.isThemeApp ;
  
  //start Review
  const [openReview, setOpenReview] = useState<Boolean>(
    loaderData.isReview
  );
  //end Review

  //suggest feature star

  // const [isSuggestFeature, setIsSuggestFeature] = useState<boolean>(false);
  // const [valueSuggestFeature, setValueSuggestFeature] = useState("");

  // const handleLike = (voteId: number, voteStatus: number, idFeature: number, voteNumber: number) => {
  //   const data:any = {
  //     action: "voteAction",
  //     idFeature,
  //     voteId,
  //     voteStatus,
  //     voteNumber,
  //   }
  //   submit(data , {method:"post"})
  //   shopify.toast.show('Vote Success')
  // }

  // const handleSubmitFeature = ()=>{
  //   const data: any = 
  //   {
  //     action: 'createFeature',
  //     title: valueSuggestFeature,
  //     since: selectedRange.since,
  //     until: selectedRange.until,
  //   }
  //   submit(data, {method:'post'})
  //   setIsSuggestFeature(!isSuggestFeature)
  //   shopify.toast.show("Feature Create")
  // }
  
  //end suggest feature

  const handleClick = ()=>{
    Crisp.chat.open();
    Crisp.message.sendText(
      'I want to learn about Zotek Pixel.'
    );
  }

  return (
      <Page 
        title="Home"
      >
        {!openReview && <Review dismiss={() => setOpenReview(true)} />}
        {isBannerThemeApp && (
          <div className="mb-3">
            <BannerNoti
              title="Before using our app, please make the following changes:"
              url={`https://${loaderData.shop}/admin/themes/current/editor?context=apps`}
              content="Enable now"
              tone="warning"
            >
              <List>
                <List.Item>
                  <p>
                  Activate the pixel by turning on our app. Go to <span className="font-semibold">Online Store</span> &gt; <span className="font-semibold">Customize</span> &gt; <span className="font-semibold">App Embeds</span>, or hit Enable below. Then switch on <span className="font-semibold">Zotek Multiple Pixel</span>.
                  </p>
                </List.Item>
              </List>
            </BannerNoti>
          </div>
        )}
        
        {/* loader eventsData streaming*/}
        <Suspense fallback = {<SkeletonDataEvent/>}>
          <Await resolve={loaderData.eventsData}>
              {(eventsData: any) => { 
                  const loaderDataAwait = {...loaderData, eventsData};
                  return <DataEventHome {...loaderDataAwait}/>;
                }}
          </Await>
        </Suspense>

        <Post/>

        <div className="mt-3">
          <p className="flex justify-center">
            <i>
                Please note: The tracking data report will follow the date you
                have selected. The maximum is the last <span className="font-bold">60 days</span>. All times
                in <span className="font-bold">UTC</span>
            </i>
          </p>
        </div>

        <FooterComponent
          text={"Zotek Pixel"}
          handleClick={handleClick}
        />
      </Page>
  );
}