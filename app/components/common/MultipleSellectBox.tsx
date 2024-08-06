import {
  Combobox,
  Icon,
  Listbox,
  Tag,
  AutoSelection,
  TextContainer,
  LegacyStack,
} from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { useCallback, useState } from "react";

export interface IOption {
  id?:string
  value: string;
  label: string;
  image?: string;
  productIds?: string[];
}
interface IMultipleSelectProps {
  handleChangeOptions: (value: string[]) => void;
  selectedOptions: string[];
  setSelectedOptions: (value: string[]) => void;
  listOptions: IOption[];
  isShowTag: boolean;
  placeholder: string;
}

function MultipleSelectBox(props: IMultipleSelectProps) {
  const {
    handleChangeOptions,
    selectedOptions,
    setSelectedOptions,
    listOptions,
    isShowTag,
    placeholder,
  } = props;

  // State for the input value and options
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(listOptions);

  // Update the text value and filter the options
  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === "") {
        setOptions(listOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = listOptions.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptions(resultOptions);
    },
    [listOptions]
  );

  // Update the selected options and call the handleChangeOptions function
  const updateSelection = useCallback(
    (selected: string) => {
      if (selectedOptions.includes(selected)) {
        setSelectedOptions(
          selectedOptions.filter((option) => option !== selected)
        );
        handleChangeOptions(
          selectedOptions.filter((option) => option !== selected)
        );
      } else {
        setSelectedOptions([...selectedOptions, selected]);
        handleChangeOptions([...selectedOptions, selected]);
      }

      updateText("");
    },
    [handleChangeOptions, selectedOptions, setSelectedOptions, updateText]
  );

  // Remove a tag from the selected options
  const removeTag = useCallback(
    (tag: string) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
      handleChangeOptions(options);
    },
    [handleChangeOptions, selectedOptions, setSelectedOptions]
  );

  const [active, setActive] = useState(false);

  const toggleModal = useCallback(() => setActive((active) => !active), []);

  // Render the tags for the selected options
  const tagsMarkup =
    selectedOptions &&
    selectedOptions.map((option) => (
      <Tag key={`option-${option}`} onRemove={removeTag(option)}>
        {option}
        {/* <Modal
          activator={
            <Button variant="monochromePlain" onClick={toggleModal}>
              {option}
            </Button>
          }
          open={active}
          onClose={toggleModal}
          title="Get a shareable link"
          primaryAction={{
            content: "Close",
            onAction: toggleModal,
          }}
        >
          <Modal.Section></Modal.Section>
        </Modal> */}
      </Tag>
    ));

  // Render the options for the combobox
  const optionsMarkup =
    options.length > 0
      ? options.map((option) => {
          const { label, value } = option;

          return (
            <Listbox.Option
              key={`${value}`}
              value={value}
              selected={selectedOptions.includes(value)}
              accessibilityLabel={label}
            >
              {value}
            </Listbox.Option>
          );
        })
      : null;

  return (
    <>
      <div>
        <Combobox
          allowMultiple
          activator={
            <Combobox.TextField
              prefix={<Icon source={SearchIcon} />}
              onChange={updateText}
              label="Select items"
              labelHidden
              value={inputValue}
              placeholder={placeholder}
              autoComplete="off"
            />
          }
        >
          {optionsMarkup ? (
            <Listbox
              autoSelection={AutoSelection.None}
              onSelect={updateSelection}
            >
              {optionsMarkup}
            </Listbox>
          ) : null}
        </Combobox>
      </div>
      {isShowTag && (
        <div className="mt-4">
          <TextContainer>
            <LegacyStack>{tagsMarkup}</LegacyStack>
          </TextContainer>
        </div>
      )}
    </>
  );
}

export default MultipleSelectBox;
//
//This code provides a multiple select combobox component. The component uses the `Combobox`, `Listbox`, and `Tag` components from the `@shopify/polaris` library. The component accepts an array of selected options and a function to handle changes to the selected options.
//
//The component maintains the state of the input value and the options. It also provides functions to update the text value, filter the options, update the selected options, and remove a tag from the selected options.
//
//The component renders the tags for the selected options and the options for the combobox. The options are filtered based on the input value.
//
//The component is optimized for performance using the `useCallback` and `useMemo` hooks.
