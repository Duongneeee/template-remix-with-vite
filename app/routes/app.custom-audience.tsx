import { useEffect, useState } from "react";
import {
  Page,
  Layout,
  Card,
  IndexTable,
  useIndexResourceState,
  Button,
  TextField,
  Icon,
  Text,
} from "@shopify/polaris";
import {
  SearchIcon,
  PlusIcon,
  DeleteIcon,
  EditIcon,
} from "@shopify/polaris-icons";
import DeleteModal from "~/components/common/DeleteModal";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import { Link, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import type { IAudienceConfigReq } from "~/backend/types/audienceConfig.type";
import {
  deletePixelById,
  getListAudienceConfigByShop,
} from "~/backend/services/audienceConfig.service";
import EmptyTableContent from "~/components/common/EmptyTableContent";
import FooterComponent from "~/components/common/FooterComponent";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const res = (await getListAudienceConfigByShop(session.shop)) as any;
  if (res.isSuccessful)
    return json({
      audiences: res.result,
    });
  else
    return json({
      audiences: [],
      error: res,
    });
}
export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const id = formData.get("id");
  if (request.method === "DELETE" && id) {
    await deletePixelById(Number(id));
  }
  // if (request.method === "PUT" && pixelId) {
  //   await updatePixelStatus(String(pixelId), String(status));
  // }

  return { id: id };
}
const CustomAudience = () => {
  const submit = useSubmit();
  const [searchQuery, setSearchQuery] = useState("");
  const { audiences }: any = useLoaderData<typeof loader>();
  const [deleteId, setDeleteId] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [isExecuted, setIsExecuted] = useState(false);
  const navigate = useNavigate();
  const resourceName = {
    singular: "custom-audience",
    plural: "custom-audience",
  };
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(audiences);
  useEffect(() => {
    const deleteBody = {
      pixelName: deleteName,
      id: deleteId,
    };
    if (isExecuted) {
      submit(deleteBody, { method: "DELETE" });
      setIsExecuted(false);
      setDeleteId("");
    }
  }, [deleteId, deleteName, isExecuted, submit]);

  const filteredRows =
    audiences &&
    audiences.length > 0 &&
    audiences.filter((audience: IAudienceConfigReq) =>
      audience.audienceName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // console.log("filter", filteredRows);
  const handleDelete = async (id: any, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };
  const rowMarkup =
    filteredRows &&
    filteredRows.map(
      (
        {
          id,
          isLookaLikeAudience,
          audienceName,
          pixelId,
          audienceBase,
          source,
          audienceSize,
          updatedAt,
          createdAt,
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
            <Text variant="bodyMd" fontWeight="bold" as="span">
              {audienceName}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>{audienceBase}</IndexTable.Cell>
          <IndexTable.Cell>{source}</IndexTable.Cell>
          <IndexTable.Cell>
            {isLookaLikeAudience ? "LookaLike Audience" : "Custom Audience"}
          </IndexTable.Cell>
          <IndexTable.Cell>{createdAt}</IndexTable.Cell>
          <IndexTable.Cell>{updatedAt}</IndexTable.Cell>
          <IndexTable.Cell>{audienceSize}</IndexTable.Cell>
          <IndexTable.Cell>
            <div className="flex gap-2">
              <Link to={`/app/audience/${id}`}>
                <Button icon={EditIcon} accessibilityLabel="Edit item" />
              </Link>
              <Button
                icon={DeleteIcon}
                accessibilityLabel="Remove item"
                onClick={() => handleDelete(Number(id), audienceName)}
              />
            </div>
          </IndexTable.Cell>
        </IndexTable.Row>
      )
    );
  const emptyStateMarkup = (
    <EmptyTableContent
      onAction={() => navigate("/app/audience/new")}
      actionText="Connect with Facebook"
    />
  );
  return (
    <Page
      title="Custom Audience"
      fullWidth
      primaryAction={
        <div className="flex gap-4">
          <Button
            icon={PlusIcon}
            onClick={() => navigate("/app/audience/new")}
            variant="primary"
          >
            Custom Audience
          </Button>
          <Button
            icon={PlusIcon}
            onClick={() => navigate("/app/lookalike/new")}
            variant="primary"
          >
            Custom LookaLike Audience
          </Button>
        </div>
      }
    >
      <div className="mb-[60px]">
        <Layout>
          {audiences?.length > 0 ? (
            <Layout.Section>
              <div className="p-1 w-full">
                <TextField
                  label=""
                  prefix={<Icon source={SearchIcon} tone="base" />}
                  autoComplete="off"
                  placeholder="Search audience"
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
              {audiences?.length === 0 ? (
                emptyStateMarkup
              ) : (
                <>
                  <IndexTable
                    emptyState={emptyStateMarkup}
                    selectable={false}
                    resourceName={resourceName}
                    itemCount={audiences.length}
                    selectedItemsCount={
                      allResourcesSelected ? "All" : selectedResources.length
                    }
                    onSelectionChange={handleSelectionChange}
                    headings={[
                      { title: "Audience name" },
                      { title: "Audience base" },
                      { title: "Source" },
                      { title: "Type" },
                      { title: "Created" },
                      { title: "Last Updates" },
                      { title: "Estimated audience size" },
                      { title: "Action" },
                    ]}
                  >
                    {rowMarkup}
                  </IndexTable>
                </>
              )}
            </Card>
          </Layout.Section>

          <DeleteModal
            open={!!deleteId}
            onClose={() => setDeleteId("")}
            id={deleteId}
            name={deleteName}
            setIsExecuted={setIsExecuted}
          />
        </Layout>
        <FooterComponent
          text={"Custom Audience"}
          url={
            "https://zotek.gitbook.io/facebook-multiple-pixel/getting-started/get-your-pixels-ready"
          }
        />
      </div>
    </Page>
  );
};

export default CustomAudience;
