import { Card, LegacyStack, Tag, Text } from "@shopify/polaris";
import { useCallback } from "react";
import { IOption } from "./MultipleSellectBox";

interface ITagProps{
    title?:string | React.ReactNode,
    data: IOption[],
    setData: (value:string[])=> void
}
const TagMultipleBoxInName = ({data, setData, title}:ITagProps)=>{
  const removeTag = useCallback(
    (tag: IOption) => () => {
        const dataFilter = data.filter((previousTag:IOption) => previousTag.id !== tag.id).map((item:IOption)=>item.id) as string[];
        setData(dataFilter);
    },
    [data, setData],
  );

  const tagMarkup = data.map((option: IOption, index: number) => (
      <Tag onRemove={removeTag(option)} key={index}>{option.value}</Tag>
  ));
  
  return (
    <Card padding="200">
        <Text as="p" variant="headingSm">{title}</Text>
        <LegacyStack spacing="tight">
            {tagMarkup}
        </LegacyStack>
    </Card>
  )
}

export default TagMultipleBoxInName;