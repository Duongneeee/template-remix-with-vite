
interface ISkeletonTabsMultiple {
    children:React.ReactNode
    state:boolean
}
export default function SkeletonTabsMultiple({children, state}:ISkeletonTabsMultiple){
    return (<div className="h-6">
        {
            state ?
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                :
                children
        }
    </div>)
}