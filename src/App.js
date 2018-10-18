import React, { Component } from 'react';
import { Button, Toast } from 'antd-mobile';
import { HashRouter, Route } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import fetch from './fetch'
import * as config from '../config.json';
import Home from './components/Home'
import Content from './components/Content'
import Login from './components/Login'
import DetailContact from './components/DetailContact';
import ShareGroup from './components/ShareGroup';


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

class App extends Component {
  state = {
    imgUrl: '',
    nickname: '',
    r: 'r'
  }
  async componentDidMount() {
    console.log(window.wx);
    let url = window.location.href.split('#')[0];
    // url = url.split('?')[0];
    console.log(url);
    const ret = await fetch(`/getSign`, {
      method: 'GET',
    });
    const r = await ret.json();
    if (r.success) {
      console.log(r);
      window.wx.config({
        ...r.data,
        // debug:true,
        appId:'wxdd06f38bac305c95',
        jsApiList:['onMenuShareAppMessage']
      })
    }
  }
  render() {
    return (
      <div>
      <HashRouter>
        <div>
          <Route exact path="/" component={Home} />
          {/* <Route path="/content" component={Content} />  */}
          <Route path="/login" component={Login} />
          <Route path="/detailContact" component={DetailContact} />
          <Route path="/shareGroup" component={ShareGroup} />
          
        </div>
      </HashRouter>
      </div>
    )
  }
}

export default App;
