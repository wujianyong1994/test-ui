import React, { Component } from 'react';
import { Button, NavBar, TabBar, Icon, Popover } from 'antd-mobile';
import * as config from '../../config.json';
import AddContact from './AddContact'
import ListContact from './ListContact'

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
const map =  {
    'add': <AddContact />,
    'list': <ListContact />
}
export default class Content extends Component {
    state = {
        imgUrl: '',
        nickname: '',
        r: 'r',
        visible:false,
        comp:map.list
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
    onSelect = (opt) => {
        console.log(opt.props.value);
        this.setState({
            comp: map[opt.props.value],
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
                            onSelect={this.onSelect}
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
                    }>NavBar</NavBar>
                <br/>
                <p style={{display:this.state.nickname ? 'block':'none'}}>欢迎您 <code>{this.state.nickname}</code> </p>
                <img src={this.state.imgUrl} alt='logo' style={{display:this.state.imgUrl ? 'block':'none'}} /><br/>
                {this.state.comp}
            </div>
        ) 
    }
}