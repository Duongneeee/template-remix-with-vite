import axios from "axios";
import { IShopReq } from "./shop.types";
export const apiGetShopInFo = async (req: IShopReq) => {
    const {shop, token } = req;
    // console.log(req);
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://${shop}/admin/api/2024-04/shop.json`,
        headers: { 
          'X-Shopify-Access-Token': token
        }
      };
      try {
      const res = await axios.request(config) as any;
      if (res.data) {
        // console.log(res.data);
        return res.data.shop;
      }
    }
    catch (error) {
        throw error; // Re-throw the error to indicate that an error occurred
      }
}