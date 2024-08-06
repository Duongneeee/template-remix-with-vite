// /* eslint-disable @typescript-eslint/no-unused-vars */
// import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
// import { json } from "@remix-run/node";
// import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
// import {
//   BlockStack,
//   Button,
//   Card,
//   Collapsible,
//   Frame,
//   Grid,
//   IndexTable,
//   Page,
//   Text,
//   Toast,
// } from "@shopify/polaris";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import CopyButton from "~/components/CopyButton";
// import { authenticate } from "~/shopify.server";
// import DateRangePicker from "~/components/DateRangePicker";
// import {
//   SortIcon,
// } from "@shopify/polaris-icons";
// import { ExportCSV } from "~/components/exportExcelFile";
// import { convertToISOFormat, filterEventsByDate, reduceByDay } from "~/utils";
// import EmptyTableContent from "~/components/EmptyTableContent";
// import { getAllEventDataService, getEventDataRangePlatformService } from "~/backend/services/eventData.service";
// import TabsCustom from "~/components/TabsCustom";


// function getUtm(data: any) {
//   const Utm = [];
//   for (const key in data) {
//     const X = {
//       name: "",
//       source: "facebook",
//       page_viewed: 0,
//       product_viewed: 0,
//       product_added_to_cart: 0,
//       checkout_started: 0,
//       payment_info_submitted: 0,
//       // revenue: 0,
//     };
//     data[key].forEach((item: any) => {
//       switch (item.eventName) {
//         case "PageView":
//           X.page_viewed++;
//           break;
//         case "ViewContent":
//           X.product_viewed++;
//           break;
//         case "AddToCart":
//           X.product_added_to_cart++;
//           break;
//         case "InitialCheckout":
//           X.checkout_started++;
//           break;
//         case "Purchase":
//           X.payment_info_submitted++;
//           break;
//         default:
//           break;
//       }
//       X.name = key;
//     });
//     Utm.push(X);
//   }
//   return Utm;
// }

// export const loader: LoaderFunction = async ({ request }) => {
//   const url = new URL(request.url);
//   const { session } = await authenticate.admin(request);

//   const startDate = reduceByDay(7);
//   const endDate = reduceByDay(1);

//   // const eventNameMap: Array<{ value: string; label: string }> =
//   //   DEFAULT_EVENTS.map((obj: any) => ({
//   //     value: obj.event_name_shopify,
//   //     label: obj.display_name,
//   //   }));

//   // const eventNameMapDefault: Array<{ value: string; label: string }> =
//   //   DEFAULT_EVENTS.slice(0, 5).map((obj) => ({
//   //     value: obj.event_name_shopify,
//   //     label: obj.display_name,
//   //   }));

//   // const defaultEvent = DEFAULT_EVENTS.map(
//   //   (obj) => obj.event_name_shopify
//   // );

//   // const eventsType = url.searchParams.get("eventsType") || defaultEvent;

//   const data = {
//     shop:session.shop,
//     since: startDate,
//     until: endDate,
//     platform:'facebook'
//   }

//   const eventsData = (await getEventDataRangePlatformService(data)).result || [];

//   return json({
//     eventsData,
//     startDate,
//     endDate,
//   });
// };

// export async function action({
//   request,
// }: ActionFunctionArgs): Promise<Response> {

//   try {
//     const { session } = await authenticate.admin(request);
//     const { shop } = session;

//       const eventsData = (await getAllEventDataService(shop)).result || [];
//     return json({eventsData})


//   } catch (error) {
//     console.error("Error processing the request:", error);
//     return new Response("Internal Server Error", {
//       status: 500,
//       headers: { "Content-Type": "text/plain" },
//     });
//   }

// }

// export default function FbAdsReport() {
//   const [selectedCampaignType, setSelectedCampaignType] =
//     useState("utmCampaign");
//   const handleClickType = (type: any) => {
//     setSelectedCampaignType(type);
//   };
//   const [typeHeading, setTypeHeading] = useState("Campaign name");
//   useEffect(() => {
//     switch (selectedCampaignType) {
//       case "utmCampaign":
//         setTypeHeading("Campaign name");
//         break;
//       case "utmAdSet":
//         setTypeHeading("Ad set name");
//         break;
//       case "utmAd":
//         setTypeHeading("Ad name");
//         break;
//     }
//   }, [selectedCampaignType]);
//   const campaignTypes = [
//     { title: "Campaign", id: "utmCampaign" },
//     { title: "Ad set", id: "utmAdSet" },
//     { title: "Ad", id: "utmAd" },
//   ];

//   var loaderData: any;
//   var actionData: any;
//   var eventsLoad: any;

