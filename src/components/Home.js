import React, { Component } from 'react';
import { Button, Toast, TabBar } from 'antd-mobile';
import logo from '../logo.svg';
import '../App.css';
import fetch from '../fetch'
import * as config from '../../config.json';
import Content from './Content'
import MyInfo from './MyInfo'

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
export default class Home extends Component {
    
    state = {
        imgUrl: '',
        nickname: '',
        r: 'r',
        selectedTab:'tab1'
    }
    async componentDidMount() {
        const href = window.location.href;
        const code = getP('code', href);
        const state = getP('state', href);
        console.log(code);
        if (code) {
            const ret = await fetch(config.reqUrl + `/getAccess_token?code=${code}&state=${state}`, {
            method: 'GET',
            });
            const r = await ret.json();
        
            if (r.success) {
            this.setState({
                imgUrl: r.headimgurl,
                nickname: r.nickname,
                r: JSON.stringify(r)
            })
            sessionStorage.setItem('sessionid',r.sid);
            }
            //调用Content子组件的setState方法
            this.refs.content.setState({comp:this.refs.content.map.list});
            this.refs.myinfo.getData();
        } else {
            if (sessionStorage.getItem('sessionid')) {
                this.refs.content.setState({comp:this.refs.content.map.list});
            }
        }
    }
        
    
    async search() {
        const ret = await fetch(config.reqUrl + `/user?a=1&b=2`, {
          method: 'GET',
        });
        console.log(ret);
        const r = await ret.json();
        console.log(r);
    }
    render(){
        return (
            <div style={{ position: 'absolute', height: '100%', width: '100%', top: 0 } }>
                <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="white"
                hidden={this.state.hidden}
                >
                <TabBar.Item
                    title="通讯录"
                    key="Life"
                    icon={<div style={{
                    width: '22px',
                    height: '22px',
                    background: 'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat' }}
                    />
                    }
                    selectedIcon={<div style={{
                    width: '22px',
                    height: '22px',
                    background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat' }}
                    />
                    }
                    selected={this.state.selectedTab === 'tab1'}
                    badge={0}
                    onPress={() => {
                    this.setState({
                        selectedTab: 'tab1',
                    });
                    }}
                    data-seed="logId"
                >
                    <Content ref="content" imgUrl={this.state.imgUrl} nickname={this.state.nickname}  />
                </TabBar.Item>
                <TabBar.Item
                    title="我的信息"
                    key="Life"
                    icon={<div style={{
                    width: '22px',
                    height: '22px',
                    background: 'url(./myinfo_o.jpg) center center /  21px 21px no-repeat' }}
                    />
                    }
                    selectedIcon={<div style={{
                    width: '22px',
                    height: '22px',
                    background: 'url(./myinfo.jpg) center center /  21px 21px no-repeat' }}
                    />
                    }
                    selected={this.state.selectedTab === 'tab2'}
                    badge={0}
                    onPress={() => {
                    this.setState({
                        selectedTab: 'tab2',
                    });
                    }}
                    data-seed="logId"
                >
                    <div><MyInfo ref="myinfo" /></div>
                </TabBar.Item>
                </TabBar>
            </div>

        ) 
            // <div className="App">
            //     <header className="App-header">
            //     <img src={logo} className="App-logo" alt="logo" />
            //     <h1 className="App-title">Welcome to React</h1>
            //     </header>
            //     <p className="App-intro">
            //     To get started, edit <code>src/App.js</code> and save to reload.
            //     </p>
            //     <Button style={{margin:5}} onClick={this.search}>Start</Button>
            //     <p style={{display:this.state.nickname ? 'block':'none'}}>欢迎您 <code>{this.state.nickname}</code> </p>
            //     <img src={this.state.imgUrl} alt='logo' /><br/>
            // </div> 
    }
}