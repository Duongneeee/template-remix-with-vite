
import { useSubmit } from "@remix-run/react"
import { Avatar, Button, ButtonGroup, Card, Modal, ResourceItem, ResourceList, Text } from "@shopify/polaris"
import { useCallback, useEffect, useState } from "react"
import { getBussinessSource } from "~/backend/external_apis/facebook/facebook.service"
import EmptyTableContent from "~/components/common/EmptyTableContent"
import FacebookLoginComp from "~/components/common/FacebookLoginComp"

interface IStepOneProps {
    formData?:any,
    // formState: any,
    removeError?: any,
    // setFormState: (prev:any)=> void,
    setRemoveError?: () => void,
    UserAvatarFb: string,
    UsernameFb: string,
    tokenFb:string,
    setTokenFb: (prev:any)=> void,
    setUserNameFb: (prev:any)=> void,
    setUserAvatarFb: (prev:any)=> void,
    setStandStep: (prev:any)=> void,
    stateLoginFB?: boolean
    setStateLoginFB: (prev:boolean)=> void
    FACEBOOK_APP_ID: string
}

const StepOne = (props:IStepOneProps) => {
    const {
        formData,
        // formState, 
        // setFormState,
        tokenFb,
        UserAvatarFb,
        UsernameFb,
        setTokenFb,
        setUserNameFb,
        setUserAvatarFb,
        setStandStep,
        setStateLoginFB,
        FACEBOOK_APP_ID
    } = props;
    const submit = useSubmit();
    const [stateToken, setStateToken] = useState(200);
    const handleSkip = ()=>{
        // setStateLoginFB(false)
        // setStandStep((prev:number)=>(prev += 1))
        setActive(!active)
    }

    const handleNext = ()=>{
        setStateLoginFB(true);
        setStandStep((prev:number)=>(prev += 1))
    }

    const validateToken = useCallback(async (tokenFb:string) =>{
        const res = await getBussinessSource(tokenFb);
        if (res.isSuccessful === true) {
            setStateToken(200);
        }else{
            setStateToken(res.result);
        }
    },[tokenFb])
    useEffect(()=>{  
        validateToken(tokenFb);
    },[validateToken,tokenFb])

    const [active, setActive] = useState(false);

  const handleModalSkip = useCallback(() => setActive(!active), [active]);
  const handleModalSkipOrYes = useCallback(() => {
    setStateLoginFB(false)
    setStandStep((prev:number)=>(prev += 1))
    setActive(!active)
    }, [active]);
    return <div>
        <Card>
        <div className="flex justify-end"><Text as="p" fontWeight="semibold" variant="bodyLg">1/4</Text></div>
            {
                tokenFb && stateToken === 200 ? 
                    <div className="flex flex-col items-center mt-3 gap-3"> 
                        <div className="rounded-md my-3 w-60">
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
                        <ButtonGroup>
                            <Button onClick={()=>{
                                const data = {
                                    action: 'logout_fb'
                                  }
                                submit(data, { method: "post" });
                                //  setStateToken(!stateToken);
                                 setTokenFb('');
                                 setUserNameFb('');
                                 setUserAvatarFb('');

                            }}>Logout</Button>
                            <Button variant="primary" onClick={handleNext}>Next</Button>
                        </ButtonGroup>
                    </div>
                    :
                    <EmptyTableContent image="https://d2qfs3b62dkzxt.cloudfront.net/images/productFeed.webp">
                        <div className="flex justify-center mt-3">
                            <FacebookLoginComp
                            shop={formData?.shopName || ''}
                            setTokenFb={setTokenFb}
                            setUserNameFb={setUserNameFb}
                            setUserAvatarFb={setUserAvatarFb}
                            labelButton="Login with Facebook"
                            FACEBOOK_APP_ID={FACEBOOK_APP_ID}
                            />
                        </div>
                    </EmptyTableContent>
            }

            <Modal
          activator={undefined}
          open={active}
          onClose={handleModalSkip}
          title="Skip login confirm"
          primaryAction={{
            content: 'No',
            onAction: handleModalSkip,
          }}
          secondaryActions={[
            {
              content: 'Yes',
              onAction: handleModalSkipOrYes,
            },
          ]}
        >
          <Modal.Section>
            <p className="my-2">If you skip the Facebook login, we will only be able to help you create a CSV file that includes your product configuration information. You will have to switch to the Facebook Commerce Manager screen to add products manually using our file.</p>
            <p className="mt-2">Do you want to continue skipping the login?</p>
          </Modal.Section>
            </Modal>
         <div className="flex justify-end mr-2"><Button variant="plain" onClick={handleSkip}>Skip</Button></div>
        </Card>
    </div>
}

export default StepOne