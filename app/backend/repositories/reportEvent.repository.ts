import db from "~/db.server";
import { sentryLogger, LOG_LEVELS } from "~/utils/logger";
import { ReportDate } from "../types/reportEvent.type";
import { IEventDataByDate } from "../types/eventData.type";

/*
Return report overview for Home menu and Analytic
*/
export const getReportEventByShopRepo = async (shop:string, data:ReportDate) => {
    try {
      const res = await db.$queryRaw`SELECT detail.shop,
		    SUM(detail.pageView) as pageView,
		    SUM(detail.viewContent) as viewContent,
		    SUM(detail.addToCart) as addToCart,
		    SUM(detail.initiateCheckout) as initiateCheckout,
		    SUM(detail.purchase) as purchase,
		    SUM(detail.collectionView) as collectionView
      FROM (
	    SELECT tmp.shop, tmp.day, 
	      max(tmp.pageView) as pageView,
	      max(tmp.viewContent) as viewContent,
	      max(tmp.addToCart) as addToCart,
	      max(tmp.initiateCheckout) as initiateCheckout,
	      max(tmp.purchase) as purchase,
	      max(tmp.collectionView) as collectionView
      FROM (
	    SELECT re.*
	    from ReportEvent re 
	    join CApi_MetaPixel cmp 
	    ON re.shop = cmp.shop and re.pixelId = cmp.pixelId 
	    where re.shop = ${shop}
	    and re.day BETWEEN ${data.since} and ${data.until}
      ) tmp GROUP BY tmp.shop, tmp.day
      ) detail group by detail.shop
     `

      return res;
    } catch (error) {
      console.log("Error getReportEventByShopRepo: ", error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getReportEventByShopRepo", {
        additionalInfo: error,
      });
      throw error;
    }
};

/*
Return data overview for Chart in Analytic Menu
*/
export const getReportEventAnalyticByShopRepo = async (data:IEventDataByDate) => {
    try {
      const res = await db.$queryRaw`SELECT tmp.shop, tmp.day,
	     MAX(tmp.pageView) as pageView,
	     MAX(tmp.viewContent) as viewContent,
	     MAX(tmp.addToCart) as addToCart,
	     MAX(tmp.initiateCheckout) as initiateCheckout,
	     MAX(tmp.purchase) as purchase,
	     MAX(tmp.collectionView) as collectionView,
	     MAX(tmp.search) as search,
	     MAX(tmp.cartView) as cartView,
	     MAX(tmp.addPaymentInfo) as addPaymentInfo
        FROM (
	     select re.* FROM shopify.ReportEvent re
		 JOIN 
			  CApi_MetaPixel cmp 
		  ON 
			  re.shop = cmp.shop AND re.pixelId = cmp.pixelId
          where re.shop = ${data.shop}
          and re.day BETWEEN ${data.since} and ${data.until} 
		  AND cmp.platform=${data.platform}
          ) tmp group by tmp.shop, tmp.day
        `
      return res;
    } catch (error) {
      console.log("Error getReportEventAnalyticByShopRepo: ", error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getReportEventAnalyticByShopRepo", {
        additionalInfo: error,
      });
      // throw error;
    }
};

/*
Return event overview for Report Table on Tab Analytics
*/
export const getReportEventAnalyticTableByShopRepo = async (data:IEventDataByDate) => {
    try {
      const res = await db.$queryRaw`SELECT 
			tmp.shop, tmp.pixelId as pixelID, tmp.pixelName,
			SUM(tmp.pageView) as pageView,
			SUM(tmp.viewContent) as viewContent,
			SUM(tmp.addToCart) as addToCart,
			SUM(tmp.initiateCheckout) as initiateCheckout,
			SUM(tmp.purchase) as purchase,
			SUM(tmp.collectionView) as collectionView,
			SUM(tmp.revenue) AS revenue,
			MAX(tmp.currency) AS currency
		from (
			SELECT 
				re.*, 
				cmp.name AS pixelName
			FROM 
					shopify.ReportEvent re
			JOIN 
					CApi_MetaPixel cmp 
			ON 
					re.shop = cmp.shop AND re.pixelId = cmp.pixelId
			WHERE 
					re.shop = ${data.shop}
			AND re.day BETWEEN ${data.since} AND ${data.until}
			AND cmp.platform=${data.platform}
		)tmp
		group by tmp.shop, tmp.pixelId, tmp.pixelName;`
	  
      return res;
    } catch (error) {
      console.log("Error getReportEventAnalyticTableByShopRepo: ", error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getReportEventAnalyticTableByShopRepo", {
        additionalInfo: error,
      });
      // throw error;
    }
};

