import React, { Component } from 'react';

var getP = function (n, hrefstr) {
    var pos, parastr, para, tempstr;
    pos = hrefstr.indexOf("?");
    parastr = hrefstr.substring(pos + 1);
    para = parastr.split("&");
    tempstr = "";
    for (var i = 0; i < para.length; i++) {
      tempstr = para[i];
      pos = tempstr.indexOf("=");
      if (tempstr.substring(0, pos).toLowerCase() === n.toLowerCase()) {
        return tempstr.substring(pos + 1);
      }
    }
    return '';
};
export default class DetailContact extends Component {
    async componentWillMount(){
        const groupid = getP('groupid',window.location.href);
        console.log(groupid);
        if (groupid) {
            window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdd06f38bac305c95&redirect_uri=http%3A%2F%2Fthebestguy.club&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect');
        }
    }
    render() {
        return <div>11</div>
    }
}