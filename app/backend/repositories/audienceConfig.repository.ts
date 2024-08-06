import db from "~/db.server";
import type { IAudienceConfigReq } from "../types/audienceConfig.type";
import {
  createCustomAudience,
  deleteCustomAudience,
  updateCustomAudience,
} from "../external_apis/facebook/facebook.service";
import {
  Config,
  ICustomeAudienceReq,
  Rule,
} from "../external_apis/facebook/facebook.types";

export const createAudienceConfigRepo = async (data: IAudienceConfigReq) => {
  // console.log("this is createData", data);
  try {
    let dataFB: ICustomeAudienceReq;
    if (data.isLookaLikeAudience == true) {
      dataFB = {
        name: data.audienceName,
        subtype: "LOOKALIKE",
        adAccount: "314709418170394",
        origin_audience_id: "120208266083380544",
        lookalike_spec: JSON.parse(data.rule),
        access_token:
          "EAAF4JF1niYkBOZBYB8ZBQq0u5FPhwknlZCpLTdv43SZC8WKBZBzQTHShu7vBIbIwOWEFERy8COxPdtWtylkAkU4ROpaHoG87dV3ZCARC9j7Q1sPtZBhtyjcEZByzz8uMzssmKSzhBLeaeRo0VkjYo3bjbgPHGHL2ZAcTMaT1C2guzZBvlVCvYswOqp402KEefeEAWmZARprKYva6IuTleAd0QknsntxKKwZD",
      };
    } else {
      let ruleFB: Config;
      const filterInclusionsRule = JSON.parse(data.rule).filter(
        (rule: any) => rule.type == "inclusions"
      );
      const ruleInclusions: Rule[] =
        filterInclusionsRule?.map((element: any) => {
          const filter = element.filter.reduce(
            (accumulator: any, currentValue: any) => {
              let currentValueArray: any = [];
              currentValueArray.push(currentValue),
                accumulator.push({
                  operator: "or",
                  filters: currentValueArray,
                });
              return accumulator;
            },
            [
              {
                field: "event",
                operator: "eq",
                value: element.events,
              },
            ]
          );

          return {
            event_sources: [
              {
                type: "pixel",
                id: 146564098519710,
              },
            ],
            retention_seconds: Number(element.retention) * 24 * 60 * 60,
            filter: {
              operator: "and",
              filters: filter,
            },
          };
        }) || [];

      const filterExclusionsRule = JSON.parse(data.rule).filter(
        (item: any) => item.type == "exclusions"
      );
      const ruleExclusions: Rule[] =
        filterExclusionsRule?.map((element: any) => {
          const filter = element.filter.reduce(
            (accumulator: any, currentValue: any) => {
              let currentValueArray: any = [];
              currentValueArray.push(currentValue);
              accumulator.push({
                operator: "or",
                filters: currentValueArray,
              });
              return accumulator;
            },
            [
              {
                field: "event",
                operator: "eq",
                value: element.events,
              },
            ]
          );

          return {
            event_sources: [
              {
                type: "pixel",
                id: 146564098519710,
              },
            ],
            retention_seconds: Number(element.retention) * 24 * 60 * 60,
            filter: {
              operator: "and",
              filters: filter,
            },
          };
        }) || [];

      if (ruleExclusions.length > 0) {
        ruleFB = {
          inclusions: {
            operator: data.conditions,
            rules: ruleInclusions,
          },
          exclusions: {
            operator: "and",
            rules: ruleExclusions,
          },
        };
      } else {
        ruleFB = {
          inclusions: {
            operator: data.conditions,
            rules: ruleInclusions,
          },
        };
      }

      dataFB = {
        name: data.audienceName,
        rule: ruleFB,
        prefill: "1",
        access_token:
          "EAAF4JF1niYkBOZBYB8ZBQq0u5FPhwknlZCpLTdv43SZC8WKBZBzQTHShu7vBIbIwOWEFERy8COxPdtWtylkAkU4ROpaHoG87dV3ZCARC9j7Q1sPtZBhtyjcEZByzz8uMzssmKSzhBLeaeRo0VkjYo3bjbgPHGHL2ZAcTMaT1C2guzZBvlVCvYswOqp402KEefeEAWmZARprKYva6IuTleAd0QknsntxKKwZD",
        description: data.description || "",
        adAccount: data.adAccount || "",
      };
    }

    const audienceFbId = await createCustomAudience(dataFB);
    data["audienceFbId"] = String(audienceFbId.data.id);

    return await db.audienceConfig.create({ data });
  } catch (error) {
    throw error;
  }
};

