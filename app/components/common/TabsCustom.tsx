import { Box, Text } from "@shopify/polaris";

interface ITab {
    id:number | string,
    title?: string,
    icon?: any
}

interface ITabsCutom {
    children?: React.ReactNode,
    tabs: ITab[],
    selected: number | string,
    onSelect: (selectedTabIndex: any) => void,
    className?: string
}

export default function TabsCustom ({children, tabs, selected, onSelect,className = ''}:ITabsCutom){
    return (
        <Box as="div">
            <div className={`border-b border-gray-200 dark:border-gray-700 ${className}`}>
                <div className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400" >
                    {
                        tabs.map((tab)=>(
                            <button type="button" className="me-2 cursor-pointer" key={tab.id} onClick={(e)=> e.isTrusted && onSelect(tab.id)}>
                                <div className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${selected === tab.id ? 'text-black border-black' : 'hover:border-gray-300 dark:hover:text-gray-300 border-transparent hover:text-gray-600'}`}>
                                    {
                                     tab.icon && 
                                     <svg className="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300" viewBox="0 0 512 512">{tab.icon}</svg>
                                    }
                                    <Text as="p" fontWeight="semibold">{tab.title}</Text>
                                </div>
                            </button>
                        ))
                    }
                </div>
            </div>
            <Box as="div">
                {children}
            </Box>
        </Box>

    )
}