import { 
  Avatar, 
  Banner, 
  BlockStack, 
  Button, 
  ButtonGroup, 
  Card, 
  EmptyState, 
  IndexFilters, 
  IndexFiltersProps, 
  IndexTable, 
  Modal, 
  RadioButton, 
  ResourceItem, 
  ResourceList, 
  TabProps, 
  Text, 
  useIndexResourceState, 
  useSetIndexFiltersMode 
} from "@shopify/polaris";
import {
  XIcon
} from '@shopify/polaris-icons';
import { useCallback, useEffect, useMemo, useState } from "react";
import type { IOption } from "~/components/common/MultipleSellectBox";
import TagMultipleBox from "~/components/common/TagMultipleBox";
import { IRules } from "./route";
import { getCollectionsStorefront } from "~/backend/external_apis/shopify/collection.service";
import { getProductTags, getProductTypes } from "~/backend/external_apis/shopify/product.service";
import TagMultipleBoxInName from "~/components/common/TagMultipleBoxInName";

interface IStepOneProps {
    formData?: any,
    formState: any,
    setFormState: (prev:any)=> void,
    setStandStep: (prev:any)=> void,
    ltsProductOptions: IOption[],
    ruleSelectedProducts: IRules,
    ltsProductConditionAll: string[],
    ltsProductAllOrSelected: any[],
    setRuleSelectedProducts: (value: IRules) => void,
    setLtsProductAllOrSelected: (value:any)=> void,
}

enum SelectionType {
  All = "all",
  Page = "page",
  Multi = "multi",
  Single = "single",
  Range = "range"
}

