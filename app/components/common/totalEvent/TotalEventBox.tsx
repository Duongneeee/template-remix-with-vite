import { Grid } from "@shopify/polaris";
import TotalEventChildrenBox from "./TotalEventChildrenBox";
import { 
    BookOpenIcon, 
    ContentIcon, 
    CartIcon,
    ContractIcon,
    CashDollarIcon,
    CollectionIcon,
} from "@shopify/polaris-icons";
import { ITotalEventProps } from "~/types/common.type";

export default function TotalEventBox (props: ITotalEventProps) {

    const { 
            pageViewCount,
            ViewContentCount,
            AddToCartCount,
            InitiateCheckoutCount,
            PurchaseCount,
            CollectionViewCount,
            stateSkeletonOfIndex 
        } = props
    return (
        <Grid>
            <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 2, lg: 4, xl: 4 }}>
                <TotalEventChildrenBox 
                    title = 'PageView'
                    data={pageViewCount} 
                    icon={BookOpenIcon} 
                    stateSkeletonOfIndex={stateSkeletonOfIndex}
                />
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 2, lg: 4, xl: 4 }}>
                <TotalEventChildrenBox 
                    title = 'ViewContent'
                    data={ViewContentCount} 
                    icon={ContentIcon} 
                    stateSkeletonOfIndex={stateSkeletonOfIndex}
                />
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 2, lg: 4, xl: 4 }}>
                <TotalEventChildrenBox 
                    title = 'AddToCart'
                    data={AddToCartCount}  
                    icon={CartIcon} 
                    stateSkeletonOfIndex={stateSkeletonOfIndex}
                />
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 2, lg: 4, xl: 4 }}>
                <TotalEventChildrenBox 
                    title = 'InitiateCheckout'
                    data={InitiateCheckoutCount} 
                    icon={ContractIcon}
                    stateSkeletonOfIndex={stateSkeletonOfIndex}
                />
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 2, lg: 4, xl: 4 }}>
                <TotalEventChildrenBox 
                    title = 'Purchase'
                    data={PurchaseCount} 
                    icon={CashDollarIcon}
                    stateSkeletonOfIndex={stateSkeletonOfIndex}
                />
            </Grid.Cell>

            <Grid.Cell columnSpan={{ xs: 3, sm: 3, md: 2, lg: 4, xl: 4 }}>
                <TotalEventChildrenBox 
                    title = 'CollectionView'
                    data={CollectionViewCount} 
                    icon={CollectionIcon}
                    stateSkeletonOfIndex={stateSkeletonOfIndex}
                />
            </Grid.Cell>
        </Grid>
    )
}