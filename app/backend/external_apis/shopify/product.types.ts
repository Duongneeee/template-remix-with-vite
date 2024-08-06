export interface IProductRequest{
    shop: string;
    id: number;
    title: string;
    handle: string;
    tags: string[];
    totalInventory: number;
    productType: string;
    onlineStorePreviewUrl: string;
}