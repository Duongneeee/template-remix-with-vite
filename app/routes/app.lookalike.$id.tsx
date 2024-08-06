/* eslint-disable @typescript-eslint/no-unused-vars */
import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import type {
  SelectOption} from "@shopify/polaris";
import {
  BlockStack,
  Card,
  Layout,
  Page,
  TextField,
  Text,
  Select,
  RangeSlider,
  Autocomplete,
  LegacyStack,
  Tag,
} from "@shopify/polaris";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AudienceSizeOptions,
} from "~/constants/options";
import { authenticate } from "~/shopify.server";
import { AlertCircleIcon } from "@shopify/polaris-icons";
import {
  createAudienceConfig,
} from "~/backend/services/audienceConfig.service";
import { jsonToFormData } from "~/utils/transform";
import type { IAudienceConfigReq } from "~/backend/types/audienceConfig.type";
import { replaceNullWithString } from "~/utils";
import { getLocaionLookaLike } from "~/backend/external_apis/facebook/facebook.service";
import FooterComponent from "~/components/common/FooterComponent";

export async function loader({ request }: any) {
  const { admin } = await authenticate.admin(request);
  const { shop, accessToken } = admin.rest.session;

  // const audienceConfig = (await getListAudienceConfigIsLookaLikeByShop(shop))
  //   .result;

  const audienceCountry = await getLocaionLookaLike({
    location_types: '["country"]',
  });

  const audienceRegion = await getLocaionLookaLike({
    location_types: '["country_group"]',
  });

  return json<any>({
    shop,
    accessToken,
    // audienceConfig,
    audienceCountry,
    audienceRegion,
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
  if (params.id === "new") {
    const createData: IAudienceConfigReq = {
      ...requestData,
      shop: shop,
      audienceSize: Number(requestData.audienceSize),
      isLookaLikeAudience: Boolean(true),
      rule: requestData.rule,
    };
    const res = await createAudienceConfig(replaceNullWithString(createData));
    if (res.isSuccessful) return redirect(`/app/custom-audience`);
    else return json({ ...res });
  }
}

function titleCase(string: string) {
  return string
    .toLowerCase()
    .split(" ")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join("");
}

export interface AudienceLookaLikeForm {
  audienceName: string;
  adAccount: string;
  audienceBase: string;
  description: string;
  rule: AudienceLookaLikeRule;
  audienceSize: number;
}

export interface AudienceLookaLikeRule {
  location_spec: AudienceLookaLikeLocation;
  ratio: number;
}

export interface AudienceLookaLikeLocation {
  geo_locations: AudienceLookaLikeGeoLocation;
}

export interface AudienceLookaLikeGeoLocation {
  countries: string[];
}

const Lookalike = () => {
  var formData = useLoaderData<typeof loader>();
  const initialState: AudienceLookaLikeForm = {
    audienceName: "",
    adAccount: "314709418170394",
    audienceBase: "",
    description: "",
    rule: {
      location_spec: {
        geo_locations: {
          countries: [],
        },
      },
      ratio: 1,
    },
    audienceSize: 1,
    // countryClassification: "1",
  };
  const [formState, setFormState] = useState<any>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cleanFormState, setCleanFormState] = useState<any>(initialState);
  const [isFormChange, setIsFormChange] = useState<boolean>(false);
  const [audienceSize, setAudienceSize] = useState<SelectOption[]>();
  const isDirty: boolean =
    JSON.stringify(formState) !== JSON.stringify(cleanFormState);
  const lstAccounts = [
    { value: "rustic", label: "Rustic" },
    { value: "antique", label: "Antique" },
    { value: "vinyl", label: "Vinyl" },
    { value: "vintage", label: "Vintage" },
    { value: "refurbished", label: "Refurbished" },
  ];

  const arraySelectaudienceBase: any[] = [
    {
      value: JSON.stringify({
        id: "120208425990750544",
        name: "My lookalike audience APi",
      }),
      label: "My lookalike audience APi",
    },
    {
      value: JSON.stringify({
        id: "120208266083380544",
        name: "My lookalike audience APi 2",
      }),
      label: "My lookalike audience APi 2",
    },
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
  useEffect(() => {
    const res = AudienceSizeOptions() as SelectOption[];
    setAudienceSize(res);
  }, []);
  function handleSave() {
    setIsSubmitting(true);
    if (!isDirty || isSaving || isDeleting) {
      return;
    }
    const rule = { ...formState.rule, ratio: formState.rule.ratio * 0.01 };
    const data: IAudienceConfigReq = {
      ...formState,
      rule: JSON.stringify(rule),
    };
    setCleanFormState({ ...formState });
    submit(jsonToFormData(data), { method: "post" });
  }

  // const arraySelectaudienceBase = formData.audienceConfig.map((item: any) => ({
  //   value: item.id,
  //   label: item.audienceName,
  // }));

  // select Region
  const arraySelectaudienceRegion = formData?.audienceRegion?.data.map(
    (item: any) => ({
      value: item.country_codes,
      label: item.name,
    })
  );

  // Start Change country
  const deselectedOptions = useMemo(
    () =>
      formData?.audienceCountry?.data.map((item: any) => ({
        value: item.key,
        label: item.name,
      })),
    []
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(deselectedOptions);

  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === "") {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, "i");
      const resultOptions = deselectedOptions.filter((option: any) =>
        option.label.match(filterRegex)
      );

      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const removeTag = useCallback(
    (tag: string) => () => {
      const options = [...selectedOptions];
      options.splice(options.indexOf(tag), 1);
      setSelectedOptions(options);
      setFormState({
        ...formState,
        rule: {
          ...formState.rule,
          location_spec: {
            ...formState.rule.location_spec,
            geo_locations: {
              ...formState.rule.location_spec.geo_locations,
              countries: options,
            },
          },
        },
      });
    },
    [selectedOptions]
  );

  const verticalContentMarkup =
    selectedOptions.length > 0 ? (
      <LegacyStack spacing="extraTight" alignment="center">
        {selectedOptions.map((option) => {
          let tagLabel = "";
          tagLabel = option.replace("_", " ");
          tagLabel = titleCase(tagLabel);
          return (
            <Tag key={`option${option}`} onRemove={removeTag(option)}>
              {tagLabel}
            </Tag>
          );
        })}
      </LegacyStack>
    ) : null;

  const textField = (
    <Autocomplete.TextField
      onChange={updateText}
      label={
        <Text variant="bodyMd" fontWeight="semibold" as="span">
          Country
        </Text>
      }
      value={inputValue}
      placeholder="Country"
      verticalContent={verticalContentMarkup}
      autoComplete="off"
    />
  );
  // End change country
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
        //   !isDirty || isSaving || isDeleting || isSubmitting || isFormChange,
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
      title={"Custom Audience / Create LookaLike"}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card padding="600">
              {/* <div className="my-4">
                <Select
                  label={
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                      LookaLike Mode
                    </Text>
                  }
                  options={lookaLikeModeOptions}
                  value={formState.mode}
                  onChange={(mode) => setFormState({ ...formState, mode })}
                />
              </div> */}
              {/* <div>
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
              </div> */}
              <div className="my-4">
                <Select
                  label={
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                      Select Ad Account
                    </Text>
                  }
                  options={lstAccounts}
                  value={formState.adAccount}
                  onChange={(adAccount) =>
                    setFormState({ ...formState, adAccount })
                  }
                />
              </div>
              <div className="my-4">
                <Select
                  label={
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                      Select Base Audience
                    </Text>
                  }
                  placeholder="Base Audience"
                  options={arraySelectaudienceBase}
                  value={
                    "" ||
                    JSON.stringify({
                      id: formState.audienceBase,
                      name: formState.audienceName,
                    })
                  }
                  onChange={(value) =>
                    setFormState({
                      ...formState,
                      audienceBase: JSON.parse(value).id,
                      audienceName: JSON.parse(value).name,
                    })
                  }
                />
              </div>
              <div className="my-4">
                <TextField
                  // disabled={!formState.isActiveCApi}
                  id="description"
                  label={
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                      Description<span>(optional)</span>
                    </Text>
                  }
                  autoComplete="off"
                  // error={formState.testEventCode && enabledConversionsApi && isSubmitting ? "Test Event Code is required" : ""}
                  value={formState.description}
                  onChange={(description) =>
                    setFormState({ ...formState, description })
                  }
                />
              </div>
              <div className="my-4">
                <Select
                  label={
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                      Select Audience location
                      <span>(Select for regions or country)</span>
                    </Text>
                  }
                  placeholder="Select for regions"
                  options={arraySelectaudienceRegion}
                  value={formState.regions}
                  onChange={(regions) =>
                    // setFormState({ ...formState, regions })
                    true
                  }
                />
              </div>
              <div className="my-4">
                <Autocomplete
                  allowMultiple
                  options={options}
                  selected={selectedOptions}
                  textField={textField}
                  onSelect={(value) => {
                    setSelectedOptions(value);
                    setFormState({
                      ...formState,
                      rule: {
                        ...formState.rule,
                        location_spec: {
                          ...formState.rule.location_spec,
                          geo_locations: {
                            ...formState.rule.location_spec.geo_locations,
                            countries: value,
                          },
                        },
                      },
                    });
                  }}
                  listTitle={undefined}
                />
                {/* <Select
                  label=""
                  placeholder="Select for countries"
                  options={arraySelectaudienceCountry}
                  value={formState.country}
                  onChange={(country) =>
                    // setFormState({ ...formState, country })
                    true
                  }
                /> */}
              </div>
              <div className="my-4">
                {/* <SingleChoiceList
                  title={
                    <Text variant="bodyMd" fontWeight="semibold" as="span">
                      Country Classification
                    </Text>
                  }
                  choices={lookaLikeClassificationOptions}
                  value={formState.countryClassification}
                  onChange={(countryClassification) =>
                    setFormState({ ...formState, countryClassification })
                  }
                /> */}
              </div>
              <div className="my-4">
                {/* <div
                  className="w-full bg-gray-200 rounded-full dark:bg-gray-700"
                >
                  <div
                    className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                    style={{ width: `${formState.audienceSize}%` }}
                    onChange={() => setFormState({ ...formState, audienceSize:2 })}
                  >
                    {formState.audienceSize}%
                  </div>
                </div> */}

                <RangeSlider
                  label="Select Audience size"
                  min={1}
                  max={20}
                  value={formState.rule.ratio}
                  onChange={(ratio) => {
                    setFormState({
                      ...formState,
                      rule: { ...formState.rule, ratio },
                    });
                  }}
                  suffix={
                    <p
                      style={{
                        minWidth: "20px",
                        textAlign: "right",
                        fontSize: "16px",
                        fontWeight: 600,
                      }}
                    >
                      {formState.rule.ratio}%
                    </p>
                  }
                  output
                />
                {/* <Select
                  label=""
                  placeholder="Select Audience size"
                  options={audienceSize}
                  value={formState.audienceSize}
                  onChange={(audienceSize) =>
                    // setFormState({ ...formState, audienceSize })
                    true
                  }
                /> */}
              </div>
              <div className="my-4 flex items-center bg-[#91D0FF] p-2">
                <AlertCircleIcon width={25} height={25} />
                <Text as="h2" fontWeight="bold">
                  A 1% lookalike consists of the people most similar to your
                  lookalike audience source. Increasing the percentage creates a
                  bigger, broader audience
                </Text>
              </div>
            </Card>
          </BlockStack>
        </Layout.Section>
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

export default Lookalike;
