import getRedisClient from "~/redis.server";
import { IProfileShopUpdate } from "../types/profileShop.type";

export const getProfileShopOnCache = async (shop:string) =>{
    try {
      const redisClient =  await getRedisClient();
      const key = `ProfileShop:${shop}`
      const dataRedis = await redisClient.get(key) || 'null'; 
      return JSON.parse(dataRedis) || null;
    } catch (error) {
      console.log(error)
    }
}

export const setProfileShopToCache = async (profileShop:IProfileShopUpdate) =>{
    try {
      const redisClient =  await getRedisClient();
      const key = `ProfileShop:${profileShop.shop}`
      await redisClient.set(key, JSON.stringify(profileShop));
    } catch (error) {
      console.log(error);
    }
}

export const delProfileShopOnCache = async (shop:string) =>{
    try {
      const redisClient =  await getRedisClient();
      const key = `ProfileShop:${shop}`
      await redisClient.del(key);
    } catch (error) {
      console.log(error);
    }
}