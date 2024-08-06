import {ChoiceList} from '@shopify/polaris';
import { useCallback, ReactNode} from 'react';
export interface IChoice{
  label: string
  value: string
}
interface ISingleChoiceList{
  title: string | ReactNode
  choices: IChoice[]
  onChange:(value:string[]) =>void
  value: string[]
}
function SingleChoiceList(props: ISingleChoiceList) {
  const {title,choices,value,onChange} = props;

  const handleChange = useCallback((value: string[]) => onChange(value), []);

  return (
    <ChoiceList
      title={title}
      choices={choices}
      selected={value}
      onChange={handleChange}
    />
  );
}
export default SingleChoiceList;