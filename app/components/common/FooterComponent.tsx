import {FooterHelp, Link} from '@shopify/polaris';

interface IFooterHelpProps{
    text: string;
    url?: string;
    handleClick?: any
}
const FooterComponent = ({text, url, handleClick}: IFooterHelpProps) => {
  return (
    <FooterHelp>
      Learn more about{' '}
      <Link url={url} onClick={handleClick} target="_blank">
        {text}
      </Link>
    </FooterHelp>
  );
}

export default FooterComponent;