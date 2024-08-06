import { Button } from "@shopify/polaris";
import { ClipboardIcon } from "@shopify/polaris-icons";

export default function CopyButton({ text, titleButton, onCopy }: { text: string, titleButton:string, onCopy: () => void }) {
  const handleCopy = (): void => {
    navigator.clipboard.writeText(text);
    onCopy();
  };

  return (
    <Button icon={ClipboardIcon} onClick={handleCopy}>
      {titleButton}
    </Button>
  );
}
