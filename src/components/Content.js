import React, { Component } from 'react';
import Flex, { Button, NavBar, TabBar, Icon, Popover } from 'antd-mobile';
import * as config from '../../config.json';
import AddContact from './AddContact'
import ListContact from './ListContact'
import fetch from '../fetch';

import {Link,Route,BrowserRouter} from 'react-router-dom'
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
export default class Content extends Component {
    map =  {
        'add': <AddContact goList={this.goList.bind(this)}/>,
        'list': <ListContact />
    }
    constructor(props){
        super(props);
        this.state = {
            props: props,
            visible:false,
            comp:''
        }
    }
    
    
    async componentDidMount() {
        // console.log('1',this.state);
        // const ret = await fetch(config.reqUrl + `/getLoginUserInfo`, {
        //     method: 'GET',
        // });
        // const r = await ret.json();
        // if (r && r.nickname) {
        //     this.setState({
        //         props:{
        //             imgUrl:r.headimgurl,
        //             nickname:r.nickname
        //         }
        //     })
        // }
        // setTimeout(()=>{console.log('2',this.state)},300);
    }
    goList(){
        this.setState({
            comp: this.map['list'],
        });
    }
    onSelect = (opt) => {
        console.log(opt.props.value);
        this.setState({
            comp: this.map[opt.props.value],
        });
    }
    render(){
        
        return (
            <div > 
                <NavBar mode="light"  onLeftClick={() => console.log('onLeftClick')}
                    rightContent={
                        <Popover 
                            overlayClassName="fortest"
                            overlayStyle={{ color: 'currentColor' }}
                            visible={this.state.visible}
                            overlay={[
                            (<Popover.Item key="3" value="list"  data-seed="logId">我的通讯录</Popover.Item>),
                            (<Popover.Item key="4" value="add"  data-seed="logId">新建通讯组</Popover.Item>),
                            ]}
                            align={{
                            overflow: { adjustY: 0, adjustX: 0 },
                            offset: [-10, 0],
                            }}
                            onSelect={this.onSelect.bind(this)}
                        >
                            <div style={{
                            height: '100%',
                            padding: '0 15px',
                            marginRight: '-15px',
                            display: 'flex',
                            alignItems: 'center',
                            }}
                            >
                            <Icon type="ellipsis" />
                            </div>
                        </Popover>
                    }>通讯录</NavBar>
                <div style={{padding:3,display:this.props.nickname ? 'flex':'none'}}>
                <img src={this.props.imgUrl} alt='logo' style={{display:this.props.imgUrl ? 'block':'none',width:30,height:30}} /><br/>
                
                <label style={{display:this.props.nickname ? 'block':'none',lineHeight:"30px"}}>欢迎您 <code>{this.props.nickname}</code> </label>
                </div>
                {this.state.comp}
            </div>
        ) 
    }
}