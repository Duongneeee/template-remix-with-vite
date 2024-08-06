import { Button, DescriptionList, Modal } from "@shopify/polaris";
import { useCallback, useState } from "react";

export default function MultipleModal (logError:any){
    const [active, setActive] = useState(false);

  const handleChange = useCallback(() => setActive(!active), [active]);

  const activator = <Button onClick={handleChange}>View Error</Button>;

  const convertFormatLogError = (logError:any) =>{
    const logErrorParse = JSON.parse(logError.logError || "null") || {};
    return Object.keys(logErrorParse).map((key:string)=>{
        const customKey = key.split('#')[0];
        const value =  Object.keys(logErrorParse[key]).map((item:string)=>{
            return `${item}: ${logErrorParse[key][item]}`
        })
        return {
            term: customKey,
            description: value.join(", "),
        }
    })
  }

  return (
    <div>
        <Modal
          activator={activator}
          open={active}
          onClose={handleChange}
          title="Details about the existing errors:"
        //   primaryAction={{
        //     content: 'Add Instagram',
        //     onAction: handleChange,
        //   }}
          secondaryActions={[
            {
              content: 'close',
              onAction: handleChange,
            },
          ]}
        >
          <Modal.Section>
          <DescriptionList
            items={convertFormatLogError(logError)}
            />
          </Modal.Section>
        </Modal>
    </div>
  );
}