export const updateAudienceConfigRepo = async (data: IAudienceConfigReq) => {
  try {
    let dataFB: ICustomeAudienceReq;
    if (data.isLookaLikeAudience == true) {
      dataFB = {
        name: data.audienceName,
        access_token:
          "EAAF4JF1niYkBOZBYB8ZBQq0u5FPhwknlZCpLTdv43SZC8WKBZBzQTHShu7vBIbIwOWEFERy8COxPdtWtylkAkU4ROpaHoG87dV3ZCARC9j7Q1sPtZBhtyjcEZByzz8uMzssmKSzhBLeaeRo0VkjYo3bjbgPHGHL2ZAcTMaT1C2guzZBvlVCvYswOqp402KEefeEAWmZARprKYva6IuTleAd0QknsntxKKwZD",
        description: data.description || "",
        adAccount: data.audienceFbId || "",
        subtype: "LOOKALIKE",
      };
    } else {
      let ruleFB: Config;
      const filterInclusionsRule = JSON.parse(data.rule).filter(
        (rule: any) => rule.type == "inclusions"
      );
      const ruleInclusions: Rule[] =
        filterInclusionsRule?.map((element: any) => {
          const filter = element.filter.reduce(
            (accumulator: any, currentValue: any) => {
              let currentValueArray: any = [];
              currentValueArray.push(currentValue),
                accumulator.push({
                  operator: "or",
                  filters: currentValueArray,
                });
              return accumulator;
            },
            [
              {
                field: "event",
                operator: "eq",
                value: element.events,
              },
            ]
          );

          return {
            event_sources: [
              {
                type: "pixel",
                id: 146564098519710,
              },
            ],
            retention_seconds: Number(element.retention) * 24 * 60 * 60,
            filter: {
              operator: "and",
              filters: filter,
            },
          };
        }) || [];

      const filterExclusionsRule = JSON.parse(data.rule).filter(
        (item: any) => item.type == "exclusions"
      );
      const ruleExclusions: Rule[] =
        filterExclusionsRule?.map((element: any) => {
          const filter = element.filter.reduce(
            (accumulator: any, currentValue: any) => {
              let currentValueArray: any = [];
              currentValueArray.push(currentValue);
              accumulator.push({
                operator: "or",
                filters: currentValueArray,
              });
              return accumulator;
            },
            [
              {
                field: "event",
                operator: "eq",
                value: element.events,
              },
            ]
          );

          return {
            event_sources: [
              {
                type: "pixel",
                id: 146564098519710,
              },
            ],
            retention_seconds: Number(element.retention) * 24 * 60 * 60,
            filter: {
              operator: "and",
              filters: filter,
            },
          };
        }) || [];

      if (ruleExclusions.length > 0) {
        ruleFB = {
          inclusions: {
            operator: data.conditions,
            rules: ruleInclusions,
          },
          exclusions: {
            operator: "and",
            rules: ruleExclusions,
          },
        };
      } else {
        ruleFB = {
          inclusions: {
            operator: data.conditions,
            rules: ruleInclusions,
          },
        };
      }

      dataFB = {
        name: data.audienceName,
        rule: ruleFB,
        prefill: "1",
        access_token:
          "EAAF4JF1niYkBOZBYB8ZBQq0u5FPhwknlZCpLTdv43SZC8WKBZBzQTHShu7vBIbIwOWEFERy8COxPdtWtylkAkU4ROpaHoG87dV3ZCARC9j7Q1sPtZBhtyjcEZByzz8uMzssmKSzhBLeaeRo0VkjYo3bjbgPHGHL2ZAcTMaT1C2guzZBvlVCvYswOqp402KEefeEAWmZARprKYva6IuTleAd0QknsntxKKwZD",
        description: data.description || "",
        adAccount: data.audienceFbId || "",
      };
    }

    await updateCustomAudience(dataFB);
    return await db.audienceConfig.update({
      where: {
        id: Number(data.id),
      },
      data: {
        id: Number(data.id),
        shop: data.shop,
        audienceName: data.audienceName,
        adAccount: data.adAccount,
        description: data.description,
        rule: data.rule,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getFistOrDefaultAudienceConfigRepo = async (shop: string) => {
  try {
    return await db.audienceConfig.findUnique({
      where: {
        shop: shop,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getAudienceConfigByIdRepo = async (id: number) => {
  try {
    return await db.audienceConfig.findUnique({
      where: {
        id: id,
      },
    });
  } catch (error) {
    throw error;
  }
};
export const getListAudienceConfigByShopRepo = async (shop: string) => {
  try {
    return await db.audienceConfig.findMany({
      where: {
        shop: shop,
      },
      orderBy: {
        id: "desc",
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getListAudienceConfigIsLookaLikeByShopRepo = async (
  shop: string
) => {
  try {
    return await db.audienceConfig.findMany({
      where: {
        shop: shop,
        isLookaLikeAudience: false,
      },
      orderBy: {
        id: "desc",
      },
    });
  } catch (error) {
    throw error;
  }
};
export const deleteAudienceConfigByIdRepo = async (id: number) => {
  try {
    const audienceConfig: any = await getAudienceConfigByIdRepo(id);
    await deleteCustomAudience({
      id: audienceConfig.audienceFbId,
      access_token:
        "EAAF4JF1niYkBOZBYB8ZBQq0u5FPhwknlZCpLTdv43SZC8WKBZBzQTHShu7vBIbIwOWEFERy8COxPdtWtylkAkU4ROpaHoG87dV3ZCARC9j7Q1sPtZBhtyjcEZByzz8uMzssmKSzhBLeaeRo0VkjYo3bjbgPHGHL2ZAcTMaT1C2guzZBvlVCvYswOqp402KEefeEAWmZARprKYva6IuTleAd0QknsntxKKwZD",
    });
    return await db.audienceConfig.deleteMany({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteAudienceConfigByShopRepo = async (shop: string) => {
  try {
    return await db.audienceConfig.deleteMany({
      where: {
        shop: shop,
      },
    });
  } catch (error) {
    throw error;
  }
};
