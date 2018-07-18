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
    // this.search();
    
  }
  async search() {
    const ret = await fetch(config.reqUrl + `/testGet`, {
      method: 'GET',
    });
    console.log(ret);
    const r = await ret.json();
    console.log(r);
  }
  render() {
    return (
      <HashRouter>
        <div>
          <Route exact path="/" component={Home} />
          {/* <Route path="/content" component={Content} />  */}
          <Route path="/login" component={Login} />
          
        </div>
      </HashRouter>
    )
  }
}

export default App;
