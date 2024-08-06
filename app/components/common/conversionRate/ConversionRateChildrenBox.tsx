import { Box, InlineStack, Text } from "@shopify/polaris";
import { IConversionRateChildrenProps } from "~/types/common.type";
import SkeletonTabsMultiple from "../SkeletonTabsMultiple";



export default function ConversionRateChildrenBox ( props: IConversionRateChildrenProps ) {
    const { title, data, handleToggle, stateSkeletonOfIndex } = props
    return (
        <div onClick={handleToggle}>
            <Box as="div" paddingBlock="400">
            <Text variant="bodyLg" as="span">{title}</Text>
            <SkeletonTabsMultiple state={stateSkeletonOfIndex}>
                <InlineStack gap="400" wrap={false} blockAlign="center">
                <Text variant="headingMd" as="span">{data}%</Text>
                </InlineStack>
            </SkeletonTabsMultiple>
            </Box>
        </div>
    )
}