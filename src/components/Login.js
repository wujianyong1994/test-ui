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
            body:JSON.stringify(this.state)
        });
        const ret = await res.json()
        if (ret.Error) {
            return ret.Error;
        } else {
            if (ret.sid) {
                sessionStorage.setItem('sessionid',ret.sid);
                Route.push('/')
            }
        }
    }
    render(){
        return (
            <div style={{top:50}}>
                <List >
                     <InputItem value={this.state.userName} onChange={this.changeUser.bind(this)}>用户名</InputItem> 
                </List>
                <Button onClick={this.login.bind(this)}>登陆</Button>
            </div>
        )
    }
}