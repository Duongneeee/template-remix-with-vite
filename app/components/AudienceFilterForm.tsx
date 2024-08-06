import React, { useState } from "react";
import { Card, Select, TextField, Text, Grid, Button } from "@shopify/polaris";
import { PlusIcon, DeleteIcon } from "@shopify/polaris-icons";
import {
  AudienceRulesOperand1Options,
  AudienceRulesRelationOptions,
} from "~/constants/options";

export interface Field {
  field: string;
  operator: string;
  value: string;
}

interface AudienceFilterFormProps {
  onChange: (fields: Field[]) => void;
  value: Field[];
  id: number
}

const AudienceFilterForm: React.FC<AudienceFilterFormProps> = ({
  onChange,
  value,
  id
}) => {
  const [fields, setFields] = useState<Field[]>(
    value.length !== 0 || id
      ? value
      : [{ field: "url", operator: "i_contains", value: "" }]
  );

  const handleChange = (index: number, name: string, value: string) => {
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

  const handleAddField = () => {
    const newField = {
      field: "url",
      operator: "i_contains",
      value: "",
    };
    setFields([...fields, newField]);
    onChange([...fields, newField]);
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
    onChange(updatedFields);
  };
  return (
    <Card>
      {fields.map((field, index) => (
        <div key={index} className="mt-2">
          <Grid>
            <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 12, xl: 12 }}>
              <Text as="h2" variant="headingSm" fontWeight="medium">
                {`Audience Rule ${index + 1}`}
              </Text>
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 2, lg: 3, xl: 2 }}>
              <Select
                label=""
                options={AudienceRulesOperand1Options}
                name="field"
                value={field.field}
                onChange={(value) => handleChange(index, "field", value)}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 2, lg: 3, xl: 2 }}>
              <Select
                label=""
                options={AudienceRulesRelationOptions}
                name="operator"
                value={field.operator}
                onChange={(value) => handleChange(index, "operator", value)}
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 2, lg: 3, xl: 2 }}>
              <TextField
                id={`audienceName-${index}`}
                label=""
                autoComplete="off"
                name="value"
                value={field.value}
                onChange={(value) =>
                  handleChange(index, "value", value)
                }
              />
            </Grid.Cell>
            <Grid.Cell columnSpan={{ xs: 2, sm: 2, md: 3, lg: 2, xl: 2 }}>
              <Button
                icon={DeleteIcon}
                accessibilityLabel="Remove item"
                onClick={() => handleRemoveField(index)}
              />
            </Grid.Cell>
          </Grid>
        </div>
      ))}
      <div className="mt-4">
        <Button icon={PlusIcon} onClick={handleAddField}>
          Add Rule
        </Button>
      </div>
    </Card>
  );
};

export default AudienceFilterForm;
