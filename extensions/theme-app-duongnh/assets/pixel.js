
const zotekUrlApi = "https://touching-humpback-friendly.ngrok-free.app";

const shopifyShopname = Shopify.shop;
localStorage.setItem('ztShopifyName', shopifyShopname);

let client_ip_address;

// Global value
let tiktokPixelIdLoaded = [];
var
    zotekPixelCurrency =
        null != Shopify.currency ? Shopify.currency.active : "USD",
    ListCustomAddToCart = [],
    ListCustomCO = [],
    pageURL = window.location.href;
let trackAtc = false;
var isUseProductID = true;

function generateRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getCookieValueByName(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

function setCookieValue(name, value, days = 20) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
}

function getParamByUrl(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param) || null;
}

//FBC + FBP for Facebook pixel
function getFbc(e) {
    var fbc = getCookieValueByName("zt_fbc");
    var urlParamFbclid = getParamByUrl("fbclid");
    if (urlParamFbclid) {
        var newFbc = `fb.${1}.${e}.${urlParamFbclid}`;
        setCookieValue("zt_fbc", newFbc, 28);
        return newFbc;
    } else if (fbc) {
        return fbc;
    } else {
        return null;
    }
}

function getFbp(e, o) {
    var fbFbp = getCookieValueByName("_fbp");
    var customFbp = getCookieValueByName("zt_fbp");
    if (fbFbp) {
        return fbFbp;
    } else if (customFbp) {
        return customFbp;
    } else {
        setCookieValue("zt_fbp", (customFbp = `fb.${1}.${e}.` + o), 28);
        return customFbp;
    }
}

// TTCLID for tiktok
function getTtc() {
    var ttc = getCookieValueByName("zt_ttc");
    var urlParamTtclid = getParamByUrl("ttclid");
    if (urlParamTtclid) {
        setCookieValue("zt_ttc", urlParamTtclid, 28);
        return urlParamTtclid;
    } else if (ttc) {
        return ttc;
    } else {
        return null;
    }
}

// ============ztCreateEventID================
function ztCreateEventID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    const randomChars = Array.from(
        { length: length },
        () => characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
    return `Zotek${randomChars}`;
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
function ztCheckButton(event, customEvents) {
    var isMatched = false;
    console.log("ztCheckButton event.target: ", event.target)
    if (customEvents[0]) {
        let customButton = customEvents[0].split(",")
        customButton.forEach((customEvent) => {
            if (event.target.matches(customEvent) || event.target.textContent == customEvent) {
                isMatched = true;
                return true;
            }
        });
    };
    return isMatched;
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

//=========== Track event

function ztTrackEvent(fbPixels, trackType, customData, tiktokPixels) {
    let event_id = ztCreateEventID(18);
    switch (trackType) {
        case "PageView":
        case "Search":
            ztTrack(fbPixels, trackType, { currency: zotekPixelCurrency, }, event_id, tiktokPixels);
            break;
        case "ViewContent":
        case "CollectionView":
        case "InitiateCheckout":
        case "CartView":
            ztTrack(fbPixels, trackType, customData, event_id, tiktokPixels);
            break;
        default:
            return;
    }
}

function ztTrackATCandCOEvent(fbPixels, trackType, customData, tiktokPixels, event_id) {
    switch (trackType) {
        case "AddToCart":
            ztTrack(fbPixels, trackType, customData, event_id, tiktokPixels);
            break;
        default:
            return;
    }
}

function apiGetPixels() {
    "use strict";
    return new Promise((resolve, reject) => {
        fetch(`${zotekUrlApi}/api/web/pixels?shop=${Shopify.shop}`, {
            method: "GET",
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        })
            .then(response => response.json())
            .then(res => {
                window.pixelIds = res.Pixel;
                window.ztSetting = res.Setting;
                window.ztparameters = res.Parameters;
                setTimeout(function () {
                    resolve(res);
                });
            })
            .catch(error => reject(error));
    });
}


async function categorizeCustomEvents(params) {
    params && params.forEach((param) => {
        switch (param.type) {
            case "ZT-ATC":
                ListCustomAddToCart.push(param.value);
                break;
            case "ZT-CO":
                ListCustomCO.push(param.value);
                break;
            default:
                break;
        }
    });
}

function fetchDataCart(pixels, tiktokPixels) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch("/cart.js", {
                method: "GET",
                mode: 'no-cors',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const cart = await response.json();

            if (cart.items.length > 0) {
                let content_ids = [];
                let content_name = [];
                let contents = [];

                // Use map to create Promise list
                const result = await Promise.all(cart.items.map(async (value) => {
                    content_ids.push(isUseProductID ? value.product_id : value.variant_id);
                    content_name.push(value.product_title);
                    contents.push({
                        id: isUseProductID ? value.product_id : value.variant_id,
                        title: value.product_title,
                        quantity: value.quantity,
                        price: value.price / 100,
                    });
                    return isUseProductID ? value.product_id : value.variant_id;
                }));

                let customData = {
                    content_type: "product_group",
                    content_ids: content_ids,
                    currency: zotekPixelCurrency,
                    value: parseFloat(cart.total_price) / 100,
                    num_items: cart.item_count,
                    content_name: content_name,
                    contents: contents,
                }

                const filterPixels = await callApiValidProduct(pixels, content_ids) || [];
                const filterTiktokPixels = await callApiValidProduct(tiktokPixels, content_ids) || [];

                sessionStorage.setItem('ztPixelIdActive', JSON.stringify(filterPixels));
                sessionStorage.setItem('ztTiktokPixelIdActive', JSON.stringify(filterTiktokPixels));
                sessionStorage.setItem('ztCartViewData', JSON.stringify(customData));

                ztTrackEvent(filterPixels, "PageView", "", filterTiktokPixels);
                ztTrackEvent(filterPixels, "CartView", customData, filterTiktokPixels);

                resolve();
            } else {
                reject("Cart is empty");
            }
        } catch (error) {
            console.error("Error fetching cart data:", error);
            reject(error);
        }
    });
}