//   loaderData = useLoaderData<LoaderFunction>();
//   actionData = useActionData<ActionFunctionArgs>();
//   eventsLoad = actionData ? actionData : loaderData;

//   const submit = useSubmit();
//   const sevenDaysAgo = new Date();
//   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
//   const startDate = new Date(sevenDaysAgo.toISOString().split("T")[0]);
//   const endDate = new Date();
//   // const [params] = useSearchParams();
//   const [selectedRange, setSelectedRage] = useState<{
//     since: Date;
//     until: Date;
//   }>({
//     since: startDate,
//     until: endDate,
//   });

//   const [eventsDataList, setEventsDataList] = useState(eventsLoad.eventsData);
//   const handleDateRangeApply = async (_selectedRange: {
//     since: Date;
//     until: Date;
//   }) => {
//     try {
//       setSelectedRage(_selectedRange);
//       if (_selectedRange) {
//         // const filteredList = filterEventsByDate(
//         //   eventsLoad.eventsData,
//         //   convertToISOFormat(_selectedRange.since),
//         //   convertToISOFormat(_selectedRange.until)
//         // );
//         // setEventsDataList(filteredList);
//         submit({},{method:'post'})
//       }
//     } catch (error) {
//       console.error("Error fetching updated data:", error);
//     }
//   };
//   const [utmData, setUtmData] = useState<any[]>([]);
//   useEffect(() => {
//     const filteredList = filterEventsByDate(
//           eventsLoad.eventsData,
//           convertToISOFormat(selectedRange.since),
//           convertToISOFormat(selectedRange.until)
//         );
//         setEventsDataList(filteredList);
//     const utm = filteredList.filter((event: any) => event.utmCampaign);
//     setUtmData(utm);
//   }, [eventsLoad]);
//   const groupedEvents = utmData.reduce((result: any, event: any) => {
//     const type =
//       selectedCampaignType === "utmCampaign"
//         ? event.utmCampaign
//         : selectedCampaignType === "utmAdSet"
//           ? event.utmAdSet
//           : selectedCampaignType === "utmAd"
//             ? event.utmAd
//             : null;

//     if (type) {
//       if (!result[type]) {
//         result[type] = [];
//       }
//       result[type].push(event);
//     }

//     return result;
//   }, {});
//   const eventsCountEachType = getUtm(groupedEvents);

//   const [openUrl, setOpenUrl] = useState(true);

//   const handleToggleUrl = useCallback(() => setOpenUrl((open) => !open), []);
//   const utmUrl =
//     "utm_source=facebook&utm_medium={{placement}}&utm_content={{ad.name}}&utm_campaign={{campaign.name}}&ad_name={{ad.name}}&adset_name={{adset.name}}";

//   // FB ads Report Table
//   const [searchQuery, setSearchQuery] = useState("");
//   const filteredRows = eventsCountEachType.filter(
//     ({ name }: { name: string }) =>
//       name.toLowerCase().includes(searchQuery.toLowerCase())
//   );
//   const numericSort = (field: string) => (a: any, b: any) => {
//     return b[field] - a[field];
//   };
//   const [sortType, setSortType] = useState<string[]>([]);
//   const [isAscending, setIsAscending] = useState(true);

//   const filteredData = useMemo(() => {
//     const data = isAscending
//       ? filteredRows.slice().reverse().sort(numericSort(sortType[0]))
//       : filteredRows.slice().sort(numericSort(sortType[0]));
//     return data;
//   }, [filteredRows, isAscending, sortType]);

//   const rowMarkup = filteredData.map(
//     (
//       {
//         name,
//         source,
//         page_viewed,
//         product_viewed,
//         product_added_to_cart,
//         checkout_started,
//         payment_info_submitted,
//         // revenue,
//       },
//       index
//     ) => (
//       <IndexTable.Row id={name} key={name} position={index}>
//         <IndexTable.Cell>
//           <Text variant="bodyMd" fontWeight="bold" as="span">
//             {name}
//           </Text>
//         </IndexTable.Cell>
//         <IndexTable.Cell>{source || "facebook"}</IndexTable.Cell>
//         <IndexTable.Cell>{page_viewed || 0}</IndexTable.Cell>
//         <IndexTable.Cell>{product_viewed || 0}</IndexTable.Cell>
//         <IndexTable.Cell>{product_added_to_cart || 0}</IndexTable.Cell>
//         <IndexTable.Cell>{checkout_started || 0}</IndexTable.Cell>
//         <IndexTable.Cell>{payment_info_submitted || 0}</IndexTable.Cell>
//         {/* <IndexTable.Cell>${revenue || 0}</IndexTable.Cell> */}
//       </IndexTable.Row>
//     )
//   );
//   // console.log(rowMarkup)

