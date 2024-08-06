import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  BlockStack,
  Card,
  Layout,
  Page,
  TextField,
  Text,
  PageActions,
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "~/shopify.server";
import { audienceChoiceOptions } from "~/constants/options";
import AudienceRulesForm from "~/components/AudienceRulesForm";
import {
  createAudienceConfig,
  getAudienceConfigById,
  updateAudienceConfig,
  validateAudienceConfig,
} from "~/backend/services/audienceConfig.service";
import type { IAudienceConfigReq } from "~/backend/types/audienceConfig.type";
import { replaceNullWithString } from "~/utils";
import { jsonToFormData } from "~/utils/transform";
import { getListPixelByShopService } from "~/backend/services/cApiConfig.service";
import { ICApi_MetaPixelRequest } from "~/backend/types/cApiConfig.type";
import SingleChoiceList from "~/components/pixel/SingleChoiceList";
import FooterComponent from "~/components/common/FooterComponent";
export async function loader({ request, params }: any) {
  const { admin, session } = await authenticate.admin(request);
  const { shop, accessToken } = admin.rest.session;

  const metaPixel = (await getListPixelByShopService(session.shop)).result;

  if (params.id === "new") {
    return json<any>({
      shop,
      accessToken,
      metaPixel,
    });
  }
  const audienceData = await getAudienceConfigById(Number(params.id));
  return json<any>({
    audienceData: { ...audienceData.result },
    shop,
    accessToken,
    session,
    metaPixel,
  });
}
export async function action({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  var requestData: any = {
    ...Object.fromEntries(await request.formData()),
  };
  const errors = validateAudienceConfig(requestData);

  if (errors) {
    return json({ errors }, { status: 422 });
  }
  if (params.id === "new") {
    const createData: IAudienceConfigReq = {
      ...requestData,
      shop: shop,
    };
    const res = await createAudienceConfig(replaceNullWithString(createData));
    if (res.isSuccessful) return redirect(`/app/custom-audience`);
    else return json({ ...res });
  } else {
    const updateData: IAudienceConfigReq = {
      ...requestData,
      shop: shop,
      status: String(requestData.status).toLowerCase() === "true",
      isActiveCApi: String(requestData.isActiveCApi).toLowerCase() === "true",
      pixelId: params.id,
    };
    const res = await updateAudienceConfig(replaceNullWithString(updateData));
    if (res.isSuccessful) return redirect(`/app/custom-audience`);
    else return json({ ...res });
  }
}
const Audiences = () => {
  var formData = useLoaderData<typeof loader>();
  const audienceData = formData.audienceData;
  var formatedData;
  if (typeof audienceData !== "undefined") {
    formatedData = {
      ...audienceData,
      rule: JSON.parse(audienceData.rule),
    };
  }
  const initalState =
    typeof audienceData !== "undefined"
      ? formatedData
      : {
          adAccount: "",
          audienceName: "",
          description: "",
          conditions: "all",
          rule: [],
        };
  const [formState, setFormState] = useState<any>(initalState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cleanFormState, setCleanFormState] = useState<any>(initalState);
  const [isFormChange, setIsFormChange] = useState<boolean>(false);
  const isDirty: boolean =
    JSON.stringify(formState) !== JSON.stringify(cleanFormState);
  const lstAccounts = [
    { value: "12113133", label: "Huy_test" },
    { value: "232343", label: "Long_test" },
  ];
  const nav = useNavigation();
  const isSaving: boolean =
    nav.state === "submitting" && nav.formData?.get("action") !== "delete";
  const isDeleting: boolean =
    nav.state === "submitting" && nav.formData?.get("action") === "delete";

  const navigate = useNavigate();
  const submit = useSubmit();
  function handleBackOrCancel() {
    return isDirty ? setIsFormChange(true) : navigate("/app/custom-audience");
  }
  function handleSave() {
    setIsSubmitting(true);
    if (!isDirty || isSaving || isDeleting) {
      console.log("test");
      const data: any = {
        ...formState,
        rule: JSON.stringify(formState.rule),
      };
      console.log("data", data);
      setCleanFormState({ ...formState });
      submit(jsonToFormData(data), { method: "post" });
    }
    const data: any = {
      ...formState,
      rule: JSON.stringify(formState.rule),
    };
    console.log("data", data);
    setCleanFormState({ ...formState });
    submit(jsonToFormData(data), { method: "post" });
  }
  // data select Pixel
  const selectPixel = formData?.metaPixel.map(
    (item: ICApi_MetaPixelRequest) => ({
      value: item.pixelId,
      label: item.name,
    })
  );

  //element adAcount

  const elementAdAcount = (
    <TextField
      // disabled={!formState.isActiveCApi}
      id="adAccount"
      label={
        <Text variant="bodyMd" fontWeight="semibold" as="span">
          Add Account ID
        </Text>
      }
      autoComplete="off"
      // error={formState.testEventCode && enabledConversionsApi && isSubmitting ? "Test Event Code is required" : ""}
      value={formState.adAccount}
      onChange={(adAccount) => setFormState({ ...formState, adAccount })}
    />
  );

  const elementAudienceRule = (
    <Card>
      <BlockStack gap="200">
        <Text as="h2" variant="headingMd" fontWeight="semibold">
          Conditions
        </Text>
        <SingleChoiceList
          title="Includes all audiences that meet ALL or ANY of the following criteria:"
          choices={audienceChoiceOptions}
          value={formState.conditions}
          onChange={(conditions) =>
            setFormState((prev: any) => ({
              ...prev,
              conditions: conditions,
            }))
          }
        />
      </BlockStack>
      <div className="mt-4">
        <AudienceRulesForm
          selectPixel={selectPixel || []}
          value={formState?.rule}
          id={formState?.id}
          onChange={(rule) => setFormState({ ...formState, rule })}
        />
      </div>
    </Card>
  );

  console.log("formState", formState);

  return (
    <Page
      fullWidth
      backAction={{
        content: "Settings",
        onAction: () => handleBackOrCancel(),
      }}
      primaryAction={{
        content: "Save",
        loading: isSaving,
        // disabled:
        //   !isDirty || isSaving || isDeleting || isSubmitting,
        onAction: handleSave,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          loading: isDeleting,
          disabled:
            !formData.id ||
            !formData ||
            isSaving ||
            isDeleting ||
            isSubmitting ||
            isFormChange,
          destructive: true,
          outline: true,
          onAction: handleBackOrCancel,
        },
      ]}
      title={
        formData.id
          ? "Custom Audience / Edit Audience"
          : "Custom Audience / Create Custom Audience"
      }
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card padding="600">
              {typeof audienceData == "undefined"
                ? elementAdAcount
                : audienceData.isLookaLikeAudience == false && elementAdAcount}

              <TextField
                // disabled={!formState.isActiveCApi}
                id="audienceName"
                label={
                  <Text variant="bodyMd" fontWeight="semibold" as="span">
                    Audience Name
                  </Text>
                }
                autoComplete="off"
                // error={formState.testEventCode && enabledConversionsApi && isSubmitting ? "Test Event Code is required" : ""}
                value={formState.audienceName}
                onChange={(audienceName) =>
                  setFormState({ ...formState, audienceName })
                }
              />
              <TextField
                // disabled={!formState.isActiveCApi}
                id="description"
                label={
                  <Text variant="bodyMd" fontWeight="semibold" as="span">
                    Description
                  </Text>
                }
                autoComplete="off"
                // error={formState.testEventCode && enabledConversionsApi && isSubmitting ? "Test Event Code is required" : ""}
                value={formState.description}
                onChange={(description) =>
                  setFormState({ ...formState, description })
                }
              />
            </Card>

            <div className="mb-4">
              {typeof audienceData == "undefined"
                ? elementAudienceRule
                : audienceData.isLookaLikeAudience == false &&
                  elementAudienceRule}
            </div>
          </BlockStack>
        </Layout.Section>
        {/* [START actions] */}
        <Layout.Section>
          <div className="flex">
            <PageActions
              secondaryActions={[
                {
                  content: "Cancel",
                  loading: isDeleting,

                  // destructive: true,
                  outline: true,
                  onAction: handleBackOrCancel,
                },
              ]}
              primaryAction={{
                content: "Save",
                loading: isSaving,
                onAction: handleSave,
              }}
            />
          </div>
        </Layout.Section>
        {/* [END actions] */}
      </Layout>
      <FooterComponent
        text={"Custom Audience"}
        url={
          "https://zotek.gitbook.io/facebook-multiple-pixel/getting-started/get-your-pixels-ready"
        }
      />
    </Page>
  );
};

export default Audiences;
