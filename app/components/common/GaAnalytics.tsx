import { useLocation } from "@remix-run/react";
import { useEffect } from "react";
import ReactGA from 'react-ga';

export default function GaAnalytics(){
    const MEASUREMENT_ID = 'G-YJ5RNEVLZZ';
    const location = useLocation();
    useEffect(()=>{
        ReactGA.initialize(MEASUREMENT_ID,{
            gaOptions:{
                cookieFlags: 'SameSite=None;Secure'
            }
        });
    },[location.pathname])

    return null; 
}