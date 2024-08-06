import type { IEventValue } from "~/models/pixel-manager.types"

export const DEFAULT_DATA_EVENTS = [
  {
    "id": 1,
    "eventName": "PageView",
    "appId": "853672049558529",
    "shop": "quickstart-fb04a053.myshopify.com",
    "eventId": "sh-a9f7ff48-623E-4D7D-C819-C1944DE047CE",
    "accountID": "efac5687-49ed-4e25-aec4-723fba0a6ff7",
    "eventTime": "1703658643",
    "createdAt": "2023-12-27T13:30:43.503Z"
  },
  {
    "id": 2,
    "eventName": "ViewContent",
    "appId": "853672049558529",
    "shop": "quickstart-fb04a053.myshopify.com",
    "eventId": "sh-a9f7ff48-623E-4D7D-C819-C1944DE047CE",
    "accountID": "efac5687-49ed-4e25-aec4-723fba0a6ff7",
    "eventTime": "1703658643",
    "createdAt": "2023-12-27T13:30:43.503Z"
  },
  {
    "id": 3,
    "eventName": "AddToCart",
    "appId": "853672049558529",
    "shop": "quickstart-fb04a053.myshopify.com",
    "eventId": "sh-a9f7ff48-623E-4D7D-C819-C1944DE047CE",
    "accountID": "efac5687-49ed-4e25-aec4-723fba0a6ff7",
    "eventTime": "1703658643",
    "createdAt": "2023-12-27T13:30:43.503Z"
  },
  {
    "id": 4,
    "eventName": "InitiateCheckout",
    "appId": "853672049558529",
    "shop": "quickstart-fb04a053.myshopify.com",
    "eventId": "sh-a9f7ff48-623E-4D7D-C819-C1944DE047CE",
    "accountID": "efac5687-49ed-4e25-aec4-723fba0a6ff7",
    "eventTime": "1703658643",
    "createdAt": "2023-12-27T13:30:43.503Z"
  },
  {
    "id": 5,
    "eventName": "Purchase",
    "appId": "853672049558529",
    "shop": "quickstart-fb04a053.myshopify.com",
    "eventId": "sh-a9f7ff48-623E-4D7D-C819-C1944DE047CE",
    "accountID": "efac5687-49ed-4e25-aec4-723fba0a6ff7",
    "eventTime": "1703658643",
    "createdAt": "2023-12-27T13:30:43.503Z"
  },
  {
    "id": 6,
    "eventName": "Search",
    "appId": "853672049558529",
    "shop": "quickstart-fb04a053.myshopify.com",
    "eventId": "sh-a9f7ff48-623E-4D7D-C819-C1944DE047CE",
    "accountID": "efac5687-49ed-4e25-aec4-723fba0a6ff7",
    "eventTime": "1703658643",
    "createdAt": "2023-12-27T13:30:43.503Z"
  },
]

