import React, { Component } from 'react';
import { Button, Toast } from 'antd-mobile';
import logo from './logo.svg';
import './App.css';
import fetch from 'unfetch'
import * as config from '../config.json';

var getP = function(n, hrefstr) {
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
  async componentDidMount(){
    const href = window.location.href;
    const code = getP('code',href);
    const state = getP('state',href);
    Toast.info(code, 1);
    const ret = await fetch(config.reqUrl+`/getAccess_token?code=${code}&state=${state}`, {
      method: 'GET',
    });
    console.log(ret);
    const r = await ret.json();
    console.log(r);
    
  }
  async search(){
    const ret = await fetch(config.reqUrl+`?a=1&b=2`, {
        method: 'GET',
    });
    console.log(ret);
    const r = await ret.json();
    console.log(r);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Button style={{margin:5}} onClick={this.search}>Start</Button> 
      </div>
    );
  }
}

export default App;
