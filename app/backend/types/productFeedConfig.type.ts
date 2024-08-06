export interface IProductFeedConfigReq{
    id?: number
    productFeedIdFb?:string
    shop: string
    name: string
    adAccount?: string
    catalog?: string
    description?: string
    conditions?: string
    rule: string
    schedule: string
    file:string
    status:number
    createdAt?: Date | string
    updatedAt?: Date | string
}

export interface IProductFeedConfigUpdate{
    id: number
    productFeedIdFb?:string
    shop: string
    name: string
    adAccount?: string
    catalog?: string
    description?: string
    conditions: string
    rule: string
    schedule: string
    file:string,
    status:number
    createdAt?: Date | string
    updatedAt?: Date | string
}