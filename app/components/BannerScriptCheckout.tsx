// /* eslint-disable react/jsx-no-target-blank */
// /* eslint-disable react-hooks/exhaustive-deps */
// import { Card } from "@shopify/polaris";
// import { useLoaderData, useSubmit } from "@remix-run/react";
// import type { LoaderFunction } from "@remix-run/node";
// import BannerNoti from "./common/BannerNoti";
// import CopyButton from "./CopyButton";
// import { useState } from "react";

// /*
// Kiểm tra bảng ProfileAppConfig đã tồn tại cấu hình script chưa?
// -> Nếu chưa -> Show banner
// -> Nếu tồn tại -> Không show banner
// => Không kiểm tra giá trị của value
// */

// export default function ScriptCheckout({shop} : {shop: string}) {
//   const submit = useSubmit();
//   const data = useLoaderData<LoaderFunction>();

//   let isCheckoutEvent: boolean = data?.isCheckoutEvent;
//   let isExistAppConfig: boolean = false;
//   data?.listProfileConfigApp.forEach((element: any) => {
//     if(element?.appConfigId == 2){
//       isExistAppConfig = true;
//     }
//   });

//   const [isShowBanner, setIsShowBanner] = useState(isCheckoutEvent && !isExistAppConfig);

//   const handleScriptCheckout = () => {
//     if (!isExistAppConfig) {
//       const data: any = {
//         action: "handleScriptCheckout",
//       };
//       submit(data, { method: "post" });
//     }
//     shopify.toast.show('Copy success');
//   };
//   const nameShop = shop.split(".myshopify.com").join("");
//   return (
//     <div className="mb-3">
//       {
//         isShowBanner && 
//         <BannerNoti
//           title="Copy Zotek's script to your Checkout Setting"
//           url={`https://admin.shopify.com/store/${nameShop}/settings/checkout`}
//           content="Checkout Setting"
//           tone="warning"
//         >
//           {/* <p className="pb-2">
//             Navigate to the <strong>Checkout Setting</strong>, find the{" "}
//             <strong>Order status page</strong> section, and paste the script
//             into the <strong>Additional scripts</strong> block.
//           </p> */}
//           <p>
//           Go to the <strong>Checkout Setting</strong>, then look for the part called <strong>Order status page</strong>. After that, you should put the script in the box labeled <strong>Additional scripts</strong>.
//           </p>
//           <Card roundedAbove="md" background="bg-surface-secondary">
//             <p className="mb-1">{`{% # Zotek facebook pixel Script %}
//         {% if first_time_accessed%}
//         <script src="https://backend-pixel.zotek.io/public/pixel.js"></script>
//         {%endif%}`}</p>
//             <CopyButton
//               text={`{% # Zotek facebook pixel Script %}
//           {% if first_time_accessed%}
//           <script src="https://backend-pixel.zotek.io/public/pixel.js"></script>
//           {%endif%}`}
//               titleButton="Copy Script"
//               onCopy={() => handleScriptCheckout()}
//             />
//           </Card>
//         </BannerNoti>
//       }
//     </div>
//   );
// }
