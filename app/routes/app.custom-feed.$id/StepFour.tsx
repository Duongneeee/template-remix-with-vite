import { ActionFunction } from "@remix-run/node";
import { useActionData, useSubmit } from "@remix-run/react";
import { Button, ButtonGroup, Card, Icon, Image, RadioButton, Select, Text, TextField } from "@shopify/polaris"
import {
  ArrowLeftIcon
} from '@shopify/polaris-icons';
import { useCallback, useEffect, useState } from "react";
import CollapsibleHelp from "~/components/common/CollapsibleHelp";
import { ageGroupOptions, genderOptions, productConditionOptions } from "~/constants/options";
import { convertObjToString, findParent } from "~/utils";
import { jsonToFormData } from "~/utils/transform";

interface IStepOneProps {
  formData?:any,
  formState: any,
  setFormState: (prev:any)=> void,
  setStandStep: (prev:any)=> void,
}

const StepFour = (props:IStepOneProps) => {

  const {
    formData,
    formState, 
    setFormState,
    setStandStep
  } = props;

  // var actionData = useActionData<any>();
  const submit = useSubmit();
  //Start custom data of CategoriesFacebookLevel

  const [value, setValue] = useState('');
  const [dataCategoriesLevel, setDataCategoriesLevel] = useState([formData.AllCategoriesLevel])
  const [dataLabelLevelBefore, setDataLabelLevelBefore] = useState<string[]>([])
  const [removeError,setRemoveError] = useState(
    {
      productCondition:undefined
    });

  const handleChange = useCallback(
    (_: boolean, newValue: string) => { 
      setValue(newValue);
      const facebookCategoryLevel  = findParent(formData?.AllCategoriesLevel, newValue) ;
      setFormState((prev:any)=>({...prev,rule:{...prev.rule, facebookCategoryLevel}}))
    },
    [],
  );

  const handleButtonRenderCategories = (value:any, label:string)=>{
    if(value){
      setDataCategoriesLevel((prev:any)=>([...prev, value]))
      setDataLabelLevelBefore((prev:string[])=>([...prev, label]))
    }
  }

  const handleButtonBack = ()=>{
    setDataCategoriesLevel((prev:any)=>prev.slice(0, prev.length - 1))
    setDataLabelLevelBefore((prev:string[])=>prev.slice(0, prev.length - 1))
  }

  const renderCategories = (data:any)=>{
    const dataValue = data[data.length-1];
    return <>
        { dataLabelLevelBefore.length > 0 &&
          <li className="rounded-sm px-3 py-1 hover:bg-gray-100 relative">
            <button
            className="w-full flex items-center outline-none focus:outline-none"
            onClick={handleButtonBack}
          >
            <div>
              <Icon
                  source={ArrowLeftIcon}
                  tone="base"
              />
            </div>
            <span>{dataLabelLevelBefore[dataLabelLevelBefore.length - 1]}</span>
          </button>
          </li>
        }
      {
      Array.isArray(dataValue) ? 
          dataValue.map((item:string, index:number)=>
              <li key={index} className="rounded-sm px-3 py-1 hover:bg-gray-100 relative">
                  <RadioButton
                    label={item}
                    checked={value === item}
                    id={item}
                    name="accounts"
                    onChange={handleChange}
                  />
              </li>
          )
      : 
      Object.keys(dataValue).map((key:string, index:number)=>{
        return(
            <li key={index} className="rounded-sm px-3 py-1 hover:bg-gray-100"> 
                  {(Object.keys(dataValue[key].children).length == 0) ? 
                  <RadioButton
                          label={dataValue[key].label}
                          checked={value === dataValue[key].label}
                          id={dataValue[key].label}
                          name="accounts"
                          onChange={handleChange}
                        />
                        :
                        <button
                        className="w-full text-left flex justify-between items-center outline-none focus:outline-none"
                        onClick={()=>handleButtonRenderCategories(dataValue[key].children, dataValue[key].label)}
                        >
                          <div className="flex-1">{dataValue[key].label}</div>
                          <div className="mr-auto">
                            <svg
                              className="fill-current h-4 w-4
                              transition duration-150 ease-in-out tranform-svg "
                              viewBox="0 0 20 20"
                            >
                              <path
                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                              />
                            </svg>
                          </div>
                        </button>
                  }
                  {/* <span>{data[key].label}</span> */}
              {/* {
                Array.isArray(data[key].children) ? 
                <ul
                  className="bg-white border rounded-sm z-[1000] absolute top-0 right-0 
                    transition duration-150 ease-in-out origin-top-left
                    min-w-32 inline-block
                    "
                >
                  {
                    data[key].children.map((item:string, index:number)=>
                        <li key={index} className="rounded-sm px-3 py-1 hover:bg-gray-100">
                          <button
                            className="w-full text-left flex items-center outline-none focus:outline-none"
                          >
                            <span className="pr-1 flex-1">{item}</span>
                            <span className="pr-1 flex-1">
                              <RadioButton
                                label={item}
                                checked={value === item}
                                id={item}
                                name="accounts"
                                onChange={handleChange}
                              />
                            </span>
                          </button>
                        </li>
                    )
                  }
                </ul>
                :
                  <ul
                    className="bg-white border rounded-sm z-[1000] absolute top-0 right-0 
                      transition duration-150 ease-in-out origin-top-left min-w-32
                      "
                  >
                    {renderCategories(data[key].children)}
                  </ul>
              } */}
              
            </li>
        )
      })}
    </>
  }
  //End custom data of CategoriesFacebookLevel
  const [createLoading, setCreateLoading] = useState(false);
  const actionData = useActionData<ActionFunction>();
  const handleCreateFeed = () =>{
    setCreateLoading(true)
      const data: any = {
        ...formState,
        // profileShopCountry:formData.profileShopCountry,
        rule: JSON.stringify(formState.rule),
        // selected
      };
      submit(jsonToFormData(data), { method: "post" });
  }

  useEffect(()=>{
    setRemoveError({productCondition: actionData?.errors.productCondition})
    setCreateLoading(false)
  },[actionData])
    return <div className="">
        <Card>
            <div className="flex justify-between">
              <Text as="p" fontWeight="semibold" variant="bodyLg">Optional Config</Text>
              <Text as="p" fontWeight="semibold" variant="bodyLg">4/4</Text>
              </div>
            <p className="my-2">We strongly encourage you to configure the options below to help your products reach the right customers, thereby improving performance and reducing advertising costs</p>
          
            <div className="my-2">
                <div className="mb-3 dropdown">
                  <div className="group">
                      <div className="w-full">
                        <TextField
                          label={<Text as="h3" variant="headingSm" >Select Facebook Categories </Text>}
                          placeholder="Select Facebook Categories"
                          value={convertObjToString(formState?.rule?.facebookCategoryLevel)}
                          onChange={undefined}
                          autoComplete="off"
                        />
                      </div>
                    <ul
                      className="bg-white border rounded-sm transform scale-0 group-hover:scale-100 absolute z-[1000]
                    transition duration-150 ease-in-out origin-top min-w-32"
                    >
                      {renderCategories(dataCategoriesLevel)}
                    </ul>
                  </div>
                </div>
                <div className="mb-3">
                  <Select
                    label={<Text as="h3" variant="headingSm" >Select Product Condition <Text as="span" fontWeight="regular">(Required)</Text></Text>}
                    placeholder="Select Product Condition"
                    options={productConditionOptions}
                    value={formState?.rule?.productCondition}
                    error={removeError?.productCondition}
                    onChange={(value) =>{
                      setFormState({...formState, rule:{...formState.rule, productCondition:value}})
                      setRemoveError({productCondition:undefined})
                    }}
                  />
                </div>
                <div className="mb-3">
                  <Select
                    label={<Text as="h3" variant="headingSm" >Select Age group</Text>}
                    placeholder="Select Age group"
                    options={ageGroupOptions}
                    value={formState?.rule?.ageGroup}
                    onChange={(value) =>setFormState({...formState, rule:{...formState.rule, ageGroup:value}})}
                  />
                </div>
                <div className="mb-3">
                  <Select
                    label={<Text as="h3" variant="headingSm" >Select Gender</Text>}
                    placeholder="Select Gender"
                    options={genderOptions}
                    value={formState?.rule?.gender}
                    onChange={(value) => setFormState({...formState, rule:{...formState.rule, gender:value}})}
                  />
                </div>
            </div>
            <div>
              <CollapsibleHelp isOpen={true} title={
                <div className="flex gap-2">
                  <Image source="https://d2qfs3b62dkzxt.cloudfront.net/images/image_india.png" alt="" />
                  <Text variant="headingMd" as="h3">Additional required fields for selling in India</Text>
                </div>
              }>
                  <div className="my-2">
                      <div className="mb-3">
                        <Select
                          label={<Text as="h3" variant="headingSm" >Origin Country <Text as="span" fontWeight="regular">(The item's country of origin)</Text></Text>}
                          placeholder="Select Origin Country"
                          options={[{value:'US',label:'US'}]}
                          value={formState.rule.originCountry}
                          onChange={(value) =>{
                            setFormState({...formState, rule:{...formState.rule, originCountry:value}})
                            // setRemoveError({...removeError,originCountry:undefined})
                          }}
                          // error={removeError?.originCountry}
                        />
                      </div>
                      <div className="mb-3">
                        <TextField
                          label={<Text as="h3" variant="headingSm" >Importer Name <Text as="span" fontWeight="regular">(If the country of origin is not India, provide the legal entity name of the item's importer)</Text></Text>}
                          value={formState?.rule?.importerName}
                          onChange={(value) =>{
                            setFormState({...formState, rule:{...formState.rule, importerName:value}})
                            // setRemoveError({...removeError,importerName:undefined})
                          }}
                          autoComplete="off"
                          placeholder="Importer Name"
                          // error={removeError?.importerName}
                        />
                      </div>
                      <div className="mb-3">
                      <Text as="h3" variant="headingSm" >Importer Address <Text as="span" fontWeight="regular">(If the country of origin is not India, provide the operational address of the importer)</Text></Text>
                        <CollapsibleHelp title={
                          <Text as="p" variant="bodyMd">{JSON.stringify(formState?.rule?.importerAddress) || 'Importer Address'}</Text>
                          }>
                            <div className="my-2">
                              <TextField
                                label={<Text as="h3">Street 1 <Text as="span" fontWeight="regular">(required)</Text></Text>}
                                value={formState?.rule?.importerAddress?.street1}
                                onChange={(value) =>{
                                  setFormState({...formState, rule:{...formState.rule, importerAddress:{...formState?.rule?.importerAddress, street1:value}}})
                                  // setRemoveError({...removeError,importerAddressStreet1:undefined})
                                }}
                                autoComplete="off"
                                placeholder="Import Street 1"
                                // error={removeError?.importerAddressStreet1}
                              />
                            </div>
                            <div className="my-2">
                              <TextField
                                label={<Text as="h3">Street 2 <Text as="span" fontWeight="regular">(optional)</Text></Text>}
                                value={formState?.rule?.importerAddress?.street2}
                                onChange={(value) =>setFormState({...formState, rule:{...formState.rule, importerAddress:{...formState?.rule?.importerAddress, street2:value}}})}
                                autoComplete="off"
                                placeholder="Import Street 2"
                              />
                            </div>
                            <div className="my-2">
                              <TextField
                                label={<Text as="h3">City <Text as="span" fontWeight="regular">(required)</Text></Text>}
                                value={formState?.rule?.importerAddress?.city}
                                onChange={(value) =>{
                                  setFormState({...formState, rule:{...formState.rule, importerAddress:{...formState?.rule?.importerAddress,city:value}}})
                                  // setRemoveError({...removeError,importerAddressCity:undefined})
                                }}
                                autoComplete="off"
                                placeholder="Import City"
                                // error={removeError?.importerAddressCity}
                              />
                            </div>
                            <div className="my-2">
                              <TextField
                                label={<Text as="h3">Region <Text as="span" fontWeight="regular">(optional)</Text></Text>}
                                value={formState?.rule?.importerAddress?.region}
                                placeholder="Import Region"
                                autoComplete="off"
                                onChange={(value) =>setFormState({...formState, rule:{...formState.rule, importerAddress:{...formState?.rule?.importerAddress,region:value}}})}
                              />
                            </div>
                            <div className="my-2">
                              <TextField
                                label={<Text as="h3">Postal code <Text as="span" fontWeight="regular">(optional)</Text></Text>}
                                value={formState?.rule?.importerAddress?.postalCode}
                                onChange={(value) =>setFormState({...formState, rule:{...formState.rule, importerAddress:{...formState?.rule?.importerAddress,postalCode:value}}})}
                                autoComplete="off"
                                placeholder="Import Postal code"
                              />
                            </div>
                            <div className="my-2">
                              <Select
                                label={<Text as="h3">Country <Text as="span" fontWeight="regular">(required)</Text></Text>}
                                options={[{value:'US',label:'US'}]}
                                value={formState?.rule?.importerAddress?.country}
                                onChange={(value) =>{
                                  setFormState({...formState, rule:{...formState.rule, importerAddress:{...formState?.rule?.importerAddress,country:value}}})
                                  // setRemoveError({...removeError,importerAddressCountry:undefined})
                              }}
                                placeholder="Import Country"
                                // error={removeError?.importerAddressCountry}
                              />
                            </div>
                        </CollapsibleHelp>
                      </div>
                      <div className="mb-3">
                      <TextField
                          label={<Text as="h3" variant="headingSm" >Manufacturer Info <Text as="span" fontWeight="regular">(Information about the product's manufacturer, such as the manufacturer name and address.)</Text></Text>}
                          value={formState?.rule?.manufacturerInfo}
                          onChange={(value) =>{
                            setFormState({...formState, rule:{...formState.rule, manufacturerInfo:value}})
                            // setRemoveError({...removeError,manufacturerInfo:undefined})
                          }}
                          autoComplete="off"
                          placeholder="Manufacturer Info"
                          // error={removeError?.manufacturerInfo}
                        />
                      </div>
                  </div>
              </CollapsibleHelp>
            </div>
        

            <div className="flex justify-end my-3">
              <ButtonGroup>
                  <Button onClick={()=>setStandStep((prev:number)=>(prev -= 1))} disabled={createLoading}>Previous</Button>
                  <Button variant="primary" onClick={handleCreateFeed} loading={createLoading}>Create Feed</Button>
              </ButtonGroup>
            </div>
        </Card>
    </div>
}

export default StepFour