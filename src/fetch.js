import unfetch from 'unfetch'
export default function fetch (url,option){
    const sessionid = sessionStorage.getItem('sessionid');
    if (!sessionid) {return unfetch(url,option);}
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
    console.log(o);
    return unfetch(url,o);
}


