import unfetch from 'unfetch'
import * as config from '../config.json';
export default async function fetch (url,option){
    let reqUrl = config.dev.reqUrl;
    if (process.env.NODE_ENV === 'production') {
        reqUrl = config.prod.reqUrl;
    }
    const sessionid = sessionStorage.getItem('sessionid');
    if (!sessionid) {return unfetch(reqUrl + url,option);}
    let o = option;
    if (!option ) {
        o = {headers:{'sessionid':sessionid}}
    } else {
        if (!option.headers) {
            option.headers = {'sessionid':sessionid};
            o = option;
        } else {
            option.headers.sessionid = sessionid;
            o = option;
        }
    }
    const res = await unfetch(reqUrl + url,o);
    return res;
}


