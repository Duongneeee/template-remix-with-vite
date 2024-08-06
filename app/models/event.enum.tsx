export type EGetAllEvents = {
    id: number;
    name: string;
    shop: string;
    eventId: string;
    data: string;
    eventSourceUrl: string;
    accountID: string;
    eventTime: string;
   };

export type IEventConfigData = {
    id?: number;
    name: string;
    shop: string;
    appId: string;
    typeId: string;
    isActive: boolean
}
export type IEventNameMapping = {
    id: number;
    event_name_shopify: string;
    event_name_facebook: string;
    display_name: string;
    color: string;
}