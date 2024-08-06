export interface IFeatureRequest{
    id?:number,
    shop:string,
    title:string,
    description:string,
    voteNumber:number,
    status:number,
    createdAt?:Date | string
    updatedAt?:Date | string
}

export interface IFeatureRequestUpdate{
    id?:number,
    shop?:string,
    title?:string,
    description?:string,
    voteNumber:number,
    status?:number,
    createdAt?:Date | string
    updatedAt?:Date | string
}