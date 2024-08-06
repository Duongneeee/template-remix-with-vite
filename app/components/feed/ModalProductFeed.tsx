import { Avatar, Button, Checkbox, Combobox, Icon, List, Listbox, Modal, Scrollable } from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import {SearchIcon, PlusIcon} from '@shopify/polaris-icons';
import { IOption } from "../common/MultipleSellectBox";
import { RuleProductFeedItem } from "./ProductFeedRulesForm";

export default function ModalProductFeed(
  {dataOption,selectData,setSelectData,titleButton,onChange ,selectedCollection,
    selectedProductTags,
    selectedProductTypes}
  :{dataOption:IOption[], 
    selectData:string[], 
    setSelectData:any,
    selectedCollection:string[],
    selectedProductTags:string[],
    selectedProductTypes:string[],
    titleButton:string, 
    onChange: (rule: RuleProductFeedItem) => void})
  {
     //modal select 
  const deselectedOptions = useMemo(
    () => dataOption,
    [],
  );

  const [selectedOptions, setSelectedOptions] = useState<string[]>(selectData);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(deselectedOptions);
  const escapeSpecialRegExCharacters = useCallback(
    (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    [],
  );

  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === '') {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(escapeSpecialRegExCharacters(value), 'i');
      const resultOptions = deselectedOptions.filter((option:any) =>
        option.label.match(filterRegex),
      );
      setOptions(resultOptions);
    },
    [deselectedOptions, escapeSpecialRegExCharacters],
  );

  const updateSelection = useCallback(
    (selected: string) => {
      if (selectedOptions.includes(selected)) {
        setSelectedOptions(
          selectedOptions.filter((option) => option !== selected),
        );
        setSelectData(selectData.filter((item) => item !== selected))
      } else {
        setSelectedOptions([...selectedOptions, selected]);
        setSelectData(
          [...selectData,selected]
         );
      }

      updateText('');
    },
    [selectedOptions, updateText],
  );

  const tagsMarkup = deselectedOptions.map((option,index) => (
    <div key={index}>
        <Checkbox
          label={
          <div className="flex gap-x-2 items-center justify-center">
            {option?.image ? <Avatar customer source={option?.image} name={option?.label || ""}/>:<Avatar customer name={option?.label || ""}/>}
            <p>{option.label}</p>
          </div>
          }
          checked={ selectedOptions.includes(option.value)}
          onChange={(value)=>{
            updateSelection(option.value)
          }}
        />
    </div>
  ));
  const optionsMarkup =
    options.length > 0
      ? options.map((option:any) => {
          const {label, value} = option;

          return (
            <Listbox.Option
              key={`${value}`}
              value={value}
              selected={selectedOptions.includes(value)}
              accessibilityLabel={label}
            >
              {label}
            </Listbox.Option>
          );
        })
      : null;
  
      const [active, setActive] = useState(false);
      const [filterProduct,setFilterProduct] = useState<IOption[]>(dataOption.filter((item)=>selectData.includes(item.value)));
      const [prevselectedOptions, setPreSelectedOptions] = useState<string[]>([]);

       useEffect(()=>{
        setFilterProduct(dataOption.filter((item)=>selectData.includes(item.value)))
        setSelectedOptions(selectData)
       },[selectData])

      const handleChange = useCallback(() => {
        setActive(!active);
        setSelectedOptions([...prevselectedOptions]);
      }, [active]);

      const handleOpen = ()=>{
        setActive(!active);
        setPreSelectedOptions([...selectedOptions]);
      }
      
      const handleAdd = ()=>{
        setFilterProduct(dataOption.filter((item)=>selectData.includes(item.value)));
        onChange({ltsProducts:selectData, types: selectedProductTypes, ltsCollections: selectedCollection,tags:selectedProductTags})
        setActive(!active);
      }

      const activator = <Button onClick={handleOpen} icon={PlusIcon}>{titleButton}</Button>
      return (
        <div>
        <Modal
          activator={activator}
          open={active}
          onClose={handleChange}
          title={titleButton}
          primaryAction={{
            content: 'Done',
            onAction: handleAdd,
          }}
          secondaryActions={[
            {
              content: 'cancel',
              onAction: handleChange,
            },
          ]}
        >
          <Modal.Section>
          <div>
      <Combobox
        allowMultiple
        activator={
          <Combobox.TextField
            prefix={<Icon source={SearchIcon} />}
            onChange={updateText}
            label="Search tags"
            labelHidden
            value={inputValue}
            placeholder="Search tags"
            autoComplete="off"
          />
        }
      >
        {optionsMarkup ? (
          <Listbox onSelect={
            updateSelection
            // ()=>{}
          }>{optionsMarkup}</Listbox>
        ) : null}
      </Combobox>
      {/* <TextContainer>
        <LegacyStack>{tagsMarkup}</LegacyStack>
      </TextContainer> */}
      {tagsMarkup}
    </div>
          </Modal.Section>
        </Modal>
          <Scrollable shadow>
          <div className={`py-2 ${filterProduct.length > 5 && "h-64"}`}>
            <List type="number">
               {filterProduct.map((item:any,index:number)=>
                  <div key={index} className="flex gap-x-2 items-center font-bold my-2 border-b">
                   <List.Item>
                    <div className="ml-2">{item?.image && <Avatar customer source={item?.image}/>}</div>
                    {/* <div className="flex gap-x-2 items-center">
                    {item?.image && <Avatar customer source={item?.image}/>}
                      {item.value}
                    </div> */}
                   </List.Item>
                   { item.value}
                  </div>
                )}
            </List>
          </div>
            </Scrollable>
        </div>

      )
}