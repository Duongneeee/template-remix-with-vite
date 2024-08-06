import { Button, IndexTable, Tooltip, useIndexResourceState } from "@shopify/polaris";
import { DeleteIcon, ViewIcon, UploadIcon, ClipboardIcon } from "@shopify/polaris-icons";
import MultipleModal from "../common/MultipleModal";
import { useNavigate, useSubmit } from "@remix-run/react";
import { IProductFeedConfigReq } from "~/backend/types/productFeedConfig.type";
import EmptyTableContent from "../common/EmptyTableContent";
import { formatTime } from "~/utils";

interface IDataTableFeed {
    productFeeds: any
    searchQuery: string
    backendApi: string
    setDataFeed: (value:any) => void
    setDeleteId: (value:string) =>void
    setDeleteName: (value:string) =>void
    setIsCheckboxOfDel: (value:boolean) =>void
    setProductFeedIdFb:  (value:string) =>void

}
const DataTableFeed = (props:IDataTableFeed) =>{
    const navigate = useNavigate();
    const { productFeeds, backendApi, searchQuery, 
        setDataFeed,
        setDeleteId,
        setDeleteName,
        setIsCheckboxOfDel,
        setProductFeedIdFb} = props
    const submit = useSubmit();
    const filteredRows =
    productFeeds &&
    productFeeds.length > 0 &&
    productFeeds.filter((productFeed: IProductFeedConfigReq) =>
      {
        return productFeed.name.toLowerCase().includes(searchQuery.toLowerCase())
      }
    );
  
    const convertNameFile = (file:string)=>{
      if(file){
          const fileName = file.split('/');
          file = fileName[fileName?.length-1]
      }
      return file;
    }

    const handleUpload = (id:number,productFeedIdFb:string)=>{
        const data = {
          id,
          productFeedIdFb,
          action:"upload"
        }
        submit(data,{method:"post"})
        // if(res)shopify.toast.show('Upload Success')
      }
    
      const handleDelete = async (id: any, name: string, productFeedIdFb:string, adAccount?:string, catalog?:string) => {
        setDeleteId(id);
        setDeleteName(name);
        setIsCheckboxOfDel(adAccount === "" && catalog === "")
        setProductFeedIdFb(productFeedIdFb);
      };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(productFeeds);

    const resourceName = {
        singular: "product-feed",
        plural: "product-feed",
      };

    const rowMarkup =
    filteredRows &&
    filteredRows.map(
      (
        {
          id,
          adAccount,
          catalog,
          name,
          file,
          schedule,
          productFeedIdFb,
          createdAt,
          logError,
          updatedAt
        }: any,
        index: number
      ) => (
        <IndexTable.Row
          id={id}
          key={id}
        //   selected={selectedResources.includes(id)}
          position={index}
        > 
          <IndexTable.Cell>{adAccount}</IndexTable.Cell>
          <IndexTable.Cell>{catalog}</IndexTable.Cell>
          <IndexTable.Cell>{name}</IndexTable.Cell>
          <IndexTable.Cell>
            {
              file && 
              <Button 
                variant="plain" 
                icon={ClipboardIcon} 
                onClick={()=>{
                  const fileName = backendApi +file;
                  navigator.clipboard.writeText(fileName);
                  shopify.toast.show('Copy Success')
                }}
              >
                {convertNameFile(file || "")}
              </Button>
            }
          </IndexTable.Cell>
          <IndexTable.Cell>{schedule}</IndexTable.Cell>
          <IndexTable.Cell>{formatTime(createdAt)}</IndexTable.Cell>
          <IndexTable.Cell>{formatTime(updatedAt)}</IndexTable.Cell>
          <IndexTable.Cell>
            {
              logError !== null && logError !== "" &&
              <MultipleModal logError={logError}/>
            }
          </IndexTable.Cell>
          <IndexTable.Cell>
            <div className="flex gap-2">
              {/* <Link to={`/app/custom-feed/${id}`}>
                <Button accessibilityLabel="Edit item" icon={EditIcon}/>
              </Link> */}
              <Tooltip content="Click here to upload your file to Facebook.">
                <Button accessibilityLabel="View item" icon={UploadIcon} onClick={()=>handleUpload(id as number, productFeedIdFb)} disabled={!adAccount && !catalog} />
              </Tooltip>
              <Tooltip content="Click here to navigate to the Facebook Catalog.">
                <Button 
                  accessibilityLabel="View item" 
                  icon={ViewIcon} 
                  url={`https://business.facebook.com/commerce/catalogs/${catalog}/data_sources?business_id=${adAccount}`} 
                  target="_blank" 
                  disabled={!adAccount && !catalog}/>
              </Tooltip>
              <Tooltip content="Click here to delete this record.">
                <Button accessibilityLabel="Remove item" icon={DeleteIcon} onClick={() => handleDelete(Number(id),name, productFeedIdFb, adAccount, catalog)}/>
              </Tooltip>
            </div>
          </IndexTable.Cell>
        </IndexTable.Row>
      )
    );

    const emptyStateMarkup = (
        <EmptyTableContent
          onAction={() => navigate("/app/custom-feed/new")}
          actionText="Create Product Feed"
          image="https://d2qfs3b62dkzxt.cloudfront.net/images/productFeed.webp"
        />
      );
    return (
        <IndexTable
            emptyState={emptyStateMarkup}
            selectable={false}
            resourceName={resourceName}
            itemCount={productFeeds.length}
            selectedItemsCount={
                allResourcesSelected ? "All" : selectedResources.length
            }
            onSelectionChange={handleSelectionChange}
            headings={[
                { title: "Business Account" },
                { title: "Catalog" },
                { title: "Product Feed" },
                { title: "File" },
                { title: "Schedule" },
                { title: "Created" },
                { title: "Updated" },
                { title: "Error File" },
                { title: "Action" },
            ]}
            >
            {rowMarkup}
        </IndexTable> 
        
    )
}

export default DataTableFeed