/*
Return data pixel for Chart in Analytic Menu
*/
export const getReportEventAnalyticByPixelIdRepo = async (data:IEventDataByDate) => {
    try {
      const res = await db.$queryRaw`SELECT tmp.shop,tmp.day,
	  MAX(tmp.pageView) as pageView,
	  MAX(tmp.viewContent) as viewContent,
	  MAX(tmp.addToCart) as addToCart,
	  MAX(tmp.initiateCheckout) as initiateCheckout,
	  MAX(tmp.purchase) as purchase,
	  MAX(tmp.collectionView) as collectionView,
      MAX(tmp.search) as search,
	  MAX(tmp.cartView) as cartView,
	  MAX(tmp.addPaymentInfo) as addPaymentInfo
	FROM (
	  SELECT re.*
	  FROM ReportEvent re 
	  JOIN 
			 CApi_MetaPixel cmp 
	    ON 
			re.shop = cmp.shop AND re.pixelId = cmp.pixelId
	  WHERE re.shop = ${data.shop} AND FIND_IN_SET(re.pixelId, ${data.pixelId})
      AND re.day BETWEEN ${data.since} AND ${data.until}
	  AND  cmp.platform = ${data.platform}
	) tmp GROUP BY tmp.shop,tmp.day`
	
      return res;
    } catch (error) {
      console.log("Error getReportEventAnalyticByPixelIdRepo: ", error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getReportEventAnalyticByPixelIdRepo", {
        additionalInfo: error,
      });
      throw error;
    }
};

export const getReportEventAnalyticTableByPixelIdRepo = async (data:IEventDataByDate) => {
    try {
      const res = await db.$queryRaw`SELECT tmp.shop,tmp.pixelId as pixelID,tmp.pixelName,
	  SUM(tmp.pageView) as pageView,
	  SUM(tmp.viewContent) as viewContent,
	  SUM(tmp.addToCart) as addToCart,
	  SUM(tmp.initiateCheckout) as initiateCheckout,
	  SUM(tmp.purchase) as purchase,
	  SUM(tmp.collectionView) as collectionView,
      SUM(tmp.search) as search,
	  SUM(tmp.cartView) as cartView,
	  SUM(tmp.addPaymentInfo) as addPaymentInfo,
	  SUM(tmp.revenue) AS revenue,
	  MAX(tmp.currency) AS currency
	FROM (
	  SELECT re.*, cmp.name as pixelName
	  from shopify.ReportEvent re 
	   JOIN 
			  CApi_MetaPixel cmp 
		  ON 
			  re.shop = cmp.shop AND re.pixelId = cmp.pixelId
	  where re.shop = ${data.shop} and FIND_IN_SET(re.pixelId, ${data.pixelId})
      AND re.day BETWEEN ${data.since} AND ${data.until}
	  AND  cmp.platform = ${data.platform}
	) tmp GROUP BY tmp.shop,tmp.pixelId,tmp.pixelName`

      return res;
    } catch (error) {
      console.log("Error getReportEventAnalyticTableByPixelIdRepo: ", error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getReportEventAnalyticTableByPixelIdRepo", {
        additionalInfo: error,
      });
      throw error;
    }
};

// Returns data for a time period by platform
export const getReportEventPlatformByShopRepo = async ( data:IEventDataByDate ) => {
    try {
      const res = await db.$queryRaw`
	  SELECT detail.shop,
	  SUM(detail.pageView) as pageView,
	  SUM(detail.viewContent) as viewContent,
	  SUM(detail.addToCart) as addToCart,
	  SUM(detail.initiateCheckout) as initiateCheckout,
	  SUM(detail.purchase) as purchase,
	  SUM(detail.collectionView) as collectionView
		FROM (
		SELECT tmp.shop, tmp.day, 
			max(tmp.pageView) as pageView,
			max(tmp.viewContent) as viewContent,
			max(tmp.addToCart) as addToCart,
			max(tmp.initiateCheckout) as initiateCheckout,
			max(tmp.purchase) as purchase,
			max(tmp.collectionView) as collectionView
		FROM (
		SELECT re.*
		FROM ReportEvent re 
		JOIN CApi_MetaPixel cmp 
		ON re.shop = cmp.shop AND re.pixelId = cmp.pixelId 
		AND re.shop = ${data.shop}
		AND re.day BETWEEN ${data.since} AND ${data.until}
		AND cmp.platform = ${data.platform}
		) tmp GROUP BY tmp.shop, tmp.day
		) detail GROUP BY detail.shop
     `

      return res;
    } catch (error) {
      console.log("Error getReportEventPlatformByShopRepo: ", error);
      sentryLogger(LOG_LEVELS.ERROR, "Error in getReportEventPlatformByShopRepo", {
        additionalInfo: error,
      });
      throw error;
    }
};