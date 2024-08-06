import { IconSource } from "@shopify/polaris"

export interface ILoaderRoot {
    apiKey: string
    shop: string
    shopName: string
    emailShop: string
    planShopify: string
    country: string
    ip: string
    url: string
    pathname: string
    isBlackList: boolean
}

// Type ConversionRate start
interface IConversionRate {
    stateSkeletonOfIndex: boolean
    handleToggle: () => void
}

export interface IConversionRateProps extends IConversionRate{
    vcRate: number | string
    atcRate: number | string
    icRate: number | string
    
}

export interface IConversionRateChildrenProps extends IConversionRate{
    title: string
    data: number | string 
}
// Type ConversionRate end

// Type TotalEvent start
export interface ITotalEventProps {
    pageViewCount: number | string
    ViewContentCount: number | string
    AddToCartCount: number | string
    InitiateCheckoutCount: number | string
    PurchaseCount: number | string
    CollectionViewCount: number | string
    stateSkeletonOfIndex: boolean
}

export interface ITotalEventChildrenProps {
    title: string
    data: number | string
    icon: IconSource
    stateSkeletonOfIndex: boolean
}
// Type TotalEvent end