import { Box, Button, ButtonGroup, Card, InlineError, List, Modal, Text } from "@shopify/polaris"
import { ExternalIcon } from "@shopify/polaris-icons";
import { useCallback, useState } from "react";
import SkeletonOnBoardingStep from "~/components/home/SkeletonOnBoardingStep";

interface IObStepTwoProps {
    shop: string
    actionData: any
    isButtonCreatePixel: boolean
    averageProgress: number
    identifystepOnBoarding: number
    setNumberProgress: any
    setIdentifyStepOnBoarding: (value: number) => void
    isThemeAppAction: boolean | undefined

}

const OnBoardingStepTwo = (props:IObStepTwoProps) => {

    const { 
        shop, 
        actionData, 
        isButtonCreatePixel,
        averageProgress,
        identifystepOnBoarding,
        isThemeAppAction,
        setNumberProgress,
        setIdentifyStepOnBoarding
    } = props
    const [active, setActive] = useState(false);

    const handleChange = useCallback(() => setActive(!active), [active]);

    const handleLater = useCallback(()=>{
        setNumberProgress((prev:number)=>(prev + averageProgress))
        setIdentifyStepOnBoarding(identifystepOnBoarding + 1)
        setActive(!active)
    },[averageProgress, identifystepOnBoarding,active, setActive, setNumberProgress, setIdentifyStepOnBoarding])
    return (
        <>
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
                                disabled={isThemeAppAction ? true : false}
                                >
                                    Enable now
                                </Button>
                            {/* <Button onClick={handleLater}>Later</Button> */}
                            <Modal
                                activator={<Button onClick={handleChange} disabled={isThemeAppAction ? true : false}>Later</Button>}
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
                            !isThemeAppAction &&
                            <div>
                                <InlineError message={"Please turn on the theme app!"} fieldID={'errorThemeApp'} />
                            </div>
                        }
                        </Card>
                    </Box>
                    </div> 
                    :
                    <SkeletonOnBoardingStep/>
                }

                {
                isButtonCreatePixel === true ? 
                    <div className="max-w-md overflow-hidden mx-auto">
                    <Card>
                        <img src="https://d2qfs3b62dkzxt.cloudfront.net/images/themeAppOnboarding.webp" alt="" loading="lazy" />
                    </Card>
                    </div> :
                    <SkeletonOnBoardingStep/>
                }
            </div>
        </>
    )
}

export default OnBoardingStepTwo