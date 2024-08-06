import {Button, Popover, OptionList} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import { IOption } from './common/MultipleSellectBox';

interface IPopopver{
    options: IOption[],
    selected: string[],
    onSelected: (value:string[])=> void
}

function UpperCaseWordFirst (item:string) {
    return item.charAt(0).toUpperCase() + item.slice(1)
}
export default function PopoverMutiple(props:IPopopver) {
  const { options, selected, onSelected } = props

  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    [],
  );

  
  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
      {UpperCaseWordFirst(selected[0]) }
    </Button>
  );


  return (
    <div>
      <Popover
        active={popoverActive}
        activator={activator}
        autofocusTarget="first-node"
        onClose={togglePopoverActive}
      >
       <OptionList
        title="Platform"
        onChange={onSelected}
        options={options}
        selected={selected}
      />
      </Popover>
    </div>
  );
}