export const DEFAULT_EVENTS = [
  {
    "id": 1,
    "event_name_shopify": "page_viewed",
    "event_name_facebook": "PageView",
    "display_name": "PageView",
    "color":"#ff9933"
  },
  {
    "id": 2,
    "event_name_shopify": "product_viewed",
    "event_name_facebook": "ViewContent",
    "display_name": "ViewContent",
    "color":"#66ffff"
  },
  {
    "id": 3,
    "event_name_shopify": "product_added_to_cart",
    "event_name_facebook": "AddToCart",
    "display_name": "AddToCart",
    "color":"#3333ff"
  },
  {
    "id": 4,
    "event_name_shopify": "checkout_started",
    "event_name_facebook": "InitiateCheckout",
    "display_name": "InitiateCheckout",
    "color":"#ff0000"
  },
  {
    "id": 5,
    "event_name_shopify": "checkout_completed",
    "event_name_facebook": "Purchase",
    "display_name": "Purchase",
    "color":"#ff66ff"
  },
  {
    "id": 6,
    "event_name_shopify": "collection_viewed",
    "event_name_facebook": "CollectionView",
    "display_name": "CollectionView",
    "color":"#ffff33"
  },
  {
    "id": 7,
    "event_name_shopify": "search_submitted",
    "event_name_facebook": "Search",
    "display_name": "Search",
    "color":"#00ff00"
  },
  {
    "id": 8,
    "event_name_shopify": "cart_viewed",
    "event_name_facebook": "CartView",
    "display_name": "CartView",
    "color":"#FFC470"
  },
  {
    "id": 9,
    "event_name_shopify": "payment_info_submitted",
    "event_name_facebook": "AddPaymentInfo",
    "display_name": "AddPaymentInfo",
    "color":"#4793AF"
  },
  // {
  //   "id": 10,
  //   "event_name_shopify": "checkout_address_info_submitted",
  //   "event_name_facebook": "CheckoutAddressInfo",
  //   "display_name": "CheckoutAddressInfo"
  // },
  // {
  //   "id": 11,
  //   "event_name_shopify": "checkout_contact_info_submitted",
  //   "event_name_facebook": "CheckoutContactInfo",
  //   "display_name": "CheckoutContactInfo"
  // },
  // {
  //   "id": 12,
  //   "event_name_shopify": "checkout_shipping_info_submitted",
  //   "event_name_facebook": "CheckoutShippingInfo",
  //   "display_name": "CheckoutShippingInfo"
  // },
  // {
  //   "id": 13,
  //   "event_name_shopify": "product_removed_from_cart",
  //   "event_name_facebook": "RemoveFromCart",
  //   "display_name": "RemoveFromCart"
  // },
]
export const EVENT_LIST_DEFAULT:Record<string, IEventValue> = {
    'PageView': {
        isActive: true,
        variant:'variantId',
        isHasVariant: true
    },
    'ViewContent': {
        isActive: true,
        variant:'variantId',
        isHasVariant: true
    },        
    'AddToCart': {
        isActive: true,
        variant:'variantId',
        isHasVariant: true
    },
    'InitiateCheckout': {
        isActive: true,
        variant:'variantId',
        isHasVariant: true
    },
    'Purchase': {
        isActive: true,
        variant:'variantId',
        isHasVariant: true
    },
    'Search': {
        isActive: true,
        variant:'variantId',
        isHasVariant: true
    },
    'CollectionView': {
        isActive: false,
        variant:'variantId',
        isHasVariant: true
    },
    'CartView': {
        isActive: false,
        variant:'variantId',
        isHasVariant: true
    },
    'AddPaymentInfo': {
        isActive: false,
        variant:'variantId',
        isHasVariant: true
    },
    // 'CheckoutAddressInfo': {
    //     isActive: false,
    //     variant:'variantId',
    //     isHasVariant: true
    // },
    // 'CheckoutContactInfo': {
    //     isActive: false,
    //     variant:'variantId',
    //     isHasVariant: true
    // },
    // 'CheckoutShippingInfo': {
    //     isActive: false,
    //     variant:'variantId',
    //     isHasVariant: true
    // },
    // 'RemoveFromCart': {
    //     isActive: false,
    //     variant:'variantId',
    //     isHasVariant: true
    // }
}

export function countEventOccurrences(eventsDataList: any): {
    [eventName: string]: number;
  } {
    return eventsDataList.reduce((acc: any, cur: any) => {
      const { name } = cur;
      acc[name] = (acc[name] ?? 0) + 1;
      return acc;
    }, {});
 }

interface Event {
    id: 462,
    eventName: string,
    pixelId: string,
    shop: string,
    eventId: string,
 }

interface EventCounts {
    [key: string]: number;
}

export function maxCountEventByAppId(events: Event[]): EventCounts {
    const eventCounts: EventCounts = {};
    const maxCount: EventCounts = {};
  
    events && events.forEach((event: Event) => {
      const key: string = event.eventName;
      const eventWithAppIdKey: string = `${event.eventName}_${event.pixelId}`;
      
      eventCounts[eventWithAppIdKey] = (eventCounts[eventWithAppIdKey] || 0) + 1;
  
      if (!maxCount[key] || eventCounts[eventWithAppIdKey] > maxCount[key]) {
        maxCount[key] = eventCounts[eventWithAppIdKey];
      }
    });
  
    return maxCount;
  }

  export function maxCountEventByAppIdReport(events: any): EventCounts {
    
    const maxCount: EventCounts = {
      "PageView":0,
      "ViewContent":0,
      "AddToCart":0,
      "InitiateCheckout":0,
      "Purchase":0,
      "CollectionView":0,
    };
    events && events.forEach((event: any) => {
      maxCount.PageView = Number(event.pageView);
      maxCount.ViewContent = Number(event.viewContent);
      maxCount.AddToCart = Number(event.addToCart);
      maxCount.InitiateCheckout = Number(event.initiateCheckout);
      maxCount.CollectionView = Number(event.collectionView);
      maxCount.Purchase = Number(event.purchase);
    });
  
    return maxCount;
  }

  export function maxCountEventByAppIdReportAnalytic(events: any): EventCounts {
    
    const maxCount: EventCounts = {
      "PageView":0,
      "ViewContent":0,
      "AddToCart":0,
      "InitiateCheckout":0,
      "Purchase":0,
      "CollectionView":0,
    };
    events && events.forEach((event: any) => {
      maxCount.PageView += Number(event.pageView);
      maxCount.ViewContent += Number(event.viewContent);
      maxCount.AddToCart += Number(event.addToCart);
      maxCount.InitiateCheckout += Number(event.initiateCheckout);
      maxCount.CollectionView += Number(event.collectionView);
      maxCount.Purchase +=Number(event.purchase);
    });
  
    return maxCount;
  }