import { Banner, BannerTone } from "@shopify/polaris";

export default function BannerNoti({
  children,
  title,
  url,
  content,
  tone,
  onDismiss = undefined,
  onAction = undefined
}: {
  children: any | undefined;
  title: string | undefined;
  url: string | undefined;
  content: string| undefined;
  tone: BannerTone| undefined;
  onDismiss?:any;
  onAction?:any;

}) {
  return (
    <div className="mb-3">
      <Banner
        title={title}
        action={{
          url,
          content,
          target: "_blank",
          onAction
        }}
        tone={tone}
        onDismiss={onDismiss}
      >
        {children}
      </Banner>
    </div>
  );
}
