import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import logo from './logo.svg';
import './App.css';
import fetch from 'unfetch'

class App extends Component {
  async search(){
    console.log(111);
    const ret = await fetch(`http://192.168.2.115:3001/`, {
        method: 'GET',
    });
    console.log(ret);
    const r = await ret.text();
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
