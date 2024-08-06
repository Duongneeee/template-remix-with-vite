import { Icon, Popover, Button, TextField, OptionList } from "@shopify/polaris";
import { SearchIcon } from '@shopify/polaris-icons';
import { useCallback, useEffect, useState } from "react";
import "../../css/common.css";

export interface IOption {
  value: string;
  label: string;
}
interface IMultipleSelectProps {
  handleChangeOptions: (value: string[]) => void;
  selectedOptions: string[];
  setSelectedOptions: (value: string[]) => void;
  listOptions: IOption[]
  isShowTag: boolean;
  placeholder: string;
}

function ComboboxSearch(props: IMultipleSelectProps) {
  const { handleChangeOptions, selectedOptions, listOptions, placeholder, isShowTag } = props;
  // State for the input value and options
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(listOptions);
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  // Update the text value and filter the options
  useEffect(()=>setOptions(listOptions),[isShowTag])
  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === '') {
        setOptions(listOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = listOptions.filter((option) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [listOptions],
  );

  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );
  //console.log(selectedOptions)
  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
      {selectedOptions.length > 1
        ? 'Multi selected'
        : selectedOptions.length === 1
          ? options.find(item => item.value === selectedValue[0])?.label
          : placeholder}
    </Button>
  );

  return (
    <>
      <div>
      <Popover
        active={popoverActive}
        activator={activator}
        onClose={togglePopoverActive}
      >
        <div className="m-2">
            <TextField             
                label=""
                value={inputValue}
                onChange={updateText}
                prefix={<Icon source={SearchIcon} tone="base" />}
                autoComplete="off"
              />
            </div>          
            <OptionList
                title=""
                onChange={ (value) => {
                  setSelectedValue(value)
                  handleChangeOptions(value);
                  }
                }
                options={options}
                selected={selectedOptions}
                allowMultiple
              />              
      </Popover>
      </div>

    </>
  );
}

export default ComboboxSearch;