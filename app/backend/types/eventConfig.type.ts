export interface IEventConfigRequest{
    pixelId: string
    name: string
    typeId: string
    isActive: boolean
    createdAt?: Date | string
}
export interface IEventConfigUpdate extends IEventConfigRequest{
    id: number
}
export interface IEventConfigCreate extends IEventConfigRequest{
    id: number
}