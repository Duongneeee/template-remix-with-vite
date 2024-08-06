import { Children, useMemo, useState } from "react";
import { DEFAULT_DATA_EVENTS } from "~/constants/events";

interface CountObject {
  time: string;
  counts: { name: string; count: number }[];
}

export function calculatePercentage(
  part: number,
  whole: number,
  decimalPlaces: number | undefined
) {
  if (
    whole === Infinity ||
    whole === -Infinity ||
    isNaN(part) ||
    isNaN(whole)
  ) {
    return "N/A"; // Handle cases where division by Infinity or NaN occurs
  }
  if (whole == 0) {
    part = 0;
    whole = 1;
  }
  const percentage = (part / whole) * 100;
  return percentage.toFixed(decimalPlaces);
}

export function groupAndCountByTimeRange(data: any) {
  const grouped: any = {};
  data.forEach((item: any) => {
    // const time = new Date(item.createdAt).getTime();
    const key =
      Math.floor((item.eventTime * 1000) / (10 * 60 * 1000)) * (10 * 60 * 1000);
    const timeKey = new Date(key).toISOString(); // Key representing time range

    if (!grouped[timeKey]) {
      grouped[timeKey] = {};
    }
    if (!grouped[timeKey][item.eventName]) {
      grouped[timeKey][item.eventName] = 0;
    }
    grouped[timeKey][item.eventName]++;
  });

  // Convert the grouped data into the desired format
  const result: CountObject[] = [];

  for (const timeKey in grouped) {
    const countObj: CountObject = { time: timeKey, counts: [] };
    for (const name in grouped[timeKey]) {
      countObj.counts.push({ name, count: grouped[timeKey][name] });
    }
    result.push(countObj);
  }
  return result;
}

export function convertTimestamp(timestamp: string | number | Date) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  // const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function filterEventsByDate(
  events: any,
  fromDate: string,
  toDate: string
) {
  const filteredEvents = events.filter((event: any) => {
    const createdAt = formatTimestamp(event.createdAt);

    // Check if createdAt is within the specified date range
    const isWithinDateRange = isDateInRange(createdAt, fromDate, toDate);

    // Return true only if it's within the date range
    return isWithinDateRange;
  });

  return filteredEvents;
}

export function filterEventsByDateAndName(
  events: any,
  fromDate: string,
  toDate: string,
  names: string[]
) {
  const filteredEvents = events.filter((event: any) => {
    const createdAt = formatTimestamp(event.createdAt);

    // Check if createdAt is within the specified date range
    const isWithinDateRange = isDateInRange(createdAt, fromDate, toDate);
    const isMatchingName =
      names.length === 0 || names.includes(event.eventName);
    return isWithinDateRange && isMatchingName;
  });
  return filteredEvents;
}

export function filterEventByDateAndNameAndAppId(
  events: any,
  fromDate: string,
  toDate: string,
  names: string[],
  appId: string[]
) {
  const filteredEvents = events.filter((event: any) => {
    const createdAt = formatTimestamp(event.createdAt);
    const isWithinDateRange = isDateInRange(createdAt, fromDate, toDate);
    const isMatchingName =
      names.length === 0 || names.includes(event.eventName);
    const isMatchingAppId = appId.length === 0 || appId.includes(event.pixelId);
    // Return true only if both conditions are met
    return isWithinDateRange && isMatchingName && isMatchingAppId;
  });
  //console.log(filteredEvents)
  return filteredEvents;
}
export function filterUniqueEventByEventTimeAndName(
  events: any,
  appIdSearch: string[]
) {
  if (appIdSearch && appIdSearch.length === 1) return events;
  const uniqueEvents: { [key: string]: any } = {};
  // Use the filter method on the events array
  const filteredEvents =
    events &&
    events.filter((event: any) => {
      // Create a unique key based on name and eventTime
      const key = `${event.eventName}-${event.eventTime}`;
      // Check if an event with the same key already exists
      if (!uniqueEvents[key]) {
        // If not, add the current event to the uniqueEvents object
        uniqueEvents[key] = event;
        // Return true to include the current event in the filteredEvents array
        return true;
      }
      // Return false to exclude the current event from the filteredEvents array
      return false;
    });

  // Return the filtered events
  return filteredEvents;
}
function isDateInRange(
  dateToCheck: string,
  startDate: string,
  endDate: string
) {
  // Convert date strings or timestamps to Date objects
  const dateToCheckObj = new Date(dateToCheck);
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  // Check if the dateToCheck is within the range
  return dateToCheckObj >= startDateObj && dateToCheckObj <= endDateObj;
}
export function convertToISOFormat(inputDate: Date) {
  // Extract individual components of the date
  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, "0");
  const day = String(inputDate.getDate()).padStart(2, "0");
  // const hours = String(inputDate.getHours()).padStart(2, '0');
  // const minutes = String(inputDate.getMinutes()).padStart(2, '0');
  // const seconds = String(inputDate.getSeconds()).padStart(2, '0');

  // Format the date string
  const isoDateString = `${year}-${month}-${day}`;

  return isoDateString;
}

