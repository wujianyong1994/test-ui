import React, { Component } from 'react';
import { Button, NavBar, TabBar, Icon, Popover, List, InputItem, Toast, Modal } from 'antd-mobile';
import * as config from '../../config.json';
import fetch from '../fetch';
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
export default class DetailContact extends Component {
    constructor(props){
        super(props);
        console.log(props);
        this.state={
            list:[],
            isInGroup:false,
            isAdmin:false,
            visible:false,
            groupId:''
        }
    }
    async componentWillMount(){
        // const groupid = getP('groupid',window.location.href);
        // console.log(groupid);
        // if (groupid) {
        //     window.location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdd06f38bac305c95&redirect_uri=http%3A%2F%2Fthebestguy.club&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect');
        // }
    }
    async componentDidMount(){
        const href = window.location.href.split('#')[0];
        console.log('href',href);
        const code = getP('code', href);
        const state = getP('state', href);
        if (state && code) {
            const ret = await fetch(`/getAccess_token?code=${code}&state=${state}`, {
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
        } 
        if ((this.props.location && this.props.location.state && this.props.location.state.groupId) || state) {
            // this.setState({groupName: this.props.location.state.groupName});
            const groupId = (this.props.location && this.props.location.state && this.props.location.state.groupId) ?  this.props.location.state.groupId : state;
            await this.getGroup(groupId);
        }
        await this.wxconfig();
        window.wx.ready(() => {
            this.share()
        })
    }
    async getGroup(groupId){
        const ret = await fetch(`/listGroupDetail?groupId=${groupId}`, {
            method: 'GET',
        });
        const r = await ret.json();
        console.log(r);
        if (r.success) {
            this.setState({
                list:r.data,
                groupName:r.groupName,
                groupId:groupId,
                isInGroup:r.isInGroup,
                isAdmin: r.isAdmin
            });
        }
    }
    async wxconfig(){
        console.log(window.wx);
        let url = window.location.href.split('#')[0];
        // url = url.split('?')[0];
        console.log(url);
        const ret = await fetch(`/getSign`, {
        method: 'GET',
        });
        const r = await ret.json();
        if (r.success) {
            console.log(r);
            window.wx.config({
                ...r.data,
                appId:'wxdd06f38bac305c95',
                jsApiList:['onMenuShareAppMessage']
            })
        }
    }
    share(){
        const date = (new Date()).getTime();
        window.wx.onMenuShareAppMessage({
            title: '邀请您加入一个通讯组', // 分享标题
            desc: '邀请您加入一个通讯组: ' + this.state.groupName, // 分享描述
            // link: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdd06f38bac305c95&redirect_uri=http%3A%2F%2Fthebestguy.club&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            link: encodeURI('http://thebestguy.club/share1?groupid='+this.state.groupId), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: '', // 分享图标
            // type: '', // 分享类型,music、video或link，不填默认为link
            // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
            // 用户点击了分享后执行的回调函数
                Toast.success('share success',1);
            }
        });
    }
    back(){
        this.props.history.push("/")
    }
    async join(){
        const ret = await fetch(`/joinGroup`, {
            method: 'POST',
            headers:{
                "Accept": "application/json",
                "Content-Type":"application/json"
            },
            body:JSON.stringify({groupId:this.state.groupId})
        });
        const r = await ret.json();
        if (r.success) {
            Toast.success(r.msg,1);
            this.getGroup(this.state.groupId);
        }
    }
    async deleteGroup(){
        Modal.alert('删除该通讯组', '您确定删除该组🐴？', [
            { text: 'Cancel', onPress: () => console.log('cancel') },
            { text: 'Ok', onPress: () => {this.del()} },
        ])
    }
    async del(){
        const ret = await fetch( `/delGroup`, {
            method: 'POST',
            headers:{
                "Accept": "application/json",
                "Content-Type":"application/json"
            },
            body:JSON.stringify({groupId:this.state.groupId})
        });
        const r = await ret.json();
        if (r.success) {
            Toast.success('删除成功!',1);
            this.props.history.push("/")
        } else {
            Toast.fail(r.msg, 1);
        }
    }
    onSelect = (opt) => {
        const v = opt.props.value;
        const v1 = v.split(':')[0];
        const userId = v.split(':')[1];
        if (v1 === 'del') {
            this.kickUser(userId);
        }
    }
    async  kickUser(userId){
        this.setState({visible:false})
        const ret = await fetch(`/kickUser`, {
            method: 'POST',
            headers:{
                "Accept": "application/json",
                "Content-Type":"application/json"
            },
            body:JSON.stringify({groupId:this.state.groupId,userId})
        });
        const r = await ret.json();
        if (r.success) {
            Toast.success('成功踢出!',1);
            this.getGroup(this.state.groupId)
        } else {
            Toast.fail(r.msg, 1);
        }
    }
    render(){
        return(
            <div className="detail-contact">
                <List   renderHeader={()=><div  style={{height:20}}>{this.state.groupName} <div style={{float:'right',display: this.state.isAdmin?'block':'none'}}><Button onClick={this.deleteGroup.bind(this)} style={{height:20,lineHeight:'20px',fontSize:'14px',paddingLeft:3,paddingRight:3}}>删除</Button></div></div>} className="my-list">
                    
                    {this.state.list.map( (item,index) => <List.Item key={index}  extra={(
                    <div style={{display:'flex'}} >
                        <div style={{display:'block'}}>
                        <a href={'tel:'+item.mobile}>{item.mobile}  </a>
                        </div>
                        <Popover mask
                            overlayClassName="fortest"
                            overlayStyle={{ color: 'currentColor' }}
                            visible={this.state.visible}
                            overlay={[
                            (<Popover.Item key={index} value={'del:'+item.ID}  data-seed="logId">踢出该组</Popover.Item>)
                            ]}
                            align={{
                            overflow: { adjustY: 0, adjustX: 0 },
                            offset: [-10, 0],
                            }}
                            onSelect={this.onSelect.bind(this)} >
                            <div style={{
                            height: '100%',
                            display: 'block',
                            alignItems: 'center',
                            marginLeft:18
                            }}
                            >
                            <Icon type="ellipsis" />
                            </div>
                        </Popover>
          
                    </div>
                    )}>{item.name}</List.Item> )}
                </List>
                {/* <Button onClick={this.share.bind(this)}>share</Button> */}
                <Button onClick={this.back.bind(this)}>返回</Button>
                <Button style={{display: !this.state.isInGroup?'block':'none'}} onClick={this.join.bind(this)}>加入该通讯组</Button>
            </div>
        )
    }
}