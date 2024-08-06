import {
    Modal, Text,
} from "@shopify/polaris";
import { useCallback } from "react";
import { ICApi_MetaPixelUpdate } from "~/backend/types/cApiConfig.type";
interface CustomModalProps {
    id: string;
    open: boolean;
    onClose: () => void;
    name: string;
    setIsExecuted: (value: boolean) => void;
    pixelId?: string;
    setPixelData?: any;
    pixelData?: ICApi_MetaPixelUpdate[];
    pixelsState?: ICApi_MetaPixelUpdate[];
    setPixelsState?: any
    isTypeDelete?: boolean,
    selectPlatform?: number
}

export default function DeleteModal({ 
    open,
    onClose,
    name, 
    setIsExecuted,
}: CustomModalProps) {
    const handleCloseModal = useCallback(() => {
        onClose();
    }, [onClose]);
    const handleDelete =
    (useCallback(() => {
        setIsExecuted(true);
        shopify.toast.show('Pixel Deleted')
    }, [setIsExecuted])) 
    // : 
    // (()=>{
    //     const deleteBody = {
    //         id:id,
    //         pixelId: pixelId || "",
    //         pixelName: name,
    //         platform: selectPlatform === 0 ? 'facebook' : 'tiktok'
    //     };
    //     submit(deleteBody, { method: "DELETE" });
    //     setPixelData((pixelData?.filter((pixel:ICApi_MetaPixelUpdate)=> !(pixel.id === Number(id)))));
    //     setPixelsState(pixelsState?.filter((pixel:ICApi_MetaPixelUpdate)=> !(pixel.id === Number(id))));
    //     onClose()
    //     shopify.toast.show('Pixel Deleted')
    // })
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
                <div className="flex">Are you sure you want to delete pixel <Text as="p" fontWeight="bold" tone="critical">&nbsp;{name}</Text></div>
            </Modal.Section>
        </Modal>
    );
}