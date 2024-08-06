import axios from 'axios';
import {onLCP} from 'web-vitals';

export default function logLCP(rootData:any){

    const logLCPToDriver = async (data: any)=>{
        
        let dataLCP = {
            shop: rootData.shop,
            plan_shopify:rootData.planShopify,
            class_name: data.entries[0].element?.localName + '.' + data.entries[0].element?.localName,
            inner_text: data.entries[0].element?.innerText ,
            renderTime: data.entries[0].renderTime,
            rating: data.rating, 
            value: data.value,
            router: rootData.pathname,
            date: new Date().toUTCString(),
            connection: '',
            ip: rootData.ip,
            country:rootData.country
        };
        try{
           await axios.get('https://script.google.com/macros/s/AKfycbxBt7PcZn2ZGY3VjPUmrSsq7sYSYcBh7hOGyYrrslteUKIXuSc0NomtuN9wETXBV1uO1g/exec',{
                params: {
                    ...dataLCP
                },
            })
            // const content =` LCP of the ${rootData.shop}: ${data.value}/ms, path: ${window.location.pathname}, date: ${new Date().toUTCString()}, class_name: ${data.entries[0].element?.localName + '.' + data.entries[0].element?.localName}, ip:${rootData.ip}`;
            // pushNoticeTelegramLCP(content);
        }catch(error){
            console.log(error)
        }
    }
    
    function sendToAnalytics(metric: any) {
       //add code to send the metric to your analytics service
        try{
            logLCPToDriver(metric)
        }catch(e){
            console.log(e)
        }
    }
    
    onLCP(sendToAnalytics);
}
