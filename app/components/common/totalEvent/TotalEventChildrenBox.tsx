import { Card, Icon, Text } from "@shopify/polaris";
import SkeletonTabsMultiple from "../SkeletonTabsMultiple";
import { ITotalEventChildrenProps } from "~/types/common.type";

export default function TotalEventChildrenBox (props: ITotalEventChildrenProps) {

    const { title, data, icon, stateSkeletonOfIndex} = props;
    return(
        <Card background="bg">
            <div className=" flex justify-between mb-2">
                <Text variant="bodyLg" as="span">{title}</Text>
                <div>
                <Icon
                source={icon}
                tone="base"
                />
                </div>
            </div>
            <SkeletonTabsMultiple state={stateSkeletonOfIndex}>
                <Text variant="headingSm" as="span">{data}</Text>
            </SkeletonTabsMultiple>
        </Card>
    )
}