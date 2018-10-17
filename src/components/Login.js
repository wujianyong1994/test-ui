import React, { Component } from 'react';
import { Button, Toast, TabBar, List, InputItem } from 'antd-mobile';
import { HashRouter, Route } from 'react-router-dom'
import fetch from '../fetch';
import * as config from '../../config.json';
// import { createForm } from 'rc-form';
export default class Login extends Component {
    state={
        userName:'',
    }
    changeUser(e){
        this.setState({
            userName:e
        })
    }
    async login(){
        const res = await fetch(config.reqUrl + `/login`, {
            headers:{
                "Accept": "application/json",
                "Content-Type":"application/json"
            },
            method: 'POST',
            body:JSON.stringify({userName : this.state.userName})
        });
        const ret = await res.json()
        if (ret.Error) {
            return ret.Error;
        } else {
            if (ret.sid) {
                sessionStorage.setItem('sessionid',ret.sid);
                this.props.history.push("/")
            }
        }
    }
    async regist(){
        const res = await fetch(config.reqUrl + `/regist`, {
            headers:{
                "Accept": "application/json",
                "Content-Type":"application/json"
            },
            method: 'POST',
            body:JSON.stringify({userName: this.state.userName})
        });
        const ret = await res.json()
        if (!ret.success) {
            Toast.fail(ret.msg,1);
        } else {
            Toast.success('注册成功!',1);
            if (ret.sid) {
                sessionStorage.setItem('sessionid',ret.sid);
                this.props.history.push("/")
            }
        }
    }
    render(){
        return (
            <div style={{marginTop:50}}>
                <List >
                     <InputItem value={this.state.userName} onChange={this.changeUser.bind(this)}>用户名</InputItem> 
                </List>
                <Button onClick={this.login.bind(this)}>登陆</Button>
                <Button onClick={this.regist.bind(this)}>注册</Button>
            </div>
        )
    }
}