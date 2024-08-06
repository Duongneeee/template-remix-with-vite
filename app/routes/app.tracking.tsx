/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IndexTable,
  LegacyCard,
  useIndexResourceState,
  Button,
} from "@shopify/polaris";
import type { IndexFiltersProps, TabProps } from "@shopify/polaris";
import { useState, useCallback } from "react";
import EmptyTableContent from "~/components/common/EmptyTableContent";

interface ITrackingProps {
  pixelList: any;
}
export default function Tracking(props: ITrackingProps) {
  const { pixelList } = props;
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const [itemStrings, setItemStrings] = useState([
    "All",
    "Unpaid",
    "Open",
    "Closed",
    "Local delivery",
    "Local pickup",
  ]);
  const deleteView = (index: number) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
  };

  const duplicateView = async (name: string) => {
    setItemStrings([...itemStrings, name]);
    await sleep(1);
    return true;
  };

  const tabs: TabProps[] = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onAction: () => {},
              onPrimaryAction: async (value: string): Promise<boolean> => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (value: string): Promise<boolean> => {
                await sleep(1);
                duplicateView(value);
                return true;
              },
            },
            {
              type: "edit",
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));

  const [accountStatus, setAccountStatus] = useState<string[] | undefined>(
    undefined
  );
  const [moneySpent, setMoneySpent] = useState<[number, number] | undefined>(
    undefined
  );
  const [taggedWith, setTaggedWith] = useState("");

  const handleAccountStatusRemove = useCallback(
    () => setAccountStatus(undefined),
    []
  );
  const handleMoneySpentRemove = useCallback(
    () => setMoneySpent(undefined),
    []
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);

  const appliedFilters: IndexFiltersProps["appliedFilters"] = [];
  if (accountStatus && !isEmpty(accountStatus)) {
    const key = "accountStatus";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, accountStatus),
      onRemove: handleAccountStatusRemove,
    });
  }
  if (moneySpent) {
    const key = "moneySpent";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, moneySpent),
      onRemove: handleMoneySpentRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = "taggedWith";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  const resourceName = {
    singular: "Pixel",
    plural: "Pixel",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(pixelList);

  const rowMarkup = pixelList.map(
    (
      {
        id,
        status,
        pixelName,
        appId,
        targetArea,
        serverSide,
        testEvent,
        createdAt,
      }: any,
      index: any
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>{status}</IndexTable.Cell>

        <IndexTable.Cell>{pixelName}</IndexTable.Cell>

        <IndexTable.Cell>{appId}</IndexTable.Cell>

        <IndexTable.Cell>{targetArea}</IndexTable.Cell>

        <IndexTable.Cell>{new Date(createdAt).toDateString()}</IndexTable.Cell>
      </IndexTable.Row>
    )
  );

  const promotedBulkActions = [
    {
      content: "Delete",
      onAction: () => console.log("Todo: implement Delete"),
    },
    {
      content: "Edit",
      onAction: () => console.log("Todo: implement Edit"),
    },
  ];

  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const emptyStateMarkup = <EmptyTableContent />;
  return (
    <>
      <div className="flex justify-end my-2">
        <Button onClick={handleOpenModal}>Add New Pixel</Button>
        {/* <CustomModal open={modalOpen} onClose={handleCloseModal} /> */}
      </div>
      <LegacyCard>
        <IndexTable
          emptyState={emptyStateMarkup}
          resourceName={resourceName}
          itemCount={pixelList.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[
            { title: "Status" },
            { title: "Pixel Name" },
            { title: "Pixel ID" },
            { title: "Target Area" },
            { title: "Created At" },
          ]}
          promotedBulkActions={promotedBulkActions}
        >
          {rowMarkup}
        </IndexTable>
      </LegacyCard>
    </>
  );

  function disambiguateLabel(key: string, value: string | any[]): string {
    switch (key) {
      case "moneySpent":
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case "taggedWith":
        return `Tagged with ${value}`;
      case "accountStatus":
        return (value as string[]).map((val) => `Customer ${val}`).join(", ");
      default:
        return value as string;
    }
  }

  function isEmpty(value: string | string[]): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}
