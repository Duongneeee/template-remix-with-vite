/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  Grid,
  IndexTable,
  Modal,
  Text,
} from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import { convertToISOFormat, filterEventsByDate } from "~/utils";
import TabsCustom from "~/components/common/TabsCustom";
import EmptyTableContent from "~/components/common/EmptyTableContent";
import { ExportCSV } from "~/components/common/exportExcelFile";
import CopyButton from "~/components/common/CopyButton";


function getUtm(data: any) {
  const Utm = [];
  for (const key in data) {
    const X = {
      name: "",
      source: "facebook",
      page_viewed: 0,
      product_viewed: 0,
      product_added_to_cart: 0,
      checkout_started: 0,
      payment_info_submitted: 0,
      // revenue: 0,
    };
    data[key].forEach((item: any) => {
      switch (item.eventName) {
        case "PageView":
          X.page_viewed++;
          break;
        case "ViewContent":
          X.product_viewed++;
          break;
        case "AddToCart":
          X.product_added_to_cart++;
          break;
        case "InitialCheckout":
          X.checkout_started++;
          break;
        case "Purchase":
          X.payment_info_submitted++;
          break;
        default:
          break;
      }
      X.name = key;
    });
    Utm.push(X);
  }
  return Utm;
}

export default function Campaign() {
  const [selectedCampaignType, setSelectedCampaignType] =
    useState("utmCampaign");
  const handleClickType = (type: any) => {
    setSelectedCampaignType(type);
  };
  const [typeHeading, setTypeHeading] = useState("Campaign name");
  useEffect(() => {
    switch (selectedCampaignType) {
      case "utmCampaign":
        setTypeHeading("Campaign name");
        break;
      case "utmAdSet":
        setTypeHeading("Ad set name");
        break;
      case "utmAd":
        setTypeHeading("Ad name");
        break;
    }
  }, [selectedCampaignType]);
  const campaignTypes = [
    { title: "Campaign", id: "utmCampaign" },
    { title: "Ad set", id: "utmAdSet" },
    { title: "Ad", id: "utmAd" },
  ];

  var loaderData: any;
  var actionData: any;
  var eventsLoad: any;

  loaderData = useLoaderData<LoaderFunction>();
  actionData = useActionData<ActionFunctionArgs>();
  eventsLoad = actionData ? actionData : loaderData;

  const submit = useSubmit();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const startDate = new Date(sevenDaysAgo.toISOString().split("T")[0]);
  const endDate = new Date();
  // const [params] = useSearchParams();
  const [selectedRange, setSelectedRage] = useState<{
    since: Date;
    until: Date;
  }>({
    since: startDate,
    until: endDate,
  });

  const [eventsDataList, setEventsDataList] = useState(eventsLoad.eventsCampaign);
  const handleDateRangeApply = async (_selectedRange: {
    since: Date;
    until: Date;
  }) => {
    try {
      setSelectedRage(_selectedRange);
      if (_selectedRange) {
        // const filteredList = filterEventsByDate(
        //   eventsLoad.eventsData,
        //   convertToISOFormat(_selectedRange.since),
        //   convertToISOFormat(_selectedRange.until)
        // );
        // setEventsDataList(filteredList);
        submit({},{method:'post'})
      }
    } catch (error) {
      console.error("Error fetching updated data:", error);
    }
  };
  const [utmData, setUtmData] = useState<any[]>([]);
  useEffect(() => {
    const filteredList = filterEventsByDate(
          eventsLoad.eventsCampaign,
          convertToISOFormat(selectedRange.since),
          convertToISOFormat(selectedRange.until)
        );
        setEventsDataList(filteredList);
    const utm = filteredList.filter((event: any) => event.utmCampaign);
    setUtmData(utm);
  }, [eventsLoad]);
  const groupedEvents = utmData.reduce((result: any, event: any) => {
    const type =
      selectedCampaignType === "utmCampaign"
        ? event.utmCampaign
        : selectedCampaignType === "utmAdSet"
          ? event.utmAdSet
          : selectedCampaignType === "utmAd"
            ? event.utmAd
            : null;

    if (type) {
      if (!result[type]) {
        result[type] = [];
      }
      result[type].push(event);
    }

    return result;
  }, {});
  const eventsCountEachType = getUtm(groupedEvents);

  const utmUrl =
    "utm_source=facebook&utm_medium={{placement}}&utm_content={{ad.name}}&utm_campaign={{campaign.name}}&ad_name={{ad.name}}&adset_name={{adset.name}}";

  // FB ads Report Table
  const [searchQuery, setSearchQuery] = useState("");
  const filteredRows = eventsCountEachType.filter(
    ({ name }: { name: string }) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const numericSort = (field: string) => (a: any, b: any) => {
    return b[field] - a[field];
  };
  const [sortType, setSortType] = useState<string[]>([]);
  const [isAscending, setIsAscending] = useState(true);

  const filteredData = useMemo(() => {
    const data = isAscending
      ? filteredRows.slice().reverse().sort(numericSort(sortType[0]))
      : filteredRows.slice().sort(numericSort(sortType[0]));
    return data;
  }, [filteredRows, isAscending, sortType]);

  const rowMarkup = filteredData.map(
    (
      {
        name,
        source,
        page_viewed,
        product_viewed,
        product_added_to_cart,
        checkout_started,
        payment_info_submitted,
        // revenue,
      },
      index
    ) => (
      <IndexTable.Row id={name} key={name} position={index}>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {name}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{source || "facebook"}</IndexTable.Cell>
        <IndexTable.Cell>{page_viewed || 0}</IndexTable.Cell>
        <IndexTable.Cell>{product_viewed || 0}</IndexTable.Cell>
        <IndexTable.Cell>{product_added_to_cart || 0}</IndexTable.Cell>
        <IndexTable.Cell>{checkout_started || 0}</IndexTable.Cell>
        <IndexTable.Cell>{payment_info_submitted || 0}</IndexTable.Cell>
        {/* <IndexTable.Cell>${revenue || 0}</IndexTable.Cell> */}
      </IndexTable.Row>
    )
  );

  const toggleActive = useCallback(() => {shopify.toast.show('Copied')}, []);

  const emptyStateMarkup = <EmptyTableContent />;

  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);

  return (
    <div>
        <div className="mb-[60px]">
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}>
              <BlockStack gap="500">
                <Card>
                <Text as="h2" variant="headingMd">Campaign Report</Text>
                  <div className="">
                    <div className="mb-5 flex gap-2 items-end">
                      <div className="flex-1">
                       <TabsCustom tabs={campaignTypes} selected={selectedCampaignType} onSelect={handleClickType} />
                      </div>
                      <div className="flex-none flex gap-2">
                        <Button onClick={handleChange}>UTM Setting</Button>
                        <ExportCSV
                            csvData={filteredRows}
                            fileName={"campaigns report"}
                        />
                      </div>
                    </div>
                    

                    <div className="flex gap-5 justify-between mb-6 items-center">
                      <input
                        className="p-1 gap-5 box-border border-[1px] w-full border-gray-300 rounded-lg"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search campaign name"
                      />
                      
                    </div>

                    <IndexTable
                      emptyState={emptyStateMarkup}
                      selectable={false}
                      itemCount={eventsCountEachType.length}
                      headings={[
                        { title: typeHeading },
                        { title: "Source" },
                        { title: "PageView" },
                        { title: "ViewContent" },
                        { title: "AddToCart" },
                        { title: "InitialCheckout" },
                        { title: "Purchase" },
                        // { title: "Revenue" },
                      ]}
                    >
                      {rowMarkup}
                    </IndexTable>
                  </div>
                </Card>
                <Modal
                    activator={undefined}
                    open={active}
                    onClose={handleChange}
                    title="UTM parameter config guide"
                    primaryAction={{
                      content: 'Close',
                      onAction: handleChange,
                    }}
                  >
                    <Box as="div" padding="200">
                      <div className="mt-3 flex flex-col gap-2">
                        <Text variant="bodyMd" as="p">
                          Step 1: Copy UTM string to put into your Facebook ads
                        </Text>
                      
                        <Card roundedAbove="md" background="bg-surface-secondary">
                          {/* <Text variant="headingMd" as="h5">UTM parameter</Text> */}
                          <p className="my-3">{utmUrl}</p>
                          <CopyButton text={utmUrl}
                            titleButton="Copy UTM"
                            onCopy={toggleActive} />
                        </Card>
                        <Text variant="bodyMd" as="p">
                          Step 2: Put UTM string to your Facebook ads
                        </Text>
                        {/* <Text variant="bodyMd" as="p">
                          Step 3: View the in-app Campaigns Report
                        </Text> */}
                        
                      </div>
                    </Box>
                  </Modal>
              </BlockStack>
            </Grid.Cell>
          </Grid>
        </div>
    </div>
  );
}
