import { useEffect, useState } from "react";
import {
  Page,
  Layout,
  Card,
  Button,
  TextField,
  Icon,
  Banner,
} from "@shopify/polaris";
import { SearchIcon , PlusIcon } from "@shopify/polaris-icons";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
// import { authenticate } from "~/shopify.server";
import { useActionData, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { getListProductFeedConfigByShop, deleteProductFeedConfigById } from "~/backend/services/productFeedConfig.service";
import { ApiDeleteProductFeed, ApiUpdateProductFeed } from "~/backend/external_apis/backend_pixel/pixel_api.service";
import DeleteModalProduct from "~/components/feed/DeleteModalProduct";
import FooterComponent from "~/components/common/FooterComponent";
import DataTableFeed from "~/components/feed/DataTableFeed";
import { checkOnboarding } from "~/utils/checkOnBoarding";

export async function loader({ request }: LoaderFunctionArgs) {
  // const { session } = await authenticate.admin(request);
  const { isOnBoarding, shop }: any = await checkOnboarding(request);

  if(!isOnBoarding){
    const url = new URL(request.url);
    return redirect(`/app/onboarding?${url.searchParams.toString()}`)
  }

  const res = await getListProductFeedConfigByShop(shop) as any;

  if (res.isSuccessful) {
    const dataError:any = [];
    res.result.map((item:any)=>{
      if(item?.logError !== null && item.logError !== ""){
        dataError.push({name:item.name, id:item.id}) 
      }
    }) || [];
    return json({
      backendApi: process.env.PIXEL_BACKEND_API,
      productFeeds: res.result,
      dataError
    })
  ;}
  else return json({
    backendApi: process.env.PIXEL_BACKEND_API,
    productFeeds: [],
    error: res
  });

}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const id = formData.get("id");
  const productFeedIdFb = formData.get("productFeedIdFb") ||"";
  if (request.method === "DELETE" && id) {
    if(formData.get('isDeleteFb') === "true" && productFeedIdFb !== "null"){
      await ApiDeleteProductFeed(Number(id),String(productFeedIdFb))
    }
    await deleteProductFeedConfigById(Number(id));
  }
  if(formData.get('action') === "upload"){
    await ApiUpdateProductFeed(Number(id),productFeedIdFb as string);

    return json({isSuccessfull:true})
  }
  // if (request.method === "PUT" && pixelId) {
  //   await updatePixelStatus(String(pixelId), String(status));
  // }

  return json({ id: id,isSuccessfull:false });
}
const CustomProductFeed = () => {
  const submit = useSubmit();
  const [searchQuery, setSearchQuery] = useState("");
  const { productFeeds, backendApi, dataError }: any = useLoaderData<typeof loader>();
  const [deleteId, setDeleteId] = useState("");
  const [isCheckboxOfDel, setIsCheckboxOfDel] = useState<boolean>(false);
  const [deleteName, setDeleteName] = useState("");
  const [productFeedIdFb, setProductFeedIdFb] = useState("");
  const [isExecuted, setIsExecuted] = useState(false);
  const actionData = useActionData<typeof action>();
  const [checked, setChecked] = useState<boolean>(false);
  const [dataFeed, setDataFeed] =  useState(productFeeds);
  const [dataErrorFeed, setDataErrorFeed] =  useState(dataError || []);
  const navigate = useNavigate();

  useEffect(() => {
    const deleteBody = {
      pixelName: deleteName,
      id: deleteId,
      productFeedIdFb,
      isDeleteFb:checked
    };
    if (isExecuted) {
      submit(deleteBody, { method: "DELETE" });
      setDataFeed((dataFeed?.filter((feed:any)=> !(feed.id === Number(deleteId)))))
      setDataErrorFeed((dataErrorFeed?.filter((feed:any)=> !(feed.id === Number(deleteId)))))
      setIsExecuted(false);
      setChecked(false);
      setDeleteId("");
    }
  }, [deleteId, deleteName, isExecuted, submit]);

  useEffect(()=>{
    if(actionData && actionData.isSuccessfull){
      shopify.toast.show('Upload Success')
    }
  },[actionData])

  useEffect(()=>{
    setDataFeed(productFeeds);
    setDataErrorFeed(dataError);
  },[productFeeds, dataError])

  return (
    <Page title="Product Feed" 
    fullWidth
    primaryAction={
      <div className="flex gap-4">
      <Button icon={PlusIcon} onClick={() => navigate("/app/custom-feed/new")} variant="primary">
        Create Product Feed
      </Button>
      </div>
    }
    >
      {
        dataErrorFeed.length > 0 &&
          <div className="mb-3">
            <Banner
              title="Product Feed is configured incorrectly"
              tone="warning"
            >
              <p>
              The product feed name <strong>{dataErrorFeed.map((item:any)=>item.name).join(', ')}</strong> is not configured correctly. Please view error details by click the View Error button in each record.
              </p>
            </Banner>
          </div>
      }
      <div className="mb-[60px]">
        <Layout>
          {productFeeds?.length > 0 ? (
            <Layout.Section>
              <div className="p-1 w-full">
                <TextField
                  label=""
                  prefix={<Icon source={SearchIcon} tone="base" />}
                  autoComplete="off"
                  placeholder="Search product feed name"
                  value={searchQuery}
                  onChange={(valueSearch) => setSearchQuery(valueSearch)}
                />
              </div>
            </Layout.Section>
          ) : (
            <></>
          )}

          <Layout.Section>
            <Card padding="0">
              <DataTableFeed 
                productFeeds={dataFeed}
                searchQuery={searchQuery}
                backendApi={backendApi}
                setDataFeed={setDataFeed}
                setDeleteId={setDeleteId}
                setDeleteName={setDeleteName}
                setIsCheckboxOfDel={setIsCheckboxOfDel}
                setProductFeedIdFb={setProductFeedIdFb}
              />
            </Card>
          </Layout.Section>

          <DeleteModalProduct
            open={!!deleteId}
            onClose={() => {
              setDeleteId("")
              setIsCheckboxOfDel(false)
            }}
            id={deleteId}
            name={deleteName}
            setIsExecuted={setIsExecuted}
            checked={checked}
            setChecked={setChecked}
            isCheckboxOfDel={isCheckboxOfDel}
          />
        </Layout>
        <FooterComponent
          text={"Product Feed"}
          url={
            "https://zotek.gitbook.io/facebook-multiple-pixel/getting-started/product-feed"
          }
        />
      </div>
    </Page>
  );
};

export default CustomProductFeed;