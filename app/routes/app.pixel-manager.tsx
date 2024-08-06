import {
  Page,
  Card,
  IndexTable,
  useIndexResourceState,
  Button,
  TextField,
  Icon,
  Tooltip,
  Banner,
} from "@shopify/polaris";
import { SearchIcon, EditIcon, DeleteIcon, AlertTriangleIcon } from "@shopify/polaris-icons";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { authenticate } from "~/shopify.server";
import { useEffect, useState } from "react";
import DeleteModal from "~/components/common/DeleteModal";
import Switch from "react-switch";
import {
      getListPixelByShopService,
  updatePixelStatus,
} from "~/backend/services/cApiConfig.service";
import type {ICApi_MetaPixelUpdate } from "~/backend/types/cApiConfig.type";
import { deleteUserDataByPixelId } from "~/backend/services/userData.service";
import { Crisp } from "crisp-sdk-web";
import TabsCustom from "~/components/common/TabsCustom";
import SvgFacebook from "~/components/svgs/SvgFacebook";
import SvgTiktok from "~/components/svgs/SvgTiktok";
import EmptyTableContent from "~/components/common/EmptyTableContent";
import FooterComponent from "~/components/common/FooterComponent";
import { checkOnboarding } from "~/utils/checkOnBoarding";

export async function loader({ request }: LoaderFunctionArgs) {
  // const { session } = await authenticate.admin(request);
  // const {shop} = session;

  const { isOnBoarding, shop }: any = await checkOnboarding(request);

  if(!isOnBoarding){
    const url = new URL(request.url);
    return redirect(`/app/onboarding?${url.searchParams.toString()}`)
  }
  const isPixelSuccessful = new URL(request.url).searchParams.get("isPixelSuccessful") || '';
  const isTikokSuccessful = new URL(request.url).searchParams.get("tiktok") || '';

  const pixels = (await getListPixelByShopService(shop)) as any;

  if (pixels.isSuccessful)
    return json({
      pixels: pixels.result,
      shop: shop,
      isPixelSuccessful,
      isTikokSuccessful,
    });
  else
    return json({
      pixels: [],
      error: pixels,
    });
  }

export async function action({ request }: { request: Request }) { 
  const formData = await request.formData();
  const id = formData.get("id");
  const pixelId = formData.get("pixelId");
  const status = formData.get("status");
  // const action = formData.get("action")
  const platform = formData.get("platform")
  const { session } = await authenticate.admin(request);
  const { shop } = session;

  // if (
  //   action &&
  //   action === "handleScriptCheckout"
  // ) {
  //   await createProfileAppConfigService(shop, 2, "true");
  //   return null ;
  // }

  if (request.method === "DELETE" && id) {
    const data = {
      id:Number(id),
      pixelId:String(pixelId),
      shop:shop,
      platform
    }
    await deleteUserDataByPixelId(data);
  }
  if (request.method === "PUT" && pixelId) {
    await updatePixelStatus(String(pixelId), String(status), shop);
  }

  return { pixelId: pixelId };

}

const resourceName = {
  singular: "pixels",
  plural: "pixels",
};

