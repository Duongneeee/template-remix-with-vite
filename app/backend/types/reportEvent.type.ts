export interface ReportDate {
    since:string,
    until:string,
    pixelId?:string
}

export interface IReportRequest {
    id?:number
    pixelId?:string,
    shop?:string,
    pageView:number,
    viewContent:number,
    addToCart:number,
    initiateCheckout:number,
    purchase:number,
    search:number,
    collectionView:number,
    cartView:number,
    addPaymentInfo:number,
    revenue?:number,
    currency?:string,
    day?:Date,
    createdAt?:Date,
    updatedAt?:Date,
}
