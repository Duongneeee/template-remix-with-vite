/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-duplicates */
import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { json,  redirect } from "@remix-run/node";
import { useLoaderData, useSubmit, useActionData } from "@remix-run/react";
import { 
  Button, 
  Card, 
  Collapsible, 
  Grid, 
  Icon, 
  Page, 
  Scrollable, 
  Text 
} from "@shopify/polaris";
import { ComponentType, lazy, Suspense, useCallback, useEffect, useState } from "react";
import { authenticate } from "~/shopify.server";
import { 
  RefreshIcon, 
  ChevronDownIcon, 
} from "@shopify/polaris-icons";
import {
  ConvertIntData,
  calculatePercentage,
  convertToISOFormat,
  countEventNamesByAppId,
  customPixelsByPlatform,
  dateToString,
  extractOffsetFromString,
  filterEventByDateAndNameAndAppId,
  filterUniqueEventByEventTimeAndName,
  formatDateAtLocalOffset,
  mapViewSourceAppIdCustom,
  reduceByDay,
} from "~/utils";
import { maxCountEventByAppId, maxCountEventByAppIdReportAnalytic } from "~/constants/events";
import type { IOptionsSrc } from "~/models/analytics.types";
import ComboboxSearch from "~/components/analytic/ComboboxSearch";
import { getAllEventDataToDayPlatformService, getEventDataRangePlatformService } from "~/backend/services/eventData.service";
import { DEFAULT_EVENTS } from "~/constants/events";
import { getListPixelByShopService } from "~/backend/services/cApiConfig.service";
import { 
  getReportEventAnalyticByPixelIdService, 
  getReportEventAnalyticByShopService, 
  getReportEventAnalyticTableByPixelIdService, 
  getReportEventAnalyticTableByShopService, 
} from "~/backend/services/reportEvent.service";
import LineChartPageAnalytic from "~/charts/LineChartPageAnalytic";
import { lstPlatform } from "~/constants/options";
import { IEventDataByDate } from "~/backend/types/eventData.type";
import Campaign from "./campaign";
import PopoverMutiple from "~/components/analytic/PopoverMutiple";
// import DateRangePicker from "~/components/common/DateRangePicker";
import ReportTable from "~/components/analytic/ReportTable";
import FooterComponent from "~/components/common/FooterComponent";
import ConversionRateBox from "~/components/common/conversionRate/ConversionRateBox";
import TotalEventBox from "~/components/common/totalEvent/TotalEventBox";
import { checkOnboarding } from "~/utils/checkOnBoarding";

const DateRangePicker = lazy(() => import("~/components/common/DateRangePicker.js").then(module => module as unknown as { default: ComponentType<any> }));

