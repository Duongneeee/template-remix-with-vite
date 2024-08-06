import { BlockStack, Button, Card, InlineStack, Text } from "@shopify/polaris";
import { Crisp } from "crisp-sdk-web";

const postsHome = [
    {
      title:"Enhance Event Tracking",
      body: <span>Optimize pixel configuration to <span className="font-semibold">capture</span> and <span className="font-semibold">analyze</span> customer actions, enhancing insights into user behavior and preferences.</span>,
      textButton:"Test Event Configuration"
    },
    {
      title:"Access the New Product Feed Feature",
      body: <span>Boost advertising with <span className="font-semibold">Product Feed</span>, offering detailed, consistent product information to engage and convert customers effectively.</span>,
      textButton:"Subscribe Feature"
    },
]
export default function Post () {
    return (
        <div className="my-3">
            {
                postsHome.map((post,index)=>
                <div key={index} className="mb-3">
                    <Card roundedAbove="sm">
                    <div className="flex justify-between gap-5">
                        <div className="">
                        <BlockStack gap="200">
                            <BlockStack gap="300">
                            <Text as="h2" variant="headingSm">
                                {post.title}
                            </Text>
                                {post.body}
                            </BlockStack>
                            <InlineStack>
                            <Button
                                accessibilityLabel={post.title}
                                onClick={
                                    ()=>{ 
                                    Crisp.chat.open();
                                    Crisp.message.sendText(
                                        `I would like to be ${post.title}`
                                    );
                                    }
                                }
                            >
                                {post.textButton}
                            </Button>
                            </InlineStack>
                        </BlockStack>
                        </div>
                        <div>
                        </div>
                    </div>
                    </Card>
                </div>
                )
            }
        </div>
    )
}