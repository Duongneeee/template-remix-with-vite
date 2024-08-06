// /* eslint-disable react/jsx-no-target-blank */
// /* eslint-disable react-hooks/exhaustive-deps */
// import { useCallback, useEffect, useState } from "react";
// import {
//   Button,
//   Card,
//   Collapsible,
//   Divider,
//   Icon,
//   ProgressBar,
//   Text,
//   Toast,
// } from "@shopify/polaris";
// import { CheckIcon } from "@shopify/polaris-icons";
// import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
// import UnChecked from "../../public/assets/icons/dashed-circle.png";
// import Checked from "../../public/assets/icons/done.png";
// import type { LoaderFunction } from "@remix-run/node";
// import { json } from "@remix-run/node";
// import { authenticate } from "~/shopify.server";
// import { getProfileShopByShop } from "~/backend/services/profileShop.service";
// import CopyButton from "./CopyButton";
// import { Crisp } from "crisp-sdk-web";
// import { ArrayChangeObj } from "~/utils";

// type StepData = {
//   label: string;
//   link?: string;
//   desc: any;
//   labelBtn?: string;
//   action?: () => void;
//   url?: string;
//   isApp?: boolean;
// };

// type OnBoardingProps = {
//   dismiss: () => void;
//   isTurnOn: boolean;
// };

// export const loader: LoaderFunction = async ({ request }) => {
//   const { session } = await authenticate.admin(request);
//   const profileShop = await getProfileShopByShop(session.shop);
//   return json({ profileShop });
// };

// export default function OnBoarding({ dismiss, isTurnOn }: OnBoardingProps) {
//   const submit = useSubmit();
//   const { profileShop } = useLoaderData<typeof loader>();
//   const [active, setActive] = useState(false);

//   const toggleActive = useCallback(() => setActive((active) => !active), []);
//   const scriptCheckout = `{% # Zotek facebook pixel Script %}
//   {% if first_time_accessed%}
//   <script src="https://backend-pixel.zotek.io/public/pixel.js"></script>
//   {%endif%}`;

//   // let nameShop = "";
//   // let onBoardingStep: any = null;
//   // profileShop.forEach((element: any) => {
//   //   nameShop = element.shop.split(".myshopify.com").join("");
//   //   onBoardingStep = element.onBoardingStep;
//   // });

//   const shopData = ArrayChangeObj(profileShop);
//   shopData.shop = shopData.shop.split(".myshopify.com").join("");
//   const toastMarkup = active ? (
//     <Toast content="Copied" onDismiss={toggleActive} />
//   ) : null;
//   const stepData: StepData[] = [
//     {
//       label: "Create your first Facebook pixel.",
//       link: "https://zotek.gitbook.io/facebook-multiple-pixel/getting-started/get-your-pixels-ready",
//       desc: "To start sending your website traffic to Facebook, all you need to do is to create facebook pixel on Zotek.",
//       labelBtn: "Create pixel",
//       action: () => handleGotoCreatePixel(),
//       isApp: true,
//     },
//     {
//       label: "Add the Zotek script to the checkout.",
//       link: "https://zotek.gitbook.io/facebook-multiple-pixel/getting-started/get-your-pixels-ready/addtional-zotek-scripts",
//       desc: (
//         <div>
//           <p className="my-1">
//             To add the code, please navigate to{" "}
//             <span className="font-bold">Setting &#8658; Checkout</span> or press
//             the button <span className="font-bold">Checkout Setting</span> below.
//           </p>
//           <Card roundedAbove="md" background="bg-surface-secondary">
//             {/* <Text variant="headingMd" as="h5">UTM parameter</Text> */}
//             <p className="my-3">{scriptCheckout}</p>
//             <CopyButton text={scriptCheckout} 
//                     titleButton="Copy Script"
//                     onCopy={toggleActive} />
//           </Card>
//         </div>
//       ),
//       labelBtn: "Checkout Setting",
//       url: `https://admin.shopify.com/store/${shopData.shop}/settings/checkout`,
//     },
//     {
//       label: "Check if your pixel is configured correctly?",
//       link: "https://zotek.gitbook.io/facebook-multiple-pixel/getting-started/get-your-pixels-ready/test-events",
//       desc: "You have the option to test events using Facebook Pixel Helper or take the initiative to verify the server events sent to Facebook by Zotek daily, accessible in the Analytics tab.",
//       labelBtn: "Contact Us",
//       action: () => handleContactUs(),
//     },
//   ];

//   const [openUrl, setOpenUrl] = useState(shopData.onBoardingStep !== 5);

//   const navigate = useNavigate();
//   const [stepOpening, setStepOpening] = useState<number>(1);
//   const [stepChecked, setStepChecked] = useState(
//     Array(stepData.length).fill(false)
//   );

//   useEffect(() => {
//     setStepChecked(
//       stepData.map((_, index) => shopData.onBoardingStep >= index + 1)
//     );
//   }, [shopData.onBoardingStep]);

//   const handleStepChange = (stepIndex: number) => {
//     setStepChecked((prev) =>
//       prev.map((_, index) => (index === stepIndex ? false : prev[index]))
//     );
//     handleChangeStep(stepIndex + 1);
//     setStepOpening(stepIndex + 1);
//   };

