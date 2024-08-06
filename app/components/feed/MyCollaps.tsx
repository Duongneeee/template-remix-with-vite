import { Collapsible, Text } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
interface IMyColapps {
  children: React.ReactNode;
  title: string;
}
const MyCollaps = (props: IMyColapps) => {
  const { children, title } = props;
  const [open, setOpen] = useState(true);

  const handleToggle = useCallback(() => setOpen((open) => !open), []);

  return (
    <div>
      <div className="mb-4">
        <Text as="h3" variant="headingMd"  fontWeight="bold">
          {title}
        </Text>
        <p
          onClick={handleToggle}
          className="cursor-pointer absolute top-3 right-8"
        >
          {open ? (
            <ChevronDownIcon width={30} height={20} />
          ) : (
            <ChevronUpIcon width={30} height={20} />
          )}
        </p>
      </div>
      {/* <p className="uppercase">
        {!open && (
          <Text as="h2" fontWeight="bold">
            {title}
          </Text>
        )}
      </p> */}
      <Collapsible
        open={open}
        id="basic-collapsible"
        transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
        expandOnPrint
      >
        {children}
      </Collapsible>
    </div>
  );
};

export default MyCollaps;
