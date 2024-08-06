import {
    Card,
    Checkbox,
    Modal, Text,
} from "@shopify/polaris";
import { useCallback } from "react";
import { IProductFeedConfigReq } from "~/backend/types/productFeedConfig.type";
interface CustomModalProps {
    id: string;
    open: boolean;
    name: string;
    checked: boolean,
    pixelData?: IProductFeedConfigReq[];
    setPixelData?: any;
    isTypeDelete?: boolean;
    productFeedId?: string;
    isCheckboxOfDel: boolean;
    onClose: () => void;
    setChecked: (value: boolean) => void;
    setIsExecuted: (value: boolean) => void;
}

export default function DeleteModalProduct({ 
    open,
    name, 
    checked, 
    isCheckboxOfDel,
    onClose,
    setChecked, 
    setIsExecuted, 
  }: CustomModalProps) {
    const handleCloseModal = useCallback(() => {
        setChecked(false);
        onClose();
    }, [onClose]);
    const handleDelete = (useCallback(() => {
        setIsExecuted(true);
        shopify.toast.show('ProductFeed Deleted')
    }, [setIsExecuted])) 

    const handleChange = useCallback(
      (newChecked: boolean) => setChecked(newChecked),
      [],
    );
    return (
        <Modal
            open={open}
            onClose={handleCloseModal}
            title="Delete Confirm"
            primaryAction={{
                destructive: true,
                content: "Delete",
                onAction: handleDelete,

            }}
            secondaryActions={[
                {
                    content: "Cancel",
                    onAction: handleCloseModal,
                },
            ]}
        >
            <Modal.Section>
                <div className="flex mb-3">Are you sure you want to delete <Text as="p" fontWeight="bold" tone="critical">&nbsp;{name}</Text></div>


                {
                    !isCheckboxOfDel &&
                    <>
                        <div className="mb-3">
                        Furthermore, by checking the box, you're confirming the removal of <Text as="span" fontWeight="bold" tone="critical">&nbsp;{name}</Text> from the Facebook Catalog. Are you sure you want to proceed with the deletion?
                        </div>
                        <div className="mb-3">
                        <Card background="bg-surface-secondary">
                            <Checkbox
                            label="Yes, Delete the feed from the Facebook catalog"
                            checked={checked}
                            onChange={handleChange}
                            />
                        </Card>
                        </div>
                    </>
                }
            </Modal.Section>
        </Modal>
    );
}