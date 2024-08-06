import { AudienceLookaLikeRule } from "~/routes/app.lookalike.$id";

export interface ISelectSource {
  label: string;
  value: string;
}
// API Create custom audience
export interface EventSource {
  type: string;
  id: number;
}
export interface Filter {
  field: string;
  operator: string;
  value: string;
}
export interface Rule {
  event_sources: EventSource[];
  retention_seconds: number;
  filter: {
    operator: string;
    filters: Filter[];
  };
}
export interface Inclusions {
  operator: string;
  rules: Rule[];
}
export interface Exclusions {
  operator: string;
  rules: Rule[];
}
export interface ICustomeAudienceReq {
  name?: string;
  rule?: Config;
  prefill?: string;
  access_token: string;
  description?: string;
  adAccount?: string;
  subtype?: string;
  origin_audience_id?: string;
  lookalike_spec?: AudienceLookaLikeRule;
}
export interface Config {
  inclusions: Inclusions;
  exclusions?: Exclusions;
}
// exmple
// const config: Config = {
//     inclusions: {
//         operator: "and",
//         rules: [
//             {
//                 event_sources: [
//                     {
//                         type: "pixel",
//                         id: 146564098519710
//                     }
//                 ],
//                 retention_seconds: 2592000,
//                 filter: {
//                     operator: "and",
//                     filters: [
//                         {
//                             field: "event",
//                             operator: "eq",
//                             value: "PageView"
//                         },
//                         // Add more filters here if needed
//                     ]
//                 }
//             },
//             // Add more rules here if needed
//         ]
//     },
//     exclusions: {
//         operator: "and",
//         rules: [
//             // Add exclusion rules here if needed
//         ]
//     }
// };
