import { Button, Card, Collapsible, Icon, Scrollable, Text } from "@shopify/polaris"
import DateRangePicker from "../common/DateRangePicker"
import TabsCustom from "../common/TabsCustom"
import ConversionRateBox from "../common/conversionRate/ConversionRateBox"
import TotalEventBox from "../common/totalEvent/TotalEventBox"
import Post from "./Post"
import { useActionData, useSubmit } from "@remix-run/react"
import { ActionFunctionArgs } from "@remix-run/node"
import { useCallback, useEffect, useState } from "react"
import { maxCountEventByAppId, maxCountEventByAppIdReport } from "~/constants/events"
import { calculatePercentage } from "~/utils"
import { 
    RefreshIcon, 
    ChevronDownIcon, 
   } from "@shopify/polaris-icons";
import SvgFacebook from "../svgs/SvgFacebook"
import SvgTiktok from "../svgs/SvgTiktok"
import { IHomeProps } from "./Home"

   export const tabs = [
    {
      id:0,
      title: 'Facebook',
      icon: (<SvgFacebook/>),
    },
    {
      id: 1,
      title: 'Tiktok',
      icon:<SvgTiktok/>,
    },
  ];

const DataEventHome = (props:IHomeProps) =>{
    var loaderData: any;
  var actionData: any;
  var eventsLoad: any;

  loaderData = {...props};
  actionData = useActionData<ActionFunctionArgs>();
  eventsLoad = actionData ? actionData : loaderData;

  //xac dinh co isBannerThemeApp la true hay false de hien thi

  const submit = useSubmit();
  const [eventsDataList, setEventsDataList] = useState(eventsLoad.eventsData);
  const [isReportState, setIsReportState] = useState(eventsLoad?.isReport)
  const [aliasOfDateRange, setAliasOfDateRange] = useState<string>('last7days');
  const [stateSkeletonOfIndex, setStateSkeletonOfIndex] =  useState<boolean>(false);

  const countEvents = !actionData ? maxCountEventByAppIdReport(eventsDataList) : 
  (isReportState ? maxCountEventByAppIdReport(eventsDataList) : maxCountEventByAppId(eventsDataList));
  const pageViewCount = countEvents["PageView"] || 0;
  const ViewContentCount = countEvents["ViewContent"] || 0;
  const AddToCartCount = countEvents["AddToCart"] || 0;
  const InitiateCheckoutCount = countEvents["InitiateCheckout"] || 0;
  const PurchaseCount = countEvents["Purchase"] || 0;
  const CollectionViewCount = countEvents["CollectionView"] || 0;

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

  const [selectedRange, setSelectedRage] = useState<{
    since: Date;
    until: Date;
  }>({
    since: new Date(loaderData.initialRange.since),
    until: new Date(loaderData.initialRange.until),
  });

  const handleRefreshData = () => {
    setStateSkeletonOfIndex(true);
    const data:any = {
      since:selectedRange.since, 
      until:selectedRange.until,
      platform: selected === 0 ? "facebook": "tiktok",
      aliasOfDateRange
    };
    submit(data, { method: "post" });
  };

  const handleDateRangeApply = async (_selectedRange: {
    since: Date;
    until: Date;
  },alias:string) => {
    try {
      setSelectedRage(_selectedRange);
      setAliasOfDateRange(alias);
      if (_selectedRange) {
        const data:any = 
        {
          since:_selectedRange.since, 
          until:_selectedRange.until,
          platform: selected === 0 ? "facebook": "tiktok",
          aliasOfDateRange:alias
        };
        setStateSkeletonOfIndex(true);
        submit(data, { method: "post" });
      }
    } catch (error) {
      console.error("Error fetching updated data:", error);
    }
  };

  useEffect(() => {
    if(eventsLoad.isFlagEventData){
      setEventsDataList(eventsLoad.eventsData);
      setIsReportState(eventsLoad.isReport);
      setStateSkeletonOfIndex(false);
    }
    if(!loaderData.isConfigThemeApp){
    // xac dinh user dang trong tab app hay khong khi user quay lai gui request
        function onVisibilityChange() {
          if (document.visibilityState === 'visible') {
            const data:any = {action:'checkThemeApp'};
            submit(data, {method:"post"});
          }
        }
          document.addEventListener('visibilitychange', onVisibilityChange);
        return () => {
           document.removeEventListener('visibilitychange', onVisibilityChange);
        };
      }
  }, [actionData]);

  // const [posts, setPosts] = useState([...postsHome, loaderData.firstFeature])

  const [open, setOpen] = useState(true);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  //Tab facebook and tiktok

  const [selected, setSelected] = useState(0);

  const handleTabChange =
    (selectedTabIndex: number) => 
    { 
      setSelected(selectedTabIndex);
      const data:any = {
        shop: loaderData.shop,
        since: selectedRange.since,
        until: selectedRange.until,
        platform: selectedTabIndex === 0 ? 'facebook' : 'tiktok',
        aliasOfDateRange
      }
      setStateSkeletonOfIndex(true);
      submit(data,{method:"post"})
    }

  //suggest feature star
    return (
        <>
        <div className="mb-4 flex justify-between">
          <div className="flex gap-3">
            <DateRangePicker selectActiveDateRange={2} onApply={handleDateRangeApply} />
            {/*selectActiveDateRange is the time you want to execute for the first time 0 - today, 1 - yesterday.... */}
            <Button
              icon={RefreshIcon}
              onClick={() => handleRefreshData()}
            >
              Refresh
            </Button>
          </div>
        </div>

        <div className="">
          <div className="my-3">
            <Card>
              <Scrollable shadow horizontal>
                <div className="flex">
                  <div className="font-bold text-base px-2 cursor-pointer flex-1 whitespace-nowrap">
                    <TabsCustom tabs={tabs} selected={selected} onSelect={handleTabChange}>
                      {/* Show data Conversion Rate  */}
                        <ConversionRateBox 
                          vcRate={vcRate} 
                          atcRate={atcRate} 
                          icRate={icRate} 
                          handleToggle={handleToggle}
                          stateSkeletonOfIndex={stateSkeletonOfIndex}
                        />
                    </TabsCustom>
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
                    <div className="my-3">
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
          </div>

          {/* <Post/> */}
          {/* <div className="my-2">
            <div>
              <Card>
                <ResourceList
                  resourceName={{singular: 'customer', plural: 'customers'}}
                  filterControl={
                        <Box borderBlockEndWidth="025" paddingBlockEnd="300" borderColor="border">
                          <Text as="h2" variant="headingSm">Recommend a feature to add to our Zotek app</Text>
                        </Box>
                  }
                  flushFilters
                  items={loaderData.features}
                  renderItem={(item) => {
                    const {id, title, voteId, voteNumber, status, voteStatus, location} = item;
                    // const media = <Avatar customer size="md" name={name} />;
                    const media = 
                    <div className=" flex gap-1 items-center">
                      <Text as="p">{voteNumber}</Text>
                      <div onClick={()=>handleLike(voteId,voteStatus,id,voteNumber)}>
                        <Icon source={ThumbsUpIcon} tone={voteId && voteStatus === 1 ? "info" : "primary"}/>
                      </div>
                    </div>

                    return (
                      <ResourceList.Item
                        id={id}
                        url=""
                        media={media}
                        accessibilityLabel={`View details for ${title}`}
                      >
                        <div className="flex justify-between">
                        <div className="">
                          <Text as="h3" variant="bodyMd" fontWeight="bold">
                            {title}
                          </Text>
                        </div>
                          <div className="w-16">
                          {
                            status === 1?
                          <Badge tone="success">Published</Badge>
                          :
                          <Badge tone="info">Doing</Badge>
                          }
                          </div>
                        </div>
                      </ResourceList.Item>
                    );
                  }}
                />

                <Box paddingBlockStart="200">
                  {!isSuggestFeature ?
                      <Button onClick={()=>setIsSuggestFeature(!isSuggestFeature)}>Suggest feature</Button>
                      :
                      <Box>
                        <TextField
                          label={undefined}
                          value={valueSuggestFeature}
                          onChange={(value)=>{
                            setValueSuggestFeature(value)
                          }}
                          placeholder="Enter a suggestion"
                          autoComplete="off"
                        />
                        <Box paddingBlockStart="200">
                          <ButtonGroup>
                            <Button variant="primary" onClick={handleSubmitFeature}>Submit</Button>
                            <Button onClick={()=>setIsSuggestFeature(!isSuggestFeature)}>Cancel</Button>
                          </ButtonGroup>
                        </Box>
                      </Box>
                  }
                </Box>
              </Card>
            </div>
          </div> */}
        </div>
        </>
    )
}

export default DataEventHome