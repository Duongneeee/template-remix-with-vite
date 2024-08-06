import { useSubmit } from "@remix-run/react";
import { Avatar, Button, ButtonGroup, Card, ResourceItem, ResourceList, Select, Text, TextField } from "@shopify/polaris"
import { useCallback, useEffect, useState } from "react";
import { getBussinessSource, getCatalogFb } from "~/backend/external_apis/facebook/facebook.service";
import { ISelectSource } from "~/backend/external_apis/facebook/facebook.types";
import { mapViewAccount, mapViewCatalog } from "~/backend/external_apis/facebook/facebook.utils";
import { lstSchedule } from "~/constants/options";
import { validateStepTwo } from "~/utils";

interface IStepTwoProps {
    formData?:any
    formState: any
    removeError?: any
    setFormState: (prev:any)=> void
    setRemoveError?: () => void
    UserAvatarFb?: string
    UsernameFb?: string
    setTokenFb: (prev:any)=> void
    setUserNameFb: (prev:any)=> void
    setUserAvatarFb: (prev:any)=> void
    setStandStep: (prev:any)=> void
    stateLoginFB?: boolean
    setStateLoginFB?: (prev:any)=> void
}

const StepTwo = (props:IStepTwoProps) => {
    const {
        formData,
        formState, 
        setFormState,
        // setRemoveError,
        // removeError,
        UserAvatarFb,
        UsernameFb,
        setStandStep,
        stateLoginFB,
    } = props;

    const productFeedData = formData.productFeedData;
    const [accountOptions, setAccountOptions] = useState<ISelectSource[]>([]);
    const [catalogOptions, setCatalogOptions] = useState<ISelectSource[]>([]);
    const [errorCodeFb, setErrorCodeFb] = useState(200);

    const _getBussinessSource = useCallback(async (_tokenFb: string) => {
        const res = await getBussinessSource(_tokenFb);
        if (res.isSuccessful == true) {
          setErrorCodeFb(200);
          if (res?.result?.businesses) {
            setAccountOptions(mapViewAccount(res.result));
      
            setFormState((prev:any)=>({ ...prev, adAccount: mapViewAccount(res.result)[0].value }));
            const selectedBusinessData =
              res &&
              res.result.businesses.data.find(
                (business: any) => business.id === res.result.businesses.data[0].id
              );
      
            const req = await getCatalogFb({
              access_token: _tokenFb,
              adAccount: selectedBusinessData.id,
            });
            // console.log("req", req);
            if (req) {
              setErrorCodeFb(200);
              setCatalogOptions(mapViewCatalog(req));
              setFormState((prev:any)=>({ ...prev, catalog: mapViewCatalog(req)[0].value}));
            }
          }
        } else {
          setErrorCodeFb(res.result);
        }
      }, []);
    
      const onChangeAccountBussiness = async (value: string) => {
        try {
          setFormState((prev:any)=>({ ...prev, adAccount: value }));
          const req = await getCatalogFb({
            access_token: formData.accessTokenFb,
            adAccount: value,
          });
          if (req) {
            setCatalogOptions(mapViewCatalog(req));
            setFormState((prev:any)=>({ ...prev, catalog: mapViewCatalog(req)[0].value}));
          }else{
            setCatalogOptions([]);
            setFormState((prev:any)=>({ ...prev, catalog: ''}));
          }
        } catch (error) {
            setCatalogOptions([]);
            setFormState((prev:any)=>({ ...prev, catalog: ''}));
        }

        // const selectedBusinessData =
        //   accountSource &&
        //   accountSource.businesses.data.find(
        //     (business: any) => business.id === value
        //   );
        // if (selectedBusinessData && selectedBusinessData.adspixels) {
        //   setPixelOptions(mapViewPixel(selectedBusinessData));
        // }
      };
      useEffect(() => {
        if(stateLoginFB){
          _getBussinessSource(formData.accessTokenFb);
        }
      }, [_getBussinessSource, formData.accessTokenFb]);
      var formatedData;
      if (typeof productFeedData !== "undefined") {
        formatedData = {
          ...productFeedData,
          rule: JSON.parse(productFeedData.rule),
        };
      }
    
      let statusTokenFB;
      if (UsernameFb && errorCodeFb == 200) {
        statusTokenFB = "connected";
      } else if (errorCodeFb == 190) {
        statusTokenFB = "token expired";
      } else {
        statusTokenFB = "disconnected";
      }
    
      // const handleLogout = () => {
      //   const data = {
      //     action: 'logout_fb'
      //   }
      //   submit(data, { method: "post" });
      //   setTokenFb('')
      //   setUserNameFb('')
      //   setUserAvatarFb('')
      //   setCatalogOptions([])
      //   setAccountOptions([])
      //   // setFormState({ ...formState, name: '' })
      // }

      const [removeError,setRemoveError] = useState(
          {
            adAccount:undefined, 
            catalog:undefined,
            name:undefined,
          });

      const handleNext = ()=>{
        const errors = validateStepTwo(formState, stateLoginFB);
        if(errors){
          setRemoveError({adAccount:errors.adAccount,catalog:errors.catalog,name:errors.name})
        }else{
          setStandStep((prev:number)=>(prev += 1))
        }
      }

      const handlePrevious = ()=>{
        setFormState({ ...formState, catalog: "", adAccount:""})
        setStandStep((prev:number)=>(prev -= 1))
      }
    return <div>
        <Card>
        <div className="flex justify-end"><Text as="p" fontWeight="semibold" variant="bodyLg">2/4</Text></div>

        {
            stateLoginFB &&
            <>
                <div className="my-3">
                    <div className="rounded-md w-1/2">
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
                            status: "Connected",
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
                </div>
                <div className="mb-3">
                <Select
                    label={<Text as="h3" variant="headingSm" >Select Business Account</Text>}
                    placeholder="Select Business Account"
                    options={accountOptions}
                    value={formState.adAccount}
                    onChange={(adAccount) =>
                    {
                        setFormState({ ...formState, adAccount })
                        onChangeAccountBussiness(adAccount)
                        setRemoveError({...removeError,adAccount:undefined})
                    }}
                    error={removeError?.adAccount}
                />
                </div>
                <div className="mb-3">
                <Select
                    label={<Text as="h3" variant="headingSm" >Select Catalog</Text>}
                    placeholder="Select Catalog"
                    options={catalogOptions}
                    value={formState.catalog}
                    onChange={(catalog) => {
                    setFormState({ ...formState, catalog })
                    setRemoveError({...removeError,catalog:undefined})
                    }}
                    error={removeError?.catalog}
                />
                </div>
            </>
        }    
        <div className="mb-3">
        <TextField
            id="name"
            label={<Text as="h3" variant="headingSm" >Product Feed Name</Text>}
            autoComplete="off"
            value={formState?.name}
            onChange={(name) => {
                setFormState({ ...formState, name })
                setRemoveError({...removeError,name:undefined})
            }}
            placeholder="Product Feed Name facilitate easier Catalog management"
            error={removeError?.name}
        />
        </div>
        <div className="mb-3">
        <Select
            label={<Text as="h3" variant="headingSm" >Schedule update</Text>}
            options={lstSchedule}
            value={formState?.schedule}
            onChange={(schedule) =>
                setFormState({ ...formState, schedule })
            }
        />
        </div>
        
        <div className="flex justify-end">
            <ButtonGroup>
                <Button onClick={handlePrevious}>Previous</Button>
                <Button variant="primary" onClick={handleNext}>Next</Button>
            </ButtonGroup>
        </div>
     </Card>
    </div>
}

export default StepTwo