export default function Index() {
  const submit = useSubmit();
  const navgation = useNavigate();
  const { pixels, shop, isPixelSuccessful, isTikokSuccessful }: any =
    useLoaderData<typeof loader>();
  useEffect(()=>{
    if(isPixelSuccessful && isPixelSuccessful == "true"){
      Crisp.session.pushEvent("create_pixel_save")
      Crisp.message.showText('Congratulations on successfully configuring your pixel. \nDo you need any assistance testing events, or are you all set to go?')
      navgation(`/app/pixel-manager`)
      shopify.toast.show('Pixel Created')
    }
    if(isPixelSuccessful && isPixelSuccessful == "false"){
      navgation(`/app/pixel-manager`)
      shopify.toast.show('Pixel Updated')
    }
  },[isPixelSuccessful])

  const navigate = useNavigate();
  const [isExecuted, setIsExecuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [deletePixelId, setDeletePixelId] = useState("");
  const [deletePixelName, setDeletePixelName] = useState("");
  const [pixelsState, setPixelsState] = useState(pixels);

  const filteredRows =
  pixelsState &&
  pixelsState.length > 0 &&
  pixelsState.filter((pixel: ICApi_MetaPixelUpdate) =>
    pixel.name.toLowerCase().includes(searchQuery.toLowerCase()) && pixel.platform === (isTikokSuccessful === "true" ? "tiktok" : "facebook")
  );

  const [pixelData,setPixelData] = useState<ICApi_MetaPixelUpdate[]>(filteredRows);

  useEffect(() => {
    const deleteBody = {
      id:deleteId,
      pixelId: deletePixelId,
      pixelName: deletePixelName,
      platform: selected === 0 ? 'facebook' : 'tiktok'
    };
    if (isExecuted) {
      submit(deleteBody, { method: "DELETE" });
      setIsExecuted(false);
      setPixelData((pixelData?.filter((pixel:ICApi_MetaPixelUpdate)=> !(pixel.id === Number(deleteId)))));
      setPixelsState(pixelsState?.filter((pixel:ICApi_MetaPixelUpdate)=> !(pixel.id === Number(deleteId))));
      setDeleteId("");
    }
  }, [deletePixelId, deleteId, deletePixelName, isExecuted, submit]);

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(pixelsState);
  // const filteredRows =
  //   pixels &&
  //   pixels.length > 0 &&
  //   pixels.filter((pixel: ICApi_MetaPixelRequest) =>
  //     pixel.name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  const handleDelete = async (id: any, pixelId: any, name: string) => {
    setDeleteId(id);
    setDeletePixelId(pixelId);
    setDeletePixelName(name);
  };
  const handleChangeStatus = async (value: boolean, pixelId: string) => {
    const body = {
      pixelId: pixelId,
      status: value,
    };
    submit(body, { method: "PUT" });

    const updateStatus = pixelData.map((item)=>{
      if(item.pixelId === pixelId) return ({...item,status:value});
      return item
    })

    const updatePixelsState = pixelsState.map((item:any)=>{
      if(item.pixelId === pixelId) return ({...item,status:value});
      return item
    })
    setPixelsState(updatePixelsState)

    setPixelData(updateStatus);
  };

  const [selected, setSelected] = useState<number>(isTikokSuccessful === "true"? 1 : 0);
  const handleTabChange =
    (selectedTabIndex: number) => {
      const selectPlatform = selectedTabIndex === 0 ? "facebook" : "tiktok";
      setPixelData(pixelsState.filter((pixel: ICApi_MetaPixelUpdate) =>
        pixel.name.toLowerCase().includes(searchQuery.toLowerCase()) && pixel.platform === selectPlatform
      ))
      setSelected(selectedTabIndex)
    };

    const tabs =[
      {
        id:0,
        title: 'Facebook',
        icon: <SvgFacebook/>,
      },
      {
        id: 1,
        title: 'Tiktok',
        icon:<SvgTiktok/>,
      },
    ];

  const warningTooltip = (
    <div>
      <Tooltip padding="default" content={
            <Banner tone="warning" >
              <p>
                Use this to test the Server-Side Event. Must be removed immediately after testing.
              </p>
            </Banner>
          }>
         <Icon source={AlertTriangleIcon} tone="textWarning"/>
      </Tooltip>
      </div>
  )

  const rowMarkup =
    pixelData &&
    pixelData.map(
      (
        {
          id,
          status,
          name,
          pixelId,
          testEventCode,
          targetArea,
          isActiveCApi,
        }: any,
        index: number
      ) => (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            {
              <div>
                <Switch
                  onColor="#86d3ff"
                  onHandleColor="#2693e6"
                  height={14}
                  width={33}
                  uncheckedIcon={true}
                  checkedIcon={false}
                  onChange={() => handleChangeStatus(!status, pixelId)}
                  checked={status}
                />
              </div>
            }
          </IndexTable.Cell>
          <IndexTable.Cell>{name}</IndexTable.Cell>
          <IndexTable.Cell>{pixelId}</IndexTable.Cell>
          <IndexTable.Cell><div className="flex">{testEventCode}{testEventCode && warningTooltip}</div></IndexTable.Cell>
          <IndexTable.Cell>{targetArea}</IndexTable.Cell>
          <IndexTable.Cell>
            {isActiveCApi ? "active" : "inactive"}
          </IndexTable.Cell>
          <IndexTable.Cell>
            <div className="flex gap-2">
              <Link to={`/app/${selected === 0 ? 'pixel' : 'pixel-tiktok'}/${id}`}>
                <Button  icon={EditIcon} />
              </Link>

              <Button
                icon={DeleteIcon}
                onClick={() => handleDelete(id, pixelId, name)}
              />
            </div>
          </IndexTable.Cell>
        </IndexTable.Row>
      )
    );
  const emptyStateMarkup = (
    <EmptyTableContent
      onAction={() => navigate(`/app/${selected === 0 ? 'pixel' : 'pixel-tiktok'}/new`)}
      actionText={`Create ${selected === 0 ? 'Facebook': 'Tiktok'} Pixel`}
    />
  );

  const handleChangeSearchQuery = (valueSearch:string) => {
    const selectPlatform = selected === 0 ? "facebook" : "tiktok";
    setPixelData(pixelsState.filter((pixel: ICApi_MetaPixelUpdate) =>
      pixel.name.toLowerCase().includes(valueSearch.toLowerCase()) && pixel.platform === selectPlatform
    ))
    setSearchQuery(valueSearch)
  };

  return (
    <Page
      title="Pixel Manager"
      fullWidth
    >
      <Card>
        <TabsCustom tabs={tabs} selected={selected} onSelect={handleTabChange} className='cursor-pointer'>
               <>
                  <div className="mb-[60px]">
                    {/* <Layout> */}
                      {/* { pixelData?.length > 0 ? ( */}
                        {/* <Layout.Section> */}
                          <div className="py-4 w-full flex justify-between gap-5">
                            <div className="flex-1">
                              <TextField
                                label=""
                                prefix={<Icon source={SearchIcon} tone="base" />}
                                autoComplete="off"
                                placeholder={`Search ${selected === 0 ? 'Facebook': 'Tiktok'} pixel name`}
                                value={searchQuery}
                                onChange={handleChangeSearchQuery}
                              />
                            </div>
                            {
                              !selected ?
                              <Button onClick={()=>navigate('/app/pixel/new')} variant="primary">Create Facebook Pixel</Button>
                              :
                              <Button onClick={()=>navigate('/app/pixel-tiktok/new')} variant="primary">Create Tiktok Pixel</Button>
                            }
                          </div>
                        {/* </Layout.Section> */}

                        {/* <Layout.Section> */}
                          <Card padding="0">
                            {/* { !searchQuery && pixelData.length === 0 ? (
                              emptyStateMarkup
                            ) : ( */}
                              <>
                                <IndexTable
                                  emptyState={emptyStateMarkup}
                                  selectable={false}
                                  resourceName={resourceName}
                                  itemCount={pixels.filter((item:any)=>item.platform === (selected === 0 ? 'facebook' : 'tiktok')).length}
                                  selectedItemsCount={
                                    allResourcesSelected ? "All" : selectedResources.length
                                  }
                                  onSelectionChange={handleSelectionChange}
                                  headings={[
                                    // { title: "Id" },
                                    { title: "Status" },
                                    { title: "Pixel Name" },
                                    { title: "Pixel ID" },
                                    { title: "Test Event Code" },
                                    { title: "Target Area" },
                                    { title: "Conversion API" },
                                    { title: "Action" },
                                  ]}
                                >
                                  {rowMarkup}
                                </IndexTable>
                              </>
                            {/* )} */}
                          </Card>
                        {/* </Layout.Section> */}

                        <DeleteModal
                          open={!!deleteId}
                          onClose={() => setDeleteId("")}
                          id={deleteId}
                          pixelId={deletePixelId}
                          name={deletePixelName}
                          setIsExecuted={setIsExecuted}
                          setPixelData={setPixelData}
                          pixelData={pixelData}
                          isTypeDelete={false}
                          pixelsState={pixelsState}
                          setPixelsState={setPixelsState}
                          selectPlatform={selected}
                        />
                    {/* </Layout>    */}
                  </div>
                </>
        </TabsCustom>
      </Card>
      <FooterComponent
          text={"Pixel"}
          url={
            "https://zotek.gitbook.io/facebook-multiple-pixel/getting-started/get-your-pixels-ready"
          }
        />
    </Page>
  );
}
