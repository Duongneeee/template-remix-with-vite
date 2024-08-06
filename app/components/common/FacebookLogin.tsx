import { useSubmit, useLoaderData } from '@remix-run/react';
import FacebookLogin from 'react-facebook-login';
import { json } from "@remix-run/node";

interface IFBProps{
  setTokenFb: (value: string) => void;
  setUserNameFb:  (value: string) => void;
  setUserAvatarFb:  (value: string) => void;
  labelButton: string;
  shop: string
}
export async function loader() {
  return json({
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
  });
}

function FacebookLoginComp(props: IFBProps) {
  const data = useLoaderData<typeof loader>();
  
  const {setTokenFb, setUserNameFb, setUserAvatarFb, labelButton} = props;
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
  return (
    <div>
      <FacebookLogin
        appId={data.FACEBOOK_APP_ID || '337123195876934'}
        autoLoad={false}
        fields="name,picture"
        callback={responseFacebook}
        scope = 'public_profile, email, business_management ,ads_read'
        cssClass="custom-button-facebook transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300  text-white font-bold rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        // icon="fa-facebook"
        size='small'
        textButton={labelButton}
      />
    </div>
  );
}

export default FacebookLoginComp;