//   const handleStepChangeBack = (stepIndex: number) => {
//     setStepChecked((prev) =>
//       prev.map((_, index) => (index === stepIndex ? true : prev[index]))
//     );
//     handleChangeStep(stepIndex);
//   };

//   const handleToggleUrl = useCallback(() => setOpenUrl((open) => !open), []);

//   const progress = stepChecked.reduce(
//     (acc, isChecked) => acc + (isChecked ? 100 / stepData.length : 0),
//     0
//   );
//   const progressText = `${
//     stepChecked.filter((isChecked) => isChecked).length
//   }/${stepData.length}`;

//   const handleFinishOnBoarding = () => {
//     handleChangeStep(5);
//     setOpenUrl(false);
//     dismiss();
//   };

//   const handleGotoCreatePixel = () => {
//     navigate("/app/pixel/new");
//   };

//   const handleContactUs = () => {
//     Crisp.chat.open();
//     Crisp.message.sendText(
//       "Hello, Zotek support team. I want you to guide me on how to use Facebook Pixel on this application and how I can check that the Pixel is working properly."
//     );
//   };

//   const handleChangeStep = (onBoardingStep: number) => {
//     const data: any = {
//       action: "updateStepOnboarding",
//       onBoardingStep: onBoardingStep,
//     };
//     // console.log(data);
//     submit(data, { method: "post" });
//   };

//   return (
//     <Card>
//       <div className="flex justify-between items-center">
//         <Text variant="headingLg" as="h5">
//           Onboarding guideline
//         </Text>
//         <Button
//           variant="tertiary"
//           onClick={handleToggleUrl}
//           disclosure={openUrl ? "up" : "down"}
//           ariaExpanded={openUrl}
//         ></Button>
//       </div>
//       <Collapsible
//         open={openUrl}
//         id="basic-collapsible"
//         transition={{
//           duration: "500ms",
//           timingFunction: "ease-in-out",
//         }}
//         expandOnPrint
//       >
//         <div className="mt-2">
//           {progress === 100 ? (
//             <div className="flex gap-2 items-center justify-start">
//               <div>
//                 <Icon source={CheckIcon} tone="base" />
//               </div>
//               <div>Done</div>
//             </div>
//           ) : (
//             <div className="flex gap-2 items-center">
//               <div>{progressText} completed</div>
//               <div style={{ width: 144, height: 4 }}>
//                 <ProgressBar progress={progress} tone="primary" size="small" />
//               </div>
//             </div>
//           )}
//         </div>
//         <div className="mt-3 flex flex-col">
//           {stepData.map((data, index) => (
//             <div
//               key={index}
//               style={{
//                 background:
//                   stepOpening === index + 1 ? "#f3f3f3" : "transparent",
//               }}
//               className="p-2 rounded-md"
//             >
//               <div
//                 className="flex items-center hover:cursor-pointer gap-2"
//                 onClick={() => setStepOpening(index + 1)}
//               >
//                 {stepChecked[index] ? (
//                   <img
//                     src={Checked}
//                     title="Mark as not done"
//                     onClick={() => handleStepChangeBack(index)}
//                     className="w-4 h-4"
//                     alt="check"
//                   />
//                 ) : (
//                   <img
//                     src={UnChecked}
//                     title="Mark as done"
//                     onClick={() => handleStepChange(index)}
//                     className="w-4 h-4"
//                     alt="uncheck"
//                   />
//                 )}
//                 <span
//                   onClick={() =>
//                     stepChecked[index]
//                       ? handleStepChangeBack(index)
//                       : handleStepChange(index)
//                   }
//                 >
//                   <Text variant="headingMd" as="h6">
//                     {`${index + 1}/${stepData.length} ${data.label}`}
//                   </Text>
//                 </span>
//               </div>

//               <Collapsible
//                 open={stepOpening === index + 1}
//                 id="basic-collapsible"
//                 transition={{
//                   duration: "500ms",
//                   timingFunction: "ease-in-out",
//                 }}
//                 expandOnPrint
//               >
//                 <div className="mt-2">
//                   <span className="flex flex-col w-full">
//                     <span className="mb-3">
//                       {data.link && (
//                         <>
//                           {data.desc}{" "}
//                           <a
//                             href={data.link}
//                             target="_blank"
//                             className="text-blue-500"
//                           >
//                             Learn more
//                           </a>
//                         </>
//                       )}
//                     </span>
//                   </span>
//                   <div className="flex w-full justify-start">
//                     {data.action ? (
//                       <Button onClick={data.action} variant="primary">
//                         {data.labelBtn}
//                       </Button>
//                     ) : (
//                       <Button url={data.url} target="_blank" variant="primary">
//                         {data.labelBtn}
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </Collapsible>
//             </div>
//           ))}
//         </div>
//         {progress === 100 && (
//           <>
//             <Divider />
//             <div className="flex justify-end mt-2">
//               <Button onClick={handleFinishOnBoarding}>Dismiss guide</Button>
//             </div>
//           </>
//         )}
//       </Collapsible>
//     </Card>
//   );
// }
