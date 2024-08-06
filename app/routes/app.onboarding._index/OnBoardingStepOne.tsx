import { Text } from "@shopify/polaris"

const OnBoardingStepOne = () => {
    return (
        <>
            {
                <div className="h-96 mb-2 flex flex-col items-center justify-center">
                    <img className="mb-3" src="https://d2qfs3b62dkzxt.cloudfront.net/images/Zotek.png" loading="lazy"/>
                    <div className="mb-3"><Text variant="headingLg" as="h3">Welcome to Zotek</Text></div>
                    <span className="mb-3">Let’s set up the <strong>important</strong> things first. We promise it will short and sweet</span>
                </div>
            }
        </>
    )
}

export default OnBoardingStepOne