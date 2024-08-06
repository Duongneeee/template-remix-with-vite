export interface IEventDataRequest {
  id?: number;
  shop: string;
  pixelId: string;
  eventName: string;
  eventId: string;
  eventSourceUrl: string;
  utmCampaign: string;
  utmSource: string;
  utmMedium: string;
  utmAd: string;
  utmAdSet: string;
  data?: string | null;
  platform: string;
  eventTime: string;
  syncFlag?: number;
  createdAt?: Date | string;
}

export interface IEventDataCreate extends IEventDataRequest {}
export interface IEventDataUpdate extends IEventDataRequest {
  id: number;
}

export interface IEventDataByDate {
  shop: string;
  since?: Date | string;
  until?: Date | string;
  pixelId?: string | undefined;
  platform?: string;
}