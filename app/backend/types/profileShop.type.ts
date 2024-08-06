export interface IProfileShopCreate{
    shopId?: string
    shop: string
    shopName?: string
    domain: string
    themeId?:string
    email: string
    country: string
    planId?: number
    planShopify?: string
    installApp?: boolean
    installDate?: Date | string
    expiresDate?: Date | string
    facebookName: string
    facebookAvatar: string
    accessTokenFb: string
    storeFrontAccessToken?: string
    isConfirmPixel?: boolean
    isBlackList?: boolean
    timezone?: string
    createdAt?: Date | string
    updatedAt?: Date | string
}

export interface IProfileShopUpdate extends IProfileShopCreate{
 id: number;
}

export interface IFacebookInfo{
    facebookName: string;
    accessTokenFb: string;
    facebookAvatar: string;
}