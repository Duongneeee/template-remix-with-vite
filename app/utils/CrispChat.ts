import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react"
import md5 from 'md5'

const CrispChat = (props:any) => {

    const {shop, emailShop, planShopify, shopName} = props

    useEffect(()=>{
        Crisp.configure("c9c0e691-e7ae-4b3d-96c6-3f18db38ede8");
        const token_id = md5(shop)
        Crisp.setTokenId(token_id);
        Crisp.session.setData({
            shop,
            planShopify
        });
        Crisp.user.setNickname(shopName);
        if (emailShop) {
            Crisp.user.setEmail(emailShop);
        }
    }, [])

    return null
}

export default CrispChat