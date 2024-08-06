import { Box, Card, Collapsible, Icon } from "@shopify/polaris";
import {
    ChevronDownIcon
  } from '@shopify/polaris-icons';
import { useCallback, useState } from "react";

export default function CollapsibleHelp({children,title, isOpen=false}:{children:React.ReactNode,title:string | React.ReactNode,isOpen?:boolean}){
    const [open, setOpen] = useState(isOpen);

    const handleToggle = useCallback(() => setOpen((open) => !open), []);
    return (
    <div className="">
        <Card>
          <div onClick={handleToggle} className="flex justify-between">
            <span className="font-bold cursor-pointer">{title}</span>
            <div className="cursor-pointer">
                <Icon
                 source={ChevronDownIcon}
                 tone="base"/>
            </div>
          </div>
          <Collapsible
               open={open}
               id="basic-collapsible"
               transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
               expandOnPrint
          >
            <Box as="div" paddingBlockStart='300'>
              {children}
            </Box>
          </Collapsible>
        </Card>
    </div>
    )
}