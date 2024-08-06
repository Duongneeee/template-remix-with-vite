
import { register } from "@shopify/web-pixels-extension";

register(async ({ settings, analytics, browser, init }) => {
  const { window } = init.context;
  const zotekUrlApi = "https://touching-humpback-friendly.ngrok-free.app";
  const utmParams = new URLSearchParams(window.location.search);
  let utmEntries = Object.fromEntries(utmParams.entries());
  var utmSource = utmEntries?.utm_source;
  var utmMedium = utmEntries?.utm_medium;
  var utmCampaign = utmEntries?.utm_campaign;
  var utmAdsetName = utmEntries?.adset_name;
  var utmAd = utmEntries?.ad_name;
  if (utmSource === "facebook" || utmSource === "tiktok") {
    if (utmSource) browser.localStorage.setItem("ZT_utmSource", utmSource.toString());
    if (utmMedium) browser.localStorage.setItem("ZT_utmMedium", utmMedium.toString());
    if (utmCampaign) browser.localStorage.setItem("ZT_utmCampaign", utmCampaign.toString());
    if (utmAdsetName) browser.localStorage.setItem("ZT_utmAdset", utmAdsetName.toString());
    if (utmAd) browser.localStorage.setItem("ZT_utmAd", utmAd.toString());
  }

  // Track COLLECTIONVIEW
  analytics.subscribe("collection_viewed", (event) => {
    browser.sessionStorage.setItem('ztCollectionData', JSON.stringify(event.data.collection));
  });

  // Track ADDTOCART 
  analytics.subscribe("product_added_to_cart", async (event) => {
    let fbPixelId = JSON.parse(await browser.sessionStorage.getItem('ztPixelIdActive'));
    let tiktokPixelId = JSON.parse(await browser.sessionStorage.getItem('ztTiktokPixelIdActive'));

    if (fbPixelId.length > 0 || tiktokPixelId.length > 0) {
      let ztAtcDataEvent = [], userData;
      let content_ids = [];
      let contents = [];
      let event_id = ztCreateEventID(18);

      contents.push({
        id: event.data.cartLine.merchandise.product.id,
        title: event.data.cartLine.merchandise.product.title,
        quantity: event.data.cartLine.quantity,
        price: event.data.cartLine.merchandise.price.amount,
      })
      content_ids.push(event.data.cartLine.merchandise.product.id);

      let filterPixels = await callApiValidProduct(fbPixelId, content_ids) || [];
      let filterTiktokPixels = await callApiValidProduct(tiktokPixelId, content_ids) || [];


      let saveToBrowseData = {
        content_type: "product_group",
        content_ids: content_ids,
        value: event.data.cartLine.merchandise.price.amount || 0.99,
        currency: event.data.cartLine.merchandise.price.currencyCode,
        content_name: event.data.cartLine.merchandise.product.title,
        contents: contents
      }
      ztAtcDataEvent = { saveToBrowseData, filterPixels, filterTiktokPixels, event_id }
      browser.sessionStorage.setItem('ztAddToCartEventNew', JSON.stringify(ztAtcDataEvent));

      // Check status event for Purchase event
      // For facebook pixel ********************************
      if (filterPixels.length > 0) {
        try {
          filterPixels = filterPixels.filter((p) =>
            zotekPixelCheckEvent(p.lstEvents, "AddToCart")
          );
        } catch (error) { }
        var fbPixelFinal = filterPixels.filter(
          (p) => p.status && null != p.status
        );
      }

      // For tiktok pixel *********************************
      if (filterTiktokPixels.length > 0) {
        try {
          filterTiktokPixels = filterTiktokPixels.filter((p) =>
            zotekPixelCheckEvent(p.lstEvents, "AddToCart")
          );
        } catch (error) { }
        var tiktokPixelFinal = filterTiktokPixels.filter(
          (p) => p.status && null != p.status
        );
      };
      //***************************************************

      const shopName = await browser.localStorage.getItem('ztShopifyName');
      let utmString = await browser.localStorage.getItem('zt_utm_string');
      const event_source_url = event.context.document.location.href + utmString;
      const client_ip_address = await browser.localStorage.getItem('ztFbpixelIp');
      const userAgent = await browser.localStorage.getItem('ztUserAgent');
      let fbc = await browser.localStorage.getItem('ztFBC');
      let ttclid = await browser.localStorage.getItem('ztTTC');
      const fbpForCapi = await browser.localStorage.getItem('ztFBPForCAPI');
      var event_time = Math.round((Date.now()) / 1e3);


      const userDataByStorageBeforDecrypt = await browser.localStorage.getItem('zotekPixelInfo')
      const userDataByStorage = decryptData(userDataByStorageBeforDecrypt);

      userData = {
        customer_email: userDataByStorage?.e ? userDataByStorage.e : null,
        first_name: userDataByStorage?.f ? userDataByStorage.f : null,
        last_name: userDataByStorage?.l ? userDataByStorage.l : null,
        customer_phone: userDataByStorage?.p ? userDataByStorage.p : null,
        ct: userDataByStorage?.ci ? userDataByStorage.ci : null,
        st: userDataByStorage?.s ? userDataByStorage.s : null,
        zp: userDataByStorage?.z ? userDataByStorage.z : null,
        country: userDataByStorage?.co ? userDataByStorage.co : null,
      }

      let customData = {
        client_ip_address: client_ip_address,
        client_user_agent: userAgent,
        content_type: "product_group",
        content_ids: content_ids,
        value: event.data.cartLine.merchandise.price.amount,
        currency: event.data.cartLine.merchandise.price.currencyCode,
        event_source_url: event_source_url,
        contents: contents,
        fbp: fbpForCapi,
        fbc: fbc,
        ttclid: ttclid,
      }

      let filteredData = {};
      for (const key in customData) {
        if (customData.hasOwnProperty(key) && customData[key] !== "null") {
          filteredData[key] = customData[key];
        }
      }
      let userDataCapi = { ...filteredData, ...userData };
      sendEventData(userDataCapi, fbPixelFinal, "AddToCart", event_id, event_time, tiktokPixelFinal, shopName, zotekUrlApi);
    }
  });

  // Track INITIATE CHECKOUT 
  analytics.subscribe("checkout_started", (event) => {
    let content_ids = [];
    content_ids.push(event.data.checkout.lineItems[0].variant.product.id);
    let customData = {
      content_ids: content_ids,
      content_type: "product_group",
      value: event.data.checkout.totalPrice.amount,
      content_name: event.data.checkout.lineItems[0].variant.product.title,
      currency: event.data.checkout.totalPrice.currencyCode,
      contents: [{
        id: event.data.checkout.lineItems[0].variant.product.id,
        title: event.data.checkout.lineItems[0].variant.product.title,
        quantity: event.data.checkout.lineItems[0].quantity,
        price: event.data.checkout.lineItems[0].variant.price.amount,
      }]
    }
    browser.sessionStorage.setItem('ztAddToCartData', JSON.stringify(customData));
  });
  // Track PURCHASE
  // TODO: sent to tiktok browser
  analytics.subscribe("checkout_completed", async (event) => {
    let userData, data, userDataConfig;
    var event_time = Math.round((Date.now()) / 1e3);
    let event_id = ztCreateEventID(18);
    let event_id_addPaymentInfo = ztCreateEventID(18);

    let fbPixelId = JSON.parse(await browser.sessionStorage.getItem('ztPixelIdActive'));
    let tiktokPixelId = JSON.parse(await browser.sessionStorage.getItem('ztTiktokPixelIdActive'));

    let utmString = await browser.localStorage.getItem('zt_utm_string');
    const client_ip_address = await browser.localStorage.getItem('ztFbpixelIp');
    const userAgent = await browser.localStorage.getItem('ztUserAgent');
    let fbp = await browser.localStorage.getItem('ztFBP');
    let fbc = await browser.localStorage.getItem('ztFBC');
    let ttclid = await browser.localStorage.getItem('ztTTC');
    const fbpForCapi = await browser.localStorage.getItem('ztFBPForCAPI');

    const shopName = await browser.localStorage.getItem('ztShopifyName');

    if (fbPixelId.length > 0 || tiktokPixelId.length > 0) {
      const event_source_url = event.context.document.location.href + utmString;
      var items = []
      var contents = []
      var numItems = 0
      for (let product of event.data.checkout.lineItems) {
        numItems = numItems + product.quantity
        items.push(product.variant.product.id)
        contents.push({
          id: product.variant.product.id,
          quantity: product.quantity,
          title: product.variant.product.title,
          price: product.variant.price.amount,
        })
      }

      let filterPixels = await callApiValidProduct(fbPixelId, items) || [];
      let filterTiktokPixels = await callApiValidProduct(tiktokPixelId, items) || [];

      let fbPixelAddPayment = filterPixels;
      let tiktokPixelAddPayment = filterTiktokPixels;

      let fbPixelFinal = [];
      let tiktokPixelFinal = [];
      let fbPixelFinalForAddPaymentInfo = [];
      let tiktokPixelFinalForAddPaymentInfo = [];


      // Check status event for Purchase event
      // For facebook pixel ********************************
      if (filterPixels.length > 0) {
        try {
          filterPixels = filterPixels.filter((p) =>
            zotekPixelCheckEvent(p.lstEvents, "Purchase")
          );
        } catch (error) { 

        }

          fbPixelFinal = filterPixels.filter(
          (p) => p.status && null != p.status
        );
      
      }

      // For tiktok pixel *********************************
      if (filterTiktokPixels.length > 0) {
        try {
          filterTiktokPixels = filterTiktokPixels.filter((p) =>
            zotekPixelCheckEvent(p.lstEvents, "Purchase")
          );
        } catch (error) { }
          tiktokPixelFinal = filterTiktokPixels.filter(
          (p) => p.status && null != p.status
        );
      };
      //***************************************************

      // Check status event for AddpaymentInfo event
      // For facebook pixel ********************************
      if (fbPixelAddPayment.length > 0) {
        try {
          fbPixelAddPayment = fbPixelAddPayment.filter((p) =>
            zotekPixelCheckEvent(p.lstEvents, "AddPaymentInfo")
          );
        } catch (error) { }
         fbPixelFinalForAddPaymentInfo = fbPixelAddPayment.filter(
          (p) => p.status && null != p.status
        );
      }

      // For tiktok pixel *********************************
      if (tiktokPixelAddPayment.length > 0) {
        try {
          tiktokPixelAddPayment = tiktokPixelAddPayment.filter((p) =>
            zotekPixelCheckEvent(p.lstEvents, "AddPaymentInfo")
          );
        } catch (error) { }
          tiktokPixelFinalForAddPaymentInfo = tiktokPixelAddPayment.filter(
          (p) => p.status && null != p.status
        );
      };
      //***************************************************
      userData = {
        customer_email: await sha256(convertToLowerCaseDash(event.data.checkout?.email || "")),
        first_name: convertToLowerCaseDash(event.data.checkout.billingAddress?.firstName || ""),
        last_name: convertToLowerCaseDash(event.data.checkout.billingAddress?.lastName || ""),
        customer_phone: convertToLowerCaseDash(event.data.checkout.billingAddress?.phone || ""),
        ct: convertToLowerCaseDash(event.data.checkout.billingAddress?.city || ""),
        st: convertToLowerCaseDash(event.data.checkout.billingAddress?.province || ""),
        zp: convertToLowerCaseDash(event.data.checkout.billingAddress?.zip || ""),
        country: convertToLowerCaseDash(event.data.checkout.billingAddress?.country || ""),
      }

      const hashedFirstName = await sha256(userData?.first_name || "");
      const hashedLastName = await sha256(userData?.last_name || "");
      const hashedPhone = await sha256(userData?.customer_phone || "");
      const hashedCity = await sha256(userData?.ct || "");
      const hashedCountry = await sha256(userData?.country || "");
      const hashedZip = await sha256(userData?.zp || "");
      data = {
        client_ip_address: client_ip_address,
        client_user_agent: userAgent,
        content_type: "product_group",
        content_ids: items,
        value: event.data.checkout.totalPrice.amount || 0.99,
        currency: event.data.checkout.totalPrice.currencyCode,
        num_items: numItems,
        event_source_url: event_source_url,
        contents: contents,
        fbp: fbpForCapi,
        fbc: fbc,
        ttclid: ttclid,
      }

      let filteredData = {};
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== "null") {
          filteredData[key] = data[key];
        }
      }
      userDataConfig = {
        e: userData?.customer_email ? userData.customer_email : null,
        f: userData?.first_name ? userData.first_name : null,
        l: userData?.last_name ? userData.last_name : null,
        p: userData?.customer_phone ? userData.customer_phone : null,
        ci: userData?.ct ? userData.ct : null,
        s: userData?.st ? userData.st : null,
        z: userData?.zp ? userData.zp : null,
        co: userData?.country ? userData.country : null,
      };
      browser.localStorage.setItem("zotekPixelInfo", encryptData(userDataConfig));

      var userDataCapi = { ...filteredData, ...userData };

      console.log("fbPixelFinal : ", fbPixelFinal + fbPixelFinal.length)
      console.log("tiktokPixelFinal : ", tiktokPixelFinal + tiktokPixelFinal.length)
      console.log("fbPixelFinalForAddPaymentInfo : ", fbPixelFinalForAddPaymentInfo + fbPixelFinalForAddPaymentInfo.length)
      console.log("tiktokPixelFinalForAddPaymentInfo : ", tiktokPixelFinalForAddPaymentInfo + tiktokPixelFinalForAddPaymentInfo.length)

      if (fbPixelFinal.length > 0 || tiktokPixelFinal.length > 0) {
        sendEventData(userDataCapi, fbPixelFinal, "Purchase", event_id, event_time, tiktokPixelFinal, shopName, zotekUrlApi)
      }
      if (fbPixelFinalForAddPaymentInfo.length > 0 || tiktokPixelFinalForAddPaymentInfo.length > 0) {
        sendEventData(userDataCapi, fbPixelFinalForAddPaymentInfo, "AddPaymentInfo", event_id_addPaymentInfo, event_time, tiktokPixelFinalForAddPaymentInfo, shopName, zotekUrlApi)
      }
      if (fbPixelFinal.length > 0) {
        for (let i = 0; i < fbPixelFinal.length; i++) {
          if (fbPixelFinal[i].isActiveCApi == false) {
            const pixelUrl = `https://www.facebook.com/tr?id=${fbPixelFinal[i].pixelId}&ev=Purchase&eid=${event_id + event_time}
            &cd[currency]=${event.data.checkout.currencyCode}
            &cd[value]=${event.data.checkout.totalPrice.amount}
            &cd[content_ids]=${items}
            &cd[contents]=${JSON.stringify(contents)}
            &cd[event_source_url]=${event_source_url}
            &cd[num_items]=${numItems}
            &cd[content_type]=product_group
            &event_source_url=${event_source_url}
            &fbp=${fbp}
            &fbc=${fbc}
            &ud[email]=${userData.customer_email}
            &ud[first_name]=${hashedFirstName}
            &ud[last_name]=${hashedLastName}
            &ud[phone]=${hashedPhone}
            &ud[city]=${hashedCity}
            &ud[country]=${hashedCountry}
            &ud[zip]=${hashedZip}`;
            fetch(pixelUrl, {
              method: 'GET'
            })
              .then(response => {
              })
              .catch(error => {
                console.error('Send Purchase Event Error', error);
              });
          }
        }
      }

      if (fbPixelFinalForAddPaymentInfo.length > 0) {
        for (let i = 0; i < fbPixelFinalForAddPaymentInfo.length; i++) {
          if (fbPixelFinalForAddPaymentInfo[i].isActiveCApi == false) {
            const urlSendAddPaymentInfo = `https://www.facebook.com/tr?id=${fbPixelFinalForAddPaymentInfo[i].pixelId}&ev=AddPaymentInfo&eid=${event_id_addPaymentInfo + event_time}
            &cd[currency]=${event.data.checkout.currencyCode}
            &cd[value]=${event.data.checkout.totalPrice.amount}
            &cd[content_ids]=${items}
            &cd[contents]=${JSON.stringify(contents)}
            &cd[event_source_url]=${event_source_url}
            &cd[num_items]=${numItems}
            &cd[content_type]=product_group
            &event_source_url=${event_source_url}
            &fbp=${fbp}
            &fbc=${fbc}
            &ud[email]=${userData.customer_email}
            &ud[first_name]=${hashedFirstName}
            &ud[last_name]=${hashedLastName}
            &ud[phone]=${hashedPhone}
            &ud[city]=${hashedCity}
            &ud[country]=${hashedCountry}
            &ud[zip]=${hashedZip}`;
            fetch(urlSendAddPaymentInfo, {
              method: 'GET'
            })
              .then(response => {
              })
              .catch(error => {
                console.error('Send AddPaymentInfo Event Error', error);
              });
          }
        }
      };
    }
  });
});

