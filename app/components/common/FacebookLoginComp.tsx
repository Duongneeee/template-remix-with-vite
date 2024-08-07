import { useSubmit } from '@remix-run/react';
import { lazy, Suspense } from 'react';
// import FacebookLogin from 'react-facebook-login';
const FacebookLogin = lazy(() => import('react-facebook-login'));

export interface IFBProps{
  setTokenFb: (value: string) => void;
  setUserNameFb:  (value: string) => void;
  setUserAvatarFb:  (value: string) => void;
  labelButton: string;
  shop: string
  FACEBOOK_APP_ID: string
}

const FacebookLoginComp = (props: IFBProps) => {
  const {setTokenFb, setUserNameFb, setUserAvatarFb, labelButton, FACEBOOK_APP_ID} = props;
  
  const submit = useSubmit();
  const responseFacebook = (response: any) => {
    setTokenFb(response.accessToken)
    setUserNameFb(response.name);
    setUserAvatarFb(response.picture.data.url);
    const data = {
      name: response.name,
      token: response.accessToken,
      avatar: response.picture.data.url,
      action:'save_fb'
    }
    // console.log(data);
    submit(data, { method: "post" });
  };
  console.log('FACEBOOK_APP_ID',FACEBOOK_APP_ID)
  return (
    <>
    <Suspense>
      <FacebookLogin
        appId={FACEBOOK_APP_ID || ""}
        autoLoad={false}
        fields="name,picture"
        callback={responseFacebook}
        scope = 'public_profile, email, business_management ,ads_read'
        cssClass="custom-button-facebook transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300  text-white font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        // icon="fa-facebook"
        size='small'
        textButton={labelButton}
      />
    </Suspense>
    </>
  )
}

export default FacebookLoginComp;