import { useState } from 'react';
import {Frame, ContextualSaveBar, Button } from '@shopify/polaris';

const CustomAudience = () => {
  const [isSaveBarVisible, setSaveBarVisible] = useState(false);

  // Function to handle saving changes
  const handleSaveChanges = () => {
    // Add your save logic here
    alert('Changes saved successfully!');
    setSaveBarVisible(false);
  };

  // Function to handle discarding changes
  const handleDiscardChanges = () => {
    // Add your discard logic here
    alert('Changes discarded!');
    setSaveBarVisible(false);
  };

  // Function to handle canceling action
  const handleCancelAction = () => {
    setSaveBarVisible(false);
  };

  return (
    <Frame
    logo={{
        width: 86,
        contextualSaveBarSource:
          'https://cdn.shopify.com/s/files/1/2376/3301/files/Shopify_Secondary_Inverted.png',
      }}
    >
      <ContextualSaveBar
        message="You have unsaved changes. Do you want to save them?"
        fullWidth ={false}
        alignContentFlush
        saveAction={{
          onAction: handleSaveChanges,
          content: 'Save',
        }}
        discardAction={{
          onAction: handleDiscardChanges,
          content: 'Discard',
        }}
      />
      
      <Button onClick={() => setSaveBarVisible(true)}>Show Save Bar</Button>
    </Frame>
  );
};

export default CustomAudience;
