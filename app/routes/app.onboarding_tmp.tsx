import { json, type LoaderFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { Banner, Button, Checkbox, List, Page } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { authenticate } from "~/shopify.server";

type CheckboxState = {
  checked1: boolean;
  checked2: boolean;
  checked3: boolean;
  checked4: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  return json({
    shop: session.shop,
  });
};

export default function Onboarding() {
  const [checkboxes, setCheckboxes] = useState<CheckboxState>({
    checked1: false,
    checked2: false,
    checked3: false,
    checked4: false,
  });
  const [step, setStep] = useState<number>(1);
  const navigate = useNavigate();
  const handleChange = useCallback(
    (checkboxName: keyof CheckboxState) => (newChecked: boolean) => {
      setCheckboxes((prev) => ({ ...prev, [checkboxName]: newChecked }));
      if (newChecked && canProgressToNextStep()) {
        if (steps[step - 1].nextStep !== undefined) {
          setStep(steps[step - 1].nextStep as number);
        }
      }
    },
    [step]
  );
  const handleOnBoard = () => {
    localStorage.setItem("isOnBoarded", true as any);
    navigate("/app");
  };
  const checkboxesByStep: Array<keyof CheckboxState>[] = [
    ["checked1"],
    ["checked1", "checked2"],
    ["checked1", "checked2", "checked3"],
  ];
  const canProgressToNextStep = () => {
    console.log(step);
    const requiredCheckboxes = checkboxesByStep[step - 1] || [];
    return requiredCheckboxes.every((checkbox) => checkboxes[checkbox]);
  };
  const handleGotoAnalytics = () => {
    localStorage.setItem("isOnBoarded", true as any);
    navigate("/app/analytics");
  };
  const steps = [
    {
      title: "1/3 App overview checklist",
      content: (
        <div className="flex flex-col w-full justify-between min-h-[200px]">
          <p className="mb-3">
            Use Facebook pixel events, server-side API, detailed analytics, KPI
            and hidden Facebook attribution reports, remarketing audiences, and
            active audiences and catalog feeds can help businesses track user
            activity, track sales, improve website or app experience, measure
            campaign marketing success, and grow sales. We provide the following
            features:
          </p>{" "}
          <Checkbox
            tone="magic"
            label="Track everything, combat IOS 14+ restrictions"
            checked={checkboxes.checked1}
            onChange={handleChange("checked1")}
          />
          <Checkbox
            tone="magic"
            label="Create reliable reports for each pixel, collection, and UTM tag."
            checked={checkboxes.checked2}
            onChange={handleChange("checked2")}
          />
          <Checkbox
            tone="magic"
            label="Track new events, such as viewing a category, customizing a product & view cart"
            checked={checkboxes.checked3}
            onChange={handleChange("checked3")}
          />
          <Checkbox
            tone="magic"
            label="Set up Facebook Pixel in 2 mins with all events auto-tracked. No login. No code."
            checked={checkboxes.checked4}
            onChange={handleChange("checked4")}
          />
        </div>
      ),
      buttonText: "Next",
      nextStep: 2,
    },
    {
      title: "2/3 Pixel create guide",
      content: (
        <div className="flex flex-col w-full justify-between min-h-[200px]">
          <p>
            Set up Facebook Pixel in 2 mins with all events auto-tracked. No
            login. No code.
          </p>
          <List type="bullet">
            <List.Item>
              Step 1: Go to home page and click on Create pixel button
            </List.Item>
            <List.Item>Step 2: Fill pixel's information and submit</List.Item>
            <List.Item>
              Step 3: View pixel details on pixel dashboard page
            </List.Item>
          </List>
        </div>
      ),
      buttonText: "Next",
      nextStep: 3,
      prevStep: 1,
    },
    {
      title: "3/3 View Analytics Page",
      content: (
        <div className="flex flex-col w-full justify-between min-h-[200px]">
          <p>
            You can monitor real-time reports of events being tracked on your
            store by visiting our Analytics page.
          </p>
          <Button
            size="large"
            tone="success"
            variant="primary"
            onClick={handleGotoAnalytics}
          >
            visit Analytic page
          </Button>
        </div>
      ),
      buttonText: "Done",
      doneAction: handleOnBoard,
      prevStep: 2,
    },
  ];

  useEffect(() => {
    if (localStorage.getItem("isOnBoarded")) {
      navigate("/app");
    }
  }, [navigate]);
  const handleBack = () => {
    if (steps[step - 1].prevStep !== undefined) {
      setStep(steps[step - 1].prevStep as number);
    }
  };
  const handleNext = () => {
    if (canProgressToNextStep()) {
      if (steps[step - 1].nextStep !== undefined) {
        setStep(steps[step - 1].nextStep as number);
      }
    }
  };
  return (
    <Page fullWidth title="Getting Started">
      <div className="flex justify-center">
        <div className="w-[600px]">
          <Banner hideIcon={true} title={steps[step - 1].title}>
            {steps[step - 1].content}
            <div className="flex w-full justify-end mt-3 gap-2">
              {steps[step - 1].prevStep !== undefined && (
                <Button variant="primary" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={
                  steps[step - 1].nextStep !== undefined
                    ? !Object.values(checkboxes).every(Boolean)
                    : false
                }
              >
                {steps[step - 1].buttonText}
              </Button>
            </div>
          </Banner>
        </div>
      </div>
    </Page>
  );
}
