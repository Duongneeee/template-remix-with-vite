import { Button, Page } from "@shopify/polaris";
import {
    ExternalSmallIcon
  } from '@shopify/polaris-icons';
import { Crisp } from "crisp-sdk-web";
import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CollapsibleHelp from "~/components/common/CollapsibleHelp";
import { authenticate } from "~/shopify.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const {shop} = session;

    return json({
      shop: shop
    });
  };

export default function Help(){
    const {shop} = useLoaderData<typeof loader>();

    const HelpOptions = [
        {
            title:"How to add Zotek app to your theme?",
            children:
            (<>
                <span>To access the theme settings page for your store, click the button below and follow the instructions in the image.</span>
                <div className="">
                  <div className="pt-2">
                    <Button url={`https://${shop}/admin/themes/current/editor?context=apps`} target="_blank" icon={ExternalSmallIcon}>Enable now</Button>
                  </div>
                  <img className="pt-2" src="https://d2qfs3b62dkzxt.cloudfront.net/images/themeAppOnboarding.webp" alt="" />
                </div>
            </>)
        },
        {
            title:"How to check event?",
            children:
            (<>
                <span>Please refer to the following video for details:</span>
                <iframe className="w-full pt-2 aspect-video" src="https://www.youtube.com/embed/oNd7ftL0fq4?si=4E7d3jIduvtZjOx6" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
            </>)
        },
        {
            title:"Why doesn't my Pixel work on the Checkout page?",
            children:`Shopify doesn't allow adding any scripts to the checkout page, including tracking pixels. The Zotek app tracks the 'Begin Checkout' event, which is triggered when you click the checkout button and happens right before the checkout page loads.`
        },
        {
            title:"Why does Meta need event verification for CartView and CollectionView events?",
            children:`The rest of the events are already set by Meta. However, we've seen that CartView and CollectionView events include crucial product information for advertising. That's why we've included additional options for users.`
        },
        {
            title:"The Pixel has been integrated into your app, but it isn't tracking any events. What might be the problem?",
            children:`Make sure you ve enabled the theme app in your store. Also, to receive Checkout events, you need to add script code. We've provided detailed instructions within the app.`
        },
        {
            title:"Why should we use the Conversion API along with the Meta Pixel? I see that the Meta Pixel already catches all the events?",
            children:`We use the Conversion API with the Meta Pixel because the Pixel has worked less effectively since the iOS 14 update and AdBlock. The Conversion API helps make up for this by tracking events from devices that opt out of tracking. This means we get more data for better reports, helping Facebook improve ad performance.`
        },
        {
            title:"Do I need to remove the Meta Channel app?",
            children:`You don't have to delete the app entirely. You can still use it for other things. Just make sure to select the correct pixel ID when installing it on Zotek to avoid any conflicts.`
        },
        {
          title:"Why are the match quality of events like PageView, ViewContent, and AddToCart so low?",
          children:`If you're seeing around 3-5, that's a positive beginning. Events higher up in the funnel typically have lower match quality compared to purchases because there's often less information available at those stages. For example, if shoppers haven't logged in or haven't completed the checkout process, you might lack email and phone information.`
      },
      ]

      const handleContactUs = ()=>{
        Crisp.chat.open();
        Crisp.message.sendText(
         "Hi Zotek Support Team, I need some assistance. Could you please help me?"
        );
      }

    return (
        <Page title="Help" primaryAction={{
            content:"Contact Us",
            onAction:handleContactUs
        }}>
          <div className="mb-10">
            {
                HelpOptions.map((item,index)=> 
                  <div key={index} className="mb-3">
                    <CollapsibleHelp title={item.title}>{item.children}</CollapsibleHelp>
                  </div>
                )
            }
          </div>
        </Page>
    )
    
}