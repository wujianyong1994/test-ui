import React, { Component } from 'react';
import {findDOMNode} from 'react-dom';
import { Button, NavBar, TabBar, Icon, Popover, List, InputItem, ListView, Accordion } from 'antd-mobile';
import * as config from '../../config.json';
import { observer } from 'mobx-react'
import fetch from '../fetch';
import { withRouter } from 'react-router-dom'
function MyBody(props) {
    return (
      <div className="am-list-body my-body">
        <span style={{ display: 'none' }}>you can custom body wrap element</span>
        {props.children}
      </div>
    );
  }
let pageIndex = 0;
function MyAccordion(props) {
    return (
        <Accordion accordion  className="my-accordion" onChange={props.onChange(props.rowData.id)}>
                <Accordion.Panel header={props.rowData.name}>
                    <List className="my-list">
                    {props.group ? props.group.map((item,index) => 
                        <List.Item key={index}>{item.name} <a href={'tel:'+item.mobile}>{item.mobile}</a></List.Item>
                    ): ''}
                    </List>
                </Accordion.Panel>
        </Accordion>
    )
}
// @observer
export default withRouter (class ListContact extends Component {
    constructor(props){
        super(props);
        const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
        const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) =>row1 !== row2 
        });

        this.state = {
            dataSource,
            isLoading: true,
            group:{},
            hei:300
        };
    }
    async componentDidMount() {
        const hei = document.documentElement.clientHeight - findDOMNode(this.refs.listview).offsetTop - 50;
        this.setState({hei});
        pageIndex = 0;
        this.listGroup();
    }
    async listGroup(){
        this.setState({ isLoading: true });
        const ret = await fetch(config.reqUrl + `/listGroup?pageIndex=${++pageIndex}`, {
            method: 'GET',
        });
        const r = await ret.json();
        if (r.success) {
            this.rData = r.data;
            console.log(this.rData);
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false
            });
        }
        console.log(this.rData);
    }
    async onChange(groupId){
        console.log(this.state.group)
        if (!this.state.group[groupId]) {
            const ret = await fetch(config.reqUrl + `/listGroupDetail?groupId=${groupId}`, {
                method: 'GET',
            });
            const r = await ret.json();
            if (r.success) {
                const obj = {...this.state.group};
                obj[groupId] = r.data;
                this.setState({group:obj})
            }
        }
    }
    async onEndReached(){
        if (this.state.isLoading && !this.state.hasMore) {
        return;
        }
        this.setState({ isLoading: true });
        const ret = await fetch(config.reqUrl + `/listGroup?pageIndex=${++pageIndex}`, {
            method: 'GET',
        });
        const r = await ret.json();
        if (r.success) {
            this.rData = this.rData.concat(r.data);
            console.log(this.rData);

            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(this.rData),
                isLoading: false
            });
        }
        console.log(this.rData);
    }
    clickGroup(row){
        // this.props.history.push('/detailContact',{query: {a:3}});
        this.props.history.push({pathname : '/detailContact',state:{groupId:row.id, groupName:row.name}});
        
    }
    row(rowData, sectionID, rowID) {
        console.log(this.state.group);
        return (
        <div key={rowID} style={{ padding: '0px 0px' }}>
            {/* {this.state.group[rowData.id]?this.state.group[rowData.id].length:0} */}
            <Accordion accordion  className="my-accordion" >
                <Accordion.Panel header={<a onClick={this.clickGroup}>{rowData.name}</a>} >
                    <List className="my-list">
                    {rowData.users ? rowData.users.map((item,index) => 
                        <List.Item key={index}>{item.name} <a href={'tel:'+item.mobile}>{item.mobile}</a></List.Item>
                    ): ''}
                    </List>
                </Accordion.Panel>
            </Accordion>
        </div>
      );
    }
    _renderRow(rowData, sectionID, rowID) {
        return (
            <div key={rowID} style={{paddingLeft:5,height:40,display:'flex'}}>
                <label style={{lineHeight:'40px',flex:'1 1'}}>{rowData.name}</label>
                <div style={{justifyContent:'flex-end',paddingRight:5,paddingTop:5}}>
                <Button style={{float:'right',lineHeight:'40px'}} inline={true} size='small' icon="check-circle-o" onClick={this.clickGroup.bind(this,rowData)}>详情</Button>  
                </div>
                {/* <MyAccordion rowData={rowData} group={this.state.group[rowData.id]} onChange={this.onChange.bind(this)}/> */}
            </div>
        )
    }
    separator(sectionID, rowID) {
        return(
        <div
          key={`${sectionID}-${rowID}`}
          style={{
            backgroundColor: '#F5F5F9',
            height: 8,
            borderTop: '1px solid #ECECED',
            borderBottom: '1px solid #ECECED'
          }}
        />
        )
    }
    render() {
        
        return (
            <div>
            {/* <span>我的通讯组</span> */}
          <ListView
            ref="listview"
            dataSource={this.state.dataSource}
            renderHeader={() => <span>我的通讯组</span>}
            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
              {this.state.isLoading ? 'Loading...' : 'Loaded'}
            </div>)}
            renderRow={this._renderRow.bind(this)}
            renderSeparator={this.separator}
            className="am-list"
            pageSize={10}
            style={{
                height: this.state.hei,
                overflow: 'auto',
            }}
            renderBodyComponent={() => <MyBody />}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached.bind(this)}
            onEndReachedThreshold={80}
          />
          </div>
        );
    }
})