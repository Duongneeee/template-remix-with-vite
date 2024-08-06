import {
  BlockStack,
  Button,
  Card,
  TextField,
  Text,
  Link,
  Select,
} from "@shopify/polaris";
import { useState } from "react";
import MyCollaps from "./feed/MyCollaps";
import type { Field } from "./AudienceFilterForm";
import AudienceFilterForm from "./AudienceFilterForm";
import { PlusIcon, MinusIcon, XIcon } from "@shopify/polaris-icons";
import { EVENT_LIST_DEFAULT } from "~/constants/events";

export interface RuleItem {
  pixelId: string;
  events: string;
  retention: number;
  filter: Field[];
  type: "inclusions" | "exclusions";
}

export interface selectItem {
  value: string;
  label: string;
}
interface AudienceRuleFormProps {
  onChange: (fields: RuleItem[]) => void;
  value: RuleItem[];
  id: number;
  selectPixel: selectItem[];
}
const AudienceRulesForm = (props: AudienceRuleFormProps) => {
  const { onChange, value, id, selectPixel } = props;
  const initialState: RuleItem[] = [
    {
      pixelId: "",
      events: "",
      retention: 0,
      type: "inclusions",
      filter: [
        {
          field: "url",
          operator: "i_contains",
          value: "",
        },
      ],
    },
  ];
  const [fields, setFields] = useState<RuleItem[]>(
    value.length !== 0 ? value : initialState
  );
  // const [ruleData, setRuleData] = useState<Field[]>([]);

  const handleChange = (index: number, name: string, value: any) => {
    const updatedFields = fields.map((field, idx) => {
      if (idx === index) {
        return {
          ...field,
          [name]: value,
        };
      }
      return field;
    });
    setFields(updatedFields);
    onChange(updatedFields);
  };

  const handleAddField = (type: "inclusions" | "exclusions") => {
    var newField = initialState[0];
    newField = { ...newField, type };
    setFields([...fields, newField]);
    onChange([...fields, newField]);
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = [...fields];
    if (updatedFields.length > 1) {
      updatedFields.splice(index, 1);
      setFields(updatedFields);
      onChange(updatedFields);
    }
  };

  // const handleFilterFormChange = (fields: Field[]) => {
  //     console.log(fields);
  //     setRuleData(fields);
  // };
  const lstPixels = [
    { value: "rustic", label: "Rustic" },
    { value: "antique", label: "Antique" },
    { value: "vinyl", label: "Vinyl" },
    { value: "vintage", label: "Vintage" },
    { value: "refurbished", label: "Refurbished" },
  ];

  //dat select Event
  const selectEvent = Object.keys(EVENT_LIST_DEFAULT).map((item: string) => ({
    value: item,
    label: item,
  }));
  return (
    <>
      {fields.map((field, index) => (
        <div key={index} className="my-5">
          <Card>
            <MyCollaps title={field.type}>
              <p
                className="cursor-pointer absolute top-3 right-3"
                onClick={() => handleRemoveField(index)}
              >
                {index > 0 && <XIcon width={20} height={20} />}
              </p>
              <BlockStack gap="500">
                <Select
                  label={
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                      Select Pixel
                    </Text>
                  }
                  placeholder="Select Pixel"
                  options={selectPixel}
                  name="pixelId"
                  value={field?.pixelId}
                  onChange={(value) => handleChange(index, "pixelId", value)}
                />
                <Select
                  label={
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                      Select Event
                    </Text>
                  }
                  placeholder="Select Event"
                  options={selectEvent}
                  name="events"
                  value={field?.events}
                  onChange={(value) => handleChange(index, "events", value)}
                />
                <TextField
                  // disabled={!formState.isActiveCApi}
                  id="retention"
                  name="retention"
                  label={
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                      Retention
                    </Text>
                  }
                  type="number"
                  autoComplete="off"
                  suffix="days"
                  max={180}
                  // error={formState.testEventCode && enabledConversionsApi && isSubmitting ? "Test Event Code is required" : ""}
                  helpText={
                    <Text as="p" fontWeight="regular">
                      Enter the number of days you want{" "}
                      <Link
                        target="_blank"
                        url="https://developers.facebook.com/docs/marketing-api/audiences/guides/audience-rules"
                      >
                        Accounts Center accounts
                      </Link>{" "}
                      to remain in your audience after meeting the website
                      traffic criteria you specified. People will be removed
                      from your audience after this time unless they meet the
                      criteria again. Maximum time: 180 days
                    </Text>
                  }
                  value={String(field?.retention)}
                  onChange={(value) => handleChange(index, "retention", value)}
                />
              </BlockStack>
              <BlockStack>
                <div className="mt-4">
                  <AudienceFilterForm
                    // onChange={handleFilterFormChange}
                    onChange={(value) => handleChange(index, "filter", value)}
                    value={field.filter}
                    id={id}
                  />
                </div>
              </BlockStack>
              <div className="mt-4 flex gap-2">
                <Button
                  icon={PlusIcon}
                  onClick={() => handleAddField("inclusions")}
                >
                  Include more people
                </Button>
                <Button
                  icon={MinusIcon}
                  onClick={() => handleAddField("exclusions")}
                >
                  Exclude people
                </Button>
              </div>
            </MyCollaps>
          </Card>
        </div>
      ))}
    </>
  );
};

export default AudienceRulesForm;