async function sha256(input) {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashString = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashString;
}

function ztCreateEventID(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  result = "Zotek" + result;
  return result;
}

function convertToLowerCaseDash(inputString) {
  return inputString.toLowerCase().replace(/[\s:]+/g, '');
}

function encryptData(data) {
  const jsonString = JSON.stringify(data);
  const encodedString = encodeURIComponent(jsonString);
  return encodedString;
}

async function sendEventData(body, pixelFilter, trackType, eventID, event_time, tiktokPixelFilter, shop, zotekUrlApi) {
  try {
    pixelFilter = pixelFilter || [];
    tiktokPixelFilter = tiktokPixelFilter || [];
    pixelFilter = pixelFilter.concat(tiktokPixelFilter);
    console.log("sendEventData body: ", body);

    const utmParams = new URLSearchParams(body.event_source_url);
    let utmEntries = Object.fromEntries(utmParams.entries());

    let filterUtmSource = {};
    for (const [key, value] of Object.entries(utmEntries)) {
      const paramName = key.split('?')[1]
      if (paramName === 'utm_source') {
        filterUtmSource[paramName] = value;
        break;
      }
    }
    var utmSource = filterUtmSource?.utm_source;
    var utmMedium = utmEntries?.utm_medium;
    var utmCampaign = utmEntries?.utm_campaign;
    var utmAdsetName = utmEntries?.adset_name;
    var utmAd = utmEntries?.ad_name;

    const url = `${zotekUrlApi}/api/web/event-data?shop=${shop}`;
    const data = {
      shop: shop,
      listPixels: pixelFilter,
      eventName: trackType,
      eventId: eventID,
      eventTime: event_time,
      eventSourceUrl: body.event_source_url,
      data: body,
      utmSource: utmSource,
      utmMedium: utmMedium,
      utmCampaign: utmCampaign,
      utmAdSet: utmAdsetName,
      utmAd: utmAd,
    };

    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      keepalive: true,
    });
  } catch (error) {
    console.error("Error sending event data:", error.message);
  }
}

function filteredProductInCollection(pixels, productId) {
  "use strict";
  return new Promise((resolve, reject) => {
    const url = new URL(`${zotekUrlApi}/api/web/valid-product`);
    url.searchParams.append("pixels", JSON.stringify(pixels));
    url.searchParams.append("productId", productId);

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'ngrok-skip-browser-warning': 'true',
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(res => {
        setTimeout(function () {
          resolve(res.filteredPixel);
        });
      })
      .catch(error => reject(error));
  });
}

function callApiValidProduct(pixels, content_ids) {
  const hasNonAllTargetArea = pixels && pixels.some((pixel) => pixel.targetArea !== "all");
  if (hasNonAllTargetArea) {
    return filteredProductInCollection(pixels, content_ids);
  }
  return pixels;
}

function decryptData(encodedData) {
  const jsonString = decodeURIComponent(encodedData);
  return JSON.parse(jsonString);
}

function zotekPixelCheckEvent(listEvents, event) {
  if (null == listEvents || null == listEvents) return !0;
  try {
    return (
      listEvents.toLowerCase().split(",").indexOf(event.toLowerCase()) >= 0 ||
      listEvents.toLowerCase().indexOf(event.toLowerCase()) >= 0
    );
  } catch (error) {
    return !0;
  }
}