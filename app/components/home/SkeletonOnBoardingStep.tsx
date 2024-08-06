import { Layout, LegacyCard, SkeletonBodyText, SkeletonDisplayText, SkeletonPage, TextContainer } from "@shopify/polaris"

const SkeletonOnBoardingStep = () => {
    return (
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
)
}

export default SkeletonOnBoardingStep