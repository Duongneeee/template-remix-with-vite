import { Text } from "@shopify/polaris"
import SvgSuccess from "~/components/svgs/SvgSuccess"
import SvgWarning from "~/components/svgs/SvgWarning"

interface IObStepThreeProps {
    actionData:any,
    isThemeAppAction: boolean | undefined;
}
const OnBoardingStepThree = (props: IObStepThreeProps) => {

    const { actionData, isThemeAppAction } =  props;
    return (
        <>
            {
                isThemeAppAction === true ?
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
                    </div>
            } 
        </>
    )
}

export default OnBoardingStepThree