export function extractOffsetFromString(dateString: String) {
  // Use regex to extract the GMT offset from the date string
  const offsetMatch = dateString.match(/GMT([+-]\d{4})/);
  
  if (offsetMatch) {
      // Extract the hours and minutes from the offset
      const offset = offsetMatch[1];
      const sign = offset[0];
      const hours = parseInt(offset.substring(1, 3), 10);
      const minutes = parseInt(offset.substring(3, 5), 10);
      
      // Calculate the total offset in minutes
      const totalOffsetMinutes = (hours * 60 + minutes) * (sign === '-' ? 1 : -1);
      return totalOffsetMinutes;
  }
  
  // Return null if no offset is found
  return 0;
}

export function formatDateAtLocalOffset(date: Date, offsetMinutes: number) {    
  // Calculate the offset in milliseconds
  const offsetMilliseconds = offsetMinutes * 60 * 1000;
  
  // Create a new date adjusted to the local time zone
  const localDate = new Date(date.getTime() - offsetMilliseconds);
  
  // Extract year, month, and day
  const year = localDate.getUTCFullYear();
  const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(localDate.getUTCDate()).padStart(2, '0');
  
  // Format the date as yyyy-mm-dd
  return `${year}-${month}-${day}`;
}

export function dateToString(inputDate: Date) {
  // Get the local time zone offset in minutes
  const offsetMinutes = inputDate.getTimezoneOffset();

  // Calculate the offset in milliseconds
  const offsetMilliseconds = offsetMinutes * 60 * 1000;
  
  // Create a new date adjusted to the local time zone
  const localDate = new Date(inputDate.getTime() - offsetMilliseconds);
  
  // Extract year, month, and day
  const year = localDate.getUTCFullYear();
  const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(localDate.getUTCDate()).padStart(2, '0');
  
  // Format the date as yyyy-mm-dd
  return `${year}-${month}-${day}`;
}

function formatTimestamp(timestamp: string) {
  const dateObject = new Date(timestamp);
  const formattedDate = dateObject.toISOString().split("T")[0];
  return formattedDate;
}

export const mapViewSourceAppId = (inputArr: any) => {
  const outputArr: any = [];
  inputArr &&
    inputArr.map((item: any) => {
      return outputArr.push({
        value: item.pixelId,
        label: `${item.name}#zotek#${item.pixelId}`,
      });
    });
  return outputArr;
};

export const mapViewSourceAppIdCustom = (inputArr: any) => {
  const outputArr: any = [];
  inputArr &&
    inputArr.map((item: any) => {
      const label = item.label.split("#zotek#").join("_")
      return outputArr.push({
        value: item.value,
        label: label,
      });
    });
  return outputArr;
};

