/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState, useRef, useEffect, Fragment } from "react";
import { json } from "@remix-run/node";
import {
  useLoaderData,
  useNavigation,
  useSubmit,
  useNavigate,
  useActionData,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Card,
  Layout,
  Page,
  Text,
  TextField,
  BlockStack,
  Grid,
  Select,
  Checkbox,
  Link,
  RadioButton,
  ResourceList,
  ResourceItem,
  Avatar,
  Button,
  Modal,
  Box,
  InlineStack,
  Badge,
  useBreakpoints,
  PageActions,
  Tooltip,
} from "@shopify/polaris";
import { InfoIcon,ArrowRightIcon,PlusIcon } from '@shopify/polaris-icons';
import Switch from "react-switch";
import MultipleSelectBox from "~/components/common/MultipleSellectBox";
import type { IFormState } from "~/models/pixel-manager.types";
import { accountDev, eventOptions, targetOptions, videoConfig } from "~/constants/options";
import { EVENT_LIST_DEFAULT } from "~/constants/events";
import { jsonToFormData } from "~/utils/transform";
import {
  createPixelService,
  getPixelByPixelIdService,
  updatePixelAccessTokenFbService,
  updatePixelService,
  validatePixel,
} from "~/backend/services/cApiConfig.service";
import type {
  ICApi_MetaPixelCreate,
  ICApi_MetaPixelUpdate,
} from "~/backend/types/cApiConfig.type";
import type { IOption } from "~/components/common/MultipleSellectBox";
import { getCollections } from "~/backend/external_apis/shopify/collection.service";
import { replaceNullWithString } from "~/utils";
import {
  getProfileShopByShop,
  updateProfileShop,
} from "~/backend/services/profileShop.service";
import FacebookLoginComp from "~/components/common/FacebookLogin";
import type { ISelectSource } from "~/backend/external_apis/facebook/facebook.types";
import { getAccessTokenCastle, getBussinessSource } from "~/backend/external_apis/facebook/facebook.service";
import {
  mapViewAccount,
  mapViewPixel,
} from "~/backend/external_apis/facebook/facebook.utils";
import type { IProfileShopUpdate } from "~/backend/types/profileShop.type";
import { getAllProducts, transformOption } from "~/backend/external_apis/shopify/product.service";
import SelectBoxProduct from "~/components/pixel/SelectBoxProduct";

export interface ErrorItem {
  isSuccessful?: string;
  errorCode?: string;
  message?: string;
}

export async function loader({ request, params }: any) {
  const { admin } = await authenticate.admin(request);
  const { shop, accessToken } = admin.rest.session;

  let collectionOptions: IOption[] = await getCollections(shop, accessToken);
  let productOptions: IOption[] = transformOption(await getAllProducts(shop, accessToken));
  const shopInfo = (await getProfileShopByShop(shop)).result;
  let isDisabledWithAccount = false;
  accountDev.map((account) => {
    if (account === shop) {
      isDisabledWithAccount = true
      return;

    }
  })
  let mode = "auto";
  // if (isDisabledWithAccount) {
  //   mode = shopInfo && shopInfo.accessTokenFb ? "auto" : "manual"
  // }

  if (params.id === "new") {
    return json({
      lstEvents: EVENT_LIST_DEFAULT,
      targetArea: "all",
      collectionOptions: collectionOptions,
      productOptions,
      mode,
      shop,
      facebookName: shopInfo && shopInfo.facebookName,
      facebookAvatar: shopInfo && shopInfo.facebookAvatar,
      accessTokenFb: shopInfo && shopInfo.accessTokenFb,
      isDisabledWithAccount
    });
  }

  const pixelData = await getPixelByPixelIdService(Number(params.id));

  return json<any>({
    pixelData: { ...pixelData.result },
    shop,
    accessToken,
    collectionOptions: collectionOptions,
    productOptions,
    facebookName: shopInfo && shopInfo.facebookName,
    facebookAvatar: shopInfo && shopInfo.facebookAvatar,
    accessTokenFb: shopInfo && shopInfo.accessTokenFb,
    mode,
    isDisabledWithAccount
  });
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
    const errors =await validatePixel(requestData);

    if (errors) {
      return json({ errors }, { status: 422 });
    }

    if (params.id === "new") {
      const createData: ICApi_MetaPixelCreate = {
        ...requestData,
        name: requestData.mode === 'auto'? requestData.name : requestData.nameManual,
        pixelId: requestData.mode === 'auto'? requestData.pixelId : requestData.pixelIdManual,
        accessTokenFB: requestData.accessTokenFB
          ? requestData.accessTokenFB?.trim()
          : "",
        shop: shop,
        status: String(requestData.status).toLowerCase() === "true",
        isActiveCApi: String(requestData.isActiveCApi).toLowerCase() === "true",
        platform: "facebook",
      };
      delete createData?.nameManual;
      delete createData?.pixelIdManual;
      delete createData.collectionOptions;
      if( requestData.mode === "manual"){
      delete createData?.adAccount;
      }
      const res = await createPixelService(replaceNullWithString(createData));
        return json({ ...res })
    } else {
      const updateData: ICApi_MetaPixelUpdate = {
        ...requestData,
        name: requestData.mode === 'auto'? requestData.name : requestData.nameManual,
        pixelId: requestData.mode === 'auto'? requestData.pixelId : requestData.pixelIdManual,
        accessTokenFB: requestData.accessTokenFB
          ? requestData.accessTokenFB?.trim()
          : "",
        shop: shop,
        status: String(requestData.status).toLowerCase() === "true",
        isActiveCApi: String(requestData.isActiveCApi).toLowerCase() === "true",
        id: Number(params.id),
      };
      delete updateData.nameManual;
      delete updateData.pixelIdManual;
      const res = await updatePixelService(replaceNullWithString(updateData));
       return json({ ...res });
    }
  }
  return null;
}