async function initpixelId() {
    let results = await apiGetPixels(Shopify.shop);
    const pixelsTotal = results.Pixel;
    await categorizeCustomEvents(results.Parameters);

    client_ip_address = results.UserIp;
    if (!client_ip_address) {
        client_ip_address = ztGetUserIp();
    }
    localStorage.setItem('ztFbpixelIp', client_ip_address);

    let pixels = [];   //Pixel of facebook
    let tiktokPixels = []; //Pixel of Tiktok
    let fbPixelTargetALL = [];
    let tiktokPixelTargetALL = [];
    pixelsTotal && pixelsTotal.forEach((pixel) => {
        if (pixel.platform === 'facebook') {
            pixels.push(pixel);
        }
        if (pixel.platform === 'tiktok') {
            tiktokPixels.push(pixel);
        }
    })

    pixels && pixels.forEach((pixel) => {
        if (pixel.targetArea === 'all') {
            fbPixelTargetALL.push(pixel);
        }
    })

    tiktokPixels && tiktokPixels.forEach((pixel) => {
        if (pixel.targetArea === 'all') {
            tiktokPixelTargetALL.push(pixel);
        }
    })

    // Check Home page ================================
    if (ShopifyAnalytics.meta.page.pageType == "home") {
        sessionStorage.setItem('ztPixelIdActive', JSON.stringify(fbPixelTargetALL))
        sessionStorage.setItem('ztTiktokPixelIdActive', JSON.stringify(tiktokPixelTargetALL))
        ztTrackEvent(fbPixelTargetALL, "PageView", "", tiktokPixelTargetALL);
    }

    // Product Page =========
    if (
        (pageURL != null && pageURL.indexOf("/products/") !== -1) ||
        ShopifyAnalytics.meta.page.pageType == "product"
    ) {
        let content_ids = [];

        content_ids.push(ShopifyAnalytics.meta.product.id)

        let filterPixels = await callApiValidProduct(pixels, content_ids) || [];
        sessionStorage.setItem('ztPixelIdActive', JSON.stringify(filterPixels))

        let filterTiktokPixels = await callApiValidProduct(tiktokPixels, content_ids) || [];
        sessionStorage.setItem('ztTiktokPixelIdActive', JSON.stringify(filterTiktokPixels))

        if (filterPixels.length > 0 || filterTiktokPixels.length > 0) {
            let customData = {
                content_ids: content_ids,
                content_type: "product_group",
                contents: [{
                    id: ShopifyAnalytics.meta.product.id,
                    title: ShopifyAnalytics.meta.product.variants[0].name.split(" - ")[0],
                    quantity: 1,
                    price: ShopifyAnalytics.meta.product.variants[0].price / 100,
                }],
                value: ShopifyAnalytics.meta.product.variants[0].price / 100,
                content_name: ShopifyAnalytics.meta.product.variants[0].name.split(" - ")[0],
                currency: zotekPixelCurrency,
            }

            sessionStorage.setItem('ztViewProductData', JSON.stringify(customData))

            ztTrackEvent(filterPixels, "PageView", "", filterTiktokPixels);
            ztTrackEvent(filterPixels, "ViewContent", customData, filterTiktokPixels);
        };
    }

    //Track Add to Cart Event ******************************
    (async function (ns, fetch) {
        if (typeof fetch !== 'function') {
            listenLoad();
            return;
        }
        ns.fetch = async function () {
            const response = fetch.apply(this, arguments);
            response.then(async res => {
                if ([
                    `${window.location.origin}/cart/add`,
                    `${window.location.origin}/cart/add.js`,
                    `${window.location.origin}/cart/update.js`,
                    `${window.location.origin}/cart/change.js`,
                ].includes(res.url)) {
                    setTimeout(async () => {
                        trackAtc = true;
                        let atcDataEvent = JSON.parse(await sessionStorage.getItem('ztAddToCartEventNew'));

                        if (atcDataEvent) {
                            let filterFbPixels = atcDataEvent.filterPixels || [];
                            let filterTiktokPixels = atcDataEvent.filterTiktokPixels || [];
                            ztTrackATCandCOEvent(filterFbPixels, "AddToCart", atcDataEvent.saveToBrowseData, filterTiktokPixels, atcDataEvent.event_id);
                            sessionStorage.removeItem('ztAddToCartEventNew');
                        }
                    }, 1500);
                }
            });
            return response;
        }
    }(window, window.fetch));
    const open = window.XMLHttpRequest.prototype.open;

    async function listenLoad() {
        this.addEventListener("load", async function () {
            if (["/cart/add.js", "/cart/add"].includes(this._url)) {

                setTimeout(async () => {
                    trackAtc = true;
                    let atcDataEvent = JSON.parse(await sessionStorage.getItem('ztAddToCartEventNew'));
                    if (atcDataEvent) {
                        let filterFbPixels = atcDataEvent.filterPixels || [];
                        let filterTiktokPixels = atcDataEvent.filterTiktokPixels || [];
                        ztTrackATCandCOEvent(filterFbPixels, "AddToCart", atcDataEvent.saveToBrowseData, filterTiktokPixels, atcDataEvent.event_id);
                        sessionStorage.removeItem('ztAddToCartEventNew');
                    }
                }, 1500);
            }
        });
        return open.apply(this, arguments);
    }
    window.XMLHttpRequest.prototype.open = listenLoad;

    //  Track Collections View
    if (
        (pageURL != null && pageURL.indexOf("/collections/") !== -1) ||
        ShopifyAnalytics.meta.page.pageType == "collection"
    ) {
        const collectionData = JSON.parse(sessionStorage.getItem('ztCollectionData'));
        if (collectionData !== "") {
            let content_ids = [];
            let contents = [];

            collectionData.productVariants.forEach((product) => {
                content_ids.push(product.product.id)
                contents.push({
                    id: product.product.id,
                    title: product.product.title,
                    quantity: 1,
                    price: product.price.amount,
                });
            })
            var customData = {
                event_source_url: window.location.origin,
                action_source: "website",
                content_ids: content_ids,
                content_type: "product_group",
                contents: contents,
                currency: zotekPixelCurrency,
            };
            const collectionId = collectionData.id;
            var filterPixel = await filterPixelCollection(collectionId, pixels);
            var filterTiktokPixel = await filterPixelCollection(collectionId, tiktokPixels);
            sessionStorage.setItem('ztPixelIdActive', JSON.stringify(filterPixel))
            sessionStorage.setItem('ztTiktokPixelIdActive', JSON.stringify(filterTiktokPixel))

            ztTrackEvent(filterPixel, "PageView", "", filterTiktokPixel);
            ztTrackEvent(filterPixel, "CollectionView", customData, filterTiktokPixel);
            sessionStorage.removeItem('ztCollectionData');
        }
    };
    // Search Page ************************************
    if (
        (pageURL != null && pageURL.indexOf("/search") !== -1) ||
        ShopifyAnalytics.meta.page.pageType == "searchresults"
    ) {
        sessionStorage.setItem('ztPixelIdActive', JSON.stringify(pixels))
        sessionStorage.setItem('ztTiktokPixelIdActive', JSON.stringify(tiktokPixels))

        ztTrackEvent(pixels, "PageView", "", tiktokPixels);
        ztTrackEvent(pixels, "Search", "", tiktokPixels);
    }
    //=== Cart page ============
    if (
        (pageURL != null && pageURL.indexOf("/cart") !== -1) ||
        ShopifyAnalytics.meta.page.pageType == "cart"
    ) {
        fetchDataCart(pixels, tiktokPixels);
    };

    //Track IniateCheckout Event *********************************

    document.addEventListener('click', async event => {
        if (event.target.name == "checkout"
            || event.target.textContent == 'Checkout'
            || event.target.classList.contains('shopify-payment-button__button')
            || event.target.classList.contains('cart__checkout-button button')
            || event.target.id == "checkout"
            || event.target.getAttribute('href') == "/checkout"
            || event.target.getAttribute('onclick') == "window.location='/checkout'"
            || event.target.getAttribute('name') == "checkout"
            || ztCheckButton(event, ListCustomCO)) {
            console.log("MATCHED")
            if (ShopifyAnalytics.meta.page.pageType == 'cart') {
                const ztPixelIdActive = JSON.parse(sessionStorage.getItem('ztPixelIdActive'));
                const ztTiktokPixelIdActive = JSON.parse(sessionStorage.getItem('ztTiktokPixelIdActive'));
                let customData = JSON.parse(sessionStorage.getItem('ztCartViewData'));
                ztTrackEvent(ztPixelIdActive, "InitiateCheckout", customData, ztTiktokPixelIdActive);
                sessionStorage.removeItem('ztCartViewData')
            } else if (ShopifyAnalytics.meta.page.pageType == 'product') {
                const ztPixelIdActive = JSON.parse(sessionStorage.getItem('ztPixelIdActive'));
                const ztTiktokPixelIdActive = JSON.parse(sessionStorage.getItem('ztTiktokPixelIdActive'));
                let customData = JSON.parse(sessionStorage.getItem('ztViewProductData'));
                ztTrackEvent(ztPixelIdActive, "InitiateCheckout", customData, ztTiktokPixelIdActive);
            } else {
                setTimeout(async () => {
                    const ztPixelIdActive = await JSON.parse(sessionStorage.getItem('ztPixelIdActive'));
                    const ztTiktokPixelIdActive = await JSON.parse(sessionStorage.getItem('ztTiktokPixelIdActive'));
                    let customData = await JSON.parse(sessionStorage.getItem('ztAddToCartData'));
                    if (!customData) {
                        customData = {
                            content_ids: [1],
                            content_type: "product_group",
                            contents: [{
                                id: 1,
                                title: 'default title',
                                quantity: 1,
                                price: 0.1,
                            }],
                            value: 0.1,
                            content_name: 'default title',
                            currency: zotekPixelCurrency,
                        }
                    }
                    ztTrackEvent(ztPixelIdActive, "InitiateCheckout", customData, ztTiktokPixelIdActive);
                }, 500);
            }
        }

        setTimeout(async () => {
            // if (trackAtc == false) {
            if (event.target.name === "add"
                || event.target.matches('button[name="plus"]')
                || event.target.textContent == 'add'
                || event.target.classList.contains('btn btn--full product-form__cart-submit')
                || event.target.classList.contains('product-form__submit button button--full-width button--secondary')
                || event.target.id == "AddToCart"
                || ztCheckButton(event, ListCustomAddToCart)) {
                let atcDataEvent = JSON.parse(await sessionStorage.getItem('ztAddToCartEventNew'));
                if (atcDataEvent) {
                    let filterFbPixels = atcDataEvent.filterPixels || [];
                    let filterTiktokPixels = atcDataEvent.filterTiktokPixels || [];
                    ztTrackATCandCOEvent(filterFbPixels, "AddToCart", atcDataEvent.saveToBrowseData, filterTiktokPixels, atcDataEvent.event_id);
                    sessionStorage.removeItem('ztAddToCartEventNew');
                }
                // }
            }
        }, 2000);
    }
    );
};

