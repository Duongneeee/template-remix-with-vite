import { EmptyState } from "@shopify/polaris";
import Empty from "../../../public/assets/imgs/empty.jpg";

interface IEmptyTableContentProps {
  onAction?: () => void;
  actionText?: string;
  image?:string
  children?:React.ReactNode
}

//TODO: change path image

export default function EmptyTableContent({
  onAction,
  actionText,
  image=Empty,
  children
}: IEmptyTableContentProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-[300px]">
        <EmptyState
          heading="No records found"
          action={
            onAction || actionText
              ? { content: actionText, onAction: onAction }
              : undefined
          }
          // secondaryAction={{
          //     content: 'Learn more',
          //     url: 'https://help.shopify.com',
          // }}
          image={image}
        >
          <p>Try changing the filters or search term</p>
          {children}
        </EmptyState>
      </div>
    </div>
  );
}