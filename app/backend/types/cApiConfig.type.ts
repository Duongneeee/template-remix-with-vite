import type { IOption } from '../../components/analytic/ComboboxSearch';
export interface ICApi_MetaPixelRequest {
    pixelId: string;
    adAccount?: string;
    name: string;
    nameManual?: string;
    pixelIdManual?: string;
    lstCollects?: string | null;
    lstProducts?: string | null;
    lstTags?: string | null;
    lstEvents: string;
    shop: string;
    targetArea: string;
    status?: boolean;
    isActiveCApi?: boolean;
    testEventCode?: string;
    accessTokenFB: string;
    mode?: string | null;
    platform?: string | null;
    createdAt?: Date | string;
    collectionOptions?: IOption[];
}
export interface ICApi_MetaPixelCreate extends ICApi_MetaPixelRequest { }
export interface ICApi_MetaPixelUpdate extends ICApi_MetaPixelRequest {
    id?: number
}
export interface IEventData {
    user_data: any,
    event_time: number,
    event_name: string,
    event_id: number,
    action_source?: string,
    test_event_code: string
}

export interface authAppFB {
    accessToken: string,
    pixelId: string
}