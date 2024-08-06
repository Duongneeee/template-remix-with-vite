import { hotjar } from "react-hotjar";
import { IProfileShopUpdate } from "~/backend/types/profileShop.type";

export default function logHotJar(profileShop: IProfileShopUpdate){
    const siteId = 3887893;
    const hotjarVersion = 6;
    hotjar.initialize(siteId, hotjarVersion);
    hotjar.identify(String(profileShop?.id || "user_id"), {
      userProperty: profileShop?.domain,
    });
}

