export interface IAudienceConfigReq {
  id?: number;
  audienceFbId?: string;
  shop: string;
  audienceName: string;
  adAccount?: string;
  source?: string;
  description?: string;
  conditions: string;
  rule: string;
  numberDay?: number;
  isLookaLikeAudience?: boolean;
  audienceSize?: number;
  audienceBase?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