export const loader: LoaderFunction = async ({ request }) => {
  // const { session } = await authenticate.admin(request);
  // const {shop} = session;

  const { isOnBoarding, shop }: any = await checkOnboarding(request);

  if(!isOnBoarding){
    const url = new URL(request.url);
    return redirect(`/app/onboarding?${url.searchParams.toString()}`)
  }

  // Calculate the date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const eventNameMap: Array<{ value: string; label: string }> =
    DEFAULT_EVENTS.map((obj: any) => ({
      value: obj.display_name,
      label: obj.display_name,
      color: obj.color
    }));

  const defaultEventShopify = DEFAULT_EVENTS.map(
    (obj: any) => obj.display_name
  );

  // const eventsData = (await getAllEventDataService(session.shop)).result || [];
  // const today= new Date(convertToISOFormat(new Date()));
  // const eventsData =
  //   (await getAllEventDataToDayService(session.shop,today)).result || [];

  const sevenDayAgo =  reduceByDay(7);
  const oneDayAgo =  reduceByDay(1);

  const data:IEventDataByDate = {
    shop: shop,
    since: sevenDayAgo,
    until: oneDayAgo,
    platform: 'facebook'
  }

  const [ eventsDataResponse, eventsDataTableResponse, pixelsResponse, eventsCampaignResponse ] = await Promise.all([
    getReportEventAnalyticByShopService(data),
    getReportEventAnalyticTableByShopService(data),
    getListPixelByShopService(shop),
    getEventDataRangePlatformService(data)
  ])
  // const eventsData = ConvertIntData((await getReportEventAnalyticByShopService(data)).result) || [];
  // const eventsDataTable = ConvertIntData((await getReportEventAnalyticTableByShopService(data)).result) || [];
  // const pixels = (await getListPixelByShopService(session.shop)).result || [];

  const eventsData = ConvertIntData(eventsDataResponse.result) || [];
  const eventsDataTable = ConvertIntData(eventsDataTableResponse.result) || [];
  const pixels = pixelsResponse.result || [];
  const eventsCampaign = eventsCampaignResponse.result || [];

  const initialRange = {
    since: sevenDayAgo,
    until: oneDayAgo
  }

  // const pixels:any = [];
  // const pixelIdSrc = mapViewSourceAppId(pixels);

  return json({
    eventsData,
    eventsDataTable,
    eventsCampaign,
    initialRange,
    // pixelIdSrc,
    pixels,
    shop: shop,
    eventNameMap,
    defaultEventShopify,
  });
};

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response> {
  try {
    const { session } = await authenticate.admin(request);
    const { shop } = session;
    const formData = await request.formData() as any;
    const body = Object.fromEntries(formData) as any;

    const eventNameMap: Array<{ value: string; label: string }> =
      DEFAULT_EVENTS.map((obj: any) => ({
        value: obj.display_name,
        label: obj.display_name,
        color: obj.color
      }));

    const defaultEventShopify = DEFAULT_EVENTS.map(
      (obj: any) => obj.display_name
    );

    let eventsData:any = [];
    let eventsDataTable:any = [];
    let isReport;
    let isFlagEventData = false;
    let eventsCampaign:any = [];
  if(body && body?.until && body?.since){

    const since = formatDateAtLocalOffset(new Date(body?.since), extractOffsetFromString(body?.since))
    const until = formatDateAtLocalOffset(new Date(body?.until), extractOffsetFromString(body?.until))
    const today = dateToString(new Date())

    const data:IEventDataByDate = {
      shop:shop,
      since,
      until,
      platform: body?.platform || ""
    }
    const day = until === since ? true : false;
    if(day){
      if(today === until){
        eventsData =
        (await getAllEventDataToDayPlatformService(data)).result || [];
      }else{
        eventsData =
        (await getEventDataRangePlatformService(data)).result || [];
      }
      eventsCampaign = eventsData
    }else{
      const data:IEventDataByDate = {
        shop,
        since,
        until,
        pixelId:body?.pixelId,
        platform:body?.platform
      }
      if(body.pixelId){
        eventsData = ConvertIntData((await getReportEventAnalyticByPixelIdService(data)).result) || [];
        eventsDataTable = ConvertIntData((await getReportEventAnalyticTableByPixelIdService(data)).result) || [];
      }
      else{
        eventsData = ConvertIntData((await getReportEventAnalyticByShopService(data)).result) || [];
        eventsDataTable = ConvertIntData((await getReportEventAnalyticTableByShopService(data)).result) || [];
      }
      isReport = true
      eventsCampaign = (await getEventDataRangePlatformService(data)).result || [];
    }

    isFlagEventData = true;
  }
    const pixels = (await getListPixelByShopService(shop)).result || [];
    // const pixels:any = []
    // const pixelIdSrc = mapViewSourceAppId(pixels) || [];
    return json({
      eventsData,
      eventsDataTable,
      eventsCampaign,
      // pixelIdSrc,
      pixels,
      isFlagEventData,
      shop: session.shop,
      defaultEventShopify,
      eventNameMap,
      isReport
    });
  } catch (error) {
    console.error('Error processing the request:', error);

    // Handle the error and return an appropriate response
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

export default function Analytics() {
  var loaderData: any;
  var actionData: any;
  var eventsLoad: any;
  loaderData = useLoaderData<typeof loader>();
  actionData = useActionData<typeof action>();

  eventsLoad = actionData ? actionData : loaderData;

  const submit = useSubmit();
  const [selectedPlatform, setSelectedPlatform] = useState<string[]>(['facebook']);
  const [appIdSrc, setAppIdSrc] = useState<IOptionsSrc[]>(
    customPixelsByPlatform(eventsLoad.pixels, selectedPlatform[0])
  );
  const [isChangeAppIdSrc,setIsChangeAppIdSrc] = useState(false);
  const [appIdSearch, setAppIdSearch] = useState<string[]>([]);
  const [appIdSearchTiktok, setAppIdSearchTiktok] = useState<string[]>([]);
  const [eventsDataList, setEventsDataList] = useState(eventsLoad.eventsData);
  const [selectedRange, setSelectedRage] = useState<{
    since: Date;
    until: Date;
  }>({
    since: new Date(loaderData.initialRange.since),
    until: new Date(loaderData.initialRange.until),
  });
  const [isReportState, setIsReportState] = useState(eventsLoad?.isReport)
  // const countEvents = eventsLoad?.isReport ? maxCountEventByAppIdReportAnalytic(eventsDataList) : maxCountEventByAppId(eventsDataList);
  
  const eventNameMap = eventsLoad.eventNameMap;
  const [eventToCount, setEventToCount] =  useState(eventsDataList);
  const [stateSkeletonOfIndex, setStateSkeletonOfIndex] =  useState<boolean>(false);

  const countEvents = !actionData ? maxCountEventByAppIdReportAnalytic(eventToCount) : 
  (isReportState ? maxCountEventByAppIdReportAnalytic(eventToCount) : maxCountEventByAppId(eventsDataList));
  const pageViewCount = countEvents["PageView"] || 0;
  const AddToCartCount = countEvents["AddToCart"] || 0;
  const ViewContentCount = countEvents["ViewContent"] || 0;
  const InitiateCheckoutCount = countEvents["InitiateCheckout"] || 0;
  const PurchaseCount = countEvents["Purchase"] || 0;
  const CollectionViewCount = countEvents["CollectionView"] || 0;

  const [eventsSearch, setEventsSearch] = useState<string[]>([]);
  const vcRate = calculatePercentage(
    AddToCartCount,
    ViewContentCount,
    2
  );
  const atcRate = calculatePercentage(
    InitiateCheckoutCount,
    AddToCartCount,
    2
  );
  const icRate = calculatePercentage(
    PurchaseCount,
    InitiateCheckoutCount,
    2
  );

  //Start Tab facebook and tiktok
  const [open, setOpen] = useState(true);
  const handleToggle = useCallback(() => setOpen((open) => !open), []);
  //End Tab facebook and tiktok

  const handleRefreshData = () => {
    const data:any = {
      since:selectedRange.since,
      until:selectedRange.until,
      pixelId: selectedPlatform[0] === 'facebook' ? appIdSearch : appIdSearchTiktok,
      platform:selectedPlatform[0]
    }
    setStateSkeletonOfIndex(true);
    submit(data, { method: "post" });
  }

  useEffect(() => {
    if(actionData?.isFlagEventData){
      let selectEventsData = eventsLoad.eventsData;
        if(actionData && !actionData?.isReport){
          selectEventsData = filterEventByDateAndNameAndAppId(
            eventsLoad.eventsData,
            convertToISOFormat(selectedRange.since),
            convertToISOFormat(selectedRange.until),
            eventsSearch,
            selectedPlatform[0] === 'facebook' ? appIdSearch : appIdSearchTiktok
          );
        }
          setEventsDataList(selectEventsData);
          setIsReportState(eventsLoad.isReport)

          const eventToCount =  selectedPlatform[0] === 'facebook' ? 
          (appIdSearch.length > 0 && appIdSearch.length !== appIdSrc.length) ? eventsLoad?.eventsDataTable : eventsLoad.eventsData 
          : 
          (appIdSearchTiktok.length > 0 && appIdSearchTiktok.length !== appIdSrc.length) ? eventsLoad?.eventsDataTable : eventsLoad.eventsData;
          setEventToCount(eventToCount);
          setStateSkeletonOfIndex(false);
    }
  }, [actionData]);

  const handleDateRangeApply = async (_selectedRange: {
    since: Date;
    until: Date;
  }) => {
    try {
      setSelectedRage(_selectedRange);
      if (_selectedRange) {
        const data:any = {
          since:_selectedRange.since,
          until:_selectedRange.until,
          pixelId: selectedPlatform[0] === 'facebook' ? appIdSearch : appIdSearchTiktok,
          platform:selectedPlatform[0]
        }
        setStateSkeletonOfIndex(true);
        submit(data, { method: "post" });
      }
    } catch (error) {
      console.error("Error fetching updated data:", error);
    }
  };

  const handleChangeOptionAppId = async (value: string[]) => {
    if(selectedPlatform[0] === 'facebook'){
      setAppIdSearch(value);
    }else{
      setAppIdSearchTiktok(value);
    }

    const data:any = {
      since:selectedRange.since,
      until:selectedRange.until,
      pixelId:value,
      platform:selectedPlatform[0]
    }
    setStateSkeletonOfIndex(true);
    submit(data, { method: "post" });
    // setEventsDataList(filteredList);
  };

  const handleChangeEventOptions = async (value: string[]) => {
    setEventsSearch(value);
    setStateSkeletonOfIndex(true);
    if (value.length === 0) {
      const data:any = {
        since:selectedRange.since,
        until:selectedRange.until,
        pixelId: selectedPlatform[0] === 'facebook' ? appIdSearch : appIdSearchTiktok,
        platform:selectedPlatform[0]
      }
      submit(data, { method: "post" });
    
    } else {
      const data:any = {
        since:selectedRange.since,
        until:selectedRange.until,
        pixelId: selectedPlatform[0] === 'facebook' ? appIdSearch : appIdSearchTiktok,
        platform:selectedPlatform[0]
      }
      submit(data, { method: "post" });
    }
  };

  const handleSelectedPlatform = (value:string[]) =>{
    const data:any = {
      since:selectedRange.since,
      until:selectedRange.until,
      pixelId: value[0] === 'facebook' ? appIdSearch : appIdSearchTiktok,
      platform:value[0]
    }
    setStateSkeletonOfIndex(true);
    submit(data, { method: "post" });
    setSelectedPlatform(value)
    const dataAppIdSrc = customPixelsByPlatform(eventsLoad.pixels,value[0])
    setAppIdSrc([...dataAppIdSrc])
    setIsChangeAppIdSrc(!isChangeAppIdSrc);
  }

  return (
    <Page title="Analytics" fullWidth>
      <div className="mb-4 flex gap-3">
        <div className="pixel_btn">
          <PopoverMutiple options= {lstPlatform} selected={selectedPlatform} onSelected={handleSelectedPlatform}/>
        </div>

        <Suspense>
          <DateRangePicker selectActiveDateRange={2} onApply={handleDateRangeApply} />
        </Suspense>       
        <div className="pixel_btn">
          <ComboboxSearch
            listOptions={mapViewSourceAppIdCustom(appIdSrc)}
            handleChangeOptions={(value: string[]) => {
              handleChangeOptionAppId(value);
            }}
            selectedOptions={ selectedPlatform[0] === 'facebook' ? appIdSearch : appIdSearchTiktok}
            setSelectedOptions={selectedPlatform[0] === 'facebook' ? setAppIdSearch : setAppIdSearchTiktok}
            isShowTag={isChangeAppIdSrc}
            placeholder="Select Pixel"
          />
        </div>

        <Button
            icon={RefreshIcon}
            //variant="primary"
            onClick={() => handleRefreshData()}
          >
            Refresh
          </Button>
      </div>
      <div >
        <div className="w-full pb-5">
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}>
               <Card>
                <Scrollable shadow horizontal>
                  <div className="flex">
                    <div className="font-bold text-base py-4 px-2 cursor-pointer flex-1 whitespace-nowrap">
                      {/* Show data Conversion Rate  */}
                      <ConversionRateBox 
                          vcRate={vcRate} 
                          atcRate={atcRate} 
                          icRate={icRate} 
                          handleToggle={handleToggle}
                          stateSkeletonOfIndex={stateSkeletonOfIndex}
                        />
                    </div>
                    <div className="cursor-pointer flex-none" onClick={handleToggle}>
                        <Icon
                        source={ChevronDownIcon}
                        tone="base"/>
                    </div>
                  </div>
                </Scrollable>
                <Collapsible
                    open={open}
                    id="basic-collapsible"
                    transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                    expandOnPrint
                >
                  <div className="px-2">
                      <Text variant="headingMd" as="h3">Total Event</Text>
                      <div className="pt-4">
                        {/* Show data Total Event  */}
                        <TotalEventBox 
                          pageViewCount={pageViewCount}
                          ViewContentCount={ViewContentCount}
                          AddToCartCount={AddToCartCount}
                          InitiateCheckoutCount={InitiateCheckoutCount}
                          PurchaseCount={PurchaseCount}
                          CollectionViewCount={CollectionViewCount}
                          stateSkeletonOfIndex={stateSkeletonOfIndex}
                        />
                      </div>
                  </div>
                </Collapsible>
               </Card>
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}>
              <Card>
                {/* Search */}
                <div className="flex justify-between items-center pb-4">
                  <div className=""><Text as="h2" variant="headingMd">Event Chart</Text></div>
                  <ComboboxSearch
                    listOptions={eventNameMap}
                    handleChangeOptions={(value: string[]) => {
                      handleChangeEventOptions(value);
                    }}
                    selectedOptions={eventsSearch}
                    setSelectedOptions={setEventsSearch}
                    isShowTag={false}
                    placeholder="All events"
                  />
                </div>

                {/* -------- */}
                {/* <LineChartPage data={eventsDataList} eventNameMap={eventNameMap} /> */}
                {/* <LineChartPage
                  data={filterUniqueEventByEventTimeAndName(eventsDataList, appIdSearch)}
                  eventNameMap={eventNameMap}
                  fromDate={convertToISOFormat(selectedRange.since)}
                  toDate={convertToISOFormat(selectedRange.until)}
                /> */}
                <LineChartPageAnalytic
                  data={!actionData ? eventsDataList : (isReportState ? eventsDataList : filterUniqueEventByEventTimeAndName(eventsDataList, appIdSearch))}
                  eventNameMap={eventNameMap}
                  fromDate={convertToISOFormat(selectedRange.since)}
                  toDate={convertToISOFormat(selectedRange.until)}
                  eventsSearch={eventsSearch}
                />
              </Card>
            </Grid.Cell>
          </Grid>
        </div>
      </div>
      <div className="w-full mb-5">
        <ReportTable
          data={!actionData ? eventsLoad.eventsDataTable : 
            (isReportState ? eventsLoad.eventsDataTable :
            countEventNamesByAppId(
              eventsDataList,
              appIdSrc?.map((item) => item.label)
            ) as any)
          }
          title="Pixel Report"
          subTitle="Report events for each individual pixel."
        />
      </div>
      
      {/* campaign */}
      <Campaign/>
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
          text={"Analytics"}
          url={
            "https://zotek.gitbook.io/facebook-multiple-pixel/getting-started/analytics-tracking-events"
          }
        />
      {/* <div className="flex justify-center my-5">
        <span>Learn more about</span>
        <a href="https://zotek.gitbook.io/facebook-multiple-pixel/getting-started/analytics-tracking-events" target="_blank" className="text-blue-500">
          &nbsp;Analytics
        </a>
      </div> */}
    </Page>
  );
}