function sendEventData(body, pixelFilter, trackType, eventID, event_time, tiktokPixelFilter) {
    localStorage.setItem('ztUserAgent', body.client_user_agent);
    localStorage.setItem('ztFBPForCAPI', body.fbp ? body.fbp : null);
    pixelFilter = pixelFilter || [];
    tiktokPixelFilter = tiktokPixelFilter || [];
    pixelFilter = pixelFilter.concat(tiktokPixelFilter);
    body = { ...body, client_ip_address };
    console.log("sendEventData body: ", body);

    const utmParams = new URLSearchParams(body.event_source_url);
    let utmEntries = Object.fromEntries(utmParams.entries());

    let filterUtmSource = {};
    for (const [key, value] of Object.entries(utmEntries)) {
        const paramName = key.split('?')[1];
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

    const requestData = {
        shop: Shopify.shop,
        // pixelId: pixelFilter.map((p) => p.pixelId),
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

    fetch(`${zotekUrlApi}/api/web/event-data?shop=${Shopify.shop}`, {
        method: "POST",
        mode: 'no-cors',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData),
        keepalive: true
    })
        .catch(error => {
            console.error("Error sending event data:", error);
        });
}


// Define ztTrack
(function (window, document) {
    window.ztTrack ||
        (window.ztTrack = async function () {
            if (arguments.length > 0) {
                var pixelIds, trackType, contentData, eventID, tiktokPixels;
                if (typeof arguments[0] == "object") pixelIds = arguments[0];
                if (typeof arguments[1] == "string") trackType = arguments[1];
                if (typeof arguments[2] == "object") contentData = arguments[2];
                if (arguments[3] != void 0) eventID = arguments[3];
                if (typeof arguments[4] == "object") tiktokPixels = arguments[4];
                if (eventID != 0 && eventID !== "") {
                }

                if (typeof trackType === "string" && trackType.replace(/\s+/gi, "")) {

                    // For facebook pixel ********************************
                    if (pixelIds.length > 0) {
                        try {
                            pixelIds = pixelIds.filter((p) =>
                                zotekPixelCheckEvent(p.lstEvents, trackType)
                            );
                        } catch (error) { }
                        var pixelFilter = pixelIds.filter(
                            (p) => p.status && null != p.status
                        );
                    }

                    // For tiktok pixel *********************************
                    if (tiktokPixels.length > 0) {
                        try {
                            tiktokPixels = tiktokPixels.filter((p) =>
                                zotekPixelCheckEvent(p.lstEvents, trackType)
                            );
                        } catch (error) { }
                        var tiktokPixelFilter = tiktokPixels.filter(
                            (p) => p.status && null != p.status
                        );
                    };
                    //***************************************************

                    if (pixelFilter != null && pixelFilter.length > 0 || tiktokPixelFilter != null && tiktokPixelFilter.length > 0) {
                        var data, userData,
                            now = Date.now();

                        const userDataByStorageBeforDecrypt = localStorage.getItem('zotekPixelInfo')
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
                        try {
                            if (window.zotekNow !== null && now - window.zotekNow > 3e5)
                                now = window.zotekNow;
                        } catch (error) { }
                        var event_time = Math.round(now / 1e3);
                        var currentTime = new Date().getTime();
                        var randomValue = generateRandomInt(1e2, 1e6);
                        var fbc = getFbc(currentTime);
                        var fbp = getFbp(currentTime, currentTime + randomValue);
                        var ttclid = getTtc();

                        const event_source_url = getSourceUrlUtm(pageURL);
                        console.log("%c  Track Type: %c" + trackType + "  ", "background: #14ae5c; color: white", "background: #14ae5c; color: white");
                        switch (trackType) {
                            case "PageView":
                                data = {
                                    fbp: getCookieValueByName("zt_fbp"),
                                    currency: contentData.currency,
                                    fbc: fbc,
                                    ttclid: ttclid,
                                }
                                data = { ...data, ...userData };
                            case "Search":
                                data = {
                                    event_source_url: event_source_url,
                                    client_user_agent: navigator.userAgent,
                                    fbp: getCookieValueByName("zt_fbp"),
                                    fbc: fbc,
                                    ttclid: ttclid,
                                    query: new URL(window.location.href).searchParams.get("q"),
                                    currency: contentData.currency,
                                };
                                data = { ...data, ...userData };
                                break;
                            case "CollectionView":
                                data = {
                                    client_user_agent: navigator.userAgent,
                                    content_type: contentData.content_type,
                                    content_ids: Array.isArray(contentData.content_ids)
                                        ? JSON.stringify(contentData.content_ids)
                                        : contentData.content_ids,
                                    event_source_url: event_source_url,
                                    fbp: getCookieValueByName("zt_fbp"),
                                    fbc: fbc,
                                    ttclid: ttclid,
                                    value: contentData.value,
                                    contents: contentData.contents,
                                    currency: contentData.currency,
                                };
                                data = { ...data, ...userData }
                                break;
                            case "InitiateCheckout":
                            case "ViewContent":
                            case "CartView":
                            case "AddToCart":
                                data = {
                                    client_user_agent: navigator.userAgent,
                                    content_type: "product_group",
                                    content_ids: Array.isArray(contentData.content_ids)
                                        ? JSON.stringify(contentData.content_ids)
                                        : contentData.content_ids,
                                    value: contentData.value || 1.99,
                                    content_name: Array.isArray(contentData.content_name)
                                        ? JSON.stringify(contentData.content_name)
                                        : contentData.content_name,
                                    currency: contentData.currency,
                                    num_items: contentData?.num_items || 1,
                                    event_source_url: event_source_url,
                                    contents: contentData.contents,
                                    fbp: getCookieValueByName("zt_fbp"),
                                    fbc: fbc,
                                    ttclid: ttclid,
                                };
                                data = { ...data, ...userData };
                                break;
                            default:
                                data = {
                                    client_user_agent: navigator.userAgent,
                                    content_type: "product_group",
                                    event_source_url: event_source_url,
                                    fbp: getCookieValueByName("zt_fbp"),
                                    fbc: fbc,
                                    ttclid: ttclid,
                                };
                                data = { ...data, ...userData };
                        }
                        // =============
                        if (trackType !== 'AddToCart') {
                            sendEventData(data, pixelFilter, trackType, eventID, event_time, tiktokPixelFilter);
                        }
                        localStorage.setItem('ztFBP', fbp);
                        localStorage.setItem('ztFBC', fbc);
                        localStorage.setItem('ztTTC', ttclid);
                        // =============
                        contentData = { ...contentData, ...{ event_source_url: event_source_url } }
                        contentData.contents = JSON.stringify(contentData?.contents)

                        //  For Facebook pixel ****************************

                        const facebookPixelPromise = new Promise((resolve) => {
                            if (pixelIds && pixelIds.length > 0) {
                                for (var i = 0; i < pixelIds.length; i++) {
                                    var pixelId = pixelIds[i].pixelId;
                                    fbq("init", pixelId, {
                                        'fbc': fbc,
                                        'fbp': fbp,
                                        'em': userData?.customer_email ? userData.customer_email : null,
                                        'fn': userData?.first_name ? userData.first_name : null,
                                        'ln': userData?.last_name ? userData.last_name : null,
                                        'ph': userData?.customer_phone ? userData.customer_phone : null,
                                        'ct': userData?.ct ? userData.ct : null,
                                        'st': userData?.st ? userData.st : null,
                                        'zp': userData?.zp ? userData.zp : null,
                                        'country': userData?.country ? userData.country : null,
                                    });
                                    switch (trackType) {
                                        case "PageView":
                                            fbq(
                                                "trackSingle",
                                                pixelId,
                                                "PageView",
                                                { event_source_url: event_source_url },
                                                { eventID: eventID }
                                            );
                                            break;
                                        case "Search":
                                            contentData = { ...contentData, ...{ search_string: new URL(window.location.href).searchParams.get("q") } }
                                            fbq("trackSingle", pixelId, trackType, contentData, {
                                                eventID: eventID,
                                            });
                                            break;
                                        case "ViewContent":
                                        case "AddToCart":
                                        case "CartView":
                                        case "CollectionView":
                                        case "InitiateCheckout":
                                            fbq("trackSingle", pixelId, trackType, contentData, {
                                                eventID: eventID,
                                            });
                                            break;
                                        default:
                                            return;
                                    }
                                }
                            }
                            resolve();
                        })
                        // ******************************************
                        // For Tiktok Pixel
                        const tiktokPixelPromise = new Promise(async (resolve) => {
                            if (tiktokPixelFilter && tiktokPixelFilter.length > 0) {
                                for (var i = 0; i < tiktokPixelFilter.length; i++) {
                                    let tiktokPixelFilterId = String(tiktokPixelFilter[i].pixelId).trim();
                                    if (!tiktokPixelIdLoaded.includes(tiktokPixelFilterId)) {
                                        tiktokPixelIdLoaded.push(tiktokPixelFilterId);
                                        ttq.load(tiktokPixelFilterId);
                                    }
                                    let tittokUserData = {
                                        email: userData?.customer_email ? userData.customer_email : null,
                                        phone: userData?.customer_phone ? await sha256(userData.customer_phone) : null,
                                        ttclid: ttclid || null,
                                    }
                                    switch (trackType) {
                                        case "PageView":
                                            ttq.identify(tittokUserData);
                                            ttq.instance(tiktokPixelFilterId).page({
                                                event_id: eventID,
                                            });
                                            break;
                                        case "Search":
                                            ttq.identify(tittokUserData);
                                            ttq.instance(tiktokPixelFilterId).track('Search', {
                                                event_id: eventID,
                                                currency: zotekPixelCurrency,
                                                value: 0,
                                                query: new URL(window.location.href).searchParams.get("q"),
                                            });
                                            break;
                                        case "ViewContent":
                                        case "AddToCart":
                                        case "CartView":
                                        case "InitiateCheckout":
                                            let contents = JSON.parse(contentData.contents);
                                            let tiktokContents = [];
                                            contents && contents.forEach((content) => {
                                                tiktokContents.push({
                                                    content_id: content.id,
                                                    content_type: "product_group",
                                                    content_name: content.title,
                                                    quantity: content.quantity || 1,
                                                })
                                            })
                                            ttq.identify(tittokUserData);
                                            ttq.instance(tiktokPixelFilterId).track(trackType, {
                                                contents: tiktokContents,
                                                content_type: 'product_group',
                                                event_id: eventID,
                                                value: data?.value || null,
                                                currency: zotekPixelCurrency,
                                            });
                                            break;
                                        case "CollectionView":
                                            let contentsCV = JSON.parse(contentData.contents);
                                            let tiktokContentsCV = [];
                                            let value = 0;
                                            contentsCV && contentsCV.forEach((content) => {
                                                value += content.quantity * content.price;
                                                tiktokContentsCV.push({
                                                    content_id: content.id,
                                                    content_type: "product_group",
                                                    content_name: content.title,
                                                    quantity: content.quantity || 1,
                                                })
                                            })
                                            ttq.identify(tittokUserData);
                                            ttq.instance(tiktokPixelFilterId).track(trackType, {
                                                contents: tiktokContentsCV,
                                                content_type: 'product_group',
                                                event_id: eventID,
                                                value: value,
                                                currency: zotekPixelCurrency,
                                            });
                                            break;
                                        default:
                                            return;
                                    }
                                }
                            } resolve()
                        })
                        await Promise.all([facebookPixelPromise, tiktokPixelPromise]);
                    }
                }
            }
        });
})(window, document);

// Base code facebook *****************
!function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s)
}(window, document, 'script',
    'https://connect.facebook.net/en_US/fbevents.js');