export function countEventNamesByAppId(events: any, appIdSrc: string[]) {
  const resultArray: any = [];

  // Iterate through each event
  events.forEach((event: any) => {
    let revenue = 0;
    let currency = '';
    const { pixelId, eventName, data } = event;
    const dataParse = JSON.parse(data || "null");
    // Check if the pixelId exists in the resultArray
    const existingAppIndex = resultArray.findIndex(
      (item: any) => item.pixelId === pixelId
    );

    if (existingAppIndex === -1) {
      // If the pixelId doesn't exist, add a new entry
      if(eventName === "Purchase"){
        if(dataParse){
          revenue = dataParse?.value || 0
          currency = dataParse?.currency || ''
        }
      }
      resultArray.push({ pixelId, [eventName]: 1, revenue, currency });
    } else {
      // If the pixelId exists, update the count for the corresponding name
      const existingAppName = resultArray[existingAppIndex][eventName];
      resultArray[existingAppIndex] = {
        ...resultArray[existingAppIndex],
        [eventName]: existingAppName ? existingAppName + 1 : 1,
        revenue:
        (existingAppName && eventName === "Purchase" ?
          resultArray[existingAppIndex].revenue + (dataParse?.value || 0)   
            : 
          resultArray[existingAppIndex].revenue
        )
      };
    }
  });
  return mappingObjectReport(resultArray, appIdSrc);
}

export const mappingObjectReport = (inObject: any, appIdSrc: string[]) => {
  return (
    inObject &&
    inObject.map((item: any) => {
      return {
        pixelID: item.pixelId,
        pixelName: appIdSrc
          ?.find((appId) => appId.split("#zotek#")[1] === item.pixelId)
          ?.split("#zotek#")[0],
        pageView: item?.PageView || 0,
        viewContent: item?.ViewContent || 0,
        addToCart: item?.AddToCart || 0,
        initiateCheckout: item?.InitiateCheckout || 0,
        purchase: item?.Purchase || 0,
        revenue: item?.revenue || 0, 
        currency: item?.currency || ''
      };
    })
  );
};

export function generatechartData(
  mapName: any,
  inputArr: any,
  fromDate: any,
  toDate: any,
  interval: any,
  typeCal: any
) {
  // Create a date range based on the fromDate and toDate
  let currentDateTime: Number | Date;
  let endDateTime: Number | Date;
  const now = new Date();
  if (typeCal === "hour") {
    currentDateTime = 0;
    if (convertToISOFormat(now) === convertToISOFormat(new Date(fromDate))) {
      endDateTime = new Date().getHours();
    } else {
      endDateTime = 24;
    }
  } else {
    currentDateTime = new Date(fromDate);
    endDateTime = new Date(toDate);
  }
  // Initialize result array
  const resultArray: any = [];
  let isNull = inputArr && inputArr?.length === 0;
  let totalCount = 0;

  if (inputArr?.length === 0) {
    inputArr = DEFAULT_DATA_EVENTS;
  }

  // Group inputArr by name
  const groupedData = groupByName(inputArr);
  // Iterate over grouped data
  groupedData.forEach((group, name) => {
    // Initialize data array for each group
    const data = [];
    // Iterate over date range
    while (currentDateTime <= endDateTime) {
      if (!isNull) {
        // Get the total count for the current unit
        totalCount = getTotalCountForUnit(
          group,
          currentDateTime,
          interval,
          typeCal
        );
      }

      // Push total count to data array
      data.push(totalCount);

      // Increment currentDate based on interval and typeCal
      currentDateTime = incrementDate(currentDateTime, interval, typeCal);
    }
    // Create result object for the current group
    const resultObj = {
      name: mapName && mapName.find((item: any) => item.value == name)?.label,
      data,
      color:mapName && mapName.find((item: any) => item.value == name)?.color,
    };

    // Push result object to the result array
    resultArray.push(resultObj);

    // Reset currentDate for the next iteration
    if (typeCal === "hour") {
      currentDateTime = 0;
    } else {
      currentDateTime = new Date(fromDate);
    }
  });
  return resultArray;
}

interface event {
    [key: string]: number[];
}

