import { IConversionRateProps } from "~/types/common.type";
import ConversionRateChildrenBox from "./ConversionRateChildrenBox";



export default function ConversionRateBox ( props: IConversionRateProps ) {
    const {vcRate, atcRate, icRate, handleToggle, stateSkeletonOfIndex} = props;
    return (
        <div className="flex justify-between">
            <ConversionRateChildrenBox 
                title="View Content to Add To Cart"
                data={vcRate}  
                handleToggle={handleToggle} 
                stateSkeletonOfIndex={stateSkeletonOfIndex}
            />
            <ConversionRateChildrenBox 
                title="Add To Cart to Initiate Checkout"
                data={atcRate} 
                handleToggle={handleToggle} 
                stateSkeletonOfIndex={stateSkeletonOfIndex}
            />
            <ConversionRateChildrenBox 
                title="Initiate Checkout to Purchase"
                data={icRate}  
                handleToggle={handleToggle} 
                stateSkeletonOfIndex={stateSkeletonOfIndex}
            />
        </div>
    )
}