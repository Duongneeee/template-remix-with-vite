export interface ICollectionRequest{
    name: string;
    collectionId: string;
    shop: string;
    appId: string;
    isActive: boolean;
}
export interface ICollectionCreate extends ICollectionRequest{}
export interface ICollectionUpdate extends ICollectionRequest{
    id: number;
}
export interface IProductInCollectionsReq{
    shop: string,
    shopifyToken: string,
    collectionId: string
}
export interface IProduct {
    id: number;
  }