export function generatechartDataDay(
  mapName: any,
  inputArr: any,
  fromDate: any,
  toDate: any,
  interval: any,
  typeCal: any,
  categoryData:any,
  eventsSearch:string[]
) {
  // Create a date range based on the fromDate and toDate
  let currentDateTime: Number | Date;
  let endDateTime: Number | Date;
  const now = new Date();
  currentDateTime = new Date(fromDate);
  endDateTime = new Date(toDate);
  // Initialize result array
  const resultArray: any = [];
  let isNull = inputArr && inputArr?.length === 0;
  
  if (inputArr?.length === 0) {
    inputArr = DEFAULT_DATA_EVENTS;
  }
  const event:event= {
    PageView: [],
    ViewContent: [],
    AddToCart: [],
    InitiateCheckout: [],
    Purchase: [],
    CollectionView: [],
    Search: [],
    CartView: [],
    AddPaymentInfo: [],
  }
  categoryData?.forEach((categoryItem:any,index:number) => {
    let totalCount = {
      PageView:0,
      ViewContent:0,
      AddToCart:0,
      InitiateCheckout:0,
      Purchase:0,
      CollectionView:0,
      Search:0,
      CartView:0,
      AddPaymentInfo:0,
    };
    
    const categoryDate = categoryItem + ', ' + new Date().getFullYear();
    const categoryItemConvert = convertToDate(categoryDate);
    let filterData:any = [];
    if(interval === 1){
      filterData = inputArr.filter((item:any)=>item.day === categoryItemConvert);
    }else{
      if(index === 0) {
        filterData = inputArr.filter((item:any)=> item.day <= categoryItemConvert);
      }else{
        const categoryItemSubtractionConvert = convertToDate(categoryData[index-1] + ', ' + new Date().getFullYear())
        filterData = inputArr.filter((item:any)=> item.day > categoryItemSubtractionConvert  && item.day <= categoryItemConvert);
      }
    }

    if(filterData.length > 0){
      filterData.forEach((item:any)=>{
        totalCount.PageView += item.pageView;
        totalCount.ViewContent += item.viewContent;
        totalCount.AddToCart += item.addToCart;
        totalCount.InitiateCheckout += item.initiateCheckout;
        totalCount.Purchase += item.purchase;
        totalCount.CollectionView += item.collectionView;
        totalCount.Search += item.search;
        totalCount.CartView += item.cartView;
        totalCount.AddPaymentInfo += item.addPaymentInfo;
      })
    }
    event.PageView.push(totalCount.PageView);
    event.ViewContent.push(totalCount.ViewContent);
    event.AddToCart.push(totalCount.AddToCart);
    event.InitiateCheckout.push(totalCount.InitiateCheckout);
    event.Purchase.push(totalCount.Purchase);
    event.CollectionView.push(totalCount.CollectionView);
    event.Search.push(totalCount.Search);
    event.CartView.push(totalCount.CartView);
    event.AddPaymentInfo.push(totalCount.AddPaymentInfo);
  });
  for(let [key,value] of Object.entries(event)){
    if((eventsSearch.length >0 && !eventsSearch.includes(key))){
      delete event[key]
    }
  }
  for(let [key,value] of Object.entries(event)){
    let isValue;
    if(!(eventsSearch.length >0)){
      isValue =  value.every((e:any)=> e === 0)
    }
     if(!isValue || isNull){ 
      const resultObj = {
        name: mapName && mapName.find((item: any) => item.value == key)?.label,
        data:mapName && mapName.find((item: any) => item.value == key) && value,
        color:mapName && mapName.find((item: any) => item.value == key)?.color,
      };
      // Push result object to the result array
      resultArray.push(resultObj);
    }
    
  }
  return resultArray;
}

