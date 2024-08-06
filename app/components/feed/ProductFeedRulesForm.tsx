// import {
//   Text,
// } from "@shopify/polaris";

// import { useEffect, useState } from "react";
// import type { IOption } from "~/components/MultipleSellectBox";
// import MultipleSelectBox from "~/components/MultipleSellectBox";
// import ModalProductFeed from "./ModalProductFeed";

// export interface RuleProductFeedItem {
//   ltsCollections: string[];
//   tags: string[];
//   types: string[];
//   ltsProducts: string[];
//   // ltsProductTagsOptions:string[];
//   // ltsProductTypesOptions:string[];

// }

// interface ProductFeedRulesFormProps {
//   onChange: (rule: RuleProductFeedItem) => void;
//   conditions: string;
//   collectionOptions: IOption[];
//   productOptions: IOption[];
//   productTagsOptions:IOption[];
//   productTypesOptions:IOption[];
//   value: RuleProductFeedItem
// }

// const ProductFeedRulesForm = (props: ProductFeedRulesFormProps) => {
//   const { onChange, collectionOptions, productOptions, productTagsOptions,productTypesOptions, conditions, value } = props;
//   const initialRule : RuleProductFeedItem = typeof value !== 'undefined'? value : {
//     ltsCollections: [],
//     tags: [],
//     types: [],
//     ltsProducts: []
//   };

//   const [rule, setRule] = useState<RuleProductFeedItem>(initialRule);
//   const [selectedCollection, setSelectedCollections] = useState<string[]>(initialRule.ltsCollections);
//   const [selectedProduct, setSelectedProducts] = useState<string[]>(initialRule.ltsProducts);
//   const [selectedProductTags, setSelectedProductTags] = useState<string[]>(initialRule.tags);
//   const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>(initialRule.types);

//   useEffect(()=>{
//     setSelectedProducts(initialRule.ltsProducts || [])
//   },[value])

//   return (
//     <>
//       {conditions === "selected-products" && (
//         <div className="my-2">
//           <div className="p-2 my-2">
//           <Text as="h2" variant="headingSm" fontWeight="medium">
//             Select Collection(s)
//           </Text>
//           <MultipleSelectBox
//             listOptions={collectionOptions || []}
//             handleChangeOptions={(valueCollection) => {
//               setRule({ ...rule, ltsCollections: valueCollection })
//               onChange({ltsCollections: valueCollection, ltsProducts: selectedProduct,tags:selectedProductTags,types:selectedProductTypes})
//             }}
//             selectedOptions={rule.ltsCollections || []}
//             setSelectedOptions={setSelectedCollections}
//             isShowTag={true}
//             placeholder="Please choose collections"
//           />
//           </div>


//           <div className="p-2 my-2">
//           <Text as="h2" variant="headingSm" fontWeight="medium">
//             Select Product Tag(s)
//           </Text>
//           <MultipleSelectBox
//             listOptions={productTagsOptions || []}
//             handleChangeOptions={(valueProductTag) =>{
//                 setRule({ ...rule, tags: valueProductTag })
//                 onChange({tags: valueProductTag,ltsProducts:selectedProduct, ltsCollections: selectedCollection,types:selectedProductTypes})
//               }
//             }
//             selectedOptions={rule.tags || []}
//             setSelectedOptions={setSelectedProductTags}
//             isShowTag={true}
//             placeholder="Please choose products"
//           />
//           </div>

//           <div className="p-2 my-2">
//           <Text as="h2" variant="headingSm" fontWeight="medium">
//             Select Product Type(s)
//           </Text>
//           <MultipleSelectBox
//             listOptions={productTypesOptions || []}
//             handleChangeOptions={(valueProductType) =>{
//                 setRule({ ...rule, types: valueProductType })
//                 onChange({types: valueProductType, ltsProducts:selectedProduct, ltsCollections: selectedCollection,tags:selectedProductTags})
//               }
//             }
//             selectedOptions={rule.types || []}
//             setSelectedOptions={setSelectedProductTypes}
//             isShowTag={true}
//             placeholder="Please choose products"
//           />
//           </div>
//           <div className="p-2 my-2">
//             <ModalProductFeed
//               onChange= {onChange}
//               dataOption={productOptions} 
//               selectData={selectedProduct || []}
//               selectedCollection={selectedCollection}
//               selectedProductTags={selectedProductTags}
//               selectedProductTypes={selectedProductTypes}
//               setSelectData={setSelectedProducts} 
//               titleButton='Select Product(s)'
//             />

//           {/* <Text as="h2" variant="headingSm" fontWeight="medium">
//             Select Product(s)
//           </Text>
//           <MultipleSelectBox
//             listOptions={productOptions || []}
//             handleChangeOptions={(valueProduct) =>{
//                 setRule({ ...rule, ltsProducts: valueProduct })
//                 onChange({ltsProducts: valueProduct, ltsCollections: selectedCollection,tags:selectedProductTags,types:selectedProductTypes})
//               }
//             }
//             selectedOptions={rule.ltsProducts || []}
//             setSelectedOptions={setSelectedProducts}
//             isShowTag={true}
//             placeholder="Please choose products"
//           /> */}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default ProductFeedRulesForm;