//   const [popoverActive, setPopoverActive] = useState(false);

//   const togglePopoverActive = useCallback(
//     () => setPopoverActive((popoverActive) => !popoverActive),
//     []
//   );

//   const activator = (
//     <Button icon={SortIcon} onClick={togglePopoverActive} disclosure>
//       Sort
//     </Button>
//   );

//   // const [checked1, setChecked1] = useState(false);
//   // const handleChange1 = useCallback(
//   //   (newChecked: boolean) => setChecked1(newChecked),
//   //   []
//   // );

//   // const [checked2, setChecked2] = useState(false);
//   // const handleChange2 = useCallback(
//   //   (newChecked: boolean) => setChecked2(newChecked),
//   //   []
//   // );

//   // const [checked3, setChecked3] = useState(false);
//   // const handleChange3 = useCallback(
//   //   (newChecked: boolean) => setChecked3(newChecked),
//   //   []
//   // );

//   // const progress = (checked1 ? 100 / 3 : 0) + (checked2 ? 100 / 3 : 0) + (checked3 ? 100 / 3 : 0);
//   // const progressText = `${(checked1 ? 1 : 0) + (checked2 ? 1 : 0) + (checked3 ? 1 : 0)}/3`;

//   const [active, setActive] = useState(false);

//   const toggleActive = useCallback(() => setActive((active) => !active), []);

//   const toastMarkup = active ? (
//     <Toast content="Copied" onDismiss={toggleActive} />
//   ) : null;

//   const emptyStateMarkup = <EmptyTableContent />;

//   return (
//     <Frame>
//       <Page title="Campaigns Report" fullWidth>
//         <div className="mb-[60px]">
//           <Grid>
//             {/* <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 4, xl: 4 }}>
//           <div className="max-w-[400px]">
//             <Card>
//               <div className="flex flex-col gap-2 ">
//                 <iframe
//                   width="100%"
//                   height="240"
//                   src="https://www.youtube.com/embed/l0qvxPPISuY"
//                   title="Embedded Video"
//                   frameBorder="0"
//                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                   allowFullScreen
//                 ></iframe>
//                 <Text variant="headingLg" as="h3">
//                   Tutorial video
//                 </Text>
//                 <Text variant="bodyMd" as="h3">
//                   Some thing for description
//                 </Text>
//                 <Button>Learn more</Button>
//               </div>
//             </Card>
//           </div>
//         </Grid.Cell> */}
//             <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}>
//               <BlockStack gap="500">
//                 <Card>
//                   <div className="flex justify-between items-center">
//                     <Text variant="headingMd" as="h5">
//                       UTM parameter config guide
//                     </Text>
//                     <div className="flex gap-2 items-center">
//                       <Button
//                         variant="tertiary"
//                         onClick={handleToggleUrl}
//                         disclosure={openUrl ? "up" : "down"}
//                         ariaExpanded={openUrl}
//                       ></Button>
//                     </div>
//                   </div>
//                   <>
//                     {/* {progress === 100 ? (
//                       <div className="flex gap-2 items-center justify-start">
//                         <div><Icon
//                           source={CheckIcon}
//                           tone="base"
//                         /></div>

//                         <div>Done</div>
//                       </div>
//                     ) : (<div className="flex gap-2 items-center">
//                       <div>{progressText} completed</div>
//                       <div style={{ width: 144, height: 4 }}>
//                         <ProgressBar progress={progress} tone="primary" size="small" />
//                       </div>
//                     </div>)} */}
//                   </>