// Base code Tiktok *****************
!function (w, d, t) {
    w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"], ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }; for (var i = 0; i < ttq.methods.length; i++)ttq.setAndDefer(ttq, ttq.methods[i]); ttq.instance = function (t) {
        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++
        )ttq.setAndDefer(e, ttq.methods[n]); return e
    }, ttq.load = function (e, n) { var i = "https://analytics.tiktok.com/i18n/pixel/events.js"; ttq._i = ttq._i || {}, ttq._i[e] = [], ttq._i[e]._u = i, ttq._t = ttq._t || {}, ttq._t[e] = +new Date, ttq._o = ttq._o || {}, ttq._o[e] = n || {}; n = document.createElement("script"); n.type = "text/javascript", n.async = !0, n.src = i + "?sdkid=" + e + "&lib=" + t; e = document.getElementsByTagName("script")[0]; e.parentNode.insertBefore(n, e) };
}(window, document, 'ttq');

function getSourceUrlUtm(url) {
    try {
        const utmSource = localStorage.getItem('ZT_utmSource');
        const utmMedium = localStorage.getItem('ZT_utmMedium');
        const utmCampaign = localStorage.getItem('ZT_utmCampaign');
        const utmAdsetName = localStorage.getItem('ZT_utmAdset');
        const utmAd = localStorage.getItem('ZT_utmAd');

        if (utmSource !== null && utmMedium !== null && utmCampaign !== null && utmAdsetName !== null && utmAd !== null) {
            let utmString = '?utm_source=' + utmSource + '&utm_medium=' + utmMedium + '&utm_campaign=' + utmCampaign + '&adset_name=' + utmAdsetName + '&ad_name=' + utmAd;
            url = url + utmString;
            localStorage.setItem('zt_utm_string', utmString)
            return url;
        }
        localStorage.setItem('zt_utm_string', "")
        return url;
    } catch (error) {
        console.error("Error take UTM String", error.message);
    }
}
function decryptData(encodedData) {
    const jsonString = decodeURIComponent(encodedData);
    return JSON.parse(jsonString);
}

