import React, { Component } from 'react';
import { Button, NavBar, TabBar, Icon, Popover, List, InputItem } from 'antd-mobile';
import * as config from '../../config.json';
import { createForm } from 'rc-form';
import fetch from '../fetch';

class AddContactForm extends Component {
    async handleClick(){
        let v;
        this.props.form.validateFields((error, value) => {
            v = value;
        });
        const res = await fetch(config.reqUrl + `/addGroup`, {
            headers:{
                "Accept": "application/json",
                "Content-Type":"application/json"
            },
            method: 'POST',
            body:JSON.stringify(v)
        });
    }
    render(){
        const { getFieldProps } = this.props.form;
        return (
            <div>
                <List renderHeader={() => '新增通讯组'}>
                <InputItem
                    {...getFieldProps('name')}
                    clear
                >通讯组名称</InputItem>
                <List.Item>
                    <div
                    style={{ width: '100%', color: '#108ee9', textAlign: 'center' }}
                    onClick={this.handleClick.bind(this)}
                    >
                    新增
                    </div>
                </List.Item>
                </List>
            </div>

        )
    }
}
const AddContact = createForm()(AddContactForm);
export default AddContact;