export const convertToDate = (data:any)=>{
  const proposedDate = new Date(data);
    const year = proposedDate.getFullYear();
    const month = proposedDate.getMonth() + 1; // Tháng bắt đầu từ 0
    const day = proposedDate.getDate();
    const itemConvert = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T00:00:00.000Z`;

    return itemConvert;
}

function groupByName(inputArr: any) {
  // Use a Map to group data by name
  const resultMap = new Map();

  inputArr &&
    inputArr.forEach((item: any) => {
      const eventName = item.eventName;
      const group = resultMap.get(eventName) || [];
      group.push(item);
      resultMap.set(eventName, group);
    });

  return resultMap;
}

function getTotalCountForUnit(
  group: any,
  currentDate: any,
  interval: any,
  typeCal: any
) {
  // Filter data within the current unit
  const filteredData = group.filter((item: any) =>
    isSameUnit(item, currentDate, interval, typeCal)
  );

  // Calculate the total count
  const totalCount = filteredData.length;

  return totalCount;
}

function isSameUnit(item: any, currentDate: any, interval: any, typeCal: any) {
  // const itemDate = timestampToISOString(item.createdAt); // Convert eventTime to milliseconds
  let itemDate = item.createdAt;
  switch (typeCal) {
    case "hour":
      return new Date(itemDate).getUTCHours() === currentDate;
    case "day":
      return itemDate.split("T")[0] === currentDate.toISOString().split("T")[0];
    case "month":
      return itemDate.slice(0, 7) === currentDate.toISOString().slice(0, 7);
    case "year":
      return itemDate.getFullYear() === currentDate.getFullYear();
    default:
      return false; // Invalid typeCal
  }
}

function incrementDate(date: any, interval: any, typeCal: any) {
  let newDate: any;
  if (typeCal === "hour") {
    newDate = date;
  } else {
    newDate = new Date(date);
  }

  if (typeCal === "hour") {
    newDate = newDate + interval;
  } else if (typeCal === "day") {
    newDate.setDate(newDate.getDate() + interval);
  } else if (typeCal === "month") {
    newDate.setMonth(newDate.getMonth() + interval);
  } else if (typeCal === "year") {
    newDate.setFullYear(newDate.getFullYear() + interval);
  }

  return newDate;
}

function formatDate(date: any) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
export function generateDateArray(startDate: any, endDate: any, interval: any) {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateArray.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + interval);
  }

  return dateArray;
}
export function generateHourArray(curentDate: Date) {
  const now = new Date();
  let hours;
  if (convertToISOFormat(now) === convertToISOFormat(curentDate)) {
    hours = now.getHours();
  } else {
    hours = 24;
  }
  // Create an array to store hour strings
  const hourArray = [];

  for (let i = 0; i <= hours; i++) {
    // Convert i to 12-hour format with leading zeros
    const formattedHour = ("0" + (i % 12 || 12)).slice(-2);

    // Determine if it's AM or PM
    const amOrPm = i < 12 ? "AM" : "PM";

    // Format the hour string as "hh:mm AM/PM"
    const formattedTime = formattedHour + ":00 " + amOrPm;

    // Add the formatted time to the array
    hourArray.push(formattedTime);
  }

  return hourArray;
}

export function isMoreThanNDaysApart(
  fromDate: string,
  toDate: string,
  n: number
): boolean {
  // Convert date strings to Date objects
  const fromDateObj: Date = new Date(fromDate);
  const toDateObj: Date = new Date(toDate);

  // Calculate the difference in milliseconds
  const differenceInMilliseconds: number =
    toDateObj.getTime() - fromDateObj.getTime();

  // Number of milliseconds in n days
  const nDaysInMilliseconds: number = n * 24 * 60 * 60 * 1000;
  // Compare the difference with more than n days
  return differenceInMilliseconds > nDaysInMilliseconds;
}
export function replaceNullWithString(obj: any) {
  for (let key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      replaceNullWithString(obj[key]);
    } else if (typeof obj[key] === "string" && obj[key] === "null") {
      obj[key] = "";
    }
  }
  return obj;
}

export function ArrayChangeObj(array: any) {
  let data: any = {};
  array.forEach((element: any) => {
    for (const key in element) {
      if (Object.prototype.hasOwnProperty.call(element, key)) {
        data[key] = element[key];
      }
    }
    // nameShop = element.shop.split(".myshopify.com").join("");
    // if (element.isClose == null) {
    //   isReview = null;
    // } else {
    //   isReview = element.isClose;
    // }
  });
  return data;
}

export const ConvertIntData = (data:any)=>{
  return data.map((item:any)=>({
    ...item,
    pageView: Number(item.pageView),
    viewContent: Number(item.viewContent),
    addToCart: Number(item.addToCart),
    initiateCheckout: Number(item.initiateCheckout),
    purchase: Number(item.purchase),
    collectionView: Number(item.collectionView),
    search: Number(item.search),
    cartView: Number(item.cartView),
    addPaymentInfo: Number(item.addPaymentInfo)
  }))
}

/*
Input: day
Output: Date before with day on format yyyy-DD-mm
*/
export const reduceByDay = (day:number) => {

  let currentDate = new Date();

  const currentDay = currentDate.getDate();
    
  currentDate.setDate(currentDay - day);

  return convertToISOFormat(currentDate)

}

export const convertDataToOption = (data:any) => {
  const dataEdit:any = {};
  
  data.forEach((item:any)=>{
    const { fpcLevel1, fpcLevel2, fpcLevel3 } = item

    if(fpcLevel1 !== ""){
      if(!dataEdit[fpcLevel1]){
        dataEdit[fpcLevel1] = {
          label:fpcLevel1,
          children:{}
        }
      }

      if(fpcLevel2 !== ""){
        if(!dataEdit[fpcLevel1].children[fpcLevel2]){
          dataEdit[fpcLevel1].children[fpcLevel2] = {
            label:fpcLevel2,
            children: []
          }
        }
    
        if(fpcLevel3 && !(fpcLevel3 === '') && !dataEdit[fpcLevel1].children[fpcLevel2].children.includes(fpcLevel3)){
          dataEdit[fpcLevel1].children[fpcLevel2].children.push(fpcLevel3)
        }
      }
    }
  })

  return dataEdit || {};
}

export const customPixelsByPlatform = (data:any,platform:string)=>{
  const dataFilter =  data ? data.filter((item:any)=>item.platform === platform) : [];
  return mapViewSourceAppId(dataFilter)
}

export const validateStepTwo = (formState:any,stateLoginFB:boolean | undefined)=>{
  const errors:any = {};
  if(stateLoginFB){
    if (!formState.adAccount) {
      errors.adAccount = "Business Account is required";
    }
    if (!formState.catalog) {
      errors.catalog = "Catalog is required";
    }
  }
  if (!formState.name) {
    errors.name = "Product Feed name is required";
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

export const validateStepThree = (formState:any)=>{
  const errors:any = {};

  const { ltsProducts, ltsCollections, tags, types} = formState.rule;
  if(ltsProducts.length === 0 || ltsCollections.length === 0 || tags.length === 0 || types.length === 0){
    errors.products = "Must have any of the following: products, collections, tags, or types."
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

export const validateStepFour= (formState:any)=>{
  const errors:any = {};
  if(!formState.rule.productCondition){
    errors.productCondition = "Product Condition is required"
  }
  if (Object.keys(errors).length) {
    return errors;
  }
}

export const findParent = (obj:any, targetValue:string, currentPath = [])=>{
  for (const [key, value] of Object.entries(obj)) {
    const newPath:any = [...currentPath, { key, label: (value as any).label }];
    
    if (Array.isArray((value as any).children)) {
      if ((value as any).children.includes(targetValue)) {
        return levelCategories({ parent: targetValue, path: newPath });
      }
    } else if (typeof (value as any).children === 'object') {
      const result:any = findParent((value as any).children, targetValue, newPath);

      if(result) return result;
    }

    if ((value as any).label === targetValue) {
      return levelCategories({ parent: targetValue, path: currentPath});
    }
  }
  return null;
}

export const levelCategories = (obj:any) => {
  const level:any = {};
  if(obj.path.length === 0) {
    level.fpcLevel1 = obj.parent;
  }else{
    obj.path.map((item:any, index:number)=>{
      level[`fpcLevel${index + 1}`] = item.label
    })
    level[`fpcLevel${obj.path.length + 1}`] = obj.parent;
  }

  return level;
}

export const convertObjToString = (data = {}) =>{
  const value = Object.values(data);
  return  value.join(' -> ')
}

export const formatTime = (data:string) =>{
  const dataSplit =  data.split('T');

  dataSplit[dataSplit.length - 1] = dataSplit[dataSplit.length - 1].split('.')[0]

  return dataSplit.join(' ');
}