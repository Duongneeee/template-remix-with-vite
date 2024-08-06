export interface IProfileAppConfigRequest{
    id?: number,
    shop: string,
    appConfigId: number,
    value: string
    createdAt?: Date | string
    updatedAt?: Date | string
}
 