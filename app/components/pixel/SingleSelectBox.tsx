import {Autocomplete, Icon} from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import {useState, useCallback, useMemo, useEffect} from 'react';
export interface IOption {
  value: string;
  label: string;
}
interface ISingleSelectBoxProps {
  handleChangeOptions: (value: string) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  listOptions: IOption[]
  placeholder: string;
  label: string;
}
function SingleSelectBox(props: ISingleSelectBoxProps) {
  const { label, handleChangeOptions, inputValue, setInputValue, listOptions, placeholder } = props;
  const deselectedOptions = useMemo(
    () => listOptions,
    [],
  );
  const [options, setOptions] = useState(deselectedOptions);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  useEffect(() => {
    const selectedValue = [inputValue].map((selectedItem) => {
      const matchedOption = options.find((option) => {
        return option.value.match(selectedItem);
      });
      return matchedOption && matchedOption.label;
    });

    setSelectedOptions([inputValue]);
    setInputValue(selectedValue[0] || '');
  }, [])
  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === '') {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
      handleChangeOptions(value)
    },
    [deselectedOptions],
  );

  const updateSelection = useCallback(
    (selected: string[]) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.label;
      });

      setSelectedOptions(selected);
      setInputValue(selectedValue[0] || '');
    },
    [options],
  );

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label={label}
      value={inputValue}
      prefix={<Icon source={SearchIcon} tone="base" />}
      placeholder={placeholder}
      autoComplete="off"
    />
  );

  return (
    <Autocomplete
      options={options}
      selected={selectedOptions}
      onSelect={updateSelection}
      textField={textField}
    />
  );
}

export default SingleSelectBox