import { Button, Card, Modal } from "@shopify/polaris";
import { useCallback } from "react";
import { ClipboardIcon } from "@shopify/polaris-icons";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  utmParam: string;
}

export default function UtmParamModal({
  open,
  onClose,
  utmParam,
}: CustomModalProps) {
  const handleCloseModal = useCallback(() => {
    onClose();
  }, [onClose]);
  const handleCopy = (): void => {
    navigator.clipboard.writeText(utmParam);
  };
  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      title="UTM parameters"
    >
      <Modal.Section>
        <div className="">
          <Card roundedAbove="md" background="bg-surface-secondary">
            <p className="mb-3">{utmParam}</p>
            <Button icon={ClipboardIcon} variant="plain" onClick={handleCopy}>
              {" "}
              copy
            </Button>
          </Card>
        </div>
      </Modal.Section>
    </Modal>
  );
}
