import type { IOption } from "~/components/common/MultipleSellectBox";

export interface IFormState {
  id?: string;
  name: string;
  pixelId?: string;
  adAccount:string;
  nameManual?:string;
  pixelIdManual?: string;
  shop?: string;
  targetArea: string;
  isActiveCApi: boolean;
  testEventCode: string;
  accessTokenFB?: string;
  collectionOptions: IOption[];
  status: boolean;
  lstEvents?: IEvent;
  mode?: string;
  actionMode?: string;
  lstCollects?: string[];
  lstProducts?: string[];
}

export interface IEvent {
  [eventName: string]: {
    isActive: boolean;
    variant: "variantId" | "productId";
  };
}
export interface IEventValue {
  isActive: boolean;
  variant: string;
  isHasVariant: boolean;
}
