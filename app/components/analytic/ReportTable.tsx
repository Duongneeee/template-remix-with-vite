import { Card, IndexTable, Text, TextField, Icon, Tooltip } from "@shopify/polaris";
import { useState } from "react";
import { calculatePercentage } from "~/utils";
import { SearchIcon } from "@shopify/polaris-icons";
import EmptyTableContent from "../common/EmptyTableContent";
import { ExportCSV } from "../common/exportExcelFile";

interface IReportProps {
  data: IDataTabel[];
  title?: string;
  subTitle?: string;
}

interface IDataTabel {
  pixelName: string;
  pixelID: string;
  pageView: number;
  viewContent: number;
  addToCart: number;
  initiateCheckout: number;
  purchase: number;
  revenue?: number;
  currency?: string;
}

export default function ReportTable(props: IReportProps) {
  const { data, title, subTitle } = props;

  const [searchQuery, setSearchQuery] = useState("");
  const resourceName = {
    singular: "pixel",
    plural: "pixels",
  };
  const filteredRows =
    data &&
    data.filter(({ pixelName }: { pixelName: string }) =>
      pixelName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  const rowMarkup =
    filteredRows &&
    filteredRows.map(
      (
        {
          pixelName,
          pixelID,
          pageView,
          viewContent,
          addToCart,
          initiateCheckout,
          purchase,
          revenue,
          currency
        },
        index
      ) => (
        <IndexTable.Row id={pixelID} key={pixelID} position={index}>
          <IndexTable.Cell>
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {pixelName}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>{pixelID}</IndexTable.Cell>
          <IndexTable.Cell>{pageView}</IndexTable.Cell>
          <IndexTable.Cell>{viewContent}</IndexTable.Cell>
          <IndexTable.Cell>{addToCart}</IndexTable.Cell>
          <IndexTable.Cell>{initiateCheckout}</IndexTable.Cell>
          <IndexTable.Cell>{purchase}</IndexTable.Cell>
          <IndexTable.Cell>
            {calculatePercentage(addToCart, viewContent, 2)}%
          </IndexTable.Cell>
          <IndexTable.Cell>
            {calculatePercentage(initiateCheckout, addToCart, 2)}%
          </IndexTable.Cell>
          <IndexTable.Cell>
            {calculatePercentage(purchase, initiateCheckout, 2)}%
          </IndexTable.Cell>
          <IndexTable.Cell>{revenue}</IndexTable.Cell>
          <IndexTable.Cell>{currency}</IndexTable.Cell>
          <IndexTable.Cell>
            {pageView + viewContent + addToCart + purchase + initiateCheckout}
          </IndexTable.Cell>
        </IndexTable.Row>
      )
    );
  const emptyStateMarkup = <EmptyTableContent />;
  return (
    <Card>
      {title && 
      <div className="flex gap-1 pb-4">
          <Tooltip content={subTitle}>
            <Text as="h2" variant="headingMd">
              {title}
            </Text>
          </Tooltip>
      </div>
      }
      <div className="flex gap-5 justify-between pb-3 items-center">
        <div className="w-full">
          <TextField
            label=""
            prefix={<Icon source={SearchIcon} tone="base" />}
            autoComplete="off"
            placeholder="Search pixel name"
            value={searchQuery}
            onChange={(valueSearch) => setSearchQuery(valueSearch)}
          />
        </div>

        <div className="flex justify-end whitespace-nowrap">
          <ExportCSV csvData={filteredRows} fileName={"pixels report"} />
        </div>
      </div>

      <IndexTable
        emptyState={emptyStateMarkup}
        selectable={false}
        resourceName={resourceName}
        itemCount={data?.length}
        headings={[
          { title: "Pixel Name" },
          { title: "Pixel ID" },
          { title: "PageView" },
          { title: "ViewContent" },
          { title: "AddToCart" },
          { title: "InitiateCheckout" },
          { title: "Purchase" },
          { title: "VC>ATC" },
          { title: "ATC>IC" },
          { title: "IC>PUR" },
          { title: "Revenue" },
          { title: "Currency" },
          { title: "Total Events" },
        ]}
      >
        {rowMarkup}
      </IndexTable>
    </Card>
  );
}
