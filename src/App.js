import React, { Component } from 'react';
import { Button, Toast } from 'antd-mobile';
import { BrowserRouter, Route } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import fetch from './fetch'
import * as config from '../config.json';
import Home from './components/Home'
import Content from './components/Content'
import Login from './components/Login'

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
    const href = window.location.href;
    const code = getP('code', href);
    const state = getP('state', href);
    const ret = await fetch(config.reqUrl + `/getAccess_token?code=${code}&state=${state}`, {
      method: 'GET',
    });
    console.log(ret);
    const r = await ret.json();
    if (r) {
      this.setState({
        imgUrl: r.headimgurl,
        nickname: r.nickname,
        r: JSON.stringify(r)
      })
    }
    console.log(r);

  }
  async search() {
    const ret = await fetch(config.reqUrl + `/user?a=1&b=2`, {
      method: 'GET',
    });
    console.log(ret);
    const r = await ret.json();
    console.log(r);
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" component={Home} />
          {/* <Route path="/content" component={Content} />  */}
          <Route path="/login" component={Login} />
          
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
