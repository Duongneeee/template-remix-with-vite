import { getAppIdActiveByShop, getPixelByAppId, getPixels } from '../capi_metapixel/capi-pixel.service';
import type { IProductInCollectionsReq } from '../collections/collection.types';
import { getSessionByShop } from '../sessions/sessions.service';
import { getCollectionByAppId, getProductsByCollection } from '../collections/collection.service';
import type { IAuthFBData, ICheckEventActiveReq, ICheckProductInCollectionReq, IEventData, IEventDataReq, IPushEventReq, IShouldPushEventToDB } from './event-data.types';
import axios from 'axios';
import db from "~/db.server";
import { checkEventActive } from '../event_config/event-config.service';
export const pushEventToDB = async (req:IPushEventReq) => {
    const {
      shop,
      user_data,
      event_name,
      event_id,
      event_source_url,
      account_id,
      utm,
    } = req;
    const shouldPushEventDBReq: IShouldPushEventToDB ={
      event: event_name,
      shop:shop
    }
    const validEvents = await shouldPushEventToDB(shouldPushEventDBReq);
    console.log('---------------------')
    console.log(validEvents);
    console.log('---------------------')
    if (validEvents.length === 0) {
      console.log("No events");
      return false;
    }
    // Process each valid pixel
    for (const event of validEvents) {
      try {
        const cApiData = await getPixelByAppId(event?.app_id||'');
        if (cApiData && cApiData.targetArea === "collections") {
          const productId = findProductIdInEvent(user_data);
          if (productId) {
            let checkProductInCollectionReq:ICheckProductInCollectionReq = {
              productId: productId,
              shop: shop,
              appId: event?.app_id || ''
            }
            const condition = await checkProductInCollection(checkProductInCollectionReq);
            if (condition == true) {
              const userDataString = JSON.stringify(user_data);
              const createEventBody:IEventDataReq = {
                name: event_name,
                shop: shop,
                eventId: event_id,
                data: userDataString,
                eventSourceUrl:event_source_url,
                accountID: account_id,
                eventTime:String(event?.event_time),
                appId: event?.app_id || '',
                utmCampaign:utm.utm_campaign,
                utmSource: utm.utm_source,
                utmMedium: utm.utm_medium,
                utmAddSet: utm.utm_adset,
                utmAd: utm.utm_ad,
              };
              console.log("insert collections");
              await createEventData(createEventBody)
              await pushEvent_FB(req);
            }
          }
        } else {
          const userDataString = JSON.stringify(user_data);
          const createEventBody:IEventDataReq = {
            name: event_name,
            shop: shop,
            eventId: event_id,
            data: userDataString,
            eventSourceUrl:event_source_url,
            accountID: account_id,
            eventTime:String(event?.event_time),
            appId: event?.app_id || '',
            utmCampaign:utm.utm_campaign,
            utmSource: utm.utm_source,
            utmMedium: utm.utm_medium,
            utmAddSet: utm.utm_adset,
            utmAd: utm.utm_ad,
          };
          console.log("insert all pages");
          await createEventData(createEventBody)
          await pushEvent_FB(req);
        }
      } catch (error) {
        console.error("Error inserting event data:", error);
      }
    }
    return true;
  };
  
  const shouldPushEventToDB = async (req:IShouldPushEventToDB) => {
    const {event, shop} = req;
    const validPixels = await getAppIdActiveByShop(shop);
    
    if (validPixels.length === 0) {
      console.log('No active AppId In Shop');
      return [];
    }
  
    const eventArr = await Promise.all(validPixels.map(async (item) => {
      let body:ICheckEventActiveReq = {
        event: event,
        shop: shop,
        appId:item.appId
      }
      const isEventActive = await _checkEventActive(body);
      console.log(event);
      console.log(isEventActive);
  
      if (isEventActive) {
        return {
          app_id: item.appId,
          event_time: Math.floor(Date.now() / 1000)
        };
      }
      
      return null;
    }));
  
    return eventArr.filter((item) => item !== null);
  };
  
  
  const _checkEventActive = async (req:ICheckEventActiveReq) => {
    const eventActive = await checkEventActive(req);
    return eventActive.length > 0;
  };
  
  const checkProductInCollection = async (req:ICheckProductInCollectionReq) => {
    const {productId, shop, appId} = req;
    const collectionsActive = await getCollectionByAppId(appId)
    // console.log(collectionsActive);
    if (collectionsActive.length === 0) {
      return false; // No active collections, product not found.
    }
    const session = await getSessionByShop(shop) as any
  
    if (!session) {
      return false; // No session data, unable to proceed.
    }
  
    for (const collection of collectionsActive) {
      let productInCollReq:IProductInCollectionsReq = {
        shop:shop,
        shopifyToken: session[0].accessToken,
        collectionId: collection.collectionId
      }
      const productIds:number[] | undefined = await getProductsByCollection(productInCollReq);
      if (productIds && productIds.includes(Number(productId))) {
        return true; // Product found in the current collection.
      }
    }
    return false; // Product not found in any active collection.
  };
  
  const pushEvent_FB = async (req:IPushEventReq) => {
    const {
      shop,
      user_data,
      event_name,
      event_id,
      event_source_url,
      account_id,
      utm,
    } = req;
    const eventData = {
      shop: shop,
      user_data: user_data,
      event_time: Math.floor(Date.now() / 1000),
      event_name: event_name,
      event_id: event_id,
      event_source_url: event_source_url,
      account_id: account_id,
      utm: utm,
    };
    let pixelData = await getPixels(shop)
      const authData = {
        accessToken: pixelData[0]?.accessTokenFB,
        appId: pixelData[0]?.appId,
        test_event_code: pixelData[0]?.testEventCode,
      };
      return pushEventToFB(authData, eventData);
  };
  

