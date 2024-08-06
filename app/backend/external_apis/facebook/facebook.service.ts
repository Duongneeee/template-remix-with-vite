import axios from "axios";
import crypto from "crypto";
import { LOG_LEVELS, sentryLogger } from "~/utils/logger";
import type { IEventDataCreate } from "~/backend/types/eventData.type";
import type { ICApi_MetaPixelRequest } from "~/backend/types/cApiConfig.type";
import type { ICustomeAudienceReq } from "./facebook.types";

const version = '20.0';
export const getBussinessSource = async (accessToken: string) => {
  try {
    const url =
      `https://graph.facebook.com/v${version}/me?fields=businesses{adspixels{id,name},name}`;

    const res = await axios.get(url, {
      params: {
        access_token: accessToken,
      },
      headers: {
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    return {
      result: res?.data,
      isSuccessful: true,
    };
  } catch (error: any) {
    return {
      result: error.response
        ? error.response?.data?.error?.code
        : error.message,
      isSuccessful: false,
    };
  }
};

export const pushEventsDataToFBService = async (
  listActivePixelCAPI: any,
  data: IEventDataCreate[]
) => {
  try {
    var response: any = [];
    data.map((eventData: IEventDataCreate) => {
      listActivePixelCAPI.map((pixel: ICApi_MetaPixelRequest) => {
        if (pixel.pixelId === eventData.pixelId) {
          let res: any, resTiktok: any;
          if (pixel.platform === 'facebook' && pixel.isActiveCApi == true) {
            const authData = {
              accessToken: pixel.accessTokenFB,
              pixelId: pixel.pixelId,
              test_event_code: pixel.testEventCode,
            };
            res = pushEventToFB(authData, eventData);
          }
          if (pixel.platform === 'tiktok' && pixel.isActiveCApi == true) {
            const authData = {
              accessToken: pixel.accessTokenFB,
              pixelId: pixel.pixelId,
              test_event_code: pixel.testEventCode,
            };
            resTiktok = pushEventToTiktok(authData, eventData);
          }
          response.push(res);
          response.push(resTiktok);
        }
      });
    });
    return {
      isSuccessful: true,
      result: response,
    };
  } catch (error) {
    console.log(error);
    sentryLogger(
      LOG_LEVELS.ERROR,
      "Error in createMultipleEventDataToFBService ",
      {
        additionalInfo: error,
      }
    );
    return {
      isSuccessful: false,
      errorCode: "500",
      message: error,
    };
  }
};

const pushEventToFB = async (authData: any, eventData: any) => {
  const url = `https://graph.facebook.com/v${version}/${authData.pixelId}/events`;

  const userDataJson = JSON.parse(eventData.data);

  const accessToken = authData.accessToken;
  var userData = {
    client_ip_address: userDataJson.client_ip_address || "167.160.91.250",
    client_user_agent: userDataJson.client_user_agent,
    fbc: userDataJson?.fbc,
    fbp: userDataJson?.fbp,
    em: userDataJson?.customer_email && userDataJson?.customer_email,
    fn: userDataJson?.first_name && (await sha256(userDataJson?.first_name)),
    ln: userDataJson?.last_name && (await sha256(userDataJson?.last_name)),
    ph:
      userDataJson?.customer_phone &&
      (await sha256(userDataJson?.customer_phone)),
    ct: userDataJson?.ct && (await sha256(userDataJson?.ct)),
    st: userDataJson?.st && (await sha256(userDataJson?.st)),
    zp: userDataJson?.zp && (await sha256(userDataJson?.zp)),
    country: userDataJson?.country && (await sha256(userDataJson?.country)),
  };

  // filter UserData sẽ chỉ chứa các giá trị không phải là null hoặc undefined
  const filteredUserData = Object.fromEntries(
    Object.entries(userData).filter(
      ([key, value]) => value !== null && value !== undefined && value !== ""
    )
  );

  const currentTimeInMillis = Math.round(new Date().getTime() / 1e3);
  if (eventData.eventTime > currentTimeInMillis) {
    eventData.eventTime = currentTimeInMillis;
  }
  const body = {
    data: [
      {
        action_source: "website",
        event_id: eventData.eventId,
        event_name: eventData.eventName,
        event_time: eventData.eventTime,
        event_source_url: eventData.eventSourceUrl,
        user_data: filteredUserData,
        custom_data: buildCustomData(eventData),
      },
    ],
    test_event_code: authData.test_event_code,
  };

  const headers = {
    "Content-Type": "application/json",
    'ngrok-skip-browser-warning': 'true'
  };

  try {
    const response = await axios.post(url, body, {
      params: {
        access_token: accessToken,
      },
      headers: headers,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    console.error(`Error data Facebook: `, JSON.stringify(body));
    console.error(`Error filteredUserData Facebook: `, filteredUserData);
    console.error(
      `Error creating event Facebook:`,
      error.response ? error.response.data : error.message
    );
  }
};

const buildCustomData = (eventData: any) => {
  const userDataJson = JSON.parse(eventData.data);
  var content_ids = userDataJson.content_ids;
  var contents = userDataJson.contents;
  var num_items = userDataJson.num_items;

  const event_source_url = eventData.eventSourceUrl;
  const event_time = eventData.eventTime;
  const search_string = userDataJson.query || null;
  const content_type = userDataJson.content_type || null;
  const content_name = userDataJson.content_name || null;
  const currency = userDataJson.currency || null;
  const value = userDataJson.value || null;
  const customeDataJsonObject = {
    event_source_url: event_source_url,
    event_time: event_time,
    search_string: search_string,
    content_type: content_type,
    content_name: content_name,
    currency: currency,
    value: value,
    content_ids: content_ids,
    num_items: num_items,
    contents: contents,
  };

  return customeDataJsonObject;
};

async function sha256(input: string) {
  // Convert the input string to an array of bytes using TextEncoder
  const data = new TextEncoder().encode(input);

  // Use the Web Crypto API to compute the SHA-256 hash
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert the hash buffer to an array of bytes
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Convert each byte to a hexadecimal string and join them
  const hashString = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  // Return the resulting SHA-256 hash string
  return hashString;
}

export const createCustomAudience = async (req: ICustomeAudienceReq) => {
  let data;
  if (req.hasOwnProperty("subtype") && req.subtype === "LOOKALIKE") {
    data = {
      name: req.name,
      subtype: "LOOKALIKE",
      origin_audience_id: req.origin_audience_id,
      lookalike_spec: req.lookalike_spec,
      access_token: req.access_token,
    };
  } else {
    data = {
      name: req.name,
      rule: req.rule,
      prefill: req.prefill,
      description: req.description,
      access_token: req.access_token,
    };
  }

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://graph.facebook.com/v${version}/act_${req.adAccount}/customaudiences`,
    data: data,
  };
  const res = await axios.request(config);
  return res;
};

export const updateCustomAudience = async (req: ICustomeAudienceReq) => {
  let data;

  if (req?.subtype === "LOOKALIKE") {
    data = {
      name: req.name,
      description: req.description,
      access_token: req.access_token,
    };
  } else {
    data = {
      name: req.name,
      rule: JSON.stringify(req.rule),
      prefill: req.prefill,
      access_token: req.access_token,
      description: req.description,
    };
  }
  const res = await axios.request({
    method: "post",
    url: `https://graph.facebook.com/v${version}/${req.adAccount}`,
    data: data,
  });

  return res;
};

export const deleteCustomAudience = async (req: any) => {
  const res = await axios.request({
    method: "delete",
    url: `https://graph.facebook.com/v${version}/${req.id}/`,
    data: {
      access_token: req.access_token,
    },
  });
  return res;
};

// Todo 
export const getLocaionLookaLike = async (req: any) => {
  const res = await axios.get(`https://graph.facebook.com/v${version}/search1`, {
    params: {
      type: "adgeolocation",
      location_types: req.location_types,
      limit: 1000,
      access_token:
        "EAAF4JF1niYkBOZBYB8ZBQq0u5FPhwknlZCpLTdv43SZC8WKBZBzQTHShu7vBIbIwOWEFERy8COxPdtWtylkAkU4ROpaHoG87dV3ZCARC9j7Q1sPtZBhtyjcEZByzz8uMzssmKSzhBLeaeRo0VkjYo3bjbgPHGHL2ZAcTMaT1C2guzZBvlVCvYswOqp402KEefeEAWmZARprKYva6IuTleAd0QknsntxKKwZD",
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return res.data;
};

// Product Feed
export const getCatalogFb = async (req: any) => {
  const res = await axios.get(
    `https://graph.facebook.com/v${version}/${req.adAccount}/owned_product_catalogs`,
    {
      params: {
        access_token: req.access_token,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return res.data;
};

export const getAccessTokenCastle = async (fb_exchange_token: string) => {
  const res = await axios.get(
    `https://graph.facebook.com/v${version}/oauth/access_token`,
    {
      params: {
        grant_type: "fb_exchange_token",
        client_id: "337123195876934",
        client_secret: "3dfdec60cb600076e7c279e8db84713a",
        fb_exchange_token: fb_exchange_token
      },
    }
  );
  return res.data.access_token;
};


const pushEventToTiktok = async (authData: any, eventData: any) => {
  
  const url = `https://business-api.tiktok.com/open_api/v1.3/event/track/`;

  const userDataJson = JSON.parse(eventData.data);

  const accessToken = authData.accessToken;
  var userData = {
    ip: userDataJson.client_ip_address,
    user_agent: userDataJson.client_user_agent,
    ttclid: userDataJson?.ttclid,
    email: userDataJson?.customer_email && userDataJson?.customer_email,
    phone:
      userDataJson?.customer_phone &&
      (await sha256(userDataJson?.customer_phone)),
  };

  // filter UserData sẽ chỉ chứa các giá trị không phải là null hoặc undefined

  const filteredUserData = Object.fromEntries(
    Object.entries(userData).filter(
      ([key, value]) => value !== null && value !== undefined && value !== ""
    )
  );

  if (eventData.eventName === "Purchase") {
      eventData.eventName = 'CompletePayment';
  }
  console.log("eventName: ", eventData.eventName)
  console.log("filteredUserData: ", filteredUserData)
  
  const body = {
    "event_source": "web",
    "event_source_id": authData.pixelId,
    "test_event_code": authData.test_event_code,
    data: [
      {
        event_id: eventData.eventId,
        event: eventData.eventName,
        event_time: eventData.eventTime,
        page: {
          url: eventData.eventSourceUrl
        },
        user: filteredUserData,
        properties: buildPropertiesTiktok(eventData) || [],
      },
    ],
  };

  const headers = {
    "Content-Type": "application/json",
    "Access-Token": accessToken,
  };

  try {
    const response = await axios.post(url, body, {
      headers: headers,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    console.error(`Error body Tiktok: `, body);
    console.error(`Error filteredUserData Tiktok : `, JSON.stringify(filteredUserData));
    console.error(error.response ? error.response.data : error.message);
  }
};

const buildPropertiesTiktok = (eventData: any) => {
  const userDataJson = JSON.parse(eventData.data);
  let buildContents: any[] = [];
  let totaValue: any = 0;

  const query = userDataJson.query || null;
  const currency = userDataJson.currency || null;
  var contents = userDataJson.contents;
 
  contents && contents.forEach((content: any) => {
    totaValue += (content?.quantity || 1) * content.price
    return buildContents.push({
      content_id: typeof content.id === 'string' ? content.id : JSON.stringify(content.id),
      content_type: "product_group",
      content_name: content.title,
      quantity: content.quantity || 1,
      price: content.price
    });
  }
  )

  const properties = {
    contents: buildContents,
    value: totaValue || 0,
    currency: currency,
    query: query
  };

  const filteredProperties = Object.fromEntries(
    Object.entries(properties).filter(
      ([key, value]) => value !== null && value !== undefined && value !== ""
    )
  );

  return filteredProperties;
};

export const invalidAccessToken = async (req: {access_token:string,adAccount:string}) => {

  try {
    const body = {
      "data": [
          {
              "event_name": "PageView",
              "event_time": Math.round((new Date().getTime())/1e3 ),
              "action_source": "website",
              "event_source_url": "url client Store",
              "event_id": "zotektest12345",
              "user_data": {
                  "client_ip_address": "167.160.91.250",
                  "client_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
              }
          }
      ]
    }
    const res = await axios.post(
      `https://graph.facebook.com/v${version}/${req.adAccount}/events`,body,
      {
        params: {
          access_token:req.access_token
        },
        
      }
    );
    return res.data;
  } catch (error:any) {
    return error.response.data;
  }
};
