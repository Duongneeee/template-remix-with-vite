/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-duplicates */
import type { ActionFunctionArgs } from "@remix-run/node";
import { useSubmit, useActionData } from "@remix-run/react";
import {
  Card,
  Button,
  Page,
  List,
  Text,
  ButtonGroup,
  ProgressBar,
  Modal,
  SkeletonBodyText,
  SkeletonPage,
  Layout,
  LegacyCard,
  TextContainer,
  SkeletonDisplayText,
  InlineError,
  Box,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import {ExternalIcon,ArrowLeftIcon } from "@shopify/polaris-icons";
import SvgSuccess from "../svgs/SvgSuccess";
import SvgWarning from "../svgs/SvgWarning";

interface IHomeOnBoardingProps {
  shop: string
}
export default function HomeOnBoarding(props:IHomeOnBoardingProps) {
  const { shop } = props;
  let actionData:any = useActionData<ActionFunctionArgs>();

  const submit = useSubmit();

  const averageProgress = 100/3;
  const [identifystepOnBoarding,setIdentifyStepOnBoarding] = useState<number>(1);
  const [numberProgress, setNumberProgress] = useState(averageProgress);
  const [isButtonCreatePixel,setIsButtonCreatePixel] = useState(true);
  const [isThemeAppNextStep,setIsThemeAppNextStep] = useState(false);

  const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);

  const handleContinue = useCallback(()=>{
    if(identifystepOnBoarding === 1){
      setIsButtonCreatePixel(false)
      submit({action:'checkThemeApp'},{method:"post"})
      setIsThemeAppNextStep(true);
    }else if(identifystepOnBoarding === 2){
     setIsButtonCreatePixel(false)
     submit({action:'checkThemeApp'},{method:"post"})
    }else{
     setNumberProgress((prev)=>prev + averageProgress)
     setIdentifyStepOnBoarding(identifystepOnBoarding+1)
    }
   },[identifystepOnBoarding, averageProgress, setNumberProgress, setIdentifyStepOnBoarding, submit])

  const handleLater = useCallback(()=>{
    setNumberProgress((prev)=>prev + averageProgress)
    setIdentifyStepOnBoarding(identifystepOnBoarding+1)
    setActive(!active)
  },[averageProgress, identifystepOnBoarding,active, setActive, setNumberProgress, setIdentifyStepOnBoarding])

  useEffect(()=>{
    setIsButtonCreatePixel(true)
    if(isThemeAppNextStep){
      setIdentifyStepOnBoarding(identifystepOnBoarding+1)
      setNumberProgress((prev)=>prev + averageProgress)
      setIsThemeAppNextStep(false);
    }else{
      if(actionData && actionData?.isThemeApp === true){
        setNumberProgress((prev)=>prev + averageProgress)
        setIdentifyStepOnBoarding(identifystepOnBoarding+1)
       }
    }
   },[actionData])

  const handleCreateConfigOnboarding = ()=>{
    setIsButtonCreatePixel(false);
    submit({action:"createConfigOnboarding"},{method:"post"})
  }

  return (
    <Page>
      <Card>
        <div className="">
          { 
            identifystepOnBoarding > 1 &&
              <Button variant="tertiary" size="large" icon={ArrowLeftIcon} onClick={()=>{
                setNumberProgress((prev)=>Math.max(prev-averageProgress, averageProgress));
                setIdentifyStepOnBoarding(Math.max(identifystepOnBoarding-1,1 ))}} />
          }

          {
            identifystepOnBoarding === 1 &&
              <div className="h-96 mb-2 flex flex-col items-center justify-center">
                <img className="mb-3" src="https://d2qfs3b62dkzxt.cloudfront.net/images/Zotek.png" loading="lazy"/>
                <div className="mb-3"><Text variant="headingLg" as="h3">Welcome to Zotek</Text></div>
                <span className="mb-3">Let’s set up the <strong>important</strong> things first. We promise it will short and sweet</span>
              </div>
          }

          { 
            identifystepOnBoarding === 2 && 
              <div className="md:h-96 md:flex mb-2 md:items-center md:justify-around">
                {
                  isButtonCreatePixel === true ? 
                    <div className="mb-2">
                      <div className="mb-3"><Text variant="headingLg" as="h3">Add Zotek to your theme</Text></div>
                      <span className="mb-3">To get started, enable the <span className="font-semibold">Zotek Multiple Pixel</span> app on you Shopify theme</span>
                      <Box paddingBlock='300'>
                        <Card>
                          <div >
                          <List>
                            <List.Item>Click on the button bellow</List.Item>
                            <List.Item>Make sure “Zotek Mutiple Pixel” app in on</List.Item>
                            <List.Item>Click on “Save”</List.Item>
                          </List>
                          </div>
                          <Box as="div" paddingBlock='300'>
                            <ButtonGroup>
                                <Button 
                                  variant="primary" 
                                  url={`https://${shop}/admin/themes/current/editor?context=apps`} 
                                  icon={ExternalIcon} target="_blank"
                                  disabled={actionData?.isThemeApp ? true : false}
                                  >
                                    Enable now
                                </Button>
                              {/* <Button onClick={handleLater}>Later</Button> */}
                              <Modal
                                activator={<Button onClick={handleChange} disabled={actionData?.isThemeApp ? true : false}>Later</Button>}
                                open={active}
                                onClose={handleChange}
                                title="Skip adding Zotek to your theme"
                                primaryAction={{
                                  content: 'Later',
                                  onAction: handleLater,
                                }}
                                secondaryActions={[
                                  {
                                  content: 'Cancel',
                                  onAction: handleChange,
                                  },
                                  ]}
                              >
                                <Modal.Section>
                                    <Text as="span">
                                      If you skip this step, you will not be tracking events.
                                    </Text>
                                </Modal.Section>
                              </Modal>
                            </ButtonGroup>
                          </Box>
                          {
                            !actionData?.isThemeApp &&
                              <div>
                                <InlineError message={"Please turn on the theme app!"} fieldID={'errorThemeApp'} />
                              </div>
                          }
                        </Card>
                      </Box>
                    </div> 
                    :
                    <SkeletonPage primaryAction>
                      <Layout>
                        <Layout.Section>
                          <LegacyCard sectioned>
                            <TextContainer>
                                <SkeletonDisplayText size="small" />
                                <SkeletonBodyText />
                              </TextContainer>
                            </LegacyCard>
                        </Layout.Section>
                      </Layout>
                    </SkeletonPage>
                }

                {
                  isButtonCreatePixel === true ? 
                    <div className="max-w-md overflow-hidden mx-auto">
                      <Card>
                        <img src="https://d2qfs3b62dkzxt.cloudfront.net/images/themeAppOnboarding.webp" alt="" loading="lazy" />
                      </Card>
                    </div> :
                    <SkeletonPage primaryAction>
                    <Layout>
                        <Layout.Section>
                        <LegacyCard sectioned>
                          <TextContainer>
                            <SkeletonDisplayText size="small" />
                            <SkeletonBodyText />
                          </TextContainer>
                        </LegacyCard>
                        </Layout.Section>
                      </Layout>
                    </SkeletonPage>
                }
              </div>
          }

          {
            identifystepOnBoarding === 3 && (actionData?.isThemeApp === true?
              <div className="h-96 mb-2 flex flex-col items-center justify-center">
                <SvgSuccess/>
                <div className="text-center">
                <Text variant="headingMd" as="h4"><span>Congratulations you have completed the basic installation.</span><br/><span>Let's create your first pixel with Zotek Mutilple Pixel</span></Text>
                </div>
              </div>:
              <div className="h-96 mb-2 flex flex-col items-center justify-center">
                <SvgWarning/>
                <div className="text-center">
                  <Text variant="headingMd" as="h4"><span>Zotek app will only function properly once you activate the embedded app in your theme.</span><br/><span>Don't forget to enable it after successfully creating the Pixel!</span></Text>
                </div>
              </div>)
          }
         
         <div className="mb-2">
           <ProgressBar progress={numberProgress} size="small" tone="success"/>
         </div>
         <div className=" mt-4 flex justify-center">
          
          { 
            identifystepOnBoarding === 3 ? 
            <Button variant="primary" loading={!isButtonCreatePixel} onClick={handleCreateConfigOnboarding}>Create new pixel</Button>
            : 
            <Button variant="primary" loading={!isButtonCreatePixel} onClick={handleContinue}>Continue</Button>
          }
          
         </div>
        </div>
      </Card>
    </Page>
    )
}