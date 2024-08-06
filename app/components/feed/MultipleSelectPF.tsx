import { Select, Text } from "@shopify/polaris";

export default function MultipleSelectPF ({data, onAction, index, selectedLevel}:{data:any, onAction:(value:string, index:number)=> void, index:number, selectedLevel:string}){
  return (
    <div className="mb-3">
        <Select
          label={<Text as="h3" variant="headingSm" >Facebook Category Level {index}</Text>}
          placeholder="select"
          options={data}
          onChange={(value)=>{onAction(value, index)}}
          value={selectedLevel}
        />
    </div>
  );
}