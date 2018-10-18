import React, { Component } from 'react';
import { Button, NavBar, TabBar, Icon, Popover, List, InputItem, Toast } from 'antd-mobile';
import * as config from '../../config.json';
import fetch from '../fetch';

export default class MyInfo extends Component {
    state={
        name:'',
        mobile:'',
        nickname:''
    }
    async componentDidMount(){
        this.getData();
    }
    async getData(){
        const ret = await fetch( `/getLoginUserInfo`, {
            method: 'GET',
        });
        const r = await ret.json();
        if (r && r.name) {
            this.setState({
                name:r.name,
                mobile:r.mobile,
                nickname:r.nickname
            })
        }
    }
    onChangeRealName(e){
        console.log(e);
        this.setState({
            name:e
        })
    }
    onChangeMobile(e){
        this.setState({
            mobile:e
        })
    }
    async handleClick(){
        const ret = await fetch(`/updateUserInfo`, {
            headers:{
                "Accept": "application/json",
                "Content-Type":"application/json"
            },
            method: 'POST',
            body:JSON.stringify({
                name:this.state.name,
                mobile:this.state.mobile 
            })
        });
        const r = await ret.json();
        if (r.success) { 
            Toast.success('修改成功 !!!', 1);
        } else {
            Toast.fail('修改失败 !!!', 1);
        }
    }
    render(){
        return (
        <List renderHeader={() => '我的信息'} className="my-list">
            <List.Item extra={this.state.nickname}>昵称</List.Item>
            <InputItem placeholder="请输入真实姓名" onChange={this.onChangeRealName.bind(this)} value={this.state.name} >真实姓名</InputItem>
            <InputItem placeholder="请输入手机号码" onChange={this.onChangeMobile.bind(this)} value={this.state.mobile} >手机号码</InputItem>
            <List.Item>
                    <div style={{ width: '100%', color: '#108ee9', textAlign:'center' }} >
                        <Button style={{width:100,display:'inline-block'}} onClick={this.handleClick.bind(this)} size='small' type="primary">修改</Button>
                    </div>
            </List.Item>
        </List>
        )
    }
}