async function filterPixelCollection(collectionId, pixels) {
    const arrValidPixel = await Promise.all(
        pixels.map(async (pixel) => {
            if (pixel.targetArea === "all") {
                return pixel;
            }
            if (pixel.targetArea === "collections") {
                if (pixel.lstCollects === collectionId) {
                    return pixel;
                }
            }
            return null;
        })
    );
    const validPixels = arrValidPixel.filter((pixel) => pixel !== null);
    if (validPixels.length > 0) return validPixels;
    else return [];
}

async function sha256(input) {
    const data = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashString = hashArray
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    return hashString;
}

function callApiValidProduct(pixels, content_ids) {
    const hasNonAllTargetArea = pixels && pixels.some((pixel) => pixel.targetArea !== "all");
    if (hasNonAllTargetArea) {
        return filteredProductInCollection(pixels, content_ids);
    }
    return pixels;
}

async function ztGetUserIp() {
    try {
        const response = await fetch("https://www.cloudflare.com/cdn-cgi/trace");
        const text = await response.text();
        let ipFromFetch = "167.160.91.250";
        if (text.includes("ip")) {
            const ipSplit = text.split("ip=")[1];
            ipFromFetch = ipSplit.split("\n")[0];
        } else {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            ipFromFetch = ipData.ip;
        }
        return ipFromFetch;
    } catch (error) {
        console.error("Error fetching IP:", error);
        return "167.160.91.250";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initpixelId();
});