import { Button, ButtonGroup, Card, Collapsible, Icon, Scrollable, Text } from "@shopify/polaris"
import TabsCustom from "../common/TabsCustom"
import ConversionRateBox from "../common/conversionRate/ConversionRateBox"
import TotalEventBox from "../common/totalEvent/TotalEventBox"
import { 
    RefreshIcon, 
    ChevronDownIcon,
    CalendarIcon 
   } from "@shopify/polaris-icons";
import SvgFacebook from "../svgs/SvgFacebook"
import SvgTiktok from "../svgs/SvgTiktok"

   export const tabs = [
    {
      id:0,
      title: 'Facebook',
      icon: (<SvgFacebook/>),
    },
    {
      id: 1,
      title: 'Tiktok',
      icon:<SvgTiktok/>,
    },
  ];

const SkeletonDataEvent = () =>{
    return (
        <>
        <div className="mb-4 flex justify-between opacity-50">
          <div className="flex gap-3">
            <ButtonGroup>
              <Button
                textAlign="left"
                size="large"
                icon={CalendarIcon}
                onClick={() => {}}
              >
                Last 7 days
              </Button>
              <Button
                icon={RefreshIcon}
                onClick={() => {}}
              >
                Refresh
              </Button>
            </ButtonGroup>
          </div>
        </div>

        <div className="">
          <div className="my-3">
            <Card>
              <Scrollable shadow horizontal>
                <div className="flex">
                  <div className="font-bold text-base px-2 cursor-pointer flex-1 whitespace-nowrap">
                    <TabsCustom tabs={tabs} selected={0} onSelect={()=>{}}>
                      {/* Show data Conversion Rate  */}
                        <ConversionRateBox 
                          vcRate={0} 
                          atcRate={0} 
                          icRate={0} 
                          handleToggle={()=>{}}
                          stateSkeletonOfIndex={true}
                        />
                    </TabsCustom>
                  </div>
                  <div className="cursor-pointer flex-none" onClick={()=>{}}>
                      <Icon
                      source={ChevronDownIcon}
                      tone="base"/>
                  </div>
                </div>
              </Scrollable>
              <Collapsible
                  open={true}
                  id="basic-collapsible"
                  transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
                  expandOnPrint
              >
                <div className="px-2">
                    <Text variant="headingMd" as="h3">Total Event</Text>
                    <div className="my-3">
                      {/* Show data Total Event  */}
                      <TotalEventBox 
                        pageViewCount={0}
                        ViewContentCount={0}
                        AddToCartCount={0}
                        InitiateCheckoutCount={0}
                        PurchaseCount={0}
                        CollectionViewCount={0}
                        stateSkeletonOfIndex={true}
                      />
                    </div>
                </div>
              </Collapsible>
            </Card>
          </div>
        </div>
        </>
    )
}

export default SkeletonDataEvent