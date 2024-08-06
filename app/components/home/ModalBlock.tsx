import { ComplexAction, Modal } from "@shopify/polaris";

export default function ModalBlock({
  children,
  title,
  onClose,
  open,
  activator,
  primaryAction,
  secondaryActions,
}: {
  activator: any | null;
  children: any | null;
  onClose: () => void;
  open: boolean;
  title: string;
  primaryAction: ComplexAction | undefined;
  secondaryActions: ComplexAction[] | undefined;
}) {
  return (
    <Modal activator={activator} title={title} onClose={onClose} open={open} primaryAction={primaryAction} secondaryActions={secondaryActions}>
      <Modal.Section>
        
        {children}
      </Modal.Section>
    </Modal>
  );
}