export default function PixelForm() {
  const response = useActionData<typeof action>() as any;
  var formData = useLoaderData<typeof loader>();
  const [tokenFb, setTokenFb] = useState<string>(formData?.accessTokenFb || "");
  const [UsernameFb, setUserNameFb] = useState<string>(formData?.facebookName || "");
  const [UserAvatarFb, setUserAvatarFb] = useState<string>(formData?.facebookAvatar || "");

  const [selectedPixel, setSelectedPixel] = useState<string>();
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [accountOptions, setAccountOptions] = useState<ISelectSource[]>([]);
  const [accountSource, setAccountSource] = useState<any>();
  const [pixelOptions, setPixelOptions] = useState<ISelectSource[]>([]);
  const [errorCodeFb, setErrorCodeFb] = useState(200);
  const [isTestEventCode, setIsTestEventCode] = useState<boolean>(formatedData?.testEventCode ? false : true);

  const _getBussinessSource = useCallback(async (_tokenFb: string) => {
    const res = await getBussinessSource(_tokenFb);
    if (res.isSuccessful == true) {
      setErrorCodeFb(200);
      
      if (res?.result?.businesses) {
        setAccountSource(res.result);
        setAccountOptions(mapViewAccount(res.result));
  
        setFormState((prev)=>({ ...prev, adAccount: mapViewAccount(res.result)[0].value }));
        setSelectedAccount(mapViewAccount(res.result)[0].value);
        const selectedBusinessData =
          res &&
          res.result.businesses.data.find(
            (business: any) => business.id === res.result.businesses.data[0].id
          );
  
        if (selectedBusinessData && selectedBusinessData.adspixels) {
          setPixelOptions(mapViewPixel(selectedBusinessData));
          const businessDataName = mapViewPixel(selectedBusinessData)[0].label.split('-')
          setFormState((prev) => ({
            ...prev,
            pixelId: formData?.pixelData?.id ? formData?.pixelData?.pixelId : mapViewPixel(selectedBusinessData)[0].value,
            name: formData?.pixelData?.id ? formData?.pixelData?.name : businessDataName[businessDataName.length - 1],
          }));
        }
      }
    }
    else {
      setErrorCodeFb(res.result);
    }
  }, []);

  const onChangeAccountBussiness = (value: string) => {
    setSelectedAccount(value);

    const selectedBusinessData =
      accountSource &&
      accountSource.businesses.data.find(
        (business: any) => business.id === value
      );
    if (selectedBusinessData && selectedBusinessData.adspixels) {
      setPixelOptions(mapViewPixel(selectedBusinessData));
    }
  };

  useEffect(() => {
    if (formState.mode == "auto") {
      _getBussinessSource(tokenFb);
    }
  }, [_getBussinessSource, tokenFb]);

  //Conversions API enabled
  const [enabledConversionsApi, setEnabledConversionsApi] = useState(false);
  const handleToggleConversionsApi = useCallback(
    () =>
      setEnabledConversionsApi(
        (enabledConversionsApi) => !enabledConversionsApi
      ),
    []
  );


  var formatedData = formData?.pixelData
    ? {
      ...formData?.pixelData,
      lstEvents: JSON.parse(formData?.pixelData?.lstEvents),
      lstCollects:
        formData?.pixelData?.targetArea === "collections"
          ? formData?.pixelData?.lstCollects.split(",")
          : null,
      lstProducts:
      formData?.pixelData?.targetArea === "products"
        ? formData?.pixelData?.lstProducts.split(",")
        : null,
      nameManual:formData?.pixelData?.mode === 'manual' && formData?.pixelData?.name,
      pixelIdManual:formData?.pixelData?.mode === 'manual' && formData?.pixelData?.pixelId
    }
    : {
      // ...formData,
      mode: formData?.mode,
      status: true,
      targetArea: formData?.targetArea,
      lstEvents: formData?.lstEvents,
      platform:"facebook"
    };
  delete formatedData.id;
  const [formState, setFormState] = useState<IFormState>(formatedData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCollection, setSelectedCollections] = useState<string[]>([]);
  const [selectedProduct, setSelectedProducts] = useState<string[]>([]);
  const [inputTarget, setInputTarget] = useState("all");
  const [cleanFormState, setCleanFormState] = useState<IFormState>(formatedData);
  const [isFormChange, setIsFormChange] = useState<boolean>(false);

  const isDirty: boolean =
    JSON.stringify(formState) !== JSON.stringify(cleanFormState);
  const nav = useNavigation();
  const isSaving: boolean =
    nav.state === "submitting" && nav.formData?.get("action") !== "delete";
  const isDeleting: boolean =
    nav.state === "submitting" && nav.formData?.get("action") === "delete";

  const navigate = useNavigate();
  const submit = useSubmit();

  const buttonRef = useRef(null);

  function handleBackOrCancel() {
    if (isDirty){
      return setIsFormChange(true)
    }else{
      const element:any = document.getElementById('my-save-bar');
      element.hide()
      return navigate("/app/pixel-manager");
    }
    // return isDirty ? setIsFormChange(true) : navigate("/app/pixel-manager");
  }

  function handleSave() {
    setIsSubmitting(true);
    // if (
    //   !isDirty ||
    //   isSaving ||
    //   isDeleting ||
    //   (enabledConversionsApi && !formState.accessTokenFB) ||
    //   !formState.pixelId ||
    //   !formState.name
    // ) {
    //   return;
    // }
    const data: IFormState = {
      ...formState,
      name: formState?.name?.trim() || "",
      pixelId: formState?.pixelId?.trim() || "",
      testEventCode: formState.testEventCode
        ? formState?.testEventCode?.trim()
        : "",
    };
    // setCleanFormState({ ...formState });
    const formatedData = {
      ...data,
      lstEvents: JSON.stringify(data.lstEvents),
      lstCollects:
        data.lstCollects && data.lstCollects.length > 0
          ? data.lstCollects?.join(",")
          : null,
    };
    setIsFormChange(false);
    submit(jsonToFormData(formatedData), { method: "post" });
  }
  let statusTokenFB;
  // console.log('codddd', errorCodeFb)
  if (UsernameFb && errorCodeFb == 200) {
    statusTokenFB = "connected";
  } else if (errorCodeFb == 190) {
    statusTokenFB = "token expired";
  } else {
    statusTokenFB = "disconnected";
  }
  // let labelButtonFB;
  // if (!UsernameFb) {
  //   labelButtonFB = "Login with Facebook";
  // } else if (errorCodeFb == 190) {
  //   labelButtonFB = "Reconnect";
  // } else {
  //   labelButtonFB = "loading...";
  // }

  //Error Change
  const [removeError, setRemoveError] = useState({
    pixelId: undefined,
    adAccount: undefined,
    name: undefined,
    nameManual:undefined,
    pixelIdManual:undefined,
    accessTokenFB: undefined,
    testEventCode: undefined
  });

  useEffect(() => {
    if(response?.isSuccessful){
      const element:any = document.getElementById('my-save-bar');
      element.hide();
      navigate(`/app/pixel-manager?isPixelSuccessful=${formData?.pixelData ? false : true}`);
    }
    if(response?.errors || response?.message){
      setRemoveError({
        ...removeError,
        adAccount: response?.errors?.adAccount,
        pixelId: response?.errors?.pixelId || (formState.mode === "auto" && response?.message),
        name: response?.errors?.title,
        nameManual:response?.errors?.nameManual,
        pixelIdManual:response?.errors?.pixelIdManual || (formState.mode === "manual" && response?.message),
        accessTokenFB: response?.errors?.accessTokenFB,
        testEventCode: response?.errors?.testEventCode
      });
    }
  }, [response])

  const handleLogout = () => {
    const data = {
      action: 'logout_fb'
    }
    submit(data, { method: "post" });
    setTokenFb('')
    setUserNameFb('')
    setUserAvatarFb('')
    setPixelOptions([])
    setAccountOptions([])
    setFormState({ ...formState, name: '' })
  }

  const [enabled, setEnabled] = useState(formState.isActiveCApi || false);

  const handleToggle = useCallback(() => { setEnabled((enabled) => { setFormState((prev)=>({...prev, isActiveCApi: !enabled,})); return !enabled}); }, []);
  // useEffect(() => {
  //   if (formState.mode === "auto") {
  //     setFormState
  //       ({
  //         ...formState, isActiveCApi: enabled,
  //       })
  //   }
  // }
  //   , [enabled])

  const contentStatus = enabled ? 'Turn off' : 'Turn on';

  const toggleId = 'setting-toggle-uuid';
  const descriptionId = 'setting-toggle-description-uuid';

  const { mdDown } = useBreakpoints();

  const badgeStatus = enabled ? 'success' : undefined;

  const badgeContent = enabled ? 'On' : 'Off';

  const title = 'Conversion API enable';
  const description =
    'Use the server-side API to track all customer actions, bypassing browser restrictions and ad-blockers.';

  const settingStatusMarkup = (
    <Badge
      tone={badgeStatus}
      toneAndProgressLabelOverride={`Setting is ${badgeContent}`}
    >
      {badgeContent}
    </Badge>
  );

  const helpLink = (
    <Tooltip content="A solution for enhancing tracking events">
          <Button variant="plain" icon={InfoIcon} accessibilityLabel="Learn more" />
    </Tooltip>
  );

  const settingTitle = title ? (
    <InlineStack gap="200" wrap={false}>
      <InlineStack gap="200" align="start" blockAlign="baseline">
        <label htmlFor={toggleId}>
          {/* <Text variant="headingMd" as="h6">
            {title}
          </Text> */}
          <p>{title}</p>
        </label>
        <InlineStack gap="200" align="center" blockAlign="center">
          {settingStatusMarkup}
          {helpLink}
        </InlineStack>
      </InlineStack>
    </InlineStack>
  ) : null;

  const actionMarkup = (
    <Button
      role="switch"
      id={toggleId}
      ariaChecked={enabled ? 'true' : 'false'}
      onClick={handleToggle}
      size="slim"
    >
      {contentStatus}
    </Button>
  );

  const headerMarkup = (
    <Box width="100%">
      <InlineStack
        gap="1200"
        align="space-between"
        blockAlign="start"
        wrap={false}
      >
        {settingTitle}
        {!mdDown ? (
          <Box minWidth="fit-content">
            <InlineStack align="end">{actionMarkup}</InlineStack>
          </Box>
        ) : null}
      </InlineStack>
    </Box>
  );

  const descriptionMarkup = (
    <BlockStack gap="400">
      <Text id={descriptionId} variant="bodyMd" as="p" tone="subdued">
        {description}
      </Text>
      {mdDown ? (
        <Box width="100%">
          <InlineStack align="start">{actionMarkup}</InlineStack>
        </Box>
      ) : null}
    </BlockStack>
  );

  const nameManualOrAuto =  formState.mode === 'auto' ? formState.name : formState.nameManual
  const errorNameManualOrAuto =  formState.mode === 'auto' ? removeError.name : removeError.nameManual

  //Turn on save bar
  useEffect(()=>{
    const element:any = document.getElementById('my-save-bar');
    element.show()

    const handleBackButton = () => {
      element.hide()
    };
    
    // Listen to popstate event
    window.addEventListener('popstate', handleBackButton);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  },[])

  const handleDisCard = ()=>{
    const element:any = document.getElementById('my-save-bar');
    element.hide();
    navigate("/app/pixel-manager");
 }
  return (
    <Page
      backAction={{
        content: "Settings",
        onAction: handleBackOrCancel,
      }}

      // primaryAction={{
      //   content: "Save",
      //   loading: isSaving,
      //   disabled:
      //     !isDirty ||
      //     isSaving ||
      //     isDeleting ||
      //     (enabledConversionsApi && !formState.accessTokenFB) ||
      //     ( formState.mode === 'auto' && (!formState.pixelId ||!formState.name)) || 
      //     ( formState.mode === 'manual' && (!formState.pixelIdManual || !formState.nameManual)),
      //   onAction: handleSave,
      // }}
      // secondaryActions={[
      //   {
      //     content: "Cancel",
      //     loading: isDeleting,
      //     // disabled: !formData.id || !formData || isSaving || isDeleting,
      //     // destructive: true,
      //     outline: true,
      //     onAction: handleBackOrCancel,
      //   },
      // ]}
      title={
        formData?.pixelData?.id
          ? "Pixel manager / Edit pixel"
          : "Pixel manager / Create pixel"
      }
    >

      {/* Congratulations */}
      {/* <form data-save-bar data-discard-confirmation 
            onReset={()=>navigate("/app/pixel-manager")} 
            onSubmit={(event)=>{ event.preventDefault(); handleSave();}}> */}

      <ui-save-bar id="my-save-bar">
        <button 
        variant="primary" 
        id="save-button"  
        disabled=
        {
          !isDirty ||
          isSaving ||
          isDeleting ||
          (enabledConversionsApi && !formState.accessTokenFB) ||
          ( formState.mode === 'auto' && (!formState.pixelId ||!formState.name)) || 
          ( formState.mode === 'manual' && (!formState.pixelIdManual || !formState.nameManual))
        }
        loading
        onClick={handleSave}
          ></button>
        <button id="discard-button" onClick={handleDisCard}></button>
      </ui-save-bar>  
      <Modal
        activator={buttonRef}
        open={isFormChange}
        title="Save changes"
        // titleHidden
        onClose={() => setIsFormChange(false)}
        primaryAction={{
          content: "Save changes",
          onAction: handleSave,
        }}
        secondaryActions={[
          {
            content: "Leave without saving",
            onAction: () => {
              const element:any = document.getElementById('my-save-bar');
              element.hide()
              navigate("/app/pixel-manager")
            }
          },
        ]}
      >
        <Modal.Section>
          <p>
            Your pixel has unsaved changes. Changes will be lost if you leave without saving.
          </p>
        </Modal.Section>
      </Modal>

      <Layout>
        <Layout.Section>
          <BlockStack>
            <Card>
              <Grid key={1}>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                  <Text variant="headingLg" as="h5">
                    Pixel config
                  </Text>
                  <div className="pt-1 pb-1 flex gap-3 items-center justify-start">
                    <span>Status</span>
                    <Switch
                      onChange={
                        (status: boolean) =>
                          setFormState({ ...formState, status })
                      }
                      checked={formState.status}
                      onColor="#86d3ff"
                      onHandleColor="#2693e6"
                      uncheckedIcon={true}
                      checkedIcon={true}
                      height={15}
                      width={33}
                    />
                  </div>
                </Grid.Cell>
              </Grid>
              {
                // formData?.pixelData?.id ? false :
                <BlockStack>
                  <div className="flex gap-5 mb-3">
                    <RadioButton
                      disabled={formData?.pixelData?.id && formData?.pixelData?.mode !== "manual" ? true : false}
                      label="Manual input pixel"
                      id="manual"
                      name="type"
                      // disabled={formData.actionMode !== "new"}
                      checked={formState.mode === "manual"}
                      onChange={() => {
                        setFormState({
                          ...formState,
                          mode: "manual",
                          // accessTokenFB: "",
                          // testEventCode: ""
                          // pixelId: "",
                          // name: ""
                        });
                        setRemoveError({
                          ...removeError,
                          accessTokenFB: undefined,
                          testEventCode: undefined
                        });
                      }}
                    />
                    <RadioButton
                      disabled={formData?.pixelData?.id && formData?.pixelData?.mode !== "auto" ? true : false}
                      label="Auto input pixel"
                      checked={formState.mode === "auto"}
                      id="auto"
                      name="type"
                      // disabled={formData.actionMode !== "new"}
                      onChange={() => {
                        // setFormState({ ...formState, mode: "auto", name: "" });
                        setFormState({ ...formState, mode: "auto" });
                        setRemoveError({
                          ...removeError,
                          accessTokenFB: undefined,
                          testEventCode: undefined
                        }); 
                      }}
                    />
                  </div>
                </BlockStack>
              }

              {
                formState.mode === "auto" ?

                  <BlockStack>
                    {formData?.accessTokenFb && errorCodeFb === 200 ?
                      !formData?.pixelData?.id &&
                      <div className="max-w-[400px]">
                        <button type="button" className="custom-button-facebook transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300  text-white font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2" onClick={handleLogout}>Logout Facebook</button>
                      </div>
                      :
                      <div className="max-w-[400px]">
                        <FacebookLoginComp
                          shop={formData.shopName || ''}
                          setTokenFb={setTokenFb}
                          setUserNameFb={setUserNameFb}
                          setUserAvatarFb={setUserAvatarFb}
                          labelButton="Login with Facebook"
                        />
                      </div>}
                    <div className="w-1/2">
                      <Card padding='0'>
                        <ResourceList
                          resourceName={{
                            singular: "customer",
                            plural: "customers",
                          }}
                          items={[
                            {
                              id: "145",
                              url: "#",
                              avatarSource: UserAvatarFb || "",
                              // "https://burst.shopifycdn.com/photos/freelance-designer-working-on-laptop.jpg?width=746",
                              name: UsernameFb || "No name",
                              status: statusTokenFB,
                            },
                          ]}
                          renderItem={(item) => {
                            const { id, url, avatarSource, name, status } = item;

                            return (
                              <ResourceItem
                                id={id}
                                url={url}
                                media={
                                  <Avatar
                                    customer
                                    size="md"
                                    name={name}
                                    source={avatarSource}
                                  />
                                }
                                accessibilityLabel={`View details for ${name}`}
                                name={name}
                              >
                                <Text variant="bodyMd" fontWeight="bold" as="h3">
                                  {name}
                                </Text>
                                <div>{status}</div>
                              </ResourceItem>
                            );
                          }}
                        />
                      </Card>
                    </div>
                  </BlockStack> : false
              }
              <div className="my-5">
                <BlockStack>
                  <TextField
                    id="name"
                    // helpText="Only store staff can see this title"
                    label={
                      <div>
                        <strong>Pixel Name</strong><span className="text-red-700"> {"*"}</span>
                      </div>
                    }
                    autoComplete="off"
                    value={nameManualOrAuto}
                    error={errorNameManualOrAuto}
                    onChange={(name) => {
                      if (formState.mode === 'auto') {    
                        setFormState({ ...formState, name })
                      }else{
                        setFormState({ ...formState, nameManual:name })

                      }
                      setRemoveError({ ...removeError, nameManual: undefined });
                    }}
                    placeholder="Pixel Name facilitate easier pixel management"
                  />
                </BlockStack>
              </div>
              <BlockStack>
                {formState.mode === "manual" ? (
                  <div className="flex flex-col gap-3">
                    <BlockStack>
                      <TextField
                        id="pixelId"
                        // helpText="Only store staff can see this title"
                        label={
                          <div>
                            <strong>Facebook Pixel ID</strong>
                            <span className="text-red-700">
                              {" "}
                              {"*"}
                              <Link
                                url={videoConfig.setupMetaPixel}
                                target="_blank"
                              >
                                {" "}
                                How to get it?{" "}
                              </Link>
                            </span>
                          </div>
                        }
                        autoComplete="off"
                        type="text"
                        // disabled={formData.actionMode !== "new"}
                        value={formState.pixelIdManual}
                        onChange={(pixelIdManual) => {
                          setFormState({ ...formState, pixelIdManual })
                          setRemoveError({ ...removeError, pixelIdManual: undefined });
                        }}
                        disabled={formData?.pixelData?.id ? true : false}
                        error={removeError?.pixelIdManual}
                        placeholder="Get the pixel ID from Facebook, then copy and paste it here."
                      />
                      {/* {error?.errorCode == "409" && (
                        <InlineError
                          message={ || ""}
                          fieldID={error.errorCode}
                        />
                      )} */}
                    </BlockStack>
                  </div>) :
                  (<div className="flex flex-col gap-3">

                    {

                      <BlockStack>
                        <Select
                          label={<strong>Select Business Account</strong>}
                          options={accountOptions}
                          onChange={(value) => {
                            // setFormState({ ...formState, adsAccountId: value });
                            onChangeAccountBussiness(value);
                          }}
                          value={selectedAccount}
                          disabled={formData?.pixelData?.id ? true : false}
                        />
                      </BlockStack>

                    }

                    <BlockStack>
                      <Select
                        label={<strong>Select Facebook Pixel ID</strong>}
                        options={pixelOptions}
                        onChange={(pixelId) => {
                          let pixelName: any;
                          pixelOptions.forEach((pixel) => {
                            if (pixel.value == pixelId) {
                              pixelName = pixel.label.split('-')
                              pixelName = pixelName[pixelName.length - 1]
                              return;
                            }
                          })
                          setSelectedPixel(pixelId);
                          setFormState({ ...formState, pixelId, name: pixelName });
                          setRemoveError({ ...removeError, pixelId: undefined });
                        }}
                        value={formState.pixelId}
                        disabled={formData?.pixelData?.id ? true : false}
                        error={removeError.pixelId}
                      />
                    </BlockStack>
                  </div>)

                }
              </BlockStack>
              <div className="my-5">
                <BlockStack>
                  <Select
                    label={<strong>Target Area</strong>}
                    options={targetOptions}
                    onChange={(value) => {
                      setInputTarget(value);
                      setFormState({ ...formState, targetArea: value });
                    }}
                    value={formState.targetArea}
                  />
                  {formState.targetArea === "collections" && (
                    <div className="p-2 my-2">
                      <MultipleSelectBox
                        listOptions={formData.collectionOptions || []}
                        handleChangeOptions={(value) =>
                          setFormState({ ...formState, lstCollects: value })
                        }
                        selectedOptions={formState.lstCollects || []}
                        setSelectedOptions={setSelectedCollections}
                        isShowTag={true}
                        placeholder="Please choose collections"
                      />
                    </div>
                  )}
                  {formState.targetArea === "products" && (
                    <div className="p-2 my-2">
                      <SelectBoxProduct
                        listOptions={formData.productOptions || []}
                        handleChangeOptions={(value) =>
                          setFormState({ ...formState, lstProducts: value })
                        }
                        selectedOptions={formState.lstProducts || []}
                        setSelectedOptions={setSelectedProducts}
                        isShowTag={true}
                        placeholder="Please choose Products"
                      />
                    </div>
                  )}
                </BlockStack>
              </div>
            </Card>
          </BlockStack>
        </Layout.Section>
        <Layout.Section>
          <BlockStack>
            <Card>
              <Grid key={2}>
                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                  <Text variant="headingLg" as="h5">
                    Server side config
                  </Text>
                </Grid.Cell>
              </Grid>
              {/* {
                formState.mode === "auto" ? */}
                  <div className="py-2">
                    <BlockStack gap={{ xs: '400', sm: '500' }}>
                      <Box width="100%">
                        <BlockStack gap={{ xs: '100', sm: '300' }}>
                          {headerMarkup}
                          {descriptionMarkup}
                        </BlockStack>
                      </Box>
                    </BlockStack>
                    <div className="my-5">
                      <TextField
                        disabled={!formState.isActiveCApi}
                        id="accessTokenFB"
                        label={
                          formState.isActiveCApi ? (
                            <div>
                              <strong>Facebook Access Token</strong>
                              <span className="text-red-700">
                                {" "}
                                {"*"}{" "}
                                <Link
                                  url={videoConfig.generateAccessToken}
                                  target="_blank"
                                >
                                  {" "}
                                  How to get it?{" "}
                                </Link>
                              </span>
                            </div>
                          ) : (
                            <strong>Facebook Access Token</strong>
                          )
                        }
                        autoComplete="off"
                        value={formState.accessTokenFB}
                        onChange={(accessTokenFB) => {
                          setFormState({ ...formState, accessTokenFB })
                          setRemoveError({ ...removeError, accessTokenFB: undefined });
                        }}
                        error={removeError.accessTokenFB}
                      />
                    </div>
                    <div className="my-5">
                        {
                          isTestEventCode ?
                          <Button icon={PlusIcon} variant="plain" onClick={()=>setIsTestEventCode(!isTestEventCode)}>Test server side event</Button>
                          :
                            <TextField
                              disabled={!formState.isActiveCApi}
                              id="testEventCode"
                               // helpText="Use this if you need to test the Server-Side Event. Remove it After Testing. The limit is not more than 10 characters. Example: TEST12345"
                              helpText={
                              <div>
                                <div className=" flex justify-between gap-3">
                                  <Text as="p">Use this if you need to test Server-Side Events. Please remove it after testing. <Box as="span" color="text-critical">If you don't remove it, Facebook will not store your events.</Box></Text>
                                  <div className="flex-shrink-0 flex-grow-0">
                                    <Button tone="critical" onClick={()=>{
                                      setIsTestEventCode(!isTestEventCode)
                                      setFormState({ ...formState, testEventCode:"" })
                                      }}>Delete
                                    </Button>
                                  </div>
                                  
                                </div>
                                  { formState.mode === "auto" && formState.isActiveCApi && formState.pixelId && selectedAccount &&
                                    <Button url={`https://business.facebook.com/events_manager2/list/dataset/${formState.pixelId}/test_events?business_id=${selectedAccount}`} target="_blank" icon={ArrowRightIcon}>Get Test Event Code</Button>
                                  }
                              </div>}
                              label={
                                <span>
                                  <strong>Test Event Code</strong>{" "}
                                  <Link
                                    url={videoConfig.testEventCode}
                                    target="_blank"
                                  >
                                    {" "}
                                    How to get it?{" "}
                                  </Link>
                                </span>
                              }
                              autoComplete="off"
                              error={response?.errors?.testEventCode}
                              // error={formState.testEventCode && enabledConversionsApi && isSubmitting ? "Test Event Code is required" : ""}
                              value={formState.testEventCode}
                              onChange={(testEventCode) => {
                                 setFormState({ ...formState, testEventCode })
                                 setRemoveError({ ...removeError, testEventCode: undefined });
                              }}
                            />
                        }
                    </div>
                  </div>
                   {/* :
                  <Grid key={3}>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                      <TextField
                        disabled={!formState.isActiveCApi}
                        id="accessTokenFB"
                        // helpText="Only store staff can see this title"
                        label={
                          formState.isActiveCApi ? (
                            <div>
                              <strong>Facebook Access Token</strong>
                              <span className="text-red-700">
                                {" "}
                                {"*"}{" "}
                                <Link
                                  url="https://zotek.gitbook.io/facebook-multiple-pixel/getting-started/get-your-pixels-ready"
                                  target="_blank"
                                >
                                  {" "}
                                  How to get it?{" "}
                                </Link>
                              </span>
                            </div>
                          ) : (
                            <strong>Facebook Access Token</strong>
                          )
                        }
                        autoComplete="off"
                        value={formState.accessTokenFB}
                        onChange={(accessTokenFB) => {
                          setFormState({ ...formState, accessTokenFB })
                          setRemoveError({ ...removeError, accessTokenFB: undefined });
                        }}
                        error={removeError.accessTokenFB}
                      />
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                      <TextField
                        disabled={!formState.isActiveCApi}
                        id="testEventCode"
                        helpText="Use this if you need to test the Server-Side Event. Remove it After Testing. The limit is not more than 10 characters. Example: TEST12345"
                        label={
                          <span>
                            <strong>Test Event Code</strong>{" "}
                            <Link
                              url="https://zotek.gitbook.io/facebook-multiple-pixel/getting-started/get-your-pixels-ready/test-events"
                              target="_blank"
                            >
                              {" "}
                              How to get it?{" "}
                            </Link>
                          </span>
                        }
                        autoComplete="off"
                        error={response?.errors?.testEventCode}
                        // error={formState.testEventCode && enabledConversionsApi && isSubmitting ? "Test Event Code is required" : ""}
                        value={formState.testEventCode}
                        onChange={(testEventCode) => {
                          setFormState({ ...formState, testEventCode })
                          setRemoveError({ ...removeError, testEventCode: undefined });
                        }}
                      />
                    </Grid.Cell>
                  </Grid>
              } */}
            </Card>
          </BlockStack>
        </Layout.Section>
        <Layout.Section>
          <BlockStack>
            <Card>
              <BlockStack>
                <div className="">
                  <Box as="div" paddingBlockEnd='300'>
                    <Text variant="headingLg" as="h5">
                      Events
                    </Text>
                  </Box>
                  <Grid>
                    {Object.keys(EVENT_LIST_DEFAULT).map((eventName) => {
                      const event = EVENT_LIST_DEFAULT[eventName];
                      // Conditionally render select box only if view is true
                      const shouldRenderSelect = event.isHasVariant === true;
                      return (
                        <Fragment key={eventName}>
                          <Grid.Cell
                            columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                          >
                            <Checkbox
                              label={eventName}
                              checked={
                                formState.lstEvents?.[eventName]?.isActive ||
                                false
                              }
                              onChange={() =>
                                setFormState((prevState: any) => ({
                                  ...prevState,
                                  lstEvents: {
                                    ...prevState.lstEvents,
                                    [eventName]: {
                                      ...prevState.lstEvents?.[eventName],
                                      isActive:
                                        !prevState.lstEvents?.[eventName]
                                          ?.isActive,
                                    },
                                  },
                                }))
                              }
                            />
                          </Grid.Cell>
                          {shouldRenderSelect && (
                            <Grid.Cell
                              columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}
                            >
                              <Select
                                label=""
                                options={eventOptions}
                                onChange={(value: string) =>
                                  setFormState((prevState: any) => ({
                                    ...prevState,
                                    lstEvents: {
                                      ...prevState.lstEvents,
                                      [eventName]: {
                                        ...prevState.lstEvents?.[eventName],
                                        variant: value,
                                      },
                                    },
                                  }))
                                }
                                value={
                                  formState.lstEvents?.[eventName]?.variant ||
                                  ""
                                }
                              />
                            </Grid.Cell>
                          )}
                        </Fragment>
                      );
                    })}
                  </Grid>
                </div>
              </BlockStack>
              {/* [END title] */}
            </Card>
          </BlockStack>
        </Layout.Section>
        {/* [START actions] */}
        <Layout.Section>
          <div className="flex">
            <PageActions
              // secondaryActions={[
              //   {
              //     content: "Cancel",
              //     loading: isDeleting,
              //     // disabled: !formData.id || !formData || isSaving || isDeleting,
              //     // destructive: true,
              //     outline: true,
              //     onAction: handleBackOrCancel,
              //   },
              // ]}
              primaryAction={{
                content: "Save",
                loading: isSaving,
                disabled:
                !isDirty ||
                isSaving ||
                isDeleting ||
                (enabledConversionsApi && !formState.accessTokenFB) ||
                ( formState.mode === 'auto' && (!formState.pixelId ||!formState.name)) || 
                ( formState.mode === 'manual' && (!formState.pixelIdManual || !formState.nameManual)),
                onAction: handleSave,
              }}
            />
            {/* <div className="ml-auto mb-2"><Button submit variant="primary">Save</Button></div> */}
          </div>
        </Layout.Section>

        {/* [END actions] */}
      </Layout>

      {/* </form> */}

    </Page>
  ); // [END polaris]
}