export const createEventData = async (data: IEventDataReq) => {
    try {
        return await db.eventsData.create({data});
    } catch (error) {
      return error;
    }
};
const pushEventToFB = async (authData:IAuthFBData, eventData:IEventData) => {
  const url = `https://graph.facebook.com/v18.0/${authData.appId}/events?utm_source=${eventData.utm.utm_source}&utm_medium=${eventData.utm.utm_medium}&utm_campaign=${eventData.utm.utm_campaign}&adset_name=${eventData.utm.utm_adset}&ad_name=${eventData.utm.utm_ad}`;
  console.log(url);
  const accessToken = authData.accessToken;
  const body = {
    data: [
      {
        action_source: "website",
        event_id: eventData.event_id,
        event_name: eventData.event_name,
        event_time: eventData.event_time,
        event_source_url: eventData.event_source_url,
        user_data: {
          client_ip_address: "254.254.254.254",
          client_user_agent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0",
          em: "f660ab912ec121d1b1e928a0bb4bc61b15f5ad44d5efdc4e1c92a25e99b8e44a",
        },
        // custom_data: eventData.user_data,
        custom_data: buildCustomData(eventData),
      },
    ],
    test_event_code: authData.test_event_code,
  };

  const headers = {
    "Content-Type": "application/json",
  };

  axios
    .post(url, body, {
      params: {
        access_token: accessToken,
      },
      headers: headers,
    })
    .then((response) => {
      console.log("Event created:", response.data);
    })
    .catch((error) => {
      console.error(
        "Error creating event:",
        error.response ? error.response.data : error.message
      );
    });
};
const buildCustomData = (eventData:IEventData) => {
  
  let content_ids:any=[]
  let contents:any =[]

  const event_source_url = eventData.event_source_url
  const event_time = eventData.event_time
  const search_string = eventData.user_data?.searchResult?.query || null
  const content_type = 'product_group'
  const content_name = eventData.user_data?.productVariant?.product?.title || null
  const variant_id = eventData?.user_data?.productVariant?.id 
                    || eventData?.user_data?.cartLine?.merchandise?.id
                    || null
  const currency = eventData.user_data?.productVariant?.price?.currencyCode 
                  || eventData.user_data?.cartLine?.cost?.totalAmount?.currencyCode  
                  || eventData.user_data?.cart?.cost?.totalAmount?.currencyCode  
                  || null
  const value = eventData.user_data?.productVariant?.price?.amount 
                || eventData.user_data?.cartLine?.cost?.totalAmount?.amount  
                || eventData.user_data?.cart?.cost?.totalAmount?.amount  
                || null
  const num_items = eventData.user_data?.productVariants?.length
                  || eventData.user_data?.cartLine?.quantity
                  || eventData.user_data?.cart?.totalQuantity
                  || null
  if (eventData?.user_data?.hasOwnProperty('productVariant')){
    content_ids.push(eventData?.user_data?.productVariant?.product?.id)
    const contentProductView = { id: eventData?.user_data?.productVariant?.product?.id,
                                title: eventData?.user_data?.productVariant?.product?.title,
                              };
    contents.push(contentProductView)
  }

  if (eventData?.user_data?.hasOwnProperty('cartLine')){
    content_ids.push(eventData?.user_data?.cartLine?.merchandise?.product?.id)
    const contentAddtoCard = { id: eventData?.user_data?.cartLine?.merchandise?.product?.id,
                              title: eventData?.user_data?.cartLine?.merchandise?.product?.title,
                              quantity: eventData?.user_data?.cartLine?.quantity,
                            };
    contents.push(contentAddtoCard)
  }

  if (eventData?.user_data?.hasOwnProperty('cart')){
    const lines = eventData?.user_data?.cart?.lines
    if(Array.isArray(lines)){
      lines.forEach(line => {
        content_ids.push(line?.merchandise?.product?.id)
        const contentCardView = { id: line?.merchandise?.product?.id,
                                  title: line?.merchandise?.product?.title,
                                  quantity: line?.quantity,
                                };
        contents.push(contentCardView)
      });
    }
  }
  const customeDataJsonObject = {
    event_source_url: event_source_url,
    event_time: event_time,
    search_string: search_string,
    content_type: content_type,
    content_name: content_name,
    currency: currency,
    value: value,
    num_items: num_items,
    content_ids: content_ids,
    contents: contents,
    variant_id: variant_id,
  };

  // console.log("event_source_url: ", event_source_url)
  // console.log("event_time: ", event_time)
  // console.log("search_string: ", search_string)
  // console.log("content_type: ", content_type)
  // console.log("content_name: ", content_name)
  // console.log("currency: ", currency)
  // console.log("value: ", value)
  // console.log("num_items: ", num_items)

  // console.log(JSON.stringify(customeDataJsonObject, removeNullValues))
  return JSON.stringify(customeDataJsonObject, removeNullValues)
};
function removeNullValues(key:any, value:any) {
  if (value === null) {
    return undefined;
  }
  return value;
}
const findProductIdInEvent = (obj:any) => {
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      const result:any = findProductIdInEvent(obj[key]);
      if (key === "product") {
        return obj[key].id; // Return the product object
      }
      if (result !== null) {
        return result;
      }
    } else if (key === "product") {
      return obj[key].id; // Return the product object
    }
  }
  return null; // Return null if product is not found
};

export const deleteEventDataByAppId = async (appId: string) => {
  try {
    await db.eventsData.deleteMany({ where: { appId } });
  } catch (error) {
    return error;
  }
};