//                   <Collapsible
//                     open={openUrl}
//                     id="basic-collapsible"
//                     transition={{
//                       duration: "500ms",
//                       timingFunction: "ease-in-out",
//                     }}
//                     expandOnPrint
//                   >
//                     <div className="mt-3 flex flex-col gap-2">
//                       <Text variant="bodyMd" as="p">
//                         Step 1: Copy UTM string to put into your Facebook ads
//                       </Text>
//                       {/* <Checkbox
//                         label="Step 1: Copy UTM string to put into your Facebook ads"
//                         checked={checked1}
//                         onChange={handleChange1}
//                       /> */}
//                       <Card roundedAbove="md" background="bg-surface-secondary">
//                         {/* <Text variant="headingMd" as="h5">UTM parameter</Text> */}
//                         <p className="my-3">{utmUrl}</p>
//                         <CopyButton text={utmUrl}
//                           titleButton="Copy UTM"
//                           onCopy={toggleActive} />
//                       </Card>
//                       <Text variant="bodyMd" as="p">
//                         Step 2: Put UTM string to your Facebook ads
//                       </Text>
//                       <Text variant="bodyMd" as="p">
//                         Step 3: View the in-app Campaigns Report
//                       </Text>
//                       {/* <Checkbox
//                         label="Step 2: Put UTM string to your Facebook ads"
//                         checked={checked2}
//                         onChange={handleChange2}
//                       />
//                       <Checkbox
//                         label="Step 3: View the in-app Campaigns report"
//                         checked={checked3}
//                         onChange={handleChange3}
//                       /> */}
//                     </div>
//                     {/* {progress === 100 && (
//                       <div className="flex justify-end"><Button
//                         onClick={() => setOpenUrl(false)}
//                       >Dismiss guide
//                       </Button></div>
//                     )} */}
//                   </Collapsible>
//                 </Card>
//                 <div className="flex gap-3">
//                   <DateRangePicker selectActiveDateRange={2} onApply={handleDateRangeApply} />
//                   <ExportCSV
//                     csvData={filteredRows}
//                     fileName={"campaigns report"}
//                   />
//                 </div>
//                 <Card>
//                   <div className="">
//                     <div className="mb-3">
//                       <TabsCustom tabs={campaignTypes} selected={selectedCampaignType} onSelect={handleClickType} />
//                     </div>
//                     {/* <div className="flex justify-between items-center mb-3">
//                       <div className="flex gap-2">
//                         {campaignTypes.map((campaignType) => (
//                           <Button
//                             key={campaignType.value}
//                             onClick={() => handleClickType(campaignType.value)}
//                             pressed={
//                               campaignType.value === selectedCampaignType
//                             }
//                           >
//                             {campaignType.label}
//                           </Button>
//                         ))}
//                       </div>

//                     </div> */}

//                     <div className="flex gap-5 justify-between mb-6 items-center">
//                       <input
//                         className="p-1 gap-5 box-border border-[1px] w-full border-gray-300 rounded-lg"
//                         type="text"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         placeholder="Search campaign name"
//                       />
//                       {/* <div className="flex  gap-2 justify-end whitespace-nowrap">
//                         <Button
//                           icon={RefreshIcon}
//                           variant="primary"
//                           onClick={handleResetSort}
//                         ></Button>

//                         <Popover
//                           active={popoverActive}
//                           activator={activator}
//                           autofocusTarget="first-node"
//                           onClose={togglePopoverActive}
//                         >
//                           <ButtonGroup variant="segmented">
//                             <Button
//                               pressed={isAscending}
//                               onClick={handleAscending}
//                             >
//                               Ascending
//                             </Button>
//                             <Button
//                               pressed={!isAscending}
//                               onClick={handleDescending}
//                             >
//                               Descending
//                             </Button>
//                           </ButtonGroup>
//                           <OptionList
//                             onChange={setSortType}
//                             options={[
//                               {
//                                 label: "PageViewed",
//                                 value: "page_viewed",
//                               },
//                               {
//                                 label: "ViewContent",
//                                 value: "product_viewed",
//                               },
//                               {
//                                 label: "AddToCart",
//                                 value: "product_added_to_cart",
//                               },
//                               {
//                                 label: "InitialCheckout",
//                                 value: "checkout_started",
//                               },
//                               {
//                                 label: "Purchase",
//                                 value: "payment_info_submitted",
//                               },
//                               // {
//                               //   label: "Revenue",
//                               //   value: "revenue",
//                               // },
//                             ]}
//                             selected={sortType}
//                           />
//                         </Popover>
                        
//                       </div> */}
//                     </div>

//                     <IndexTable
//                       emptyState={emptyStateMarkup}
//                       selectable={false}
//                       itemCount={eventsCountEachType.length}
//                       headings={[
//                         { title: typeHeading },
//                         { title: "Source" },
//                         { title: "PageView" },
//                         { title: "ViewContent" },
//                         { title: "AddToCart" },
//                         { title: "InitialCheckout" },
//                         { title: "Purchase" },
//                         // { title: "Revenue" },
//                       ]}
//                     >
//                       {rowMarkup}
//                     </IndexTable>
//                   </div>
//                 </Card>
//               </BlockStack>
//             </Grid.Cell>
//             {toastMarkup}
//           </Grid>
//           <div className="flex justify-center my-5">
//             <span>Learn more about</span>
//             <a href="https://zotek.gitbook.io/facebook-multiple-pixel/getting-started/boost-performance-campaign" target="_blank" className="text-blue-500">
//               &nbsp;Campaign report
//             </a>
//           </div>
//         </div>
//       </Page>
//     </Frame>
//   );
// }
