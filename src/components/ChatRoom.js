import React, { Component } from 'react';
import Flex, { Button, NavBar, TabBar, Icon, Popover } from 'antd-mobile';
import * as config from '../../config.json';
import fetch from '../fetch';
import io from 'socket.io-client';
let socket;
let socket1;
export default class ChatRoom extends Component {
    constructor(props){
        super(props);
        socket = io('https://thebestguy.club:3001',{path : '/room'});
        this.state = {
            msg : '',
            list:[]
        }
        let _this = this;
        socket.on('chat', function(obj){
            _this.setState({list:_this.state.list.concat(obj)})
        })
    } 
    componentDidMount(){
        console.log(window.innerHeight)
    }
    onkeyup(e){
        if (e.keyCode===13) {
            this.chat()
        }
    }
    async chat(e){
        console.log(socket.id);
        if (!this.state.msg) return;
        socket.emit('chat', {name: this.props.name ,msg: this.state.msg});
        this.setState({msg:''})
    }
    changeMsg(e){
    
          // 发射
        //   socket.emit('identity', 0, (response) => console.log('Identity:', response));
        
        this.setState({msg:e.target.value});
    }
    render() {
        return (
        <div>
            <div style={{width:'100%',height:window.innerHeight-137,overflowY:'auto',overflowX:'hidden',wordWrap:'break-word'}}>
                {this.state.list.map( (item,index) => <li key={index}>{item.name} :{item.msg}</li>)}
            </div>
            <div style={{position:'fixed',bottom:47,width:'100%'}}>
            <input value={this.state.msg} onChange={this.changeMsg.bind(this)} onKeyUp={this.onkeyup.bind(this)}  style={{height:'40px',width:'100%'}}/>
            <Button onClick={this.chat.bind(this)} >发送</Button>
            </div>
        </div>)
    }

}