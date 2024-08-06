import axios from "axios";
import getRedisClient, { closeRedisConnection } from "~/redis.server";

export const ApiCreateProductFeed = async (id:any) =>{
   try {
    const res = await axios.get(`${process.env.PIXEL_BACKEND_API}/api/v1/product-feed/create/${id}`);
    return res;
   } catch (error: any) {
    return error
   }
}

export const ApiUpdateProductFeed = async (id:number,productFeedId:string) =>{
    try {
      const res = await axios.post(`${process.env.PIXEL_BACKEND_API}/api/v1/product-feed/update/${id}`);
      return res;
    } catch (error) {
        console.log(error)
    }
}

export const ApiDeleteProductFeed =  async (id:number,productFeedId:string) =>{
  try {
    const res = await axios.delete(`${process.env.PIXEL_BACKEND_API}/api/v1/product-feed/delete/${id}`,
    {
      params:{
        deleteFB:true
      },
      data:{
        productFeedId
      }
    });
    return res;
  } catch (error) {
      console.log(error)
  }
}

export const getDataCacheProfileAppConfig = async (shop:string) =>{
  try {
    const redisClient =  await getRedisClient();
    const key = `ProfileAppConfigs:${shop}`
    const dataRedis = (await redisClient.get(key)) || 'null';
    
    return JSON.parse(dataRedis) || [];
  } catch (error) {
    console.log(error)
  }
}

export const getDataCacheReportSevenDayFB = async (shop:string, platform:string) =>{
  try {
    const redisClient =  await getRedisClient();
    const key = `EventReport7Day:${platform}:${shop}`
    const dataRedis = await redisClient.get(key) || 'null'; 
    return JSON.parse(dataRedis) || [];
  } catch (error) {
    console.log(error)
  }
}

export const setDataCacheProfileAppConfig = async (shop:string, value:string) =>{
  try {
    const redisClient =  await getRedisClient();
    const key = `ProfileAppConfigs:${shop}`
    await redisClient.set(key, value);
  } catch (error) {
    console.log(error);
  }
}

export const delDataCacheProfileAppConfig = async (shop:string) =>{
  try {
    const redisClient =  await getRedisClient();
    const key = `ProfileAppConfigs:${shop}`
    await redisClient.del(key);
  } catch (error) {
    console.log(error);
  }
}