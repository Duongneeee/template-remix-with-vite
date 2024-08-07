import { json } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import {
  Page,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "~/shopify.server";
import {
  createProductFeedConfig,
  updateProductFeedConfig,
  validateProductFeedConfig,
} from "~/backend/services/productFeedConfig.service";
import { IProductFeedConfigReq } from "~/backend/types/productFeedConfig.type";
import { convertDataToOption, replaceNullWithString } from "~/utils";
import { redirect } from "@remix-run/node";
import type { IOption } from "~/components/common/MultipleSellectBox";
import { 
   getAccessTokenStoreFont,
   getAllProducts,  
   transformProductIds,
   transformProducts,  
  } from "~/backend/external_apis/shopify/product.service";
import { getProfileShopByShop, updateProfileShop } from "~/backend/services/profileShop.service";
import {
  getAccessTokenCastle,
} from "~/backend/external_apis/facebook/facebook.service";
import { IProfileShopUpdate } from "~/backend/types/profileShop.type";
import { updatePixelAccessTokenFbService } from "~/backend/services/cApiConfig.service";
import { ApiCreateProductFeed } from "~/backend/external_apis/backend_pixel/pixel_api.service";
import { getAllDataFacebookCategoryLevelService } from "~/backend/services/facebookCategoryLevel.service";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";


export interface IRules{
  ltsProducts: string[],
  ltsCollections: string[],
  tags: string[],
  types: string[]
}

export async function loader({ request, params }: any) {
  const { session } = await authenticate.admin(request);
  const { shop, accessToken } = session;
  let ltsProducts: IOption[] = await getAllProducts(shop, accessToken);
  const profileShop = (await getProfileShopByShop(shop)).result as IProfileShopUpdate || [];
  
  let storeFrontAccessToken: string;
  
  if (profileShop.storeFrontAccessToken) {
    storeFrontAccessToken = profileShop.storeFrontAccessToken;
  }else{
    storeFrontAccessToken = await getAccessTokenStoreFont(shop,accessToken) || '';
    await updateProfileShop({...profileShop, storeFrontAccessToken});
  }
  const AllCategoriesLevel:IOption[] = convertDataToOption((await getAllDataFacebookCategoryLevelService()).result || []);
  if (params.id === "new") {
    return json<any>({
      shop,
      profileShopCountry:profileShop.country,
      accessToken,
      storeFrontAccessToken,
      ltsProducts,
      AllCategoriesLevel,
      facebookName: profileShop && profileShop.facebookName,
      facebookAvatar: profileShop && profileShop.facebookAvatar,
      accessTokenFb: profileShop && profileShop.accessTokenFb,
      FACEBOOK_APP_ID:process.env.FACEBOOK_APP_ID
    });
  }
  // const productFeedData = await getProductFeedConfigById(Number(params.id));
  // return json<any>({
  //   productFeedData: { ...productFeedData.result },
  //   shop,
  //   profileShopCountry:profileShop.country,
  //   accessToken,
  //   collectionOptions,
  //   ltsProducts,
  //   ltsProductTagsOptions,
  //   ltsProductTypesOptions,
  //   AllCategoriesLevel,
  //   facebookName: shopInfo && shopInfo.facebookName,
  //   facebookAvatar: shopInfo && shopInfo.facebookAvatar,
  //   accessTokenFb: shopInfo && shopInfo.accessTokenFb,
  // });
}

export async function action({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  var requestData: any = {
    ...Object.fromEntries(await request.formData()),
  };

  if (requestData.action === "save_fb") {
    const shopInfo = (await getProfileShopByShop(shop))
      .result as IProfileShopUpdate;
    if (shopInfo) {
      const accessTokenFB = await getAccessTokenCastle(requestData.token);
      const data: IProfileShopUpdate = {
        ...shopInfo,
        facebookName: requestData.name,
        // accessTokenFb: requestData.token,
        accessTokenFb: accessTokenFB,
        facebookAvatar: requestData.avatar,
      };
      await updateProfileShop(data)
      await updatePixelAccessTokenFbService({ shop, accessTokenFB: accessTokenFB })
    }
  }

  if (requestData.action === "logout_fb") {
    const shopInfo = (await getProfileShopByShop(shop))
      .result as IProfileShopUpdate;
      if (shopInfo) {
         const data: IProfileShopUpdate = {
         ...shopInfo,
         facebookName: '',
         accessTokenFb: '',
         facebookAvatar: '',
      };
      await updateProfileShop(data)
    }
  }
  
  if (!requestData?.action) {
    const errors = validateProductFeedConfig(requestData);

    if (errors) {
      return json({ errors }, { status: 422 });
    }

    if (params.id === "new") {
      delete requestData?.profileShopCountry
      delete requestData?.selected
        const createData: IProductFeedConfigReq = {
         ...requestData,
         status:0,
         shop: shop,
        };
        const res = await createProductFeedConfig(
         replaceNullWithString(createData)
        );
       if (res.isSuccessful){
        await ApiCreateProductFeed(res?.result?.id)
        return redirect(`/app/product-feed`);
       } 
       else return json({ ...res });
    } else {
      const updateData: IProductFeedConfigReq = {
         ...requestData,
         id: Number(requestData.id),
         status:0,
         shop: shop,
      };
      const res = await updateProductFeedConfig(
        replaceNullWithString(updateData)
      );
      if (res.isSuccessful) return redirect(`/app/product-feed`);
       else return json({ ...res });
    }
  }
  return null;
}

const CustomProductFeed = () => {
  var formData = useLoaderData<typeof loader>();
  const productFeedData = formData.productFeedData;
  const [tokenFb, setTokenFb] = useState<string>(formData?.accessTokenFb || "");
  const [UsernameFb, setUserNameFb] = useState<string>(formData?.facebookName || "");
  const [UserAvatarFb, setUserAvatarFb] = useState<string>(formData?.facebookAvatar || "");
  const [standStep, setStandStep] =  useState(1);
  const [stateLoginFB, setStateLoginFB] = useState<boolean>(false);

  // start state Step 3
  const ltsProductOptions = transformProducts(formData.ltsProducts);
  const ltsProductConditionAll = transformProductIds(formData.ltsProducts);
  const [ltsProductAllOrSelected, setLtsProductAllOrSelected] = useState(ltsProductOptions);
  const [ruleSelectedProducts,setRuleSelectedProducts] = useState<IRules>({ltsProducts:[],ltsCollections:[],tags:[],types:[]});
  //end state Step 3
  
  var formatedData;
  if (typeof productFeedData !== "undefined") {
    formatedData = {
      ...productFeedData,
      rule: JSON.parse(productFeedData.rule),
    };
  }

  const initalState =
    typeof productFeedData !== "undefined"
      ? formatedData
      : {
          adAccount: "",
          catalog: "",
          name: "",
          schedule: "daily",
          conditions: "all",
          file: "",
          rule: {
            ltsProducts: ltsProductConditionAll
          },
        };

  const [formState, setFormState] = useState<any>(initalState);
  const [cleanFormState, setCleanFormState] = useState<any>(initalState);
  const [isFormChange, setIsFormChange] = useState<boolean>(false);

  const isDirty: boolean =
    JSON.stringify(formState) !== JSON.stringify(cleanFormState);

  const nav = useNavigation();
  // const isSaving: boolean =
  //   nav.state === "submitting" && nav.formData?.get("action") !== "delete";
  // const isDeleting: boolean =
  //   nav.state === "submitting" && nav.formData?.get("action") === "delete";

  const navigate = useNavigate();

  function handleBackOrCancel() {
    return isDirty ? setIsFormChange(true) : navigate("/app/product-feed");
  }

  //End custom data of CategoriesFacebookLevel

  return (
    <Page
      backAction={{
        content: "Settings",
        onAction: () => handleBackOrCancel(),
      }}
      
      title={
        formData?.productFeedData?.id
          ? "Product Feed / Edit Product Feed"
          : "Product Feed / Create Product Feed"
      }
    >
      <div className="mb-10">
        {
          standStep === 1 && 
            <StepOne 
            UserAvatarFb = {UserAvatarFb}
            UsernameFb = {UsernameFb}
            setTokenFb = {setTokenFb}
            setUserNameFb = {setUserNameFb}
            setUserAvatarFb = {setUserAvatarFb}
            setStandStep = {setStandStep}
            stateLoginFB = {stateLoginFB}
            setStateLoginFB = {setStateLoginFB}
            tokenFb= {tokenFb}
            FACEBOOK_APP_ID={formData.FACEBOOK_APP_ID}
            />
          ||
          standStep === 2 && 
            <StepTwo 
            formData={formData}
            formState={formState} 
            setFormState={setFormState} 
            UsernameFb={UsernameFb}
            UserAvatarFb={UserAvatarFb}
            setTokenFb={setTokenFb}
            setUserNameFb={setUserNameFb}
            setUserAvatarFb={setUserAvatarFb}
            setStandStep={setStandStep}
            stateLoginFB = {stateLoginFB}
            setStateLoginFB = {setStateLoginFB}
            />
          ||
          standStep === 3 && 
            <StepThree 
            formData={formData}
            formState={formState} 
            setFormState={setFormState} 
            setStandStep={setStandStep}
            ltsProductOptions={ltsProductOptions}
            ltsProductConditionAll={ltsProductConditionAll}
            ltsProductAllOrSelected={ltsProductAllOrSelected}
            ruleSelectedProducts={ruleSelectedProducts}
            setRuleSelectedProducts={setRuleSelectedProducts}
            setLtsProductAllOrSelected={setLtsProductAllOrSelected}
            />
          ||
          standStep === 4 && 
            <StepFour 
            formData={formData}
            formState={formState} 
            setFormState={setFormState} 
            setStandStep={setStandStep}/>
        }
      </div>

    </Page>
  );
};

export default CustomProductFeed;