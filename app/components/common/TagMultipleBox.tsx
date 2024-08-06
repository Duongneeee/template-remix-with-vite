import { Card, LegacyStack, Tag, Text } from "@shopify/polaris";
import { useCallback } from "react";

interface ITagProps{
    title?:string | React.ReactNode,
    data: string[],
    setData: (value:string[])=> void
}
const TagMultipleBox = ({data, setData, title}:ITagProps)=>{
  const removeTag = useCallback(
    (tag: string) => () => {
        const dataFilter= data.filter((previousTag:string) => previousTag !== tag);
        setData(dataFilter);
    },
    [data, setData],
  );

  const tagMarkup = data.map((option: string, index: number) => (
      <Tag onRemove={removeTag(option)} key={index}>{option}</Tag>
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

export default TagMultipleBox;