const StepThree = (props:IStepOneProps) => {
    const {
        formData, 
        formState, 
        ltsProductOptions,
        ruleSelectedProducts,
        ltsProductConditionAll,
        ltsProductAllOrSelected,
        setStandStep,
        setFormState,
        setRuleSelectedProducts,
        setLtsProductAllOrSelected,
      } = props;

      const[ collectionOptions, setCollectionOptions ] = useState<IOption[]>([]);
      const[ ltsProductTagsOptions, setLtsProductTagsOptions ] = useState<IOption[]>([]);
      const[ ltsProductTypesOptions, setLtsProductTypesOptions ] = useState<IOption[]>([]);
      
      useEffect(()=>{
        const callApi = async () => {
          setCollectionOptions(await getCollectionsStorefront(formData.shop, formData.storeFrontAccessToken) || []);
          setLtsProductTagsOptions(await getProductTags(formData.shop, formData.storeFrontAccessToken) || []);
          setLtsProductTypesOptions(await getProductTypes(formData.shop, formData.storeFrontAccessToken) || []);
        }
        callApi()
        // const AllCategoriesLevel:IOption[] = convertDataToOption((await getAllDataFacebookCategoryLevelService()).result || []);
      },[])
  const [list, setList] =  useState<any[]>(ltsProductOptions);
  const [listNoSearch, setListNoSearch] =  useState<any[]>(ltsProductOptions);
  const [ruleChangeRadioButton, setRuleChangeRadioButton] = useState({});
  const [blockProduct,setBlockProduct] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentPageTwo, setCurrentPageTwo] = useState<number>(1);
  const pageSize = 10;
  
  const paginatedData = useMemo(()=>{
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return list.slice(firstPageIndex, lastPageIndex);
  },[currentPage, list, setList])

  const totalPages = Math.ceil(list.length / pageSize);

  const paginatedDataTwo = useMemo(()=>{
    const firstPageIndex = (currentPageTwo - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return ltsProductAllOrSelected.slice(firstPageIndex, lastPageIndex);
  },[currentPageTwo, ltsProductAllOrSelected, setLtsProductAllOrSelected])

  const totalPagesTwo = Math.ceil(ltsProductAllOrSelected.length / pageSize);

  const handleBlockProduct = (index:number)=>{
    if(blockProduct === index)return;
    setBlockProduct(index);
  }

  const [active, setActive] = useState(false);

  const handleDone = useCallback(() => {
    setActive(!active)
    setLtsProductAllOrSelected(ltsProductOptions.filter((item:any)=>ruleSelectedProducts.ltsProducts.includes(item.id)));
    setFormState((prev:any)=>({...prev, rule:{...prev.rule, ...ruleSelectedProducts}}))
    setRuleChangeRadioButton((prev:any)=>({...prev, rule:{...prev.rule, ...ruleSelectedProducts}}))
    setSelectedItemString("Products");
    setList(ltsProductOptions);
    setListNoSearch(ltsProductOptions);
    (formState.rule.ltsProducts || []).map((item:any)=>handleSelectionChange(SelectionType.Single,true,item));
    setSelected(0)

  }, [active, setFormState, ruleSelectedProducts, setLtsProductAllOrSelected]);

  const handleCancel = useCallback(() => {
    clearSelection();
    setActive(!active);
    setSelectedItemString("Products");
    setList(ltsProductOptions);
    setListNoSearch(ltsProductOptions);
    (formState.rule.ltsProducts || []).map((item:any)=>handleSelectionChange(SelectionType.Single,true,item));
    setSelected(0)
  }, [active]);

  const [removeError,setRemoveError] = useState(
    {
      products:undefined
    });


  const handleNext = ()=>{
    // const errors = validateStepThree(formState);

    // if(errors){
    //   setRemoveError({products:errors.products})
    // }else{
      setStandStep((prev:number)=>(prev += 1))
    // }
  }

  //start
  const [itemStrings, setItemStrings] = useState([
    'Products',
    'Collections',
    'Tags',
    'Types',
  ]);
  const [selectedItemString, setSelectedItemString] = useState('Products');

  const handleItemString = (item:any)=>{
    clearSelection();
    setCurrentPage(1);
    if(item === "Products"){
      setSelectedItemString("Products");
      setList(ltsProductOptions);
      setListNoSearch(ltsProductOptions);
      (formState.rule.ltsProducts || []).map((item:any)=>handleSelectionChange(SelectionType.Single,true,item));
    }
    if(item === "Collections"){
      setSelectedItemString("Collections");
      setList(collectionOptions); 
      setListNoSearch(collectionOptions);
      (formState.rule.ltsCollections || []).map((item:any)=>handleSelectionChange(SelectionType.Single,true,item));
    }
    if(item === "Tags"){
      setSelectedItemString("Tags");
      setList(ltsProductTagsOptions);
      setListNoSearch(ltsProductTagsOptions);
      (formState.rule.tags || []).map((item:any)=>handleSelectionChange(SelectionType.Single,true,item));
    }
    if(item === "Types"){
      setSelectedItemString("Types");
      setList(ltsProductTypesOptions);
      setListNoSearch(ltsProductTypesOptions);
      (formState.rule.types || []).map((item:any)=>handleSelectionChange(SelectionType.Single,true,item));
    }

  }
  const tabs: TabProps[] = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction:()=> handleItemString(item),
    id: `${item}-${index}`,
    isLocked: true,
  }));
  const [selected, setSelected] = useState(0);

  const sortOptions: IndexFiltersProps['sortOptions'] = [
    {label: 'Name', value: 'name asc', directionLabel: 'A-Z'},
    {label: 'Name', value: 'name desc', directionLabel: 'Z-A'},
  ];
  const [sortSelected, setSortSelected] = useState(['name asc']);

  const handleSort = (value:string[])=>{
    const sortedData = list.sort((a:any,b:any)=>
    {
      if(value[0] === 'name asc'){
        return a.label.localeCompare(b.label)
      }else{
        return b.label.localeCompare(a.label)
      }
    })
    setList([...sortedData]);
    setSortSelected(value);
  }
  const {mode, setMode} = useSetIndexFiltersMode();
  const onHandleCancel = () => {};

  const [accountStatus, setAccountStatus] = useState<string[] | undefined>(
    undefined,
  );
  const [moneySpent, setMoneySpent] = useState<[number, number] | undefined>(
    undefined,
  );
  const [taggedWith, setTaggedWith] = useState('');
  const [queryValue, setQueryValue] = useState('');

  // const handleAccountStatusChange = useCallback(
  //   (value: string[]) => setAccountStatus(value),
  //   [],
  // );
  // const handleMoneySpentChange = useCallback(
  //   (value: [number, number]) => setMoneySpent(value),
  //   [],
  // );
  // const handleTaggedWithChange = useCallback(
  //   (value: string) => setTaggedWith(value),
  //   [],
  // );
  const handleFiltersQueryChange = useCallback(
    (value: string) => {
      setQueryValue(value);
      const data = value === "" ? listNoSearch : listNoSearch.filter((item:any)=> item.label.toLowerCase().includes(value.toLowerCase()));
      setList([...data]);
    },
    [list, setList],
  );

  const handleSearchClear = () =>{
    setQueryValue('');
    setList([...listNoSearch]);
  }
  const handleAccountStatusRemove = useCallback(
    () => setAccountStatus(undefined),
    [],
  );
  const handleMoneySpentRemove = useCallback(
    () => setMoneySpent(undefined),
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(''), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleAccountStatusRemove,
    handleMoneySpentRemove,
    handleQueryValueRemove,
    handleTaggedWithRemove,
  ]);

  const appliedFilters: IndexFiltersProps['appliedFilters'] = [];
  if (accountStatus && !isEmpty(accountStatus)) {
    const key = 'accountStatus';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, accountStatus),
      onRemove: handleAccountStatusRemove,
    });
  }
  if (moneySpent) {
    const key = 'moneySpent';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, moneySpent),
      onRemove: handleMoneySpentRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = 'taggedWith';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  const resourceName = {
    singular: 'record',
    plural: 'records',
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange, clearSelection,} =
    useIndexResourceState(list);
  const rowMarkup = paginatedData.map(
    (
      {id, image, label},
      index,
    ) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        {
          selectedItemString === "Products" &&
            <IndexTable.Cell>
              <Avatar source={image}/>
            </IndexTable.Cell>
        }
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {label}
          </Text>
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  const handleChangeIndexTable = (SelectionType:SelectionType, toggleType:boolean, selection?:string)=>{
    if(selectedItemString === 'Products'){
      let arrayProduct = ruleSelectedProducts.ltsProducts || [];
      if(SelectionType === 'page'){
        if(arrayProduct.length === list.length){
          arrayProduct = [];
        }else{
          arrayProduct = ltsProductOptions.map((item:any)=>item.id);
        }
      }
      if(SelectionType === 'single'){
        if (toggleType) {
          arrayProduct.push(selection as string);
        }else{
          arrayProduct = arrayProduct.filter((item:string)=>item !== selection)
        }
      }
      setRuleSelectedProducts({...ruleSelectedProducts, ltsProducts:arrayProduct})
    }

    // setFormState with rule lstCollections
    if(selectedItemString === 'Collections'){
    let arrayColletions = ruleSelectedProducts.ltsCollections || [];
    let productIdsWithCollections = ruleSelectedProducts.ltsProducts || []; 
      if(SelectionType === 'page'){
        if(arrayColletions.length === list.length){
          arrayColletions = [];
          productIdsWithCollections = [];
        }else{
          arrayColletions = collectionOptions.map((item:any)=>item.id);
          collectionOptions.forEach((item:IOption)=>{
            (item.productIds || []).forEach((id:string) => {
              if(!productIdsWithCollections.includes(id)){
                productIdsWithCollections.push(id)
              }
            });
          })
        }
      }
      if(SelectionType === 'single'){
        if (toggleType) {
          arrayColletions.push(selection as string);
          (collectionOptions || []).filter((item:IOption) => item.id === selection)
          .map((item:IOption)=>{
            item.productIds?.map((id:string)=>{
              if(!productIdsWithCollections.includes(id)){
                productIdsWithCollections.push(id)
              }
            })
          })
        }else{
          arrayColletions = arrayColletions.filter((item:string)=>item !== selection);
          (collectionOptions || []).filter((item:IOption) => item.id === selection)
          .map((item:IOption)=>{
            productIdsWithCollections = productIdsWithCollections.filter((id:string) => !item.productIds?.includes(id));
          })
        }
      }
      setRuleSelectedProducts({
        ...ruleSelectedProducts, 
        ltsProducts: productIdsWithCollections, 
        ltsCollections:arrayColletions, 
        types: [], 
        tags:[]
      })
    }
    
    // setFormState with rule tags
    if(selectedItemString === 'Tags'){
    let arrayTags = ruleSelectedProducts.tags || [];
      if(SelectionType === 'page'){
        if(arrayTags.length === list.length){
          arrayTags = [];
        }else{
          arrayTags = ltsProductTagsOptions.map((item:any)=>item.id);
        }
      }
      if(SelectionType === 'single'){
        if (toggleType) {
          arrayTags.push(selection as string);
        }else{
          arrayTags = arrayTags.filter((item:string)=>item !== selection)
        }
      }
      
      // setFormState({...formState,rule:{...formState.rule, tags:arrayTags}})
      const productIdsWithTags = ltsProductOptions.filter(
        (item:any) => arrayTags.some((tag:string)=>item.tags.includes(tag))).map((item:any)=>item.id
      );
      setRuleSelectedProducts({
        ...ruleSelectedProducts, 
        ltsProducts: productIdsWithTags, 
        ltsCollections:[], 
        types: [], 
        tags:arrayTags
      })
    }

    // setFormState with rule types
    if(selectedItemString === 'Types'){
      let arrayTypes = ruleSelectedProducts.types || [];
        if(SelectionType === 'page'){
          if(arrayTypes.length === list.length){
            arrayTypes = [];
          }else{
            arrayTypes = ltsProductTypesOptions.map((item:any)=>item.id);
          }
        }
        if(SelectionType === 'single'){
          if (toggleType) {
            arrayTypes.push(selection as string);
          }else{
            arrayTypes = arrayTypes.filter((item:string)=>item !== selection)
          }
        }
        const productIdsWithTypes = ltsProductOptions.filter(
          (item:any) => arrayTypes.includes(item.productType)).map((item:any)=>item.id
        );
        setRuleSelectedProducts({
          ...ruleSelectedProducts, 
          ltsProducts: productIdsWithTypes, 
          ltsCollections:[], 
          tags: [], 
          types:arrayTypes
        })
    }

    handleSelectionChange(SelectionType,toggleType,selection)
  }
  // End

  const handleDelete = (id:string) => {
    const productIdsFilter = formState.rule.ltsProducts?.filter(( item:string )=> item !== id) || [];
    setLtsProductAllOrSelected(ltsProductOptions.filter((item:any)=>productIdsFilter.includes(item.id)));
    setFormState((pre:any)=>({...pre,rule:{...pre.rule, ltsProducts:productIdsFilter}}))
    
    shopify.toast.show('Deleted Success')
  }

  const productEmptyState = (
    <EmptyState
      heading="No products found"
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
    >
      <p>Try changing the filters or search term</p>
    </EmptyState>
  )

    return <div>
      {
        removeError.products &&
          <div className="mb-3">
            <Banner
            title="High risk of fraud detected"
            tone="critical"
          >
            <p>
              {removeError?.products}
            </p>
          </Banner>
          </div>
      }
        <Card>
        <div className="flex justify-end"><Text as="p" fontWeight="semibold" variant="bodyLg">3/4</Text></div>
        <div className="">
                <BlockStack gap="200">
                  <div className="flex justify-between">
                  <Text as="h2" variant="headingMd" fontWeight="medium">
                    Select products for Product feed
                  </Text>
                  </div>
                  <div className="md:flex md:gap-x-2">
                    <Button onClick={()=>handleBlockProduct(0)} pressed={ blockProduct === 0 }>Select Customized Product</Button>
                    {/* <Button onClick={()=>handleBlockProduct(1)} pressed={ blockProduct === 1 }>Zotek Suggested Products</Button> */}
                  </div>
                  { blockProduct == 0 ?
                  <div className="md:flex md:gap-x-4">
                    <RadioButton
                      label="All product"
                      helpText=""
                      checked={formState.conditions === "all"}
                      id="all"
                      name="conditions"
                      onChange={(isChecked, newValue) => {
                        clearSelection();
                        setLtsProductAllOrSelected(ltsProductOptions);
                        setRuleSelectedProducts({
                          ltsProducts:[],
                          ltsCollections:[],
                          tags:[],
                          types:[]
                        })
                        setFormState({ ...formState, conditions: newValue, 
                          rule:{
                            ...ruleChangeRadioButton,
                            ltsProducts:ltsProductConditionAll,
                            ltsCollections:[],
                            tags:[],
                            types:[]
                          }
                        });
                      }}
                    />
                    <RadioButton
                      label="Selected products"
                      helpText=""
                      id="selected-products"
                      name="conditions"
                      checked={formState.conditions === "selected-products"}
                      onChange={(isChecked, newValue) => {
                        const productFilter = ltsProductOptions.filter((item:any)=>(ruleSelectedProducts.ltsProducts || []).includes((item.id)))
                        // setLtsProductAllOrSelected(ltsProductOptions.filter((item:any)=>(formState?.rule?.ltsProducts || []).includes(item.id)));
                        setLtsProductAllOrSelected(productFilter)
                        setActive(!active)
                        setFormState({ ...formState, conditions: newValue, 
                          rule: {
                            ...ruleChangeRadioButton,
                            ltsProducts:[],
                            ltsCollections:[],
                            tags:[],
                            types:[]
                          } 
                        });
                      }}
                    />
                  </div>: false}
                </BlockStack>
                <BlockStack gap="300">
                {/* Tag Collection  */}
                  {
                    (formState?.rule?.ltsCollections || []).length > 0 && 
                    <TagMultipleBoxInName data={collectionOptions.filter((item:IOption)=>(formState?.rule?.ltsCollections|| []).includes(item.id)) || []} 
                      setData={(value:string[])=>{
                        let productIdsWithCollections:string[] = [];
                        collectionOptions.filter((item:IOption)=> value.includes(item.id ||""))
                        .map((item:IOption)=>{
                          item.productIds?.map((id:string)=>{
                            if(!productIdsWithCollections.includes(id)){
                              productIdsWithCollections.push(id)
                            }
                          })
                        })
                        
                        const productWithCollections = ltsProductOptions.filter((item:any)=>productIdsWithCollections.includes(item.id));
                        setLtsProductAllOrSelected(productWithCollections);
                        setFormState({ 
                          ...formState, 
                          rule:{
                            ...formState.rule, 
                            ltsProducts: productIdsWithCollections, 
                            ltsCollections:value
                          }
                        })
                      }} 
                      title="Collections"
                    />
                  }
                  {/* Tags  */}
                  {
                    (formState?.rule?.tags || []).length > 0 && 
                    <TagMultipleBox data={formState?.rule?.tags || []} 
                    setData={(value:string[])=>{
                      const productWithTags = ltsProductOptions.filter((item:any) => value.some((tag:string)=>item.tags.includes(tag)));
                      const productIdsWithTags =productWithTags.map((item:any)=>item.id);
                      setLtsProductAllOrSelected(productWithTags);
                      setFormState({ ...formState, rule:{...formState.rule, ltsProducts: productIdsWithTags, tags:value}})
                    }} 
                    title="Tags"/>
                  }
                  {/* Tag Types  */}
                  {
                    (formState?.rule?.types || []).length > 0 && 
                    <TagMultipleBox data={formState?.rule?.types || []} 
                    setData={(value:string[])=>{
                      const productWithTypes = ltsProductOptions.filter((item:any) => value.includes(item.productType));
                      const productIdsWithTypes =productWithTypes.map((item:any)=>item.id);
                      setLtsProductAllOrSelected(productWithTypes);
                      setFormState({ ...formState, rule:{...formState.rule, ltsProducts: productIdsWithTypes, types:value}});
                    }} 
                    title="Types"/>
                  }
                  
                  <div className="mt-3">
                    <Card padding="0">
                      <div className="p-3">
                        <Text as="h2" variant="headingSm">Products</Text>
                      </div>
                      <ResourceList
                        resourceName={{singular: 'customer', plural: 'customers'}}
                        emptyState={productEmptyState}
                        items={paginatedDataTwo}
                        pagination={paginatedDataTwo.length > 0 ? {
                          label:`${currentPageTwo}`,
                          hasNext: currentPageTwo < totalPagesTwo ? true : false,
                          hasPrevious:currentPageTwo > 1  ? true : false,
                          onNext: () => {setCurrentPageTwo((prev:number)=>prev += 1)},
                          onPrevious: () =>{setCurrentPageTwo((prev:number)=>prev -= 1)}
                        } : undefined}
                        renderItem={(item) => {
                          const {id,image, label} = item;
                          const media = <Avatar source={image} name={label} />;

                          return (
                              <ResourceItem
                              id={id}
                              url={''}
                              media={media}
                              accessibilityLabel={`View details for ${label}`}
                              >
                                <div className="flex justify-between">
                                  <h3>
                                      <Text fontWeight="bold" as="span">
                                      {label}
                                      </Text>
                                  </h3>
                                  <Button icon={XIcon} onClick={()=>handleDelete(id)} />
                                </div>
                              </ResourceItem>
                          );
                          }}
                      />
                    </Card>
                  </div>
                </BlockStack>
                   
                <Modal
                activator={undefined}
                open={active}
                onClose={handleCancel}
                title="Selects products"
                primaryAction={{
                    content: 'Done',
                    onAction: handleDone,
                }}
                secondaryActions={[
                    {
                    content: 'Cancel',
                    onAction: handleCancel,
                    },
                ]}
                size="large"
                >
                {/* <Modal.Section>  */}
                    <IndexFilters
                        sortOptions={sortOptions}
                        sortSelected={sortSelected}
                        queryValue={queryValue}
                        queryPlaceholder="Searching in name"
                        onQueryChange={handleFiltersQueryChange}
                        onQueryClear={handleSearchClear}
                        onSort={handleSort}
                        // primaryAction={primaryAction}
                        cancelAction={{
                        onAction: onHandleCancel,
                        disabled: false,
                        loading: false,
                        }}
                        tabs={tabs}
                        selected={selected}
                        onSelect={setSelected}
                        canCreateNewView={false}
                        // onCreateNewView={onCreateNewView}
                        filters={[]}  
                        // appliedFilters={appliedFilters}
                        hideFilters
                        onClearAll={handleFiltersClearAll}
                        mode={mode}
                        setMode={setMode}
                    />
                    <IndexTable
                        resourceName={resourceName}
                        itemCount={list.length}
                        selectedItemsCount={
                        allResourcesSelected ? 'All' : selectedResources.length
                        }
                        onSelectionChange={handleChangeIndexTable}
                        headings={
                          selectedItemString === "Products" ? 
                          [
                            {title: 'Image'},
                            {title: 'Name'},
                          ]
                          :
                          [{title: 'Name'}]
                        }
                        
                        pagination={list.length > 0 ?{
                          label:`${currentPage}`,
                          hasNext: currentPage < totalPages ? true : false,
                          hasPrevious:currentPage > 1  ? true : false,
                          onNext: () => {setCurrentPage((prev:number)=>prev += 1)},
                          onPrevious: () =>{setCurrentPage((prev:number)=>prev -= 1)}
                        }: undefined}
                    >
                        {rowMarkup}
                    </IndexTable>
                {/* </Modal.Section> */}
                </Modal>

                <div className="flex justify-end my-3">
                    <ButtonGroup>
                        <Button onClick={()=>setStandStep((prev:number)=>(prev -= 1))}>Previous</Button>
                        <Button variant="primary" onClick={handleNext}>Next</Button>
                    </ButtonGroup>
                </div>
            </div>

        </Card>
    </div>

function disambiguateLabel(key: string, value: string | any[]): string {
    switch (key) {
      case 'moneySpent':
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case 'taggedWith':
        return `Tagged with ${value}`;
      case 'accountStatus':
        return (value as string[]).map((val) => `Customer ${val}`).join(', ');
      default:
        return value as string;
    }
  }

  function isEmpty(value: string | any[]) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }
}

export default StepThree