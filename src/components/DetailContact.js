import React, { Component } from 'react';
import { Button, NavBar, TabBar, Icon, Popover, List, InputItem, Toast } from 'antd-mobile';
import * as config from '../../config.json';
import fetch from '../fetch';
export default class DetailContact extends Component {
    constructor(props){
        super(props);
        console.log(props);
        this.state={list:[]}
    }
    async componentDidMount(){
        if (this.props.location && this.props.location.state && this.props.location.state.groupId) {
            this.setState({groupName: this.props.location.state.groupName});
            const groupId = this.props.location.state.groupId;
            const ret = await fetch(config.reqUrl + `/listGroupDetail?groupId=${groupId}`, {
                method: 'GET',
            });
            const r = await ret.json();
            console.log(r);
            if (r.success) {
                this.setState({list:r.data});
            }
        }
    }
    render(){
        return(
            <div>
                <List renderHeader={this.state.groupName} className="my-list">
                    
                    {this.state.list.map( (item,index) => <List.Item key={index}  extra={<a href={'tel:'+item.mobile}>{item.mobile}</a>}>{item.name}</List.Item> )}
                </List>
